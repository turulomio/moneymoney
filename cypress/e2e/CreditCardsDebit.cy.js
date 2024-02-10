import { 
  login_test_User,
  add_creditcard_from_AccountsView,
} from "./commons"

describe('e2e Credit cards', () => {
  it('Credit cards', () => {    
    login_test_User(cy)

    //Open lateral menu and enter in account 4 view
    cy.getDataTest('LateralIcon').click()
    cy.getDataTest('LateralAccounts').click()
    cy.getDataTest('AccountsList_Table_Row4').click()

    // Move to CC
    cy.getDataTest('AccountsView_TabCC').click()


    // Add a new debit credit card
    add_creditcard_from_AccountsView(cy,"cc_id")
    
    // Making last cc inactive
    cy.get("@cc_id").then((cc_id)=>{
      //Add credit card operation as an account 
      cy.getDataTest(`AccountsView_Tablecc_ButtonAddDebitOperation${cc_id}`).click()
      cy.getDataTest("AccountsoperationsCU_Concepts").type("super{downArrow}{enter}")
      cy.getDataTest("AccountsoperationsCU_Amount").clear().type("-100")
      cy.getDataTest("AccountsoperationsCU_Button").click()

      // Edition and set inactive
      cy.getDataTest(`AccountsView_Tablecc_ButtonEdit${cc_id}`).click()
      cy.getDataTest("CreditcardsCU_Active").find("input").click()
      cy.getDataTest('CreditcardsCU_Button').click()

      

      //Show inactives
      cy.getDataTest("AccountsView_ShowActiveCC").find("input").click()
      //Delete inactive
      cy.getDataTest(`AccountsView_Tablecc_ButtonDelete${cc_id}`).click()
      cy.getDataTest('CreditcardsCU_Button').click()
      //Show actives
      cy.getDataTest("AccountsView_ShowActiveCC").find("input").click()
    })

  })
  
})