import { login_test_User, add_investmentoperation_from_Home } from "./commons"

describe('e2e Strateegies List', () => {
  it('Strategies list', () => {
    login_test_User(cy)

    // Add investments
    add_investmentoperation_from_Home(cy) // Is a promise
    cy.getDataTest("InvestmentsView_ButtonClose").click()


    //Open strategies lateral menu
    cy.getDataTest('LateralIcon').click()
    cy.getDataTest('LateralStrategies').click()

    // Add a new strategy ranged
    cy.getDataTest('MyMenuInline_Button').last().click()
    cy.getDataTest('MyMenuInline_Header0_Item0').click()
    cy.getDataTest('StrategyCU_Name').type("Range strategy")
    cy.getDataTest('StrategyCU_Investments').type("Cash{downArrow}{enter}")
    cy.getDataTest('StrategyCU_Type').click().type("pr{downArrow}{enter}")
    cy.getDataTest('StrategyCU_Products').type("Apalanc{downArrow}{enter}")
    cy.getDataTest('StrategyCU_Additional2').type("10000")
    cy.getDataTest('StrategyCU_Additional3').type("10000")
    cy.getDataTest('StrategyCU_Additional4').type("10000")
    cy.getDataTest('StrategyCU_RecomendationMethod').type("All{downArrow}{enter}")
    cy.getDataTest('StrategyCU_Additional6').type("0")
    cy.intercept({ method:'POST', url:'http://127.0.0.1:8004/api/strategies/', times:1,}).as("post_strategies")
    cy.getDataTest('StrategyCU_Button').click()
    cy.wait('@post_strategies').then((interception)=>{
        cy.wrap(interception.response.body.id).as('strategy_id') // Stores the captured ID for later us
    })

    cy.get("@strategy_id").then((strategy_id)  =>{
      // Opens strategy view
      cy.getDataTest(`StrategiesList_Table_IconView${strategy_id}`).click()

      // Closes strategy view
      cy.getDataTest('StrategiesView_ButtonClose').click()

      // Opens strategy product range
      cy.getDataTest(`StrategiesList_Table_Row${strategy_id}`).click()

    })
  })  
})
