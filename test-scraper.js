import { scrapeFacebookPosts } from "./src/lib/sync/facebook-scraper.js";

async function run() {
  console.log("Starting scraper...");
  const articles = await scrapeFacebookPosts(new Date("2026-05-01"));
  console.log("Articles found:", articles.length);
  articles.forEach((a, i) => {
    console.log(`[${i}] ${a.title}`);
  });
}

run().catch(console.error);
