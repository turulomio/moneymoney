import { login_test_User } from "./commons"
describe('e2e Chart evolution assets', () => {

    it('Chart pie', () => {    
        cy.viewport(1920, 1080)
        login_test_User(cy)
        //Open lateral menu
        cy.getDataTest('LateralIcon').click()
        cy.getDataTest('LateralReports').click()
        cy.getDataTest('LateralReportsEvolutionChart').click()    
    })
  
})