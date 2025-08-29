import { test, expect } from './fixtures.js';
import {
    account_add_from_AccountsList,
} from "./commons.js";




test('Home and its alerts', async ({ page }) => {

    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralAccounts').click();

    // Creates an account
    await account_add_from_AccountsList(page)
    // // I DONT KNOW WHY FAILS
    // // cy.get("@account_id").then((account_id) =>{
    // //   //Add ao to set a non zero balance
    // //   console.log(`AccountsList_Table_Row${account_id}`)
    // //   cy.getDataTest(`AccountsList_Table_Row${account_id}`).click()
    // //   add_accountoperation_from_AccountsView(cy)
    // //   cy.getDataTest("AccountsView").type("{esc}")

    // //   //Set inactive
    // //   cy.getDataTest(`AccountsList_Table_ButtonUpdate${account_id}`).click()
    // //   cy.get('[id^="checkbox"]')[3].click()
    // //   cy.getDataTest('AccountsCU_Button').click()


    // Creates an investment and an investment operation
    // const investments_id=await investment_add_from_InvestmentsList(page)
    // await quote_add_from_InvestmentsList(page, investments_id)
    // await expect(page.getByTestId(`Investments_Table_Row${investments_id}`)).toBeVisible();
    // // Test expired order
    // add_investment_from_Home(cy)
    // cy.getDataTest('LateralIcon').click()
    // cy.getDataTest('LateralOrders').click()
    // cy.getDataTest('MyMenuInline_Button').last().click()
    // cy.getDataTest('MyMenuInline_Header0_Item0').click()
    // cy.getDataTest('OrderCU_Expiration').click()
    // cy.get(`[data-v-date="${yesterday_in_isostring()}"] > .v-btn > .v-btn__content`).click()
    // cy.getDataTest('OrderCU_Investments').type("New{downArrow}{enter}")
    // cy.getDataTest('OrderCU_Button').click()
    // cy.getDataTest('OrderCU_ButtonCloseMessage').click()
    // cy.getDataTest('LateralHome').click()



});