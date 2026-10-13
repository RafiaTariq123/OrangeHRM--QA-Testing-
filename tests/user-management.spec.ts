import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AdminPage } from '../pages/AdminPage';
import { UserFormPage } from '../pages/UserFormPage';

test.describe.serial('OrangeHRM - System User Management', () => {
  // Increase timeout – the remote demo site is slow
  test.setTimeout(60_000);

  let createdUsername: string;
  let selectedEmployeeName: string | undefined;
  let updatedUsername: string;

  /**
   * Shared setup: login as Admin and navigate to Admin → System Users.
   */
  async function loginAndGoToSystemUsers(
    loginPage: LoginPage,
    adminPage: AdminPage
  ) {
    await loginPage.goto();
    await loginPage.login('Admin', 'admin123');
    await loginPage.expectDashboard();
    await adminPage.navigateToSystemUsers();
  }

  // ─────────────────────────────────────────────────────────────
  // TC-01 — Navigate to Admin Module
  // ─────────────────────────────────────────────────────────────
  test('TC-01 - Navigate to Admin Module', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const adminPage = new AdminPage(page);

    await loginAndGoToSystemUsers(loginPage, adminPage);
  });

  // ─────────────────────────────────────────────────────────────
  // TC-02 — Add a New User
  // ─────────────────────────────────────────────────────────────
  test('TC-02 - Add a New User', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const adminPage = new AdminPage(page);
    const userForm = new UserFormPage(page);

    await loginAndGoToSystemUsers(loginPage, adminPage);

    await adminPage.clickAdd();
    await userForm.expectAddUserHeading();

    createdUsername = `qauser${Date.now()}`;

    // Fill form fields
    await userForm.selectUserRole('ESS');
    selectedEmployeeName = await userForm.fillEmployeeName('a');
    console.log('Selected employee:', selectedEmployeeName);

    await userForm.fillUsername(createdUsername);
    await userForm.selectStatus('Enabled');
    await userForm.fillPassword('Qwerty@1234567');

    // Save and verify redirect
    await userForm.saveAndExpectSuccess();

    await expect(
      page.getByText(createdUsername, { exact: true })
    ).toBeVisible({ timeout: 10000 });
  });

  // ─────────────────────────────────────────────────────────────
  // TC-03 — Search Newly Created User
  // ─────────────────────────────────────────────────────────────
  test('TC-03 - Search Newly Created User', async ({ page }) => {
    expect(createdUsername, 'createdUsername must be set by TC-02').toBeTruthy();

    const loginPage = new LoginPage(page);
    const adminPage = new AdminPage(page);

    await loginAndGoToSystemUsers(loginPage, adminPage);
    await adminPage.searchUser(createdUsername);

    const userRow = adminPage.getUserRow(createdUsername);
    await expect(userRow).toBeVisible({ timeout: 10000 });

    await expect(userRow).toContainText(createdUsername);
    await expect(userRow).toContainText('Enabled');
    await expect(userRow).toContainText('ESS');
  });

  // ─────────────────────────────────────────────────────────────
  // TC-04 — Edit User Details
  // ─────────────────────────────────────────────────────────────
  test('TC-04 - Edit User Details', async ({ page }) => {
    expect(createdUsername, 'createdUsername must be set by TC-02').toBeTruthy();

    const loginPage = new LoginPage(page);
    const adminPage = new AdminPage(page);
    const userForm = new UserFormPage(page);

    await loginAndGoToSystemUsers(loginPage, adminPage);
    await adminPage.searchUser(createdUsername);

    const userRow = adminPage.getUserRow(createdUsername);
    await expect(userRow).toBeVisible({ timeout: 10000 });

    // Click the pencil (edit) icon
    await adminPage.clickEdit(userRow);
    await userForm.expectEditUserHeading();

    // Update Status: Enabled → Disabled
    await userForm.selectStatus('Disabled');

    // Update Username
    updatedUsername = `${createdUsername}_edit`;
    await userForm.fillUsername(updatedUsername);

    // Save and verify redirect
    await userForm.saveAndExpectSuccess();

    await expect(
      page.getByText(updatedUsername, { exact: true })
    ).toBeVisible({ timeout: 10000 });
  });

  // ─────────────────────────────────────────────────────────────
  // TC-05 — Validate Updated User Details
  // ─────────────────────────────────────────────────────────────
  test('TC-05 - Validate Updated User Details', async ({ page }) => {
    expect(updatedUsername, 'updatedUsername must be set by TC-04').toBeTruthy();

    const loginPage = new LoginPage(page);
    const adminPage = new AdminPage(page);

    await loginAndGoToSystemUsers(loginPage, adminPage);
    await adminPage.searchUser(updatedUsername);

    const userRow = adminPage.getUserRow(updatedUsername);
    await expect(userRow).toBeVisible({ timeout: 10000 });

    // 1. Verify Username
    await expect(userRow).toContainText(updatedUsername);

    // 2. Verify User Role
    await expect(userRow).toContainText('ESS');

    // 3. Verify Employee Name (first + last parts)
    if (selectedEmployeeName) {
      const nameParts = selectedEmployeeName.split(/\s+/);
      const firstName = nameParts[0];
      const lastName = nameParts[nameParts.length - 1];

      await expect(userRow).toContainText(firstName, { timeout: 5000 });
      if (nameParts.length > 1) {
        await expect(userRow).toContainText(lastName, { timeout: 5000 });
      }
    }

    // 4. Verify Status (changed to Disabled in TC-04)
    await expect(userRow).toContainText('Disabled');

    console.log('TC-05: All updated user details validated successfully');
  });

  // ─────────────────────────────────────────────────────────────
  // TC-06 — Delete User
  // ─────────────────────────────────────────────────────────────
  test('TC-06 - Delete User', async ({ page }) => {
    expect(updatedUsername, 'updatedUsername must be set by TC-04').toBeTruthy();

    const loginPage = new LoginPage(page);
    const adminPage = new AdminPage(page);

    await loginAndGoToSystemUsers(loginPage, adminPage);
    await adminPage.searchUser(updatedUsername);

    const userRow = adminPage.getUserRow(updatedUsername);
    await expect(userRow).toBeVisible({ timeout: 10000 });

    // Select the user, delete, and confirm
    await adminPage.selectCheckbox(userRow);
    await adminPage.clickDelete(userRow);
    await adminPage.confirmDeletion();

    // Verify success
    await page.waitForLoadState('networkidle');
    await adminPage.expectSuccessToast();

    console.log('TC-06: User deleted successfully');
  });

  // ─────────────────────────────────────────────────────────────
  // TC-07 — Verify User Deletion
  // ─────────────────────────────────────────────────────────────
  test('TC-07 - Verify User Deletion', async ({ page }) => {
    expect(updatedUsername, 'updatedUsername must be set by TC-04').toBeTruthy();

    const loginPage = new LoginPage(page);
    const adminPage = new AdminPage(page);

    await loginAndGoToSystemUsers(loginPage, adminPage);
    await adminPage.searchUser(updatedUsername);

    // Assert the user row is NOT visible
    const userRow = adminPage.getUserRow(updatedUsername);
    await expect(userRow).not.toBeVisible({ timeout: 10000 });

    console.log('TC-07: Deleted user is not displayed in search results');
  });
});