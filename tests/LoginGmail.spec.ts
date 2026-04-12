import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  
    await page.goto('https://gmail.com/');
    await page.pause()
    await page.getByRole('textbox', { name: 'Email or phone' }).click();
  await page.getByRole('textbox', { name: 'Email or phone' }).fill('nandiniconsultant.24@gmail.com');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.locator('div').filter({ hasText: 'This browser or app may not' }).nth(4).click();

})