import { login_test_User } from "./commons"
describe('e2e Evolution report', () => {
  it('Evolution report', () => {    

    login_test_User(cy)

    cy.getDataTest('LateralIcon').click()
    cy.getDataTest('LateralReports').click()
    cy.getDataTest('LateralReportsEvolution').click()

    cy.getDataTest('ReportsEvolution__CmbYears').click().type("{downArrow}{enter}{enter}")

    
  })

  
})