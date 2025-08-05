import { 
  login_test_User,
  add_creditcard_from_AccountsView,
  add_creditcardoperation_from_CreditCardView,
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


    // Add a new deferred credit card
    add_creditcard_from_AccountsView( cy, "cc_id", "Deferred CC", "0000 0000 0000 0000 0000", "3000", true)
    
    // Making last cc inactive
    cy.get("@cc_id").then((cc_id)=>{
      cy.getDataTest(`AccountsView_Tablecc_Row${cc_id}`).click()
      add_creditcardoperation_from_CreditCardView( {cy:cy, wait_name:"cco_id", })
      for (var i = 0; i < 10; i++) {
        cy.getDataTest('CreditcardsoperationsCU_ButtonFollow').click()
      }
      cy.getDataTest('CreditcardsoperationsCU_Button').click()
    })
  })
  
})