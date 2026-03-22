import { test, expect } from './fixtures.js';
import {
  account_add_from_AccountsList,
  accountoperation_add_from_AccountsView,
  accountstransfer_from_AccountsView
} from "./commons.js";
import { id_from_hyperlinked_url } from '@/functions.js';
import {
  v_text_input_settext,
  expect_native_confirm_and_accept_it
} from "./playwright_vuetify.js";




test('Accounts transfers CRUD', async ({ page }) => {
    // 1. Create source account
    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralAccounts').click();
    const source_account_id = await account_add_from_AccountsList(page, "Source Account for Transfers");
    // Add an initial operation to ensure the source account has some balance for transfer
    await page.getByTestId(`AccountsList_Table_Row${source_account_id}`).click();
    await accountoperation_add_from_AccountsView(page, "Initiating bank account", "2000", "Initial balance for transfer test");
    await page.getByTestId('AccountsView_ButtonClose').click();
    await account_add_from_AccountsList(page, "Destiny Account for Transfers");

    // Navigate to the source account's view to initiate transfer 
    await page.getByTestId(`AccountsList_Table_Row${source_account_id}`).click();
 
    // --- C: Create a new transfer ---
    const transfer = await accountstransfer_from_AccountsView(page, 'Destiny Account for Transfers', '1000', '1');
    console.log(transfer)
    const transfer_origin_id=id_from_hyperlinked_url(transfer.origin); //Id origin account operation
    await expect(page.getByTestId(`TableAccountOperations_ButtonUpdate${transfer_origin_id}`)).toBeVisible();

    // --- U: Update the transfer ---
    await page.getByTestId(`TableAccountOperations_ButtonUpdate${transfer_origin_id}`).click();
    await v_text_input_settext(page, 'AccountsTransfer_Amount', "2000");
    await page.getByTestId('AccountsTransfer_Button').click();
    await expect(page.getByTestId('AccountsTransfer_Button')).toBeHidden(); // Wait for dialog to close
    await expect(page.getByTestId(`TableAccountOperations_ButtonUpdate${transfer_origin_id}`)).toBeVisible();
    
    // --- D: Delete the transfer ---
    await page.getByTestId(`TableAccountOperations_ButtonDelete${transfer_origin_id}`).click();
    expect_native_confirm_and_accept_it(page); // Handle native browser confirm
    await page.getByTestId('AccountsTransfer_Button').click(); // Assuming this button confirms deletion in the dialog
    await expect(page.getByTestId('AccountsTransfer_Button')).toBeHidden(); // Wait for dialog to close
    await expect(page.getByTestId(`TableAccountOperations_ButtonUpdate${transfer_origin_id}`)).toBeHidden();
});
