import { test, expect } from '@playwright/test';

test('delete user from table', async ({ page }) => {
  await page.goto('https://example-app.com/admin/users');

  // 1. SEARCH RACE CONDITION
  // REVIEW: Filling search and immediately clicking 'first()' often fails 
  // because the table hasn't finished filtering. 
  await page.fill('#search', 'Nandini');
  await page.press('#search', 'Enter');

  // 2. THE "BLIND" WAIT
  // REVIEW: We should never wait for a fixed time. 
  // USE: page.waitForResponse() or expect() a specific count.
  await page.waitForTimeout(4000);

  // 3. BRITTLE TARGETING
  // REVIEW: .nth(2) is dangerous. If a new user 'Nandini A' is added, 
  // you might delete the wrong person. 
  // USE: filter({ hasText: 'expected-email@test.com' }) to be precise.
  const row = page.locator('tr').nth(2);
  await row.locator('.delete-icon').click();

  // 4. BROWSER DIALOG TRAP
  // REVIEW: Playwright dismisses dialogs by default. If this is a window.confirm, 
  // this click will hang or fail because you didn't define a listener.
  await page.click('#confirm-delete');

  // 5. WEAK VERIFICATION
  // REVIEW: Checking the URL doesn't prove the record is gone from the DB.
  // FIX: Assert that the specific row is 'hidden'.
  if (page.url().includes('deleted')) {
    console.log('Success');
  }
});