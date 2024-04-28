import { login_test_User } from "./commons"

describe('e2e Products', () => {
  it('Products', () => {
    login_test_User(cy)


    //Open lateral menu products search
    cy.getDataTest('LateralIcon').click()
    cy.getDataTest('LateralProducts').click()
    cy.getDataTest('LateralProductsSearch').click()

    // Add a personal product
    cy.getDataTest('MyMenuInline_Button').last().click()
    cy.getDataTest('MyMenuInline_Header0_Item0').click()
    cy.getDataTest('ProductsCU_Name').type("New product personal")
    cy.getDataTest('ProductsCU_Currency').type("Eur{downArrow}{enter}")
    cy.getDataTest('ProductsCU_ProductsTypes').type("ETF{downArrow}{enter}")
    cy.getDataTest('ProductsCU_Stockmarkets').type("Madrid{downArrow}{enter}")
    cy.getDataTest('ProductsCU_Button').click()

    // Add a system product
    cy.getDataTest('MyMenuInline_Button').last().click()
    cy.getDataTest('MyMenuInline_Header0_Item1').click()
    cy.getDataTest('ProductsCU_Name').type("New product system")
    cy.getDataTest('ProductsCU_Currency').type("Eur{downArrow}{enter}")
    cy.getDataTest('ProductsCU_ProductsTypes').type("ETF{downArrow}{enter}")
    cy.getDataTest('ProductsCU_Stockmarkets').type("Madrid{downArrow}{enter}")
    cy.getDataTest('ProductsCU_Button').click()

    // Search added products
    cy.get('.v-field__clearable').click()
    cy.getDataTest('ProductsSearch_Search').type("new product")
    cy.getDataTest('ProductsSearch_Button').click()



  })  
})