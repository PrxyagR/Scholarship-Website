import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUTPUT_DIR = '/tmp/maplepath-audit';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const routes = [
  { name: 'desktop-opportunities', url: 'http://localhost:3000/opportunities', viewport: { width: 1440, height: 900 } },
  { name: 'desktop-detail', url: 'http://localhost:3000/opportunities/loran-scholarship', viewport: { width: 1440, height: 900 } },
  { name: 'desktop-roadmap', url: 'http://localhost:3000/roadmap', viewport: { width: 1440, height: 900 } },
  { name: 'desktop-dashboard', url: 'http://localhost:3000/dashboard', viewport: { width: 1440, height: 900 } },
  { name: 'desktop-saved', url: 'http://localhost:3000/saved', viewport: { width: 1440, height: 900 } },
  { name: 'desktop-how-it-works', url: 'http://localhost:3000/how-it-works', viewport: { width: 1440, height: 900 } },
  { name: 'desktop-about', url: 'http://localhost:3000/about', viewport: { width: 1440, height: 900 } },
  { name: 'desktop-submit-role', url: 'http://localhost:3000/submit-role', viewport: { width: 1440, height: 900 } },
  { name: 'mobile-opportunities', url: 'http://localhost:3000/opportunities', viewport: { width: 390, height: 844 }, isMobile: true },
  { name: 'mobile-detail', url: 'http://localhost:3000/opportunities/loran-scholarship', viewport: { width: 390, height: 844 }, isMobile: true },
  { name: 'mobile-roadmap', url: 'http://localhost:3000/roadmap', viewport: { width: 390, height: 844 }, isMobile: true },
  { name: 'mobile-dashboard', url: 'http://localhost:3000/dashboard', viewport: { width: 390, height: 844 }, isMobile: true }
];

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  for (const route of routes) {
    console.log(`Capturing ${route.name}...`);
    await page.setViewport({
      width: route.viewport.width,
      height: route.viewport.height,
      deviceScaleFactor: 2,
      isMobile: route.isMobile || false,
      hasTouch: route.isMobile || false
    });
    await page.goto(route.url, { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(OUTPUT_DIR, `${route.name}.png`), fullPage: false });
  }

  await browser.close();
  console.log('Audit screenshots saved to', OUTPUT_DIR);
}

run().catch(console.error);
