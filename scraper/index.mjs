import { chromium } from "playwright";
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { SOURCES } from "./config.mjs";
import { deduplicate } from "./utils.mjs";
import { scrapeSource } from "./sources.mjs";

const DATA_FILE = new URL("../public/listings.json", import.meta.url);
const previous = existsSync(DATA_FILE) ? JSON.parse(await readFile(DATA_FILE, "utf8")) : { listings: [] };
let storageState;
if (process.env.FACEBOOK_STORAGE_STATE_BASE64) {
  try { storageState = JSON.parse(Buffer.from(process.env.FACEBOOK_STORAGE_STATE_BASE64, "base64").toString("utf8")); }
  catch { console.warn("FACEBOOK_STORAGE_STATE_BASE64 is invalid; continuing with public Facebook access."); }
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  storageState,
  userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/132 Safari/537.36 GuwahatiRentIndexer/1.0",
  locale: "en-IN",
  timezoneId: "Asia/Kolkata"
});

const discovered = [];
for (const source of SOURCES) {
  const rows = await scrapeSource(context, source);
  console.log(`${source.name}: ${rows.length} valid listings`);
  discovered.push(...rows);
}
await browser.close();

const now = new Date().toISOString();
const oldByUrl = new Map((previous.listings || []).map(x => [x.sourceUrl, x]));
const merged = deduplicate([
  ...(previous.listings || []),
  ...discovered.map(item => ({ ...oldByUrl.get(item.sourceUrl), ...item, firstSeen: oldByUrl.get(item.sourceUrl)?.firstSeen || item.firstSeen, lastSeen: now }))
]).sort((a,b) => (b.firstSeen || "").localeCompare(a.firstSeen || ""));

const output = {
  updatedAt: now,
  sourceStatus: Object.fromEntries(SOURCES.map(s => [s.name, discovered.filter(x => x.source === s.name).length])),
  listingCount: merged.length,
  listings: merged
};
await writeFile(DATA_FILE, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Saved ${merged.length} deduplicated listings to public/listings.json`);
