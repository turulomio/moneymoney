// /full/path/to/playwright/tests/dashboard.spec.js
// import { test, expect } from '@playwright/test';
// import { login } from '../utils/auth.js'; // Adjust path as needed
import { test, expect } from './fixtures.js'; // Import from your fixtures file

// test.describe('Dashboard Tests (requires login)', () => {
//   test.beforeEach(async ({ page }) => {
//     // Perform login before each test in this describe block
//     await login(page, 'testuser', 'secretpassword');
//   });

  // No explicit beforeEach for login is needed here if the fixture handles it.
  // The 'page' object provided to the test function will already be logged in.
  // If you still need a beforeEach for other reasons specific to this describe block,
  // it will run *after* the fixture setup.
  test('Accounts list', async ({ page }) => {
    // User is already logged in by beforeEach
    // Example: Check for a welcome message specific to the logged-in user

    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralAccounts').click();




    // login_test_User(cy)
    // //Open lateral menu
    // cy.getDataTest('LateralIcon').click()
    // cy.getDataTest('LateralAccounts').click()


    // // Add account
    // add_account_from_AccountsList(cy)


    // // Add search accountsoperations dialog
    // cy.getDataTest('MyMenuInline_Button').last().click()
    // cy.getDataTest('MyMenuInline_Header1_Item0').click()
    // cy.getDataTest('AccountsoperationsSearch_Search').type("comment")
    // cy.getDataTest('AccountsoperationsSearch_Button').click()
    


  })

