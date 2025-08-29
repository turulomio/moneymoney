import { test, expect } from './fixtures.js';
import {
  v_text_input_settext,
  quote_add_from_ProductsView,
} from "./commons.js";

test('Products View', async ({ page }) => {
    // 1. Search a product
    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralProducts').click();
    await page.getByTestId('LateralProductsSearch').click();
    await expect(page).toHaveURL("products/search/");
    await v_text_input_settext(page, "ProductsSearch_Search", "apalancado");
    await page.getByTestId('ProductsSearch_Button').click();

    // 2. Enter in Product View 
    await page.getByTestId('ProductsSearch_Table_Row79228').click();

    // 3. Adds a quote
    await quote_add_from_ProductsView(page, "10")
    await quote_add_from_ProductsView(page, "11")

    // 4. Shows all tabs
    await page.getByTestId('ProductsView_TabPercentageEvolution').click();
    await page.getByTestId('ProductsView_TabQuotesEvolution').click();
    await page.getByTestId('ProductsView_TabDpsEstimations').click();
    await page.getByTestId('ProductsView_TabDps').click();
    await page.getByTestId('ProductsView_TabOHCLS').click();
    await page.getByTestId('ProductsView_TabQuotes').click();
    await page.getByTestId('ProductsView_TabChart').click();
});