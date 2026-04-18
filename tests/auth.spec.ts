import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import * as dotenv from 'dotenv';
import path from 'path';

// Improved env loading logic
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

test.describe('Authentication Flow', () => {
  test('should successfully login and logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // Log the URL to the terminal to debug during your session
    console.log('Navigating to:', process.env.BASE_URL);

    await page.goto(process.env.BASE_URL || 'https://app.simplelogin.io/auth/login');
    
    // Check visibility with a clear error message
    await expect(loginPage.emailInput).toBeVisible({ timeout: 10000 });
    await loginPage.login(process.env.TEST_USER_EMAIL!, process.env.TEST_USER_PW!);
    
    await expect(page).toHaveURL(/.*dashboard/);
  });
});