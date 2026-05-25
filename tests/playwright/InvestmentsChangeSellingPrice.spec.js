import { test, expect } from './fixtures.js';
import {
  investment_add_from_InvestmentsList,
} from "./commons.js"
import {
  mymenuinline_selection,
  v_text_input_settext,
} from "./playwright_vuetify.js"

test('Investments Change Selling Price snackbar', async ({ page }) => {
  await page.getByTestId('LateralIcon').click();
  await page.getByTestId('LateralInvestments').click();

  const investment = await investment_add_from_InvestmentsList(page, "Test Change Price", "LYXOR IBEX DOBLE APALANCADO (Madrid Stock Exchange)")
  
  await page.getByTestId(`Investments_Table_Row${investment.id}`).click()
  
  // Open "Change selling price" dialog (Subheader 0, Item 4)
  await mymenuinline_selection(page, "InvestmentsView_MyMenuInline", 0, 4)
  
  // The dialog is open.
  await expect(page.getByTestId('InvestmentsChangeSellingPrice_ButtonSubmit')).toBeVisible();

  // Change the price in the "price" tab (Tab 2)
  await page.getByRole('tab', { name: /Establece un precio|Set a price/ }).click();
  await v_text_input_settext(page, "InvestmentsChangeSellingPrice_Price", "15");

  // Submit
  await page.getByTestId('InvestmentsChangeSellingPrice_ButtonSubmit').click();

  // Verify snackbar message
  await expect(page.getByText(/El precio de venta se actualizó correctamente.|Selling price was updated sucessfully./)).toBeVisible();
  await expect(page.getByText(/No olvides colocar la orden en tu banco|Don't forget to set this order in your bank/)).toBeVisible();
  // await expect(page.getByText(/Price: 15,00 €|Price: 15.00 €/)).toBeVisible(); // Might vary by locale

  // Close message
  await page.getByTestId('InvestmentsChangeSellingPrice_ButtonCloseMessage').click();

  // Dialog should be closed (cruded event closes it in InvestmentsView)
  await expect(page.getByTestId('InvestmentsChangeSellingPrice_ButtonCloseMessage')).toBeHidden();
})
