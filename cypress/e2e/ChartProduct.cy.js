import { login_test_User, add_investmentoperation_from_Home } from "./commons"
describe('e2e Product chart', () => {
  it('Product chart', () => {    

    login_test_User(cy)


    // Add investments
    add_investmentoperation_from_Home(cy) // Is a promise

    // Open product chart
    cy.getDataTest('MyMenuInline_Button').last().click()
    cy.getDataTest('MyMenuInline_Header1_Item0').click()

    
  })

  
})