import { login_test_User, add_investmentoperation_from_Home } from "./commons"
describe('e2e Investments', () => {
  it('Investments', () => {    

    login_test_User(cy)


    // Add investments
    add_investmentoperation_from_Home(cy) // Is a promise
    cy.getDataTest("InvestmentsView_ButtonClose").click()

    
  })

  
})