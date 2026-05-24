const fs = require("fs");

const BASE_URL = "https://vanguadr-main.vercel.app/api";

const endpoints = [
  "hero",
  "features",
  "news",
  "brands",
  "about1",
  "about2",
  "about3",
  "about4",
  "services1",
  "services2",
  "proxy/testmonials",
  "contact",
];

async function fetchAll() {
  const allData = {};

  for (const endpoint of endpoints) {
    const url = `${BASE_URL}/${endpoint}`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const key = endpoint.replace("/", "_");
        allData[key] = data;
        console.log(`  ${endpoint}: OK`);
      } else {
        console.log(`  ${endpoint}: HTTP ${res.status}`);
        allData[endpoint.replace("/", "_")] = { error: `HTTP ${res.status}` };
      }
    } catch (err) {
      console.log(`  ${endpoint}: FAILED - ${err.message}`);
      allData[endpoint.replace("/", "_")] = { error: err.message };
    }
  }

  const json = JSON.stringify(allData, null, 2);
  fs.writeFileSync("database_export.tst", json, "utf-8");
  console.log(`\nExported to database_export.tst (${json.length} bytes)`);
}

fetchAll();
