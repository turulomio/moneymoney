
import { expect } from '@playwright/test';


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
async function get_id_from_post_response(page, url) {
  const responsePromise = page.waitForResponse(
    response => response.url().includes(url) && response.request().method() === 'POST'
  );
  const response = await responsePromise;
  const responseBody = await response.json();
  expect(responseBody).toHaveProperty('id');
  return responseBody.id;
}


export async function account_add_from_AccountsList(page){
  await page.getByTestId('MyMenuInline_Button').click();
  await page.getByTestId('MyMenuInline_Header0_Item0').click();

  // Set up the promise to wait for the response *before* the action.
  const idPromise = get_id_from_post_response(page, "/api/accounts/");

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