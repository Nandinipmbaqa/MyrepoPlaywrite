import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly userMenu: Locator;
  readonly signOutButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Use Role-based locators for better resiliency and accessibility [cite: 13, 31]
    // If getByLabel fails on this specific site, we use a more robust locator string.
    this.emailInput = page.locator('input[name="email"], #email, [placeholder*="Email"]').first();
    
    // FIX: Initializing passwordInput to resolve the "reading 'fill'" TypeError 
    this.passwordInput = page.locator('input[name="password"], #password, [placeholder*="Password"]').first();
    
    this.loginButton = page.getByRole('button', { name: 'Log in' });
    
    // Locators for the logout flow
    this.userMenu = page.locator('.dropdown-trigger').filter({ hasText: 'plantify1111@gmail.com' });
    this.signOutButton = page.getByRole('link', { name: 'Sign out' });
  }

  /**
   * Navigates to the login page using the environment variable. [cite: 13, 51]
   */
  async navigate() {
    const url = process.env.BASE_URL || 'https://app.simplelogin.io/auth/login';
    await this.page.goto(url, { waitUntil: 'networkidle' });
  }

  /**
   * Performs the login action. 
   * Each step uses auto-waiting to ensure the element is ready. [cite: 41, 47]
   */
  async login(email: string, pass: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
  }

  /**
   * Performs the logout action. [cite: 40]
   */
  async logout() {
    await this.userMenu.click();
    await this.signOutButton.click();
  }
}