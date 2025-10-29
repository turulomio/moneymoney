import { test, expect } from './fixtures.js';
import {
  v_text_input_settext,
  account_add_from_AccountsList,
  mymenuinline_selection,
  v_autocomplete_selection_with_role_option,
} from "./commons.js";

test('Accounts transfers', async ({ page }) => {
    // 1. Create account to transfer to
    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralAccounts').click();
    const account_id=await account_add_from_AccountsList(page, "Account to transfer to")

    // 2. Launches accounts view and makes transfer
    await expect(page.getByTestId(`AccountsList_Table_Row${account_id}`)).toBeVisible()
    await page.getByTestId(`AccountsList_Table_Row${account_id}`).click();
    await mymenuinline_selection(page, "AccountsView_MyMenuInline", 0, 0)
    await v_autocomplete_selection_with_role_option(page, 'AccountsTransfer_Destiny', 'Cash')
    await v_text_input_settext(page, 'AccountsTransfer_Amount', '1000' )
    await v_text_input_settext(page, 'AccountsTransfer_Commission', '1' )
    await page.getByTestId('AccountsTransfer_Button').click();
    await expect(page.getByTestId('AccountsTransfer_Button')).toBeHidden()

});