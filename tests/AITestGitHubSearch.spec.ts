import { test, expect } from '@playwright/test';

test.skip('verify playwright repository popularity', async ({ page }) => {
  // 1. Navigate directly to GitHub
  await page.goto('https://github.com');

  // 2. Handle the "Search Trap": Click the button first to reveal the input
  // This targets the exact button you saw highlighted in blue!
  const searchTrigger = page.getByRole('button', { name: /search or jump to/i });
  await searchTrigger.click();

  // 3. Fill the actual input that appears after the click
  const searchInput = page.getByRole('combobox', { name: 'Search' });
  await searchInput.fill('playwright');
  await searchInput.press('Enter');

  // 4. Avoid waitForTimeout. Instead, wait for the specific result to appear.
  // This makes the test faster and more reliable.
  const playwrightRepo = page.getByRole('link', { name: 'microsoft/playwright', exact: true });
  await expect(playwrightRepo).toBeVisible();
  await playwrightRepo.click();

  // 5. Get the star count text (e.g., "61.2k")
  const starsText = await page.getAttribute('a[href$="/stargazers"]', 'aria-label');
  // Example: "61,234 users starred this repository" or "61.2k"
  
  // 6. Robust Math Logic: Convert "61.2k" into a real number 61200
  // This fixes the logic bug from the original code review
  const rawNumber = await page.locator('#repo-stars-counter-star').innerText();
  let starCount = parseFloat(rawNumber);
  
  if (rawNumber.includes('k')) {
    starCount = starCount * 1000;
  } else if (rawNumber.includes('m')) {
    starCount = starCount * 1000000;
  }

  // 7. Use a real assertion instead of console.log
  console.log(`Verified Star Count: ${starCount}`);
  expect(starCount).toBeGreaterThan(50000);
});



test('search for playwright repo and check stars', async ({ page }) => {
  // 1. Navigation
  await page.goto('https://github.com');

  // 2. Interaction
  await page.click('[placeholder="Search or jump to..."]');
  await page.keyboard.type('playwright');
  await page.keyboard.press('Enter');

  // 3. Waiting for results
  await page.waitForTimeout(5000);

  // 4. Locating the result
  // Click the first link that looks like the repo
  await page.locator('.repo-list-item').first().click();

  // 5. Verification logic
  const stars = await page.innerText('.Counter.js-social-count');
  const starCount = parseInt(stars.replace('k', '000'));

  if (starCount > 50000) {
    console.log('Very popular repo!');
  } else {
    throw new Error('Not enough stars found');
  }

  // 6. Navigation back
  await page.goBack();
});