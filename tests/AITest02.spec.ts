// 🚩 ISSUE 1: No Page Object Model (POM) used. 

import test from "@playwright/test";

// All logic and locators are hardcoded in the test file.
test('contact form test', async ({ page }) => {
  
  // 🚩 ISSUE 2: Hardcoded URL. 
  // Should use a baseURL from config for environment flexibility.
  await page.goto('https://www.appinio.com/en/contact');

  // 🚩 ISSUE 3: Brittle CSS Selectors. 
  // These are likely to break if the UI changes even slightly.
  await page.locator('.input-field-name-234').fill('John Doe');

  // 🚩 ISSUE 4: Reliance on nth(0). 
  // This is fragile; if a new input is added above this, the test will fail.
  await page.locator('input[type="email"]').nth(0).fill('john@example.com');

  // 🚩 ISSUE 5: Hardcoded Sleep. 
  // This is a "flaky" killer. It makes tests slow and unreliable.
  await page.waitForTimeout(5000);

  // 🚩 ISSUE 6: Generic Click. 
  // Doesn't verify if the button is enabled or visible first.
  await page.click('#submit-btn');

  // 🚩 ISSUE 7: Weak/Manual Assertion. 
  // Not using "web-first" assertions which provide automatic retries.
  const message = await page.textContent('.success-msg');
  if (message !== 'Success') {
    throw new Error('Test Failed');
  }
});