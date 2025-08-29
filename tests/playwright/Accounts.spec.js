import { test, expect } from './fixtures.js'; // Import from your fixtures file
import {account_add_from_AccountsList} from "./commons"

  test('Accounts list', async ({ page }) => {

    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralAccounts').click();
    await account_add_from_AccountsList(page)
    await expect(page.getByTestId('LateralIcon')).toBeVisible() //Eslint need
  })

