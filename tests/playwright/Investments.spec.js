import { test, expect } from './fixtures.js'; // Import from your fixtures file
import {
  investment_add_from_InvestmentsList,
  investmentoperation_add_from_InvestmentsView,
  quote_add_from_InvestmentsList,
  dividend_add_from_InvestmentView,
  mymenuinline_selection,
} from "./commons"


test('Investments list', async ({ page }) => {
  await page.getByTestId('LateralIcon').click();
  await page.getByTestId('LateralInvestments').click();

  const investments_id=await investment_add_from_InvestmentsList(page, "Test investment", "LYXOR IBEX DOBLE APALANCADO (Madrid Stock Exchange)")
  await quote_add_from_InvestmentsList(page, investments_id)
  await expect(page.getByTestId(`Investments_Table_Row${investments_id}`)).toBeVisible();
  await page.getByTestId(`Investments_Table_Row${investments_id}`).click()
  await investmentoperation_add_from_InvestmentsView(page)
  await dividend_add_from_InvestmentView(page)

  // See investments chart  BUG DJANGO_MONEYMONEY
  // await mymenuinline_selection(page, "InvestmentsView_MyMenuInline", 0, 0)
  // await expect(page.getByTestId('ChartInvestments_ButtonClose')).toBeVisible();
  // cy.getDataTest('ChartInvestments_ButtonClose').click()

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

