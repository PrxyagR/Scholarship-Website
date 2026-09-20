import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUTPUT_DIR = '/tmp/maplepath-screenshots';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  // Desktop View
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  
  console.log('Capturing Desktop Homepage...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'desktop-home-viewport.png') });
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'desktop-home-full.png'), fullPage: true });

  console.log('Capturing Mobile Homepage (iPhone 14)...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'mobile-home-viewport.png') });
  await page.screenshot({ path: path.join(OUTPUT_DIR, 'mobile-home-full.png'), fullPage: true });

  await browser.close();
  console.log('Screenshots saved to', OUTPUT_DIR);
}

run().catch(console.error);
