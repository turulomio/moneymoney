import { test, expect } from './fixtures.js'; // Import from your fixtures file
import {
  investment_add_from_InvestmentsList,
  investmentoperation_add_from_InvestmentsView,
  quote_add_from_InvestmentsList,
  mymenuinline_selection,
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

  // Change investment active status 
  await mymenuinline_selection(page, "InvestmentsView_MyMenuInline", 0, 5)




})

