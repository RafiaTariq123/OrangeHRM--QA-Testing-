# OrangeHRM — System User Management

Automated end-to-end tests for the **Admin → System Users** module on [OrangeHRM Demo](https://opensource-demo.orangehrmlive.com/).

Built with **Playwright** + **TypeScript** using the **Page Object Model** pattern.

---

## 📁 Project Structure

```
OrangeHRM-QA-Assessment/
├── pages/                          # Page Object Model classes
│   ├── LoginPage.ts                # Login form interactions
│   ├── AdminPage.ts                # System Users list & row actions
│   └── UserFormPage.ts             # Add / Edit User form
├── tests/
│   └── user-management.spec.ts     # 7 test cases (TC-01 → TC-07)
├── docs/
│   └── manual-test-cases.md        # Manual test case documentation
├── playwright.config.ts            # Playwright configuration
├── package.json
└── README.md
```

---

## 🛠️ Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **Windows:** Microsoft Visual C++ Redistributable 2015–2022 (x64), required by the Playwright browsers.

If `npx playwright install` reports that `msvcp140_1.dll` is missing, install or repair the official [Microsoft Visual C++ Redistributable (x64)](https://aka.ms/vs/17/release/vc_redist.x64.exe), close and reopen your terminal, then run `npx playwright install` again. This warning is about a Windows runtime dependency; reinstalling the project’s npm packages will not provide the missing system DLL.

---

## 🚀 Project Setup

```bash
# 1. Clone the repository
git clone https://github.com/RafiaTariq123/AccuKnox-user-management-tests.git
cd AccuKnox-user-management-tests-main

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install
```

---

## ▶️ Running the Tests

### Run all tests (default — Chromium, Firefox, WebKit)

```bash
npx playwright test
```

### Run on Chromium only (recommended for speed)

```bash
npx playwright test --project=chromium
```

### Run in headed mode (visible browser)

```bash
npx playwright test --project=chromium --headed
```

### View HTML report after run

```bash
npx playwright show-report
```

---

## 🧪 Test Cases

| TC ID | Test Case                       | Description                                                  |
|-------|---------------------------------|--------------------------------------------------------------|
| TC-01 | Navigate to Admin Module        | Login and verify the System Users page loads                 |
| TC-02 | Add a New User                  | Create a user with ESS role, unique username, Enabled status |
| TC-03 | Search Newly Created User       | Search and verify username, role, and status                 |
| TC-04 | Edit User Details               | Change username and status from Enabled → Disabled           |
| TC-05 | Validate Updated User Details   | Search updated user and verify all fields match              |
| TC-06 | Delete User                     | Delete the user via trash icon and confirm                   |
| TC-07 | Verify User Deletion            | Search deleted username and confirm no results               |

Tests run **serially** (`test.describe.serial`) because each test depends on state created by the previous one.

---

## 📦 Tech Stack

| Technology       | Version    |
|------------------|------------|
| Playwright       | `^1.62.1`  |
| TypeScript       | (bundled)  |
| Node.js          | ≥ 18.x     |

---

## 📝 Notes

- Tests target the **OrangeHRM open-source demo** site, which resets data periodically.
- A 60-second timeout is configured per test to accommodate the remote server's response time.
- The password `Qwerty@1234567` is used to satisfy OrangeHRM's password strength requirements.
