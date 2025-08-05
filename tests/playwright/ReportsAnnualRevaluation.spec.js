import { test, expect } from './fixtures.js';

test('Reports Annual Revaluation', async ({ page }) => {
    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralReports').click();
    await page.getByTestId('LateralReportsAnnualRevaluation').click();
    await page.getByTestId('ReportsAnnualRevaluation_OnlyZero').getByRole("checkbox").check();
    await expect(page.getByTestId('ReportsAnnualRevaluation_OnlyZero').getByRole("checkbox")).toBeChecked()
});