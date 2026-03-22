import { test, expect } from './fixtures.js';
import {
  account_add_from_AccountsList,
  currency_update_factor_from_CurrenciesList
} from "./commons.js";


test('Currencies: Add USD account and update USD quote', async ({ page }) => {
  // 1. Create an account in USD
  await page.getByTestId('LateralIcon').click();
  await page.getByTestId('LateralAccounts').click();
  const usd_account_id = await account_add_from_AccountsList(page, "USD Test Account", "Us dollar (USD - $)");
  await expect(page.getByTestId(`AccountsList_Table_Row${usd_account_id}`)).toBeVisible();
  // Navigate to account view and close it to ensure we are back in AccountsList
  await page.getByTestId(`AccountsList_Table_Row${usd_account_id}`).click();
  await page.getByTestId('AccountsView_ButtonClose').click();

  // 2. Navigate to the Currencies list
  await page.getByTestId('LateralIcon').click(); // Open lateral menu again
  await page.getByTestId('LateralCurrencies').click(); // Corrected testId
  await expect(page).toHaveURL(/.*\/currencies\/list/); // Assuming this is the URL pattern

  // 3. Update the quote (factor) for USD
  // Let's set a factor, e.g., 1.1 for USD to EUR (assuming EUR is base currency)
  await currency_update_factor_from_CurrenciesList(page, "USD", "1.1");

  // Verify the updated factor is visible in the table (optional, but good practice)
  const usdRow = page.locator(`[data-testid^="CurrenciesList_Table_Row"]`, { hasText: "USD" });
  await expect(usdRow).toContainText("1.1"); // Assuming the factor is displayed in the row
});
