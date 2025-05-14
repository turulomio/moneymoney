import { login_test_User, add_investmentoperation_from_Home, add_dividend_from_InvestmentView, mymenuinlinebutton_pointable } from "./commons"
describe('e2e Investments', () => {
  it('Investments', () => {    

    login_test_User(cy)

    // Add investments
    add_investmentoperation_from_Home(cy)

    cy.wait(5000)

    // Add dividend
    add_dividend_from_InvestmentView(cy)

    // See investments chart
    mymenuinlinebutton_pointable("InvestmentsView_MyMenuInline_Button")
    cy.getDataTest('InvestmentsView_MyMenuInline_Button').click()
    cy.getDataTest('InvestmentsView_MyMenuInline_Header0_Item0').click()
    cy.getDataTest('ChartInvestments_ButtonClose').click()

    // Change investment active status twice
    cy.wait(5000)
    mymenuinlinebutton_pointable("InvestmentsView_MyMenuInline_Button")
    cy.getDataTest('InvestmentsView_MyMenuInline_Button').click()
    cy.getDataTest('InvestmentsView_MyMenuInline_Header0_Item1').click()


    cy.wait(5000)
    mymenuinlinebutton_pointable("InvestmentsView_MyMenuInline_Button")
    cy.getDataTest('InvestmentsView_MyMenuInline_Button').click()
    cy.getDataTest('InvestmentsView_MyMenuInline_Header0_Item1').click()

    // Evolution chart
    cy.wait(5000)
    mymenuinlinebutton_pointable("InvestmentsView_MyMenuInline_Button")
    cy.getDataTest('InvestmentsView_MyMenuInline_Button').click()
    cy.getDataTest('InvestmentsView_MyMenuInline_Header0_Item2').click()
    cy.getDataTest('ChartInvestmentsoperationsEvolution_ButtonClose').should("be.visible").click()
    cy.getDataTest('InvestmentsView_MyMenuInline_Button').should('have.css', 'cursor', 'pointer'); // Is pointable o clickable


    // Open show evolution chart
    mymenuinlinebutton_pointable("InvestmentsView_MyMenuInline_Button")
    cy.getDataTest('InvestmentsView_MyMenuInline_Button').click()
    cy.getDataTest('InvestmentsView_MyMenuInline_Header0_Item3').click()
  })

  
})