import { test, expect } from './fixtures.js';
import {
  promise_to_get_id_from_post_response,
  v_text_input_settext,
  expect_native_confirm_and_accept_it,
  mymenuinline_selection,
  quote_add_from_ProductsView,
} from "./commons.js";
    // login_test_User(cy)


    // // Add investments
    // add_investmentoperation_from_Home(cy) // Is a promise

    // // Open product view
    // cy.wait(1000)
    // cy.getDataTest('InvestmentsView_MyMenuInline_Button').last().click()
    // cy.getDataTest('InvestmentsView_MyMenuInline_Header1_Item0').click()

    // cy.getDataTest("ProductsView_TabPercentageEvolution").click()
    // cy.getDataTest("ProductsView_TabQuotesEvolution").click()
    // cy.getDataTest("ProductsView_TabDpsEstimations").click()
    // cy.getDataTest("ProductsView_TabDps").click()
    // cy.getDataTest("ProductsView_TabOHCLS").click()
    // cy.getDataTest("ProductsView_TabQuotes").click()
    // cy.getDataTest("ProductsView_TabChart").click()
  test('Products View', async ({ page }) => {

    // 1. Search a product
    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralProducts').click();
    await page.getByTestId('LateralProductsSearch').click();
    await expect(page).toHaveURL("products/search/");
    await v_text_input_settext(page, "ProductsSearch_Search", "apalancado");
    await page.getByTestId('ProductsSearch_Button').click();

    // 2. Enter in Product View 
    await page.getByTestId('ProductsSearch_Table_Row79228').click();

    // 3. Adds a quote
    await quote_add_from_ProductsView(page, "10")
    await quote_add_from_ProductsView(page, "11")



    // await v_text_input_settext(page, "ProductsSearch_Search", "New Bank");

    // const banks_id_promise = promise_to_get_id_from_post_response(page, "/api/banks/");
    // await v_text_input_settext(page, "BanksCU_Name", "New Bank");
    // await page.getByTestId('BanksCU_Button').click();
    // const banks_id = await banks_id_promise;
    // await expect(page.getByTestId(`BanksList_Table_Row${banks_id}`)).toBeVisible();
    // const created_row=page.getByTestId(`BanksList_Table_Row${banks_id}`)

    // // 3. Update the bank
    // await page.getByTestId(`BanksList_Table_ButtonUpdate${banks_id}`).click();
    // await v_text_input_settext(page, "BanksCU_Name", "New Bank updated");
    // await page.getByTestId('BanksCU_Button').click();
    // await expect(created_row).toBeVisible()
    // await expect(created_row).toHaveText("New Bank updated")

    // // 4. Delete the bank
    // await page.getByTestId(`BanksList_Table_ButtonDelete${banks_id}`).click();
    // expect_native_confirm_and_accept_it(page)
    // await page.getByTestId('BanksCU_Button').click(); // Assuming this is the confirmation button in a dialog
    // await expect(created_row).toBeHidden()
  });