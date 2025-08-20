import { test, expect } from './fixtures.js';
import {
  accountoperation_add_from_AccountsView,
} from "./commons.js";



test('Reports Concepts', async ({ page }) => {
    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralAccounts').click();
    await page.getByTestId('AccountsList_Table_Row4').click();

    // Create several accounts operations
    await accountoperation_add_from_AccountsView(page, "Supermarket", "-100", "This is a comment")
    await accountoperation_add_from_AccountsView(page, "Attendance bonus", "100", "This is a comment")
    await accountoperation_add_from_AccountsView(page, "Restaurant", "-50", "This is a comment")
    await page.getByTestId('AccountsView_ButtonClose').click();

    // Enter in concepts report
    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralReports').click();
    await page.getByTestId('LateralReportsConcepts').click();
    expect(page.getByTestId('ReportConcepts_TabPositiveChart')).toBeVisible()
    await page.getByTestId('ReportConcepts_TabNegativeChart').click();
    expect(page.getByTestId('ReportConcepts_TabNegativeChart')).toBeVisible()
    await page.getByTestId('ReportConcepts_TabPositive').click();
    await page.getByTestId('ReportConcepts_TabNegative').click();
});