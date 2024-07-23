import { login_test_User } from "./commons"
describe('e2e Assets Report', () => {
  it('Assets Report', () => {    

    login_test_User(cy)
    //Open lateral menu
    cy.getDataTest('LateralAssetsReport').click()
    cy.getDataTest('AssetsReport_ButtonGenerate').click()
    cy.wait(30000)
    
  })

  
})