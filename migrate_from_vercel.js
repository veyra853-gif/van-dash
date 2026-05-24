const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const BASE = "https://vanguadr-main.vercel.app/api";

// Endpoints mapped to their Prisma model and how to extract records
const SOURCES = [
  // Direct endpoints (return single objects)
  { url: `${BASE}/hero`, model: "hero", type: "single" },
  { url: `${BASE}/features`, model: "features", type: "single" },
  { url: `${BASE}/news`, model: "news", type: "single" },
  { url: `${BASE}/brands`, model: "brands", type: "single" }, // returns {images: [...]} directly
  { url: `${BASE}/about1`, model: "aboutUs", type: "single" },
  { url: `${BASE}/about2`, model: "featuredServices", type: "single", pick: ["title", "image"], defaults: { image: "" } },
  { url: `${BASE}/about3`, model: "ourSkills", type: "single", pick: ["title", "description", "image"], defaults: { image: "" } },
  { url: `${BASE}/about4`, model: "video", type: "single", pick: ["title", "description", "video"] },
  { url: `${BASE}/services2`, model: "steps", type: "single" },
  { url: `${BASE}/footer`, model: "getInTouch", type: "single" },

  // Proxy endpoints (return {success, data: [...]}) — may have multiple records
  { url: `${BASE}/proxy/ourservices`, model: "ourServices", type: "proxy" },
  { url: `${BASE}/proxy/testmonials`, model: "testmonials", type: "proxy-testmonials" },
  { url: `${BASE}/proxy/ourtrackrecord`, model: "ourTrackRecord", type: "proxy" },
  { url: `${BASE}/proxy/portfolio`, model: "portfolio", type: "proxy" },
  { url: `${BASE}/proxy/projects`, model: "projects", type: "proxy" },
  { url: `${BASE}/proxy/whoweserve`, model: "whoWeServe", type: "proxy" },
  { url: `${BASE}/proxy/whychoosevan`, model: "whyChooseVan", type: "proxy" },
];

// Schema field lists for each model (only fields Prisma accepts)
const SCHEMA_FIELDS = {
  hero: ["Title1", "Title2", "decrption", "image1", "image2"],
  features: ["Title", "descrption", "card1Title", "card1Descrption", "card1Image", "card2Title", "card2Descrption", "card2Image", "card3Title", "card3Descrption", "card3Image"],
  news: ["card1Title", "card1Date", "card1Descrption", "card1Image", "card2Title", "card2Date", "card2Descrption", "card2Image", "card3Title", "card3Date", "card3Descrption", "card3Image"],
  brands: ["images"],
  aboutUs: ["title", "description", "items", "image"],
  featuredServices: ["title", "image"],
  ourSkills: ["title", "description", "image"],
  video: ["title", "description", "video"],
  ourServices: ["title", "card1Title", "card1Description", "card1Image", "card2Title", "card2Description", "card2Image", "card3Title", "card3Description", "card3Image", "card4Title", "card4Description", "card4Image", "card5Title", "card5Description", "card5Image", "card6Title", "card6Description", "card6Image"],
  steps: ["title", "step1Title", "step1Description", "step1Image", "step2Title", "step2Description", "step2Image", "step3Title", "step3Description", "step3Image", "step4Title", "step4Description", "step4Image", "step5Title", "step5Description", "step5Image", "step6Title", "step6Description", "step6Image"],
  getInTouch: ["locationTitle", "locationDescription", "phoneTitle", "phoneDescription", "emailTitle", "emailDescription"],
  testmonials: ["title", "description"],
  ourTrackRecord: ["Title1", "Title2", "descrption", "C1title", "C1descrption", "C2title", "C2descrption", "C3title", "C3descrption"],
  portfolio: ["url"],
  projects: ["Title", "Descrption", "C1Title", "C1Descrption", "C1Points", "C1Images", "C2Title", "C2Descrption", "C2Points", "C2Images", "C3Title", "C3Descrption", "C3Points", "C3Images", "C4Title", "C4Descrption", "C4Points", "C4Images"],
  whoWeServe: ["description", "points"],
  whyChooseVan: ["title", "description", "points"],
  skills: ["title", "description", "skills"],
};

function pickFields(obj, modelName, defaults) {
  const fields = SCHEMA_FIELDS[modelName];
  if (!fields) return obj;
  const result = {};
  for (const f of fields) {
    if (obj[f] !== undefined) result[f] = obj[f];
    else if (defaults && defaults[f] !== undefined) result[f] = defaults[f];
  }
  return result;
}

async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

async function main() {
  console.log("=== Vanguard Data Migration from Vercel ===\n");
  console.log(`Target DB: ${process.env.DATABASE_URL?.replace(/\/\/.*@/, "//***@")}\n`);

  const prisma = new PrismaClient();
  await prisma.$connect();
  console.log("Connected to database\n");

  const allFetched = {};

  for (const src of SOURCES) {
    process.stdout.write(`Fetching ${src.model} from ${src.url}... `);
    const raw = await fetchJSON(src.url);

    if (!raw) { console.log("FAILED"); continue; }

    let records = [];

    if (src.type === "single") {
      records = [raw];
    } else if (src.type === "proxy" || src.type === "proxy-testmonials") {
      records = raw.data || [];
    }

    console.log(`${records.length} record(s)`);
    allFetched[src.model] = { records, src };
  }

  // Save backup
  const backupFile = `vercel_backup_${Date.now()}.json`;
  fs.writeFileSync(backupFile, JSON.stringify(allFetched, null, 2), "utf-8");
  console.log(`\nBackup saved to ${backupFile}\n`);

  // Insert into database
  console.log("--- Inserting into database ---\n");

  for (const [modelName, { records, src }] of Object.entries(allFetched)) {
    const model = prisma[modelName];
    if (!model) { console.log(`[SKIP] ${modelName}: no Prisma model`); continue; }
    if (!records.length) { console.log(`[SKIP] ${modelName}: no records`); continue; }

    // Check existing
    const existing = await model.count();
    if (existing > 0) {
      console.log(`[SKIP] ${modelName}: already has ${existing} record(s)`);
      continue;
    }

    let inserted = 0, failed = 0;

    for (const record of records) {
      try {
        if (src.type === "proxy-testmonials") {
          // Insert testimonial with nested cards
          const cleaned = pickFields(record, "testmonials", src.defaults);
          const cards = record.cards || [];
          await model.create({
            data: {
              ...cleaned,
              ...(cards.length > 0 ? {
                cards: {
                  create: cards.map(c => ({
                    comment: c.comment || "",
                    name: c.name || "",
                    profilePic: c.profilePic || "",
                    role: c.role || "",
                  })),
                },
              } : {}),
            },
          });
        } else {
          const cleaned = pickFields(record, modelName, src.defaults);
          await model.create({ data: cleaned });
        }
        inserted++;
      } catch (err) {
        failed++;
        if (failed <= 3) console.log(`  ERR ${modelName}: ${err.message.slice(0, 150)}`);
      }
    }

    console.log(`${modelName}: ${inserted} inserted${failed ? `, ${failed} failed` : ""}`);
  }

  await prisma.$disconnect();
  console.log("\n=== Migration Complete ===");
}

main();
