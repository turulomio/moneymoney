import { test, expect } from './fixtures.js';
import {
    investment_add_from_InvestmentsList,
    quote_add_from_InvestmentsList,
} from "./commons.js";
import {
    mymenuinline_selection,
    v_text_input_settext,
    v_autocomplete_selection_with_role_listbox,
    promise_to_get_response,
} from "./playwright_vuetify.js";



    // cy.get("@strategy_id").then((strategy_id)  =>{
    //   // Opens strategy view
    //   cy.getDataTest(`StrategiesList_Table_IconView${strategy_id}`).click()

    //   // Closes strategy view
    //   component_pointable('StrategiesView_ButtonClose')
    //   cy.getDataTest('StrategiesView_ButtonClose').click()

    //   // // Opens strategy product range
    //   // cy.wait(2000)
    //   // component_pointable(`StrategiesList_Table_Row${strategy_id}`)
    //   // cy.getDataTest(`StrategiesList_Table_Row${strategy_id}`).click()

    //   // // Returns to strategy view buscando un typeable para hacer uno dos esc y vuelve a StrategyList
    //   // cy.getDataTest('ProductsRanges_Product').type("{esc}{esc}")

    //   // Sets an strategy inactive (dt_end not null)
    //   cy.getDataTest(`StrategiesList_Table_IconEdit${strategy_id}`).click()

    //   // component_pointable('StrategyProductsRangeCU_DtTo_Icon')
    //   cy.getDataTest('StrategyProductsRangeCU_DtTo_Icon').should('have.css', 'cursor', 'pointer').click()
    //   // cy.get('[data-test="StrategyProductsRangeCU_DtTo"] > .d-flex > .v-input > .v-input__prepend > .mdi-calendar-clock').click()
    //   cy.getDataTest('StrategyProductsRangeCU_Button').click()  
    //   cy.getDataTest(`StrategiesList_Table_IconEdit${strategy_id}`).should('not.exist');
    //    // Select elements whose ID starts with 'checkbox'
    //   cy.get('[id^="checkbox"]').first().click()
    //   cy.getDataTest(`StrategiesList_Table_IconEdit${strategy_id}`).should('exist');
    //   //Deletes it
    //   cy.getDataTest(`StrategiesList_Table_IconDelete${strategy_id}`).click()
    //   cy.getDataTest('StrategyProductsRangeCU_ButtonDelete').click()



test('Strategies Products Range', async ({ page }) => {

    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralInvestments').click();


    // Creates an investment and an investment operation
    const investments_id=await investment_add_from_InvestmentsList(page, "Test investment", "LYXOR IBEX DOBLE APALANCADO (Madrid Stock Exchange)")
    await expect(page.getByTestId(`Investments_Table_Row${investments_id}`)).toBeVisible();
    await quote_add_from_InvestmentsList(page, investments_id)

    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralStrategies').click();

    await mymenuinline_selection(page, "StrategiesList_MyMenuInline", 0, 1)
    const strategy_id_promise = promise_to_get_response(page, "/api/strategies_productsrange/", "POST");
    await v_text_input_settext(page, "StrategyProductsRangeCU_Name", "Range strategy");
    await v_autocomplete_selection_with_role_listbox(page, "StrategyProductsRangeCU_Investments", "Test investment");
    await v_autocomplete_selection_with_role_listbox(page, "StrategyProductsRangeCU_Product", "LYXOR IBEX DOBLE APALANCADO (Madrid Stock Exchange)");
    await v_text_input_settext(page, "StrategyProductsRangeCU_Comment", "The best too");
    await page.getByTestId('StrategyProductsRangeCU_Button').click();
    const strategy_id = (await strategy_id_promise).strategy.id;
    await expect(page.getByTestId(`StrategiesList_Table_Row${strategy_id}`)).toBeVisible();



});