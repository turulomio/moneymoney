
import { expect } from './fixtures.js';


export async function v_autocomplete_selection(page, name, item_text){
  const autocomplete = page.getByTestId(name);
  // Click the input to focus and show the dropdown
  await autocomplete.click();
  // Type the text to filter the options
  await autocomplete.getByRole("textbox").fill(item_text);
  // Wait for the dropdown option to appear and click it.
  // Vuetify often renders the options overlay detached from the input.
  // We locate the item by its title text. Using a RegExp ensures an exact match.
  await page.locator('.v-list-item-title', { hasText: new RegExp(`^${item_text}$`) }).click();
}


export async function v_text_input_settext(page, name, text){
  const v_text_input=page.getByTestId(name)
  await v_text_input.click()
  await v_text_input.getByRole("textbox").fill(text);
//   await expect(v_text_input).toHaveValue(text);
}
  
// This helper waits for a POST request to a given URL and returns the 'id' from the JSON response.
export async function promise_to_get_id_from_post_response(page, url) {
  const responsePromise = page.waitForResponse(
    response => response.url().includes(url) && response.request().method() === 'POST'
  );
  const response = await responsePromise;
  const responseBody = await response.json();
  expect(responseBody).toHaveProperty('id');
  return responseBody.id;
}

export async function mymenuinline_selection(page, name,header,item){
  await page.getByTestId(`${name}_Button`).click();
  await page.getByTestId(`${name}_Header${header}_Item${item}`).click();
}


export async function account_add_from_AccountsList(page){
  await mymenuinline_selection(page, "AccountsList_MyMenuInline", 0, 0)

  // Set up the promise to wait for the response *before* the action.
  const idPromise = promise_to_get_id_from_post_response(page, "/api/accounts/");

  await v_text_input_settext(page, "AccountsCU_Name", "Permanent Account");
  await v_autocomplete_selection(page, "AccountsCU_Bank", "Personal Management");

  // This is the action that triggers the POST request.
  await page.getByTestId('AccountsCU_Button').click();

  // Now we wait for the promise to resolve with the ID from the response.
  const newAccountId = await idPromise;
  console.log(`New account created with ID: ${newAccountId}`);
  expect(newAccountId).toBeDefined();

  // Wait for the dialog to close.
  await expect(page.getByTestId('AccountsCU_Button')).toBeHidden();
}

export async function investment_add_from_InvestmentsList(page){InvestmentsList_MyMenuInline
  // This is a placeholder implementation based on the function name.
  // You may need to adjust the selectors and values.
  await mymenuinline_selection(page, "InvestmentsList_MyMenuInline", 0, 0)
  const idPromise = promise_to_get_id_from_post_response(page, "/api/investments/");
  await v_text_input_settext(page, "InvestmentsCU_Name", "New Test Investment");
  await v_autocomplete_selection(page, "InvestmentsCU_Type", "Stocks");
  await page.getByTestId('InvestmentsCU_Button').click();
}




export async function accountoperation_add_from_AccountsView(page){
  await mymenuinline_selection(page, "AccountsView_MyMenuInline", 1, 0)
  await v_autocomplete_selection(page, "AccountsoperationsCU_Concepts", "Supermarket");
  await v_text_input_settext(page, "AccountsoperationsCU_Amount", "-100")
  await v_text_input_settext(page, "AccountsoperationsCU_Comment", "This is a comment")
  
  const idPromise = promise_to_get_id_from_post_response(page, "/api/accountsoperations/");
  await page.getByTestId('AccountsoperationsCU_Button').click()
  return await idPromise
}

export async function expect_native_confirm_and_accept_it(page){
  /**
   * Must be before action raises it
   */
      page.on('dialog', dialog => { 
        console.log(dialog.message())
        dialog.accept()
    })
}