import { login_test_User } from "./commons"
describe('e2e Concepts report', () => {
  it('Concepts report', () => {    

    login_test_User(cy)

    cy.getDataTest('LateralIcon').click()
    cy.getDataTest('LateralAccounts').click()
    cy.getDataTest('AccountsList_Table_Row4').click()

    //Create two accounts operations
    cy.getDataTest('MyMenuInline_Button').last().click()
    cy.getDataTest('MyMenuInline_Header1_Item0').click()
    cy.getDataTest('AccountsoperationsCU_Concepts').type("Super{downArrow}{enter}")
    cy.getDataTest('AccountsoperationsCU_Amount').clear().type("-100")
    cy.getDataTest('AccountsoperationsCU_ButtonFollowing').click()
    cy.getDataTest('AccountsoperationsCU_Concepts').clear().type("Att{downArrow}{enter}")
    cy.getDataTest('AccountsoperationsCU_Amount').clear().type("100")
    cy.getDataTest('AccountsoperationsCU_ButtonFollowing').click()
    cy.getDataTest('AccountsoperationsCU_Concepts').clear().type("Rest{downArrow}{enter}")
    cy.getDataTest('AccountsoperationsCU_Amount').clear().type("-50")
    cy.getDataTest('AccountsoperationsCU_Button').click()
    cy.getDataTest('AccountsView').type('{esc}');

    // Enter concepts report
    cy.getDataTest('LateralIcon').click()
    cy.getDataTest('LateralReports').click()
    cy.getDataTest('LateralReportsConcepts').click()
    cy.getDataTest('ReportsEvolution__CmbYears').click().type("{downArrow}{enter}{enter}")

    
  })

  
})