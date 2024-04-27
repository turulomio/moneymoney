import { login_test_User } from "./commons"
describe('e2e Accounts List', () => {
  it('Accounts View List', () => {    
    login_test_User(cy)
    //Open lateral menu and enter in account 4 view
    cy.getDataTest('LateralIcon').click()
    cy.getDataTest('LateralAccounts').click()
    cy.getDataTest('AccountsList_Table_Row4').click()

    // Add two account operations with continue button  and then with create button
    cy.getDataTest('MyMenuInline_Button').last().click()
    cy.getDataTest('MyMenuInline_Header1_Item0').click()
    cy.getDataTest('AccountsoperationsCU_Concepts').type("Super{downArrow}{enter}")
    cy.getDataTest('AccountsoperationsCU_Amount').clear().type("-100")
    cy.getDataTest('AccountsoperationsCU_Comment').type("This is a comment")
    cy.getDataTest('AccountsoperationsCU_ButtonFollowing').click()
    cy.intercept({ method:'POST', url:'http://127.0.0.1:8004/api/accountsoperations/', times:1,}).as("post_ao")
    cy.getDataTest('AccountsoperationsCU_Button').click()
    
    // Capture ao_id from last post and copy this ao
    cy.wait('@post_ao').then((interception)=>{
      var ao_id=interception.response.body.id
      // Copy and uses following button and then create
      cy.getDataTest(`TableAccountOperations_ButtonCopy${ao_id}`).click()
      cy.getDataTest('AccountsoperationsCU_ButtonFollowing').click()
      cy.getDataTest('AccountsoperationsCU_Button').click()


    })
  })
})