import fs from "fs";

const sitemapPath = "./sitemap.xml";
const today = new Date().toISOString().split("T")[0];

// Check sitemap exists
if (!fs.existsSync(sitemapPath)) {
  console.error("❌ sitemap.xml not found!");
  process.exit(1);
}

// Read sitemap
let sitemap = fs.readFileSync(sitemapPath, "utf-8");

// Replace all <lastmod> tags with today's date
sitemap = sitemap.replace(/<lastmod>.*?<\/lastmod>/g, `<lastmod>${today}</lastmod>`);

// Save it back
fs.writeFileSync(sitemapPath, sitemap);

console.log(`✅ Updated <lastmod> to ${today} in sitemap.xml`);
