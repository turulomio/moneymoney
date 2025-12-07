import { test, expect } from './fixtures.js'; // Import from your fixtures file
import {
  investment_add_from_InvestmentsList,
  investmentoperation_add_from_InvestmentsView,
  quote_add_from_InvestmentsList,
  dividend_add_from_InvestmentView,
} from "./commons.js"
import {
  mymenuinline_selection,
  expect_native_prompt_and_set_value,
  click_outside_dialog,
  expect_native_alert_and_accept_it
} from "./playwright_vuetify.js"


test('Investments list', async ({ page }) => {
  await page.getByTestId('LateralIcon').click();
  await page.getByTestId('LateralInvestments').click();

  const investments_id=await investment_add_from_InvestmentsList(page, "Test investment", "LYXOR IBEX DOBLE APALANCADO (Madrid Stock Exchange)")
  await quote_add_from_InvestmentsList(page, investments_id)
  await expect(page.getByTestId(`Investments_Table_Row${investments_id}`)).toBeVisible();
  await page.getByTestId(`Investments_Table_Row${investments_id}`).click()
  await investmentoperation_add_from_InvestmentsView(page)
  await dividend_add_from_InvestmentView(page)

  // Open Reinvest dialog
  await mymenuinline_selection(page, "InvestmentsView_MyMenuInline", 2, 3)
  
  // Shares from amount
  await expect_native_prompt_and_set_value(page, "10")
  await mymenuinline_selection(page, "InvestmentsoperationsReinvest_MyMenuInline", 0, 0)
  await page.getByTestId('InvestmentsoperationsReinvest_ButtonSimulate').click()
  await expect(page.getByText("10.99 %")).toBeVisible()

  // Shares with decimals from amount
  await expect_native_prompt_and_set_value(page, "12")
  await mymenuinline_selection(page, "InvestmentsoperationsReinvest_MyMenuInline", 0, 1)
  await page.getByTestId('InvestmentsoperationsReinvest_ButtonSimulate').click()
  await expect(page.getByText("10.96 %")).toBeVisible()

  // Calculate shares from loss amount from reinvest
  await expect_native_alert_and_accept_it(page)
  await mymenuinline_selection(page, "InvestmentsoperationsReinvest_MyMenuInline", 1, 0)

  // Float shares to consolidate losses from reinvest
  await expect_native_alert_and_accept_it(page)
  await mymenuinline_selection(page, "InvestmentsoperationsReinvest_MyMenuInline", 1, 1)
  

  //Exit Reinvest Dialog
  await click_outside_dialog(page, "InvestmentsView_InvesmentsoperationsReinvest_Dialog")


  // See investments chart  
  await mymenuinline_selection(page, "InvestmentsView_MyMenuInline", 0, 0)
  await expect(page.getByTestId('ChartInvestments_ButtonClose')).toBeVisible();
  await page.getByTestId('ChartInvestments_ButtonClose').click()
  await expect(page.getByTestId('ChartInvestments_ButtonClose')).toBeHidden();

  // Change investment active status 
  await mymenuinline_selection(page, "InvestmentsView_MyMenuInline", 0, 1)
  await expect(page.getByText('Active: false')).toBeVisible();
  await expect(page.getByTestId('InvestmentsView_MyMenuInline_Header0_Item1')).toBeHidden();
  // Change status again
  await page.waitForTimeout(2000); //Due to rapid text change. Doesn't close menu
  await mymenuinline_selection(page, "InvestmentsView_MyMenuInline", 0, 1)
  await expect(page.getByText('Active: true')).toBeVisible();
  await expect(page.getByTestId('InvestmentsView_MyMenuInline_Header0_Item1')).toBeHidden();

  // Evolution chart
  await page.waitForTimeout(2000); //Due to rapid text change. Doesn't close menu
  await mymenuinline_selection(page, "InvestmentsView_MyMenuInline", 0, 2)
  await expect(page.getByTestId('ChartInvestmentsoperationsEvolution_ButtonClose')).toBeVisible();
  await page.getByTestId('ChartInvestmentsoperationsEvolution_ButtonClose').click()
  await expect(page.getByTestId('ChartInvestmentsoperationsEvolution_ButtonClose')).toBeHidden();


  // Evolution chart with time series
  await mymenuinline_selection(page, "InvestmentsView_MyMenuInline", 0, 3)
  await expect(page.getByTestId('ChartInvestmentsoperationsEvolutionTimeseries_ButtonClose')).toBeVisible();
  await page.getByTestId('ChartInvestmentsoperationsEvolutionTimeseries_ButtonClose').click()
  await expect(page.getByTestId('ChartInvestmentsoperationsEvolutionTimeseries_ButtonClose')).toBeHidden();





  // Navegate through tabs
    await page.getByTestId('InvestmentsView_TabCurrent').click();
    await page.getByTestId('InvestmentsView_TabOperations').click();
    await page.getByTestId('InvestmentsView_TabHistorical').click();
    await page.getByTestId('InvestmentsView_TabDividends').click();

})

