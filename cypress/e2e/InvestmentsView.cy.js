import { login_test_User, add_investmentoperation_from_Home, add_dividend_from_InvestmentView } from "./commons"
describe('e2e Investments', () => {
  it('Investments', () => {    

    login_test_User(cy)

    // Add investments
    add_investmentoperation_from_Home(cy)

    // Add dividend
    add_dividend_from_InvestmentView(cy)

    // See investments chart
    cy.wait(1000) //Loading ios
    cy.getDataTest('MyMenuInline_Button').last().click()
    cy.getDataTest('MyMenuInline_Header0_Item0').click()
    cy.getDataTest('ChartInvestments_ButtonClose').click()

    // Change investment active status twice
    cy.wait(1000) //Loading ios
    cy.getDataTest('MyMenuInline_Button').last().click()
    cy.getDataTest('MyMenuInline_Header0_Item1').last().click()
    cy.wait(1000) //Loading ios
    cy.getDataTest('MyMenuInline_Button').last().click()
    cy.getDataTest('MyMenuInline_Header0_Item1').last().click()

    // Evolution chart
    cy.wait(1000) //Loading ios
    cy.getDataTest('MyMenuInline_Button').last().click()
    cy.getDataTest('MyMenuInline_Header0_Item2').last().click()
    cy.getDataTest('ChartInvestmentsoperationsEvolution_ButtonClose').click()

    // Open show evolution chart
    cy.wait(1000) //Loading ios
    cy.getDataTest('MyMenuInline_Button').last().click()
    cy.getDataTest('MyMenuInline_Header0_Item3').click()
    
  })

  
})