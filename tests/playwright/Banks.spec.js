import { test, expect } from './fixtures.js';
import {
  promise_to_get_response,
  v_text_input_settext,
  expect_native_confirm_and_accept_it
} from "./playwright_vuetify.js";

  test('Banks CRUD', async ({ page }) => {

    // 1. Navigate to the Banks list
    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralBanks').click();
    await expect(page).toHaveURL(/.*\/banks\/list/);

    // 2. Create a new bank
    await page.getByTestId('MyMenuInline_Button').last().click();
    await page.getByTestId('MyMenuInline_Header0_Item0').click();

    const banks_id_promise = promise_to_get_response(page, "/api/banks/", "POST");
    await v_text_input_settext(page, "BanksCU_Name", "New Bank");
    await page.getByTestId('BanksCU_Button').click();
    const banks_id = (await banks_id_promise).id;
    await expect(page.getByTestId(`BanksList_Table_Row${banks_id}`)).toBeVisible();
    const created_row=page.getByTestId(`BanksList_Table_Row${banks_id}`)

    // 3. Update the bank
    await page.getByTestId(`BanksList_Table_ButtonUpdate${banks_id}`).click();
    await v_text_input_settext(page, "BanksCU_Name", "New Bank updated");
    await page.getByTestId('BanksCU_Button').click();
    await expect(created_row).toBeVisible()
    await expect(created_row).toHaveText("New Bank updated")

    // 4. Delete the bank
    await page.getByTestId(`BanksList_Table_ButtonDelete${banks_id}`).click();
    expect_native_confirm_and_accept_it(page)
    await page.getByTestId('BanksCU_Button').click(); // Assuming this is the confirmation button in a dialog
    await expect(created_row).toBeHidden()
  });