import { test, expect } from './fixtures.js';
import {
    investment_add_from_InvestmentsList,
} from "./commons.js";


    // //Open strategies lateral menu
    // cy.wait(1000)
    // cy.getDataTest('LateralIcon').should('be.visible').click()
    // cy.getDataTest('LateralStrategies').click()

    // // Add a new strategy ranged
    // component_pointable('StrategiesList_MyMenuInline_Button')
    // cy.getDataTest('StrategiesList_MyMenuInline_Button').click()
    // cy.getDataTest('StrategiesList_MyMenuInline_Header0_Item1').click()
    // cy.getDataTest('StrategyProductsRangeCU_Name').type("Range strategy")
    // cy.getDataTest('StrategyProductsRangeCU_Investments').type("Perm{downArrow}{enter}")
    // cy.wait(1000) // A lot of products, needed more time
    // cy.getDataTest('StrategyProductsRangeCU_Product').type("Apalanc{downArrow}{enter}")
    // cy.getDataTest('StrategyProductsRangeCU_Comment').type("The best too")
    // cy.intercept({ method:'POST', url:'http://127.0.0.1:8004/api/strategies_productsrange/', times:1,}).as("post_strategies")
    // cy.getDataTest('StrategyProductsRangeCU_Button').click()
    // cy.wait('@post_strategies').then((interception)=>{
    //     cy.wrap(interception.response.body.strategy.id).as('strategy_id') // Stores the captured ID for later us
    // })

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



test('Home and its alerts', async ({ page }) => {

    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralInvestments').click();


    // Creates an investment and an investment operation
    const investments_id=await investment_add_from_InvestmentsList(page)
    await expect(page.getByTestId(`Investments_Table_Row${investments_id}`)).toBeVisible();



});