import { test, expect } from './fixtures.js';
import {
    accountoperation_add_from_AccountsView,
    investment_add_from_InvestmentsList,
    quote_add_from_InvestmentsList,
    investmentoperation_add_from_InvestmentsView,
} from "./commons.js";

test('Chart Evolution Assets', async ({ page }) => {
    // Add account operations
    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralAccounts').click();
    await page.getByTestId('AccountsList_Table_Row4').click();
    await accountoperation_add_from_AccountsView(page, "Supermarket", "-100", "This is a comment");
    await accountoperation_add_from_AccountsView(page, "Paysheet", "1000", "This is a comment");
    await page.getByTestId('AccountsView_ButtonClose').click();

    // Add investment operations
    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralInvestments').click();
    const investments_id = await investment_add_from_InvestmentsList(page, "Test investment", "LYXOR IBEX DOBLE APALANCADO (Madrid Stock Exchange)");
    await quote_add_from_InvestmentsList(page, investments_id);
    await page.getByTestId(`Investments_Table_Row${investments_id}`).click();
    await investmentoperation_add_from_InvestmentsView(page);
    await page.getByTestId('InvestmentsView_ButtonClose').click();

    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralReports').click();
    await page.getByTestId('LateralReportsEvolutionChart').click();
    await expect(page.getByTestId('ChartEvolutionAssets_From')).toBeEnabled()

    const chart = page.getByTestId('ChartEvolutionAssets_Chart');
    await expect(chart).toBeVisible();
});