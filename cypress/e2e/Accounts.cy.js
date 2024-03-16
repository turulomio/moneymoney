import { login_test_User, add_account_from_AccountsList } from "./commons"
describe('e2e Accounts List', () => {
  it('Accounts List', () => {    

    login_test_User(cy)
    //Open lateral menu
    cy.getDataTest('LateralIcon').click()
    cy.getDataTest('LateralAccounts').click()


    // Add account
    add_account_from_AccountsList(cy)


    // Add search accountsoperations dialog
    cy.getDataTest('MyMenuInline_Button').last().click()
    cy.getDataTest('MyMenuInline_Header1_Item0').click()
    cy.getDataTest('AccountsoperationsSearch_Search').type("comment")
    cy.getDataTest('AccountsoperationsSearch_Button').click()
    
  })

  
})