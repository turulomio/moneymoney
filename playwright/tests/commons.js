
import { expect } from '@playwright/test';


export async function v_autocomplete_selection(page, name){
  await page.getByTestId(name).click()
  await page.getByTestId(name).getByRole("textbox").fill("Personal Management")
  await page.keyboard.press("ArrowDown")
  await page.keyboard.press("Enter")
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
  v_text_input.click()
  await v_text_input.getByRole("textbox").fill(text);
//   await expect(v_text_input).toHaveValue(text);
}
  
export async function intercept_post(page, url, field){
   // url acabado en /
  // 1. Declara una variable fuera del handler para guardar el ID.
  let interceptedItemId;

  // 2. Configura el "interceptor" de rutas.
  //    Usamos un patrón "glob" (**) para interceptar cualquier petición a esa ruta.
  await page.route(`**${url}*`, async (route, request) => {
        console.log('Petición interceptada:', request.url());
        
        // 3. Extrae el ID de la URL.
        //    La URL será algo como "https://mi-app.com/api/items/12345"
        const url = request.url();
        console.log(request)
        interceptedItemId = url.split('/').pop(); // Extrae la última parte de la URL
        
        console.log(`ID capturado desde la URL: ${interceptedItemId}`);
        
        // 4. ¡MUY IMPORTANTE! Deja que la petición continúe hacia el servidor.
        //    Si no lo haces, la petición se quedará colgada.
        await route.continue();
        return interceptedItemId    
    }) 
}


export async function account_add_from_AccountsList(page){
  await page.getByTestId('MyMenuInline_Button').click();
  await page.getByTestId('MyMenuInline_Header0_Item0').click();
  v_text_input_settext(page, "AccountsCU_Name", "Permanent Account")
  v_autocomplete_selection(page, "AccountsCU_Bank")
  await page.getByTestId('AccountsCU_Button').click()
  await page.getByTestId('AccountsCU_Button').isHidden()
  intercept_post(page, "/api/accounts/", "id")
}