import { login_test_User, add_account_from_AccountsList } from "./commons"
describe('e2e Accounts Transfer', () => {
  it('Accounts Transfer', () => {    
    login_test_User(cy)
    //Open lateral menu and enter in account 4 view
    cy.getDataTest('LateralIcon').click()
    cy.getDataTest('LateralAccounts').click()


    // Add account
    add_account_from_AccountsList(cy)// Generates accounts id

    // Add a transfer with commission
    cy.getDataTest('MyMenuInline_Button').last().click()
    cy.getDataTest('MyMenuInline_Header0_Item1').click()
    cy.getDataTest('AccountsTransfer_Origin').type("Cash{downArrow}{enter}")
    cy.getDataTest('AccountsTransfer_Destiny').type("Account{downArrow}{enter}")
    cy.getDataTest('AccountsTransfer_Amount').type("1000")
    cy.getDataTest('AccountsTransfer_Commission').type("1")
    cy.getDataTest('AccountsTransfer_Button').click()

    // Add a transfer without commision from an account using account id to check uses accounts origin
    cy.get('@waitAccountId').then((account_id)=>{
      cy.getDataTest(`AccountsList_Table_Row${account_id}`).click()
      cy.getDataTest('MyMenuInline_Button').last().click()
      cy.getDataTest('MyMenuInline_Header0_Item0').click()
      cy.getDataTest('AccountsTransfer_Destiny').type("Cash{downArrow}{enter}")
      cy.getDataTest('AccountsTransfer_Amount').type("1000")
      cy.getDataTest('AccountsTransfer_Button').click()


    })
  })

  
})