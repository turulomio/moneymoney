import { test, expect } from './fixtures.js';

test('Reports evolution', async ({ page }) => {
    // Navegate to component
    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralReports').click();
    await page.getByTestId('LateralReportsEvolution').click();
    expect (page.getByTestId('ReportsEvolution__CmbYears')).toBeVisible()
    await page.getByTestId('ReportsEvolution_TabAssets').click();
    await page.getByTestId('ReportsEvolution_TabInvested').click();


});