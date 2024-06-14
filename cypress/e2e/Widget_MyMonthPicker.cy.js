

describe('e2e MyMonthPicker Widget', () => {
  it('MyMonthPicker Widget', () => {
    cy.visit('/')
    cy.getDataTest('LateralIcon').click()
    cy.getDataTest('OpenWidgets').click( {force:true})
    cy.getDataTest('Button_MyMonthPicker').click()
    

  })  
})
