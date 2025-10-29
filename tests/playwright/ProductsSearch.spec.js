import { test, expect } from './fixtures.js';
import {
  v_text_input_settext,
  v_autocomplete_selection_with_role_option,
  mymenuinline_selection,
  v_autocomplete_selection_with_role_listbox,
} from "./commons.js";

test('Products List', async ({ page }) => {
    // Navegate to component
    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralProducts').click();
    await page.getByTestId('LateralProductsSearch').click();
    await expect(page).toHaveURL("products/search/");

    // Add a personal product
    await mymenuinline_selection(page, "ProductsSearch_MyMenuInline", 0, 0)
    await v_text_input_settext(page, "ProductsCU_Name", "New product personal")
    await v_autocomplete_selection_with_role_option(page, "ProductsCU_Currency", "Eur")
    await v_autocomplete_selection_with_role_option(page, "ProductsCU_ProductsTypes", "ETF")
    await v_autocomplete_selection_with_role_listbox(page, "ProductsCU_Stockmarkets", "Madrid")
    await page.getByTestId('ProductsCU_Button').click();
    await expect( page.getByTestId('ProductsCU_Button')).toBeHidden();

    // Add a system product
    await mymenuinline_selection(page, "ProductsSearch_MyMenuInline", 0, 1)
    await v_text_input_settext(page, "ProductsCU_Name", "New product system")
    await v_autocomplete_selection_with_role_option(page, "ProductsCU_Currency", "Eur")
    await v_autocomplete_selection_with_role_option(page, "ProductsCU_ProductsTypes", "ETF")
    await v_autocomplete_selection_with_role_listbox(page, "ProductsCU_Stockmarkets", "Madrid")
    await page.getByTestId('ProductsCU_Button').click();
    await expect( page.getByTestId('ProductsCU_Button')).toBeHidden();

    // Search added products
    await v_text_input_settext(page, "ProductsSearch_Search", "New product")
    await page.getByTestId('ProductsSearch_Button').click();
});