import { test, expect } from './fixtures.js';
import {
  account_add_from_AccountsList,
  accountoperation_add_from_AccountsView,
  quote_add_from_currencies
} from "./commons.js";


test('Currencies: Add USD account and update USD quote', async ({ page }) => {
  // 1. Create an account in USD
  await page.getByTestId('LateralIcon').click();
  await page.getByTestId('LateralAccounts').click();
  const usd_account_id = await account_add_from_AccountsList(page, "USD Test Account", "Us dollar (USD - $)");


  // 2. Create accountoperation with an account with usd currencies
  await expect(page.getByTestId(`AccountsList_Table_Row${usd_account_id}`)).toBeVisible();
  await page.getByTestId(`AccountsList_Table_Row${usd_account_id}`).click();
  await accountoperation_add_from_AccountsView(page, "Supermarket", "-100", "This is a comment");
  await page.getByTestId('AccountsView_ButtonClose').click();

  // 2. Navigate to the Currencies list
  await page.getByTestId('LateralCurrencies').click(); // Corrected testId
  await expect(page.getByTestId('Currencies')).toBeVisible();

  // 3. Update the quote (factor) for USD
  // Let's set a factor, e.g., 1.1 for USD to EUR (assuming EUR is base currency)
  await quote_add_from_currencies(page, "1.1");
});
