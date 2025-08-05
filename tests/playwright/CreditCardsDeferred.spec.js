import { test,expect } from './fixtures.js';
import {
  creditcard_add_from_AccountsView,
  creditcardoperation_add_from_CreditCardsView,
} from "./commons.js";

test('Credit cards deferred', async ({ page }) => {
    // Navegate to component
    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralAccounts').click();
    await page.getByTestId('AccountsList_Table_Row4').click();
    await page.getByTestId('AccountsView_TabCC').click();

    // Create a credit card deferred
    const cc_id=await creditcard_add_from_AccountsView(page, "My credit card", true )
    await page.getByTestId(`AccountsView_Tablecc_Row${cc_id}`).click()

    //Create a credit card operation with follow and other without
    await creditcardoperation_add_from_CreditCardsView(page,"Supermarket", true)
    await expect(page.getByTestId('CreditcardsoperationsCU_ButtonFollow')).toBeVisible()
    await page.getByTestId('CreditcardsoperationsCU_Button').click()
    await expect(page.getByTestId('CreditcardsoperationsCU_Button')).toBeHidden()


});