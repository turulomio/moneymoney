import { login_test_User, add_investmentoperation_from_Home } from "./commons"

describe('e2e Concepts Catalog', () => {
  it('Concepts Catalog', () => {
    login_test_User(cy)

    // Create investment operation
    add_investmentoperation_from_Home(cy)
    cy.getDataTest("InvestmentsView_ButtonClose").click()

    //Open lateral menu
    cy.getDataTest('LateralIcon').click()
    cy.getDataTest('LateralReports').click()
    cy.getDataTest('LateralReportsInvestmentsClasses').click()
    cy.getDataTest("ReportsInvestmentsClasses_TabPCI").click()

  })  
})