import { test, expect } from './fixtures.js';
import {
    investment_add_from_InvestmentsList,
    quote_add_from_InvestmentsList,
    strategy_products_range_add_from_StrategiesList,
} from "./commons.js";
import {
    expect_native_confirm_and_accept_it,
    v_text_input_settext
} from "./playwright_vuetify.js";



test('Strategies Products Range CRUD', async ({ page }) => {

    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralInvestments').click();


    // Creates an investment and an investment operation
    const investments_id=await investment_add_from_InvestmentsList(page, "Test investment", "LYXOR IBEX DOBLE APALANCADO (Madrid Stock Exchange)");
    await expect(page.getByTestId(`Investments_Table_Row${investments_id}`)).toBeVisible();
    await quote_add_from_InvestmentsList(page, investments_id);

    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralStrategies').click();

    const strategy_id = await strategy_products_range_add_from_StrategiesList(page, "Range strategy", "Test investment", "LYXOR IBEX DOBLE APALANCADO (Madrid Stock Exchange)", "The best too");

    // Update the strategy
    await page.getByTestId(`StrategiesList_Table_IconEdit${strategy_id}`).click();
    await v_text_input_settext(page, "StrategyProductsRangeCU_Name", "Range strategy updated");
    await page.getByTestId('StrategyProductsRangeCU_Button').click();
    const row = page.getByRole('row').filter({ has: page.getByTestId(`StrategiesList_Table_IconEdit${strategy_id}`) });
    await expect(row).toContainText("Range strategy updated");

    // Delete the strategy
    await page.getByTestId(`StrategiesList_Table_IconDelete${strategy_id}`).click();
    await expect(page.getByTestId('StrategyProductsRangeCU_Button')).toBeVisible();
    expect_native_confirm_and_accept_it(page);
    await page.getByTestId('StrategyProductsRangeCU_Button').click();
    await expect(page.getByTestId(`StrategiesList_Table_Row${strategy_id}`)).toBeHidden();

    // Create another strategy
    const other_strategy_id = await strategy_products_range_add_from_StrategiesList(page, "Another Range strategy", "Test investment", "LYXOR IBEX DOBLE APALANCADO (Madrid Stock Exchange)", "The second best");

});