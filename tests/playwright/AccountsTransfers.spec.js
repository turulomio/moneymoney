import { test, expect } from './fixtures.js';
import {
  account_add_from_AccountsList,
  accountoperation_add_from_AccountsView,
  accountstransfer_from_AccountsView,
} from "./commons.js";
import {
  v_text_input_settext,
  mymenuinline_selection,
  v_autocomplete_selection_with_role_option,
} from "./playwright_vuetify.js";


test('Accounts transfers', async ({ page }) => {
    // 1. Create account to transfer to
    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralAccounts').click();
    const account_id=await account_add_from_AccountsList(page, "Account to transfer to")
    // Add an initial operation to ensure the account has some balance for transfer
    await page.getByTestId(`AccountsList_Table_Row${account_id}`).click();
    await accountoperation_add_from_AccountsView(page, "Initiating bank account", "2000", "Initial balance for transfer test");
    await page.getByTestId('AccountsView_ButtonClose').click();

    // 2. Launches accounts view and makes transfer
    await expect(page.getByTestId(`AccountsList_Table_Row${account_id}`)).toBeVisible()
    await page.getByTestId(`AccountsList_Table_Row${account_id}`).click();
    await accountstransfer_from_AccountsView(page, 'Cash', '1000', '1');

});