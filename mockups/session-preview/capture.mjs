import { chromium } from 'playwright';
const browser = await chromium.launch({headless:true, ...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {})});
try {
  const page = await browser.newPage({viewport:{width:1024,height:650},deviceScaleFactor:2});
  page.on('pageerror', e => { throw e; });
  await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:43871');
  await page.evaluate(() => document.fonts.ready);
  await page.getByText('npm install acme', {exact:true}).waitFor();
  await page.locator('#capture').screenshot({path:'mockups/session-preview/session-evidence.png'});
} finally { await browser.close(); }
