import { test, expect } from '@playwright/test';
import 'dotenv/config';

/**
 * Cancel test if dot env file is not present
 */
if (!process.env.SITE_URL) {
  console.error('Please create a .env file with SITE_URL');
  test.skip();
}

/**
 * Dummy test to check if the test suite is running
 */
test('dummy test', async () => {
  expect(true).toBe(true);
});