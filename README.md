# Guwahati Rent Auto-Updater

A standalone, zero-cost room-rental map and scheduled scraper. After one-time setup, GitHub Actions checks public OLX, Housing.com, Bricklet, 99acres and Facebook group pages every six hours, updates `public/listings.json`, and Cloudflare Pages republishes the map automatically.

## What is included

- Mobile-responsive Leaflet/OpenStreetMap website
- Playwright-based multi-source scraper
- Rent, locality, BHK/RK, bathroom, size, public phone and publication-date extraction
- URL and property-detail deduplication
- Booked/unavailable detection
- GitHub Actions schedule at minute 17 every six hours
- Optional Facebook authenticated browser state
- Tests and a manual-run option

## Free hosting setup

### 1. Create the GitHub repository

1. Sign in to GitHub and create a new **public** repository named `guwahati-rent-map`.
2. Extract this ZIP on your computer.
3. Open a terminal inside the extracted folder and run:

```bash
git init
git add .
git commit -m "Initial Guwahati rent map"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/guwahati-rent-map.git
git push -u origin main
```

Public repositories receive free standard GitHub-hosted Actions usage. GitHub can disable a public repository's scheduled workflows after 60 days without repository activity, so check the Actions page occasionally.

### 2. Permit the updater to commit data

In the GitHub repository, open **Settings → Actions → General → Workflow permissions**, select **Read and write permissions**, and save.

Then open **Actions → Update rental listings → Run workflow** once. Confirm that the run finishes successfully and updates `public/listings.json`.

### 3. Host the map on Cloudflare Pages

1. Create a free Cloudflare account.
2. Open **Workers & Pages → Create → Pages → Connect to Git**.
3. Connect GitHub and select `guwahati-rent-map`.
4. Use these settings:
   - Production branch: `main`
   - Framework preset: `None`
   - Build command: leave blank
   - Build output directory: `public`
5. Select **Save and Deploy**.

Every data commit made by the scheduled workflow will now redeploy the site automatically.

## Optional Facebook access

Facebook frequently hides group posts from logged-out automated browsers. The scraper still tries the public page without credentials. For better coverage, create a Playwright storage-state JSON locally using your own Facebook session, Base64-encode it, and add it as a GitHub Actions repository secret named `FACEBOOK_STORAGE_STATE_BASE64`.

Never paste your Facebook password into source code. Session state can expire and may require replacement. Only collect posts you are permitted to access, and follow the group's rules and Facebook's terms.

## Run locally

Requires Node.js 22 or newer:

```bash
npm install
npx playwright install chromium
npm test
npm run scrape
npm run serve
```

Open the local URL printed by `serve`.

## Maintenance

Websites change their HTML and may block automation. When a source shows zero results for several runs, inspect the corresponding page and update its `linkPattern` or parsing logic in `scraper/config.mjs` and `scraper/sources.mjs`. The updater keeps existing listings when one source temporarily fails, so a blocked request does not erase the map.

Phone numbers are stored only when visibly published in a listing. The website deliberately does not bypass masked contact controls.
