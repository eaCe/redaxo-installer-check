const { chromium, firefox, webkit } = require('playwright');
require('dotenv').config();

/**
 * Return if SITE_URL is not set
 */
if (!process.env.SITE_URL) {
  console.error('Please create a .env file with SITE_URL');
  return;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(process.env.SITE_URL);

  /**
   * TODO: Write code ;)
   */

  await browser.close();
})();