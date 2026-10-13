import { type Page, expect } from '@playwright/test';

/**
 * Page Object for the Add / Edit User form.
 * Encapsulates form field interactions and save behaviour.
 */
export class UserFormPage {
  constructor(private readonly page: Page) {}

  // ── Form heading assertions ─────────────────────────────────

  /** Verify the "Add User" heading is visible. */
  async expectAddUserHeading() {
    await expect(
      this.page.getByRole('heading', { name: 'Add User' })
    ).toBeVisible({ timeout: 10000 });
  }

  /** Verify the "Edit User" heading is visible. */
  async expectEditUserHeading() {
    await expect(this.page.getByText('Edit User').first()).toBeVisible({
      timeout: 15000,
    });
  }

  // ── Field helpers ───────────────────────────────────────────

  /** Select a User Role from the first dropdown (e.g. "Admin" or "ESS"). */
  async selectUserRole(role: string) {
    await this.page.locator('.oxd-select-text').first().click();
    await this.page.getByText(role, { exact: true }).click();
  }

  /**
   * Type into the Employee Name autocomplete and pick the first result.
   * @returns The text content of the selected option (full name).
   */
  async fillEmployeeName(searchChar: string): Promise<string | undefined> {
    const field = this.page.getByPlaceholder('Type for hints...');
    await field.click();
    await field.pressSequentially(searchChar, { delay: 150 });

    const option = this.page
      .locator('.oxd-autocomplete-dropdown .oxd-autocomplete-option')
      .filter({ hasNotText: 'Searching' })
      .first();

    await expect(option).toBeVisible({ timeout: 10000 });
    const name = (await option.textContent())?.trim();
    await option.click();

    // Confirm the field is populated
    await expect(field).not.toHaveValue('', { timeout: 3000 });
    await expect(field).not.toHaveValue(/Searching/, { timeout: 3000 });

    return name;
  }

  /** Fill the Username input field. */
  async fillUsername(username: string) {
    const input = this.page
      .locator('.oxd-input-group', { hasText: 'Username' })
      .locator('input');
    await input.fill('');
    await input.fill(username);
  }

  /** Select a Status from the second dropdown (e.g. "Enabled" or "Disabled"). */
  async selectStatus(status: string) {
    await this.page.locator('.oxd-select-text').nth(1).click();
    await this.page.getByText(status, { exact: true }).click();
  }

  /** Fill both Password and Confirm Password fields. */
  async fillPassword(password: string) {
    await this.page
      .locator('.oxd-input-group', { hasText: /^Password$/ })
      .locator('input')
      .fill(password);

    await this.page
      .locator('.oxd-input-group', { hasText: 'Confirm Password' })
      .locator('input')
      .fill(password);
  }

  // ── Save ────────────────────────────────────────────────────

  /** Click the Save button and wait for success (toast + redirect). */
  async saveAndExpectSuccess() {
    await this.page.getByRole('button', { name: 'Save' }).click();

    // Wait for success toast OR redirect back to the System Users list
    const successToast = this.page.locator('.oxd-toast--success');
    await expect(
      successToast.or(this.page.locator('text=System Users'))
    ).toBeVisible({ timeout: 15000 });

    await expect(this.page).toHaveURL(/\/admin\/viewSystemUsers/, {
      timeout: 15000,
    });
  }
}
