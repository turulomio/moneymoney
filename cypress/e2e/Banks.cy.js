import { login_test_User } from "./commons"
describe('e2e Banks', () => {
  it('Banks', () => {    

    login_test_User(cy)
    //Open lateral menu
    cy.getDataTest('LateralIcon').click()
    cy.getDataTest('LateralBanks').click()

    // Create a new bank
    cy.intercept({ method:'POST', url:'http://127.0.0.1:8004/api/banks/', times:1,}).as("post_banks")
    cy.getDataTest('MyMenuInline_Button').last().click()
    cy.getDataTest('MyMenuInline_Header0_Item0').click()
    cy.getDataTest('BanksCU_Name').type("New bank")
    cy.getDataTest('BanksCU_Button').click()
    cy.wait('@post_banks').then((interception)=>{
        var banks_id=interception.response.body.id
        // Update bank
        cy.getDataTest(`BanksList_Table_ButtonUpdate${banks_id}`).click()
        cy.getDataTest('BanksCU_Name').type(" updated")
        cy.getDataTest('BanksCU_Button').click()

        // Delete bank
        cy.getDataTest(`BanksList_Table_ButtonDelete${banks_id}`).click()
        cy.getDataTest('BanksCU_Button').click()
    })

    // Shows personal management bank
    cy.getDataTest(`BanksList_Table_Row3`).click()
  })

  
})