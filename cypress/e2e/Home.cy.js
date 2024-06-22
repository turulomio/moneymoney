import { 
  login_test_User,
  add_investment_from_Home,
  add_account_from_AccountsList,
  add_accountoperation_from_AccountsView,
} from "./commons"
import {yesterday_in_isostring} from "../../src/functions.js"
describe('e2e Home', () => {
  it('Home', () => {    

    login_test_User(cy)

    // Test inactive account with balance
    cy.getDataTest('LateralIcon').click()
    cy.getDataTest('LateralAccounts').click()
    add_account_from_AccountsList(cy)
    
    cy.get("@waitAccountId").then((account_id) =>{
      //Add ao to set a non zero balance
      console.log(`AccountsList_Table_Row${account_id}`)
      cy.getDataTest(`AccountsList_Table_Row${account_id}`).click()
      add_accountoperation_from_AccountsView(cy)
      cy.getDataTest("AccountsView").type("{esc}")

      //Set inactive
      cy.getDataTest(`AccountsList_Table_ButtonUpdate${account_id}`).click()
      cy.get('[id^="checkbox"]')[3].click()
      cy.getDataTest('AccountsCU_Button').click()

    })


    // Test expired order
    add_investment_from_Home(cy)
    cy.getDataTest('LateralIcon').click()
    cy.getDataTest('LateralOrders').click()
    cy.getDataTest('MyMenuInline_Button').last().click()
    cy.getDataTest('MyMenuInline_Header0_Item0').click()
    cy.getDataTest('OrderCU_Expiration').click()
    cy.get(`[data-v-date="${yesterday_in_isostring()}"] > .v-btn > .v-btn__content`).click()
    cy.getDataTest('OrderCU_Investments').type("New{downArrow}{enter}")
    cy.getDataTest('OrderCU_Button').click()
    cy.getDataTest('OrderCU_ButtonCloseMessage').click()
    cy.getDataTest('LateralHome').click()




  })
  


})