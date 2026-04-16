import { test, expect } from '@playwright/test';

test('complete purchase', async ({ page }) => {
  await page.goto('https://app.appinio.com/checkout');

  // RED FLAG: Blindly clicking based on index (extremely brittle)
  await page.locator('.payment-option').nth(2).click(); 

  // RED FLAG: Hardcoded data that should be dynamic or from environment
  await page.fill('#card-number', '4242424242424242');

  // RED FLAG: Static wait for a "processing" state
  await page.click('button.submit');
  await page.waitForTimeout(8000); 

  // RED FLAG: Not checking if the order actually succeeded in the DB/Backend
  expect(await page.isVisible('.success-icon')).toBeTruthy();
});