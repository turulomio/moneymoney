import { login_test_User, add_investmentoperation_from_Home, add_investmentoperation_from_InvestmentView } from "./commons"
describe('e2e Investments', () => {
  it('Investments', () => {    

    login_test_User(cy)


    // Add investments
    add_investmentoperation_from_Home(cy) // Is a promise
    add_investmentoperation_from_InvestmentView(cy,"-100","10")

    // Open show evolution chart
    cy.getDataTest('MyMenuInline_Button').last().click()
    cy.getDataTest('MyMenuInline_Header0_Item3').click()

    
  })

  
})