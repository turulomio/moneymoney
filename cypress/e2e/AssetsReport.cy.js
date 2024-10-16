import { login_test_User } from "./commons"
describe('e2e Assets Report', () => {
  it('Assets Report', () => {    

    login_test_User(cy)
    //Open lateral menu
    cy.getDataTest('LateralSettings').click()
    cy.getDataTest('Settings_FirstName').clear().type("Paco")
    cy.getDataTest('Settings_LastName').clear().type("Pérez Pérez")
    cy.getDataTest('Settings_ButtonSave').click()

    cy.getDataTest('LateralAssetsReport').click()
    cy.getDataTest('AssetsReport_ButtonGenerate', { timeout: 100000 }).click()
    cy.getDataTest('AssetsReport_ButtonGenerate', { timeout: 100000 }).should("be.enabled")
  })

  
})