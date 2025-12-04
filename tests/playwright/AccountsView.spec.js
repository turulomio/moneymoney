import { test,expect } from './fixtures.js'; // Import from your fixtures file
import {
    accountoperation_add_from_AccountsView,
} from "./commons"
import {
    v_text_input_settext,
    mymenuinline_selection
} from "./playwright_vuetify.js"

  test('Accounts View', async ({ page }) => {

    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralAccounts').click();
    await page.getByTestId('AccountsList_Table_Row4').click();

    const accountoperation_id=await accountoperation_add_from_AccountsView(page, "Supermarket", "-100", "This is a comment")
    
    // Capture ao_id from last post and copy this ao
    await page.getByTestId(`TableAccountOperations_ButtonCopy${accountoperation_id}`).click();
    await page.getByTestId('AccountsoperationsCU_ButtonFollowing').click();
    await page.getByTestId('AccountsoperationsCU_Button').click();
    await expect(page.getByTestId('AccountsoperationsCU_Button')).toBeHidden()

    // Exits AccountsView and make search
    await page.getByTestId('AccountsView_ButtonClose').click();
    await expect(page.getByTestId('AccountsView_ButtonClose')).toBeHidden()

    await mymenuinline_selection(page, "AccountsList_MyMenuInline", 1, 0)
    await v_text_input_settext(page, "AccountsoperationsSearch_Search", "comment")
    await page.getByTestId('AccountsoperationsSearch_Button').click()

  })

