import { login_test_User } from "./commons"
describe('e2e Accounts List', () => {
  it('Accounts List', () => {    

    login_test_User(cy)
    //Open lateral menu
    cy.getDataTest('LateralAssetsReport').click()
    cy.wait(10000)
    cy.intercept('POST', 'http://127.0.0.1:8004/assets/report/').as('fileDownload');
    cy.getDataTest('AssetsReport_ButtonGenerate').click()
    cy.wait(25000)
    cy.wait('@fileDownload').its('response.statusCode').should('eq', 200);
    
  })

  
})