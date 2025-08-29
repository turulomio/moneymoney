import { test, expect } from './fixtures.js';
import {
    investment_add_from_InvestmentsList,
    quote_add_from_InvestmentsList,   
    investmentoperation_add_from_InvestmentsView,
} from "./commons.js";

test('Reports Investments Classes', async ({ page }) => {
    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralInvestments').click();
    // Creates an investment and an investment operation
    const investments_id=await investment_add_from_InvestmentsList(page)
    await quote_add_from_InvestmentsList(page, investments_id)
    await expect(page.getByTestId(`Investments_Table_Row${investments_id}`)).toBeVisible();
    await page.getByTestId(`Investments_Table_Row${investments_id}`).click()
    await investmentoperation_add_from_InvestmentsView(page)
    await page.getByTestId(`InvestmentsView_ButtonClose`).click()
    await expect(page.getByTestId(`InvestmentsView_ButtonClose)`)).toBeHidden()

    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralReports').click();
    await page.getByTestId('LateralReportsInvestmentsClasses').click();
    await page.getByTestId("ReportsInvestmentsClasses_TabPCI").click();
    expect(page.getByTestId('ReportsInvestmentsClasses_TabPCI')).toBeVisible()
    await page.getByTestId("ReportsInvestmentsClasses_TabPercentage").click();
    expect(page.getByTestId('ReportsInvestmentsClasses_TabPercentage')).toBeVisible()
    await page.getByTestId("ReportsInvestmentsClasses_TabType").click();
    expect(page.getByTestId('ReportsInvestmentsClasses_TabType')).toBeVisible()
    await page.getByTestId("ReportsInvestmentsClasses_TabLeverage").click();
    expect(page.getByTestId('ReportsInvestmentsClasses_TabLeverage')).toBeVisible()
    await page.getByTestId("ReportsInvestmentsClasses_TabProduct").click();
    expect(page.getByTestId('ReportsInvestmentsClasses_TabProduct')).toBeVisible()
});