import { login_test_User } from "./commons"

describe('e2e Strateegies List', () => {
  it('Strategies list', () => {
    login_test_User(cy)
    cy.getDataTest('LateralIcon').click()
    cy.getDataTest('OpenWidgets').click( {force:true})
    cy.getDataTest('Button_MyDatePicker').click()
    

  })  
})
