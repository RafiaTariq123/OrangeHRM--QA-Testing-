import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Page Object for the Admin → System Users list page.
 * Handles navigation, search, and row-level actions (edit, delete).
 */
export class AdminPage {
  constructor(private readonly page: Page) {}

  // ── Navigation ──────────────────────────────────────────────

  /** Click the "Admin" link in the sidebar and wait for the System Users page. */
  async navigateToSystemUsers() {
    await this.page.getByRole('link', { name: 'Admin' }).click();

    await expect(this.page).toHaveURL(/\/admin\/viewSystemUsers/, {
      timeout: 10000,
    });

    await expect(
      this.page.getByRole('heading', { name: 'System Users' })
    ).toBeVisible({ timeout: 10000 });
  }

  // ── Search ──────────────────────────────────────────────────

  /** Search for a username via the filter form. */
  async searchUser(username: string) {
    const usernameField = this.page
      .locator('.oxd-table-filter-area .oxd-input-group', {
        hasText: 'Username',
      })
      .locator('input');

    await usernameField.fill(username);
    await this.page.getByRole('button', { name: 'Search' }).click();
    await this.page.waitForLoadState('networkidle');
  }

  // ── Table row helpers ───────────────────────────────────────

  /** Return the table row locator that contains the given username. */
  getUserRow(username: string): Locator {
    return this.page.locator('.oxd-table-card', { hasText: username });
  }

  // ── Row actions ─────────────────────────────────────────────

  /** Click the "+ Add" button to open the Add User form. */
  async clickAdd() {
    await this.page.getByRole('button', { name: 'Add' }).click();
  }

  /** Click the pencil (edit) icon inside the given row. */
  async clickEdit(userRow: Locator) {
    const editButton = userRow.locator('button:has(i.bi-pencil-fill)');
    await expect(editButton).toBeVisible({ timeout: 5000 });
    await editButton.click();
  }

  /** Click the trash (delete) icon inside the given row. */
  async clickDelete(userRow: Locator) {
    const deleteButton = userRow.locator('button:has(i.bi-trash)');
    await expect(deleteButton).toBeVisible({ timeout: 5000 });
    await deleteButton.click();
  }

  /** Select the checkbox inside the given row. */
  async selectCheckbox(userRow: Locator) {
    const checkbox = userRow.locator('.oxd-checkbox-input').first();
    await checkbox.click();
  }

  /** Confirm deletion in the "Are you Sure?" dialog. */
  async confirmDeletion() {
    const confirmButton = this.page.getByRole('button', {
      name: /Yes, Delete/i,
    });
    await expect(confirmButton).toBeVisible({ timeout: 10000 });
    await confirmButton.click();
  }

  // ── Assertions ──────────────────────────────────────────────

  /** Wait for a success toast notification. */
  async expectSuccessToast() {
    const toast = this.page.locator('.oxd-toast--success, .oxd-toast-content');
    await expect(toast.first()).toBeVisible({ timeout: 10000 });
  }
}
