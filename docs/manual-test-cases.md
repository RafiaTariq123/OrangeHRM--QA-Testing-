# Manual Test Cases — OrangeHRM System User Management

**Application Under Test:** [OrangeHRM Demo](https://opensource-demo.orangehrmlive.com/)  
**Module:** Admin → User Management → System Users  
**Credentials:** Username: `Admin` | Password: `admin123`

---

## TC-01 — Navigate to Admin Module

| Field             | Details                                                                       |
|-------------------|-------------------------------------------------------------------------------|
| **Preconditions** | User is on the OrangeHRM login page                                           |
| **Test Steps**    | 1. Enter valid Admin credentials (Admin / admin123)                           |
|                   | 2. Click **Login**                                                            |
|                   | 3. Click **Admin** from the left navigation menu                              |
| **Expected Result** | Admin Management module opens. The "System Users" heading and user table are displayed. |

---

## TC-02 — Add a New User

| Field             | Details                                                                       |
|-------------------|-------------------------------------------------------------------------------|
| **Preconditions** | Admin module is open (System Users page)                                      |
| **Test Steps**    | 1. Click the **+ Add** button                                                |
|                   | 2. Select **User Role** → ESS                                                |
|                   | 3. Type in the **Employee Name** field and select an employee from the dropdown |
|                   | 4. Enter a unique **Username**                                                |
|                   | 5. Select **Status** → Enabled                                               |
|                   | 6. Enter a **Password** (must meet strength requirements)                     |
|                   | 7. Enter the same value in **Confirm Password**                               |
|                   | 8. Click **Save**                                                             |
| **Expected Result** | A success toast message appears. The page redirects to System Users. The new user is visible in the table. |

---

## TC-03 — Search Newly Created User

| Field             | Details                                                                       |
|-------------------|-------------------------------------------------------------------------------|
| **Preconditions** | A new user has been created (TC-02)                                           |
| **Test Steps**    | 1. Enter the newly created username in the **Username** search field          |
|                   | 2. Click **Search**                                                           |
| **Expected Result** | The search results display the user with correct Username, User Role (ESS), Employee Name, and Status (Enabled). |

---

## TC-04 — Edit User Details

| Field             | Details                                                                       |
|-------------------|-------------------------------------------------------------------------------|
| **Preconditions** | The newly created user exists in the System Users list                        |
| **Test Steps**    | 1. Search for the user using the Username field                               |
|                   | 2. Click the **Edit** (pencil) icon in the user's row                         |
|                   | 3. Update the **Username** to a new unique value                              |
|                   | 4. Change the **Status** from Enabled → Disabled                              |
|                   | 5. Click **Save**                                                             |
| **Expected Result** | A success toast message appears. The page redirects to System Users. The updated username is visible in the table. |

---

## TC-05 — Validate Updated User Details

| Field             | Details                                                                       |
|-------------------|-------------------------------------------------------------------------------|
| **Preconditions** | User details have been updated (TC-04)                                        |
| **Test Steps**    | 1. Search for the updated username                                            |
|                   | 2. Verify the **Username** matches the updated value                          |
|                   | 3. Verify the **User Role** is still ESS                                      |
|                   | 4. Verify the **Employee Name** matches the originally selected employee      |
|                   | 5. Verify the **Status** is Disabled                                          |
| **Expected Result** | All updated details match the values entered during editing. |

---

## TC-06 — Delete User

| Field             | Details                                                                       |
|-------------------|-------------------------------------------------------------------------------|
| **Preconditions** | The updated user exists in the System Users list                              |
| **Test Steps**    | 1. Search for the user using the updated username                             |
|                   | 2. Select the user using the **checkbox**                                     |
|                   | 3. Click the **Delete** (trash) icon in the user's row                        |
|                   | 4. Click **Yes, Delete** in the confirmation dialog                           |
| **Expected Result** | A success toast message is displayed. The user is removed from the table. |

---

## TC-07 — Verify User Deletion

| Field             | Details                                                                       |
|-------------------|-------------------------------------------------------------------------------|
| **Preconditions** | The user has been deleted (TC-06)                                             |
| **Test Steps**    | 1. Enter the deleted username in the **Username** search field                |
|                   | 2. Click **Search**                                                           |
| **Expected Result** | The deleted user is **not** displayed in the search results. A "No Records Found" message may appear. |
