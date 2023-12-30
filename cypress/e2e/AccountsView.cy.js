import { login_test_User } from "./commons"
describe('e2e Accounts List', () => {
  it('Accounts View List', () => {    
    login_test_User(cy)
    //Open lateral menu and enter in account 4 view
    cy.getDataTest('LateralIcon').click()
    cy.getDataTest('LateralAccounts').click()
    cy.getDataTest('AccountsList_Table_Row4').click()

    // Add a new account operation
    cy.getDataTest('MyMenuInline_Button').last().click()
    cy.getDataTest('MyMenuInline_Header1_Item0').click()
    cy.getDataTest('AccountsoperationsCU_Concepts').type("Super{downArrow}{enter}")
    cy.getDataTest('AccountsoperationsCU_Amount').clear().type("-100")
    cy.getDataTest('AccountsoperationsCU_Comment').type("This is a comment")
    cy.getDataTest('AccountsoperationsCU_Button').click()
    
  })

  
})