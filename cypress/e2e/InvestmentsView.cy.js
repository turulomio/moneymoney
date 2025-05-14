import { login_test_User, add_investmentoperation_from_Home, add_dividend_from_InvestmentView } from "./commons"
describe('e2e Investments', () => {
  it('Investments', () => {    

    login_test_User(cy)

    // Add investments
    add_investmentoperation_from_Home(cy)

    // Add dividend
    add_dividend_from_InvestmentView(cy)

    // See investments chart
    cy.getDataTest('InvestmentsView_MyMenuInline_Button').click()
    cy.getDataTest('InvestmentsView_MyMenuInline_Header0_Item0').click()
    cy.getDataTest('ChartInvestments_ButtonClose').click()
    cy.getDataTest('InvestmentsView_MyMenuInline_Button').should("be.enabled")

    // Change investment active status twice
    cy.getDataTest('InvestmentsView_MyMenuInline_Button').click()
    cy.getDataTest('InvestmentsView_MyMenuInline_Header0_Item1').click()
    cy.getDataTest('InvestmentsView_MyMenuInline_Button').should("be.enabled")
    cy.getDataTest('InvestmentsView_MyMenuInline_Button').click()
    cy.getDataTest('InvestmentsView_MyMenuInline_Header0_Item1').click()
    cy.getDataTest('InvestmentsView_MyMenuInline_Button').should("be.enabled")

    // Evolution chart
    cy.getDataTest('InvestmentsView_MyMenuInline_Button').click()
    cy.getDataTest('InvestmentsView_MyMenuInline_Header0_Item2').click()
    cy.getDataTest('ChartInvestmentsoperationsEvolution_ButtonClose').should("be.enabled").click()
    cy.getDataTest('InvestmentsView_MyMenuInline_Button').should("be.enabled")


    // Open show evolution chart
    cy.getDataTest('InvestmentsView_MyMenuInline_Button').should("be.enabled").click()
    cy.getDataTest('InvestmentsView_MyMenuInline_Header0_Item3').click()
  })

  
})