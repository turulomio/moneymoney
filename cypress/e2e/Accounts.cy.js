import { login_test_User } from "./commons"
describe('e2e Accounts List', () => {
  it('Accounts List', () => {    

    login_test_User(cy)
    //Open lateral menu
    cy.getDataTest('LateralIcon').click()
    cy.getDataTest('LateralAccounts').click()


    // Add search accountsoperations dialog
    cy.getDataTest('MyMenuInline_Button').last().click()
    cy.getDataTest('MyMenuInline_Header1_Item0').click()
    cy.getDataTest('AccountsoperationsSearch_Search').type("comment")
    cy.getDataTest('AccountsoperationsSearch_Button').click()
    
  })

  
})