

describe('e2e MyMonthPicker Widget', () => {
  it('MyMonthPicker Widget', () => {
    cy.visit('/')
    cy.getDataTest('LateralIcon').click()
    cy.getDataTest('OpenWidgets').click( {force:true})
    cy.getDataTest('Button_MyMonthPicker').click()
    cy.getDataTest("MyMonthPicker_ButtonSubsYear").click()
    cy.getDataTest("MyMonthPicker_ButtonSubsMonth").click()
    cy.getDataTest("MyMonthPicker_ButtonAddYear").click()
    cy.getDataTest("MyMonthPicker_ButtonAddMonth").click()
    cy.getDataTest("MyMonthPicker_ButtonCurrent").click()
    

  })  
})
