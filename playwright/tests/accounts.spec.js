import { test } from './fixtures.js'; // Import from your fixtures file
import {account_add_from_AccountsList} from "./commons"

  test('Accounts list', async ({ page }) => {

    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralAccounts').click();
    await account_add_from_AccountsList(page)

    // // Add search accountsoperations dialog
    // cy.getDataTest('MyMenuInline_Button').last().click()
    // cy.getDataTest('MyMenuInline_Header1_Item0').click()
    // cy.getDataTest('AccountsoperationsSearch_Search').type("comment")
    // cy.getDataTest('AccountsoperationsSearch_Button').click()
    


  })

