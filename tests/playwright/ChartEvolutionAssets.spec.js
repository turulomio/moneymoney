import { test, expect } from './fixtures.js';

test('Chart Evolution Assets', async ({ page }) => {
    // 1. Create account to transfer to
    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralReports').click();
    await page.getByTestId('LateralReportsEvolutionChart').click();
    await expect(page.getByTestId('ChartEvolutionAssets_From')).toBeEnabled()
});