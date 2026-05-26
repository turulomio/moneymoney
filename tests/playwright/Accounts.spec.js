import { test, expect } from './fixtures.js'; // Import from your fixtures file
import {account_add_from_AccountsList} from "./commons"
import {
  v_text_input_settext,
  expect_confirm_and_accept_it
} from "./playwright_vuetify.js"


  test('Accounts list', async ({ page }) => {

    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralAccounts').click();
  
    // 1. Create an account for testing CRUD operations
    const account_id = await account_add_from_AccountsList(page, "Test Account for CRUD");
    await expect(page.getByTestId(`AccountsList_Table_Row${account_id}`)).toBeVisible();

    // 2. Update the account
    await page.getByTestId(`AccountsList_Table_ButtonUpdate${account_id}`).click();
    await v_text_input_settext(page, "AccountsCU_Name", "Updated Test Account");
    await page.getByTestId('AccountsCU_Button').click();
    await expect(page.getByTestId('AccountsCU_Button')).toBeHidden(); // Assert dialog closes
    await expect(page.getByTestId(`AccountsList_Table_Row${account_id}`)).toBeVisible();

    // 3. Delete the account
    await page.getByTestId(`AccountsList_Table_ButtonDelete${account_id}`).click();
    await page.getByTestId('AccountsCU_Button').click(); // This triggers the confirm dialog
    await expect_confirm_and_accept_it(page);
    await expect(page.getByTestId('AccountsCU_Button')).toBeHidden(); // Assert dialog closes
    await expect(page.getByTestId(`AccountsList_Table_Row${account_id}`)).toBeHidden(); // Assert account is gone
  })

