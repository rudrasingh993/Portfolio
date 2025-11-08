// --- Update <lastmod> tags in sitemap.xml ---
import fs from "fs";
const sitemapPath = "./sitemap.xml";
const today = new Date().toISOString().split("T")[0];

if (!fs.existsSync(sitemapPath)) {
  console.error("❌ sitemap.xml not found!");
  process.exit(1);
}

let sitemap = fs.readFileSync(sitemapPath, "utf-8");
sitemap = sitemap.replace(/<lastmod>.*?<\/lastmod>/g, `<lastmod>${today}<\/lastmod>`);
fs.writeFileSync(sitemapPath, sitemap);
console.log(`✅ Updated <lastmod> to ${today} in sitemap.xml`);

// --- Submit URLs to IndexNow ---
import https from "https";
import { parseStringPromise } from "xml2js";

const SITEMAP_PATH = "./sitemap.xml";
const KEY = "7f752836d8e441049bbee2d2b482c3db";
const HOST = "www.rudrasingh.dev"; // Change to your actual domain
const KEY_LOCATION = `https://www.rudrasingh.dev/7f752836d8e441049bbee2d2b482c3db.txt`;

async function getUrlsFromSitemap() {
  const xml = fs.readFileSync(SITEMAP_PATH, "utf8");
  const result = await parseStringPromise(xml);
  const urls = result.urlset.url.map(u => u.loc[0]);
  return urls;
}

async function submitToIndexNow(urls) {
  const payload = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls
  });

  const options = {
    hostname: "www.bing.com",
    path: "/indexnow",
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Length": Buffer.byteLength(payload)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let data = "";
      res.on("data", chunk => { data += chunk; });
      res.on("end", () => {
        console.log(`HTTP Response Code: ${res.statusCode}`);
        switch (res.statusCode) {
          case 200:
            console.log("✅ Ok - URL(s) submitted successfully");
            break;
          case 400:
            console.error("❌ Bad request - Invalid format");
            break;
          case 403:
            console.error("❌ Forbidden - Key not valid or not found");
            break;
          case 422:
            console.error("❌ Unprocessable Entity - URLs don’t belong to host or key mismatch");
            break;
          case 429:
            console.error("❌ Too Many Requests - Potential spam");
            break;
          default:
            console.error(`❌ Unexpected response: ${res.statusCode}`);
        }
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          reject(data);
        }
      });
    });
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

(async () => {
  try {
    const urls = await getUrlsFromSitemap();
    if (urls.length === 0) {
      console.log("No URLs found in sitemap.");
      return;
    }
    await submitToIndexNow(urls);
  } catch (err) {
    console.error("Error:", err);
  }
})();
