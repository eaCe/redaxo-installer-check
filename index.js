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
      headless: true,
    }
  );
  const page = await browser.newPage();
  await page.goto(backendUrl);

  // Login
  await login(page);

  // Go to installer
  await getAvailableAddons(page);

  // Install addons
  await installAddons(page);

  // Remove addons
  await removeAddons(page);

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
}

async function installAddons (page) {
  for (const link of availableAddonLinks) {
    await page.goto(link);

    const installLink = await page.$eval('td.rex-table-action a', a => a.href);
    await page.goto(installLink);

    await page.getByText('AddOn installieren & aktivieren').click();
    await page.waitForLoadState('networkidle');

    const addonKey = new URL(installLink).searchParams.get('addonkey');
    await page.screenshot({ path: `screenshots/${addonKey}.png` });
  }
}

async function removeAddons (page) {
  const addonUrl = new URL('/redaxo/index.php?page=packages', process.env.SITE_URL).href;
  await page.goto(addonUrl);

  const installedAddonLinks = await page.$$eval('tr.rex-package-is-addon td.rex-table-action a:last-child', as => as.map(a => a.href));

  for (const link of installedAddonLinks) {
    if (!link.includes('function=delete')) {
      continue;
    }

    await page.goto(link);
    await page.waitForLoadState('networkidle');
  }
}