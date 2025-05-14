import { login_test_User, add_investmentoperation_from_Home } from "./commons"
describe('e2e Product view', () => {
  it('Product view', () => {    

    login_test_User(cy)


    // Add investments
    add_investmentoperation_from_Home(cy) // Is a promise

    // Open product view
    cy.wait(1000)
    cy.getDataTest('InvestmentsView_MyMenuInline_Button').last().click()
    cy.getDataTest('InvestmentsView_MyMenuInline_Header1_Item0').click()

    cy.getDataTest("ProductsView_TabPercentageEvolution").click()
    cy.getDataTest("ProductsView_TabQuotesEvolution").click()
    cy.getDataTest("ProductsView_TabDpsEstimations").click()
    cy.getDataTest("ProductsView_TabDps").click()
    cy.getDataTest("ProductsView_TabOHCLS").click()
    cy.getDataTest("ProductsView_TabQuotes").click()
    cy.getDataTest("ProductsView_TabChart").click()
  })

  
})