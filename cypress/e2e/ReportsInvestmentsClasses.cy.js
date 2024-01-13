import { login_test_User } from "./commons"
describe('e2e Concepts Catalog', () => {
  it('Concepts Catalog', () => {
    login_test_User(cy)
    //Open lateral menu
    cy.getDataTest('LateralIcon').click()
    cy.getDataTest('LateralReports').click()
    cy.getDataTest('LateralReportsInvestmentsClasses').click()

  })  
})