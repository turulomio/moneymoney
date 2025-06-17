
import { expect } from '@playwright/test';


export async function v_autocomplete_selection(page, name){
  await page.getByTestId(name).getByRole("textbox").pressSequentially("Personal Management")
  await page.keyboard.pressSequentially("ArrowDown")
  await page.keyboard.pressSequentially("Enter")
//    await page.getByTestId(name).('.v-list-item-name:has-text("Italy")').click();

  
//   getByRole('textbox').fill("Personal");

// await autocompleteInput.click();
// await autocompleteInput.type('Italy');

// // The option selector remains the same as it's in a global element
// await page.locator('.v-list-item-name:has-text("Italy")').click();

// await expect(autocompleteInput).toHaveValue('Italy');
//     })
}


export async function v_text_input_settext(page, name, text){
  const v_text_input=page.getByTestId(name)
  await v_text_input.getByRole("textbox").fill(text);
//   await expect(v_text_input).toHaveValue(text);
}