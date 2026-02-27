import { test, expect } from './fixtures.js';
import {
    investment_add_from_InvestmentsList,
    quote_add_from_InvestmentsList,
    strategy_products_range_add_from_StrategiesList,
    investmentoperation_add_from_InvestmentsView,
} from "./commons.js";
import {
    expect_native_confirm_and_accept_it,
    v_text_input_settext,
    promise_to_get_response,
    v_autocomplete_selection_with_role_listbox
} from "./playwright_vuetify.js";



test('Strategies Products Range CRUD', async ({ page }) => {

    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralInvestments').click();


    // Creates an investment and an investment operation
    const investments_id=await investment_add_from_InvestmentsList(page, "Test investment", "LYXOR IBEX DOBLE APALANCADO (Madrid Stock Exchange)");
    await expect(page.getByTestId(`Investments_Table_Row${investments_id}`)).toBeVisible();
    await quote_add_from_InvestmentsList(page, investments_id);
    await page.getByTestId(`Investments_Table_Row${investments_id}`).click();
    await investmentoperation_add_from_InvestmentsView(page);
    await page.getByTestId('InvestmentsView_ButtonClose').click();
    

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
    await page.getByTestId(`StrategiesList_Table_Row${other_strategy_id}`).click();
    await expect(page.getByTestId('ProductsRanges')).toBeVisible();

    // // Add an order
    // await page.getByTestId('ProductsRanges_TabTable').click();
    // const order_id_promise = promise_to_get_response(page, "/api/orders/", "POST");
    // await page.getByTestId(/^ProductsRanges_Table_IconAddOrder/).first().click();
    // await v_autocomplete_selection_with_role_listbox(page, "OrdersCU_Investments", "Test investment");
    // await page.getByTestId('OrdersCU_Button').click();
    // const order_id = (await order_id_promise).id;
    // await expect(page.getByTestId('OrdersCU_Button')).toBeHidden();

    // Shows chart
    await page.getByTestId('ProductsRanges_TabChart').click();
    await expect(page.getByTestId('ProductsRanges_Chart')).toBeVisible();
    await expect(page.getByTestId('ProductsRanges_Chart_Component')).toBeVisible();


});