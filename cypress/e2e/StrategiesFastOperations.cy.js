import { login_test_User, mymenuinlinebutton_pointable } from "./commons"

describe('e2e Strategies List', () => {
  it('Strategies list', () => {
    login_test_User(cy)

    //Open strategies lateral menu
    cy.getDataTest('LateralIcon').should('be.visible').click()
    cy.getDataTest('LateralStrategies').click()

    // Add a new strategy ranged
    mymenuinlinebutton_pointable('StrategiesList_MyMenuInline_Button')
    cy.getDataTest('StrategiesList_MyMenuInline_Button').click()
    cy.getDataTest('StrategiesList_MyMenuInline_Header0_Item0').click()
    cy.getDataTest('StrategyCU_Name').type("Fast operations strategy")

    cy.getDataTest('StrategyCU_Type').click()
    cy.getDataTest('StrategyCU_Type').type("Fast{downArrow}{enter}")
    cy.getDataTest('StrategyCU_Accounts').type("Cash{downArrow}{enter}")

    cy.intercept({ method:'POST', url:'http://127.0.0.1:8004/api/strategies/', times:1,}).as("post_strategies")
    cy.getDataTest('StrategyCU_Button').click()
    cy.wait('@post_strategies').then((interception)=>{
        cy.wrap(interception.response.body.id).as('strategy_id') // Stores the captured ID for later us
    })

    cy.get("@strategy_id").then((strategy_id)  =>{
        cy.log(strategy_id)

    })
  })  
})
