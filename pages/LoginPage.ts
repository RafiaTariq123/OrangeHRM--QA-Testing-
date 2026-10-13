import { type Page, expect } from '@playwright/test';

/**
 * Page Object for the OrangeHRM Login page.
 * Encapsulates login form interactions and navigation.
 */
export class LoginPage {
  private static readonly URL =
    'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

  constructor(private readonly page: Page) {}

  /** Navigate to the OrangeHRM login page. */
  async goto() {
    await this.page.goto(LoginPage.URL, { waitUntil: 'domcontentloaded' });
  }

  /** Fill in credentials and click the Login button. */
  async login(username: string, password: string) {
    await this.page.getByPlaceholder('Username').fill(username);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  /** Verify the Dashboard heading is visible after login. */
  async expectDashboard() {
    await expect(
      this.page.getByRole('heading', { name: 'Dashboard' })
    ).toBeVisible({ timeout: 10000 });
  }
}
