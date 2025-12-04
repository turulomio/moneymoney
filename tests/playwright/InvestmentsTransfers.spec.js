import { test, expect } from './fixtures.js'; // Import from your fixtures file
import {
  mymenuinline_selection,
  v_autocomplete_selection_with_role_listbox,
  v_text_input_settext,
  promise_to_get_id_from_post_response,
} from "./playwright_vuetify.js"
import {
  investment_add_from_InvestmentsList,
  investmentoperation_add_from_InvestmentsView,
  quote_add_from_InvestmentsList,
} from "./commons"


test('Investments transfers', async ({ page }) => {
  await page.getByTestId('LateralIcon').click();
  await page.getByTestId('LateralInvestments').click();

  // Preparing investment 1
  const investments1_id=await investment_add_from_InvestmentsList(page, "Test investment transfer 1", "LYXOR IBEX DOBLE APALANCADO (Madrid Stock Exchange)");
  await quote_add_from_InvestmentsList(page, investments1_id)
  await expect(page.getByTestId(`Investments_Table_Row${investments1_id}`)).toBeVisible();
  await page.getByTestId(`Investments_Table_Row${investments1_id}`).click()
  await investmentoperation_add_from_InvestmentsView(page)
  await page.getByTestId("InvestmentsView_ButtonClose").click()

    // Preparing investment 2
  const investments2_id=await investment_add_from_InvestmentsList(page, "Test investment transfer 2", "Lyxor UCITS NASDAQ-100 Daily Leverage (Paris Stock Exchange)")
  await quote_add_from_InvestmentsList(page, investments2_id)
  await expect(page.getByTestId(`Investments_Table_Row${investments2_id}`)).toBeVisible();
  await page.getByTestId(`Investments_Table_Row${investments2_id}`).click()

  // Creating a new investments transfer
  await mymenuinline_selection(page, "InvestmentsView_MyMenuInline", 0, 5)
  await mymenuinline_selection(page, "InvestmentsTransfers_MyMenuInline", 0, 0)

  await v_autocomplete_selection_with_role_listbox(page, 'InvestmentsTransfersCU_InvestmentsOrigin',"Test investment transfer 1")
  await v_autocomplete_selection_with_role_listbox(page, 'InvestmentsTransfersCU_InvestmentsDestiny',"Test investment transfer 2")

  // Fill origin data
  await v_text_input_settext(page, "InvestmentsTransfersCU_SharesOrigin", "50")
  await v_text_input_settext(page, "InvestmentsTransfersCU_PriceOrigin", "9")

  // Fill destiny data
  await v_text_input_settext(page, "InvestmentsTransfersCU_SharesDestiny", "45")
  await v_text_input_settext(page, "InvestmentsTransfersCU_PriceDestiny", "10")

  const transferIdPromise = promise_to_get_id_from_post_response(page, "/api/investmentstransfers/");
  await page.getByTestId('InvestmentsTransfersCU_Button').click();
  const transferId = await transferIdPromise;
  expect(transferId).toBeDefined();

  await expect(page.getByTestId('InvestmentsTransfersCU_Button')).toBeHidden();
})
