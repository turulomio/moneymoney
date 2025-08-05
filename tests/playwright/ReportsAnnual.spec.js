import { test, expect } from './fixtures.js';
import {
  quote_add_from_InvestmentsList,
  investment_add_from_InvestmentsList,
  investmentoperation_add_from_InvestmentsView,
  dividend_add_from_InvestmentView,
} from "./commons.js";

test('Reports Annual', async ({ page }) => {
    // test.setTimeout(60000);

    // Navigate to settings to Investment lists and add an investment operations
    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralInvestments').click();

    const investments_id=await investment_add_from_InvestmentsList(page)
    await quote_add_from_InvestmentsList(page, investments_id)
    await expect(page.getByTestId(`Investments_Table_Row${investments_id}`)).toBeVisible();
    await page.getByTestId(`Investments_Table_Row${investments_id}`).click()
    await investmentoperation_add_from_InvestmentsView(page)
    await dividend_add_from_InvestmentView(page)
    await page.getByTestId('InvestmentsView_ButtonClose').click();
    await expect(page.getByTestId('InvestmentsView_ButtonClose')).toBeHidden();

    // Goto annual report
    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralReports').click();
    await page.getByTestId('LateralReportsAnnual').click();

    // Navigate through tabs
    await page.getByTestId('ReportsAnnual_Tab0').click();
    await page.getByTestId('ReportsAnnual_Tab1').click();
    await page.getByTestId('ReportsAnnual_TableIncome_row1').click();
    await page.getByTestId('ReportsAnnualIncomeDetail_TabIncomes').click();
    await page.getByTestId('ReportsAnnualIncomeDetail_TabExpenses').click();
    await page.getByTestId('ReportsAnnualIncomeDetail_TabDividends').click();
    await page.getByTestId('ReportsAnnualIncomeDetail_TabGains').click();
    await page.getByTestId('ReportsAnnualIncomeDetail_TabFastOperations').click();
    await page.getByTestId('ReportsAnnualIncomeDetail_ButtonClose').click();
    await page.getByTestId('ReportsAnnual_Tab2').click();
    await page.getByTestId('ReportsAnnual_Tab3').click();
    await page.getByTestId('ReportsAnnual_Tab4').click();
    await page.getByTestId('ReportsAnnual_Tab5').click();
    

});