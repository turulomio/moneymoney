import { login_test_User,add_investment_from_Home } from "./commons"
import {yesterday_in_isostring} from "../../src/functions.js"
describe('e2e Home', () => {
  it('Home', () => {    

    login_test_User(cy)
    cy.wait(300)

    // Add investment
    add_investment_from_Home(cy)

    // Test expired order
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