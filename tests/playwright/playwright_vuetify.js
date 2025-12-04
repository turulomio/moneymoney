import { expect } from '@playwright/test';


export async function v_autocomplete_selection_with_role_option(page, testId, optionText, first = true) {
  const autocomplete = page.getByTestId(testId);

  // 1. Click the component to open the dropdown.
  await autocomplete.click();

  // 2. The actual input is inside the component. We can find it by its role and type.
  await autocomplete.locator('input[type="text"]').fill(optionText);

  // 3. Wait for the desired option to appear in the dropdown and click it.
  const option = page.getByRole('option', { name: optionText, exact: false,  });
  if (first) await option.first().click();
  else await option.last().click();
}

export async function v_autocomplete_selection_with_role_listbox(page, testId, optionText, first = true) {
  const autocomplete = page.getByTestId(testId);

  // 1. Click the component to open the dropdown.
  await autocomplete.click();

  // 2. The actual input is inside the component. We can find it by its role and type.
  await autocomplete.locator('input[type="text"]').fill(optionText);

  // 3. Wait for the desired option to appear in the dropdown and click it.
  const option = page.getByRole('listbox').filter({ hasText: optionText }).locator('div').nth(1)
  if (first) await option.first().click();
  else await option.last().click();
}


export async function v_text_input_settext(page, name, text){
  const v_text_input=page.getByTestId(name)
  await v_text_input.click()
  await v_text_input.getByRole("textbox").fill(text);
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
  await expect(page.getByTestId(`${name}_Button`)).toBeVisible()
  await expect(page.getByTestId(`${name}_Button`)).toBeEnabled()
  await page.getByTestId(`${name}_Button`).click();
  await expect(page.getByTestId(`${name}_Header${header}_Item${item}`)).toBeVisible();
  await page.getByTestId(`${name}_Header${header}_Item${item}`).click();
}


export async function expect_native_confirm_and_accept_it(page){
  /**
   * Must be before action raises it
   */
      page.on('dialog', dialog => { 
        // console.log(dialog.message())
        dialog.accept()
    })
}