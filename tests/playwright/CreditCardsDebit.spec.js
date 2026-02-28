import { test, expect } from './fixtures.js';
import {
  creditcard_add_from_AccountsView,
} from "./commons.js";
import {
  v_text_input_settext,
} from "./playwright_vuetify.js";

test('Credit cards debit', async ({ page }) => {
    // Navegate to component
    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralAccounts').click();
    await page.getByTestId('AccountsList_Table_Row4').click();
    await page.getByTestId('AccountsView_TabCC').click();

    // Create a credit card debit
    const cc_id=await creditcard_add_from_AccountsView(page, "My credit card", false )

    // Edit credit card and set inactive
    await page.getByTestId(`AccountsView_Tablecc_ButtonEdit${cc_id}`).click();
    await v_text_input_settext(page, "CreditcardsCU_Name", "Updated cc");
    await page.getByTestId('CreditcardsCU_Active').getByRole("checkbox").uncheck();
    await page.getByTestId('CreditcardsCU_Button').click();
    await expect(page.getByTestId('CreditcardsCU_Button')).toBeHidden();

    // Show inactive, check exiss and delete it

    await page.getByTestId('AccountsView_ShowActiveCC').getByRole("checkbox").uncheck();
    await expect(page.getByTestId(`AccountsView_Tablecc_Row${cc_id}`)).toBeVisible();
    await page.getByTestId(`AccountsView_Tablecc_ButtonDelete${cc_id}`).click();

    const dialogHandler = async dialog => await dialog.accept();
    page.on('dialog', dialogHandler);
    const responsePromise = page.waitForResponse(response => response.url().includes('/api/creditcards/') && response.request().method() === 'DELETE');
    await page.getByTestId('CreditcardsCU_Button').click();
    await responsePromise;
    page.removeListener('dialog', dialogHandler);
    await expect(page.getByTestId('CreditcardsCU_Button')).toBeHidden();
    await expect(page.getByTestId(`AccountsView_Tablecc_Row${cc_id}`)).toBeHidden();

});