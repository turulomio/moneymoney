import { login_test_User } from "./commons"
describe('e2e Assets Report', () => {
  it('Assets Report', () => {    

    login_test_User(cy)
    //Open lateral menu
    cy.getDataTest('LateralSettings').should("be.visible").click()
    cy.getDataTest('Settings_FirstName').clear().type("Paco")
    cy.getDataTest('Settings_LastName').clear().type("Pérez Pérez")
    cy.getDataTest('Settings_ButtonSave').click()
    cy.wait(1000) //Settings goes to /home and doesn't fount lateral assets
    cy.getDataTest('LateralAssetsReport').click()
    cy.getDataTest('AssetsReport_ButtonGenerate', { timeout: 50001 }).should("be.visible").and("be.enabled").click()
    cy.getDataTest('AssetsReport_ButtonGenerate', { timeout: 50003 }).should("be.enabled")
  })

  
})