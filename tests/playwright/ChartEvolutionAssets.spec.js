import { test, expect } from './fixtures.js';

test('Chart Evolution Assets', async ({ page }) => {
    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralReports').click();
    await page.getByTestId('LateralReportsEvolutionChart').click();
    await expect(page.getByTestId('ChartEvolutionAssets_From')).toBeEnabled()
});