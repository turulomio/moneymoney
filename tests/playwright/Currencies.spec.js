import { test, expect } from './fixtures.js';

test('Currencies', async ({ page }) => {
  await page.getByTestId('LateralCurrrencies').click();

});