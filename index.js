const { chromium, firefox, webkit } = require('playwright');
require('dotenv').config();

/**
 * Return if SITE_URL is not set
 */
if (!process.env.SITE_URL) {
  console.error('Please create a .env file with SITE_URL');
  return;
}

let availableAddonLinks = [];

(async () => {
  const backendUrl = new URL('/redaxo', process.env.SITE_URL).href;
  const browser = await chromium.launch({
      headless: false,
    }
  );
  const page = await browser.newPage();
  await page.goto(backendUrl);

  // Login
  await login(page);

  // Go to installer
  await getAvailableAddons(page);

  await browser.close();
})();

async function login (page) {
  await page.fill('#rex-id-login-user', process.env.USER);
  await page.fill('#rex-id-login-password', process.env.PASSWORD);
  await page.locator('button[type=submit]').click();
}

async function getAvailableAddons (page) {
  const installerUrl = new URL('/redaxo/index.php?page=install/packages/add', process.env.SITE_URL).href;
  await page.goto(installerUrl);

  availableAddonLinks = await page.$$eval('tr td:nth-child(2) a', as => as.map(a => a.href));
  console.log(availableAddonLinks);
}

// TODO: Test addons