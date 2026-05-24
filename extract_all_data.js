const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

async function extractAllData() {
  const prisma = new PrismaClient();

  try {
    console.log("Connecting to database...");

    const [
      hero,
      features,
      news,
      brands,
      aboutUs,
      featuredServices,
      ourSkills,
      video,
      ourServices,
      steps,
      getInTouch,
      testmonials,
      testmonialCards,
      skills,
      whoWeServe,
      whyChooseVan,
      ourTrackRecord,
      portfolio,
      projects,
    ] = await Promise.all([
      prisma.hero.findMany(),
      prisma.features.findMany(),
      prisma.news.findMany(),
      prisma.brands.findMany(),
      prisma.aboutUs.findMany(),
      prisma.featuredServices.findMany(),
      prisma.ourSkills.findMany(),
      prisma.video.findMany(),
      prisma.ourServices.findMany(),
      prisma.steps.findMany(),
      prisma.getInTouch.findMany(),
      prisma.testmonials.findMany({ include: { cards: true } }),
      prisma.testmonialCard.findMany(),
      prisma.skills.findMany(),
      prisma.whoWeServe.findMany(),
      prisma.whyChooseVan.findMany(),
      prisma.ourTrackRecord.findMany(),
      prisma.portfolio.findMany(),
      prisma.projects.findMany(),
    ]);

    const allData = {
      hero,
      features,
      news,
      brands,
      aboutUs,
      featuredServices,
      ourSkills,
      video,
      ourServices,
      steps,
      getInTouch,
      testmonials,
      testmonialCards,
      skills,
      whoWeServe,
      whyChooseVan,
      ourTrackRecord,
      portfolio,
      projects,
    };

    const json = JSON.stringify(allData, null, 2);
    fs.writeFileSync("database_export.tst", json, "utf-8");

    // Print summary
    for (const [key, value] of Object.entries(allData)) {
      console.log(`  ${key}: ${Array.isArray(value) ? value.length : 1} record(s)`);
    }

    console.log("\nData exported to database_export.tst");
  } catch (error) {
    console.error("Error extracting data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

extractAllData();
