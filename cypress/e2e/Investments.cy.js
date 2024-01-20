import { login_test_User, add_investment_from_Home } from "./commons"
describe('e2e Investments', () => {
  it('Investments', () => {    

    login_test_User(cy)


    // Add investments
    add_investment_from_Home(cy) // Is a promise

    // cy.getDataTest('AccountsoperationsSearch_Search').type("comment")
    // cy.getDataTest('AccountsoperationsSearch_Button').click()
    
  })

  
})