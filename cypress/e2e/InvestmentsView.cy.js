import { login_test_User, add_investmentoperation_from_Home } from "./commons"
describe('e2e Investments', () => {
  it('Investments', () => {    

    login_test_User(cy)


    // Add investments
    add_investmentoperation_from_Home(cy) // Is a promise

    // See investments chart
    cy.wait(300)
    cy.getDataTest('MyMenuInline_Button').last().click()
    cy.getDataTest('MyMenuInline_Header0_Item0').click()

    // cy.getDataTest("InvestmentsView_ButtonClose").click()

    
  })

  
})