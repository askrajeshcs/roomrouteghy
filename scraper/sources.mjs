import { listingFromText, normalizeUrl } from "./utils.mjs";
import { MAX_LISTINGS_PER_SOURCE, NAVIGATION_TIMEOUT_MS } from "./config.mjs";

async function dismissPopups(page) {
  for (const label of [/accept/i, /allow all/i, /not now/i, /close/i]) {
    const button = page.getByRole("button", { name: label }).first();
    if (await button.isVisible().catch(()=>false)) await button.click({ timeout: 1500 }).catch(()=>{});
  }
}

export async function scrapeSource(context, source) {
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  try {
    await page.goto(source.url, { waitUntil: "domcontentloaded", timeout: NAVIGATION_TIMEOUT_MS });
    await dismissPopups(page);
    await page.waitForTimeout(2500);
    await page.mouse.wheel(0, 3500).catch(()=>{});
    await page.waitForTimeout(1200);

    const candidates = await page.locator("a[href]").evaluateAll((links, base) => links.map(a => ({
      href: new URL(a.getAttribute("href") || "", base).toString(),
      title: (a.getAttribute("aria-label") || a.textContent || "").replace(/\s+/g," ").trim()
    })), source.url).catch(()=>[]);

    const unique = [...new Map(candidates
      .filter(x => source.linkPattern.test(x.href))
      .map(x => [normalizeUrl(x.href, source.url), x])).values()]
      .slice(0, MAX_LISTINGS_PER_SOURCE);

    const results = [];
    for (const candidate of unique) {
      const detail = await context.newPage();
      try {
        await detail.goto(candidate.href, { waitUntil: "domcontentloaded", timeout: NAVIGATION_TIMEOUT_MS });
        await dismissPopups(detail);
        const title = await detail.locator("h1").first().innerText().catch(()=>candidate.title);
        const text = await detail.locator("body").innerText({ timeout: 8000 }).catch(()=>"");
        const listing = listingFromText({ source: source.name, url: candidate.href, title, text });
        if (listing) results.push(listing);
      } catch (error) {
        console.warn(`[${source.name}] skipped ${candidate.href}: ${error.message}`);
      } finally { await detail.close(); }
    }
    return results;
  } catch (error) {
    console.warn(`[${source.name}] source unavailable: ${error.message}`);
    return [];
  } finally { await page.close(); }
}
