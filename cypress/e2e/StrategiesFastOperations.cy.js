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
    cy.getDataTest('StrategyFastOperationsCU_Name').type("Fast operations strategy")
    cy.getDataTest('StrategyFastOperationsCU_Comment').type("The best")
    cy.getDataTest('StrategyFastOperationsCU_Accounts').type("Cash{downArrow}{enter}")

    cy.intercept({ method:'POST', url:'http://127.0.0.1:8004/api/strategies_fastoperations/', times:1,}).as("post_strategies_fastoperations")
    cy.getDataTest('StrategyFastOperationsCU_Button').click()
    cy.wait('@post_strategies_fastoperations').then((interception)=>{
        cy.wrap(interception.response.body.id).as('strategy_fastoperations_id') // Stores the captured ID for later us
    })

    cy.get("@strategy_fastoperations_id").then((strategy_fastoperations_id)  =>{
        cy.log(strategy_fastoperations_id)

    })

    // Creates one fast operation
    cy.getDataTest('LateralIcon').should('be.visible').click()
    cy.getDataTest('LateralAccounts').click()
    cy.getDataTest('AccountsList_Table_Row4').click()
    cy.getDataTest('MyMenuInline_Button').last().click()
    cy.getDataTest('MyMenuInline_Header1_Item0').click()
    cy.getDataTest('AccountsoperationsCU_Concepts').type("Fast{downArrow}{enter}")
    cy.getDataTest('AccountsoperationsCU_Amount').clear().type("-100")
    cy.getDataTest('AccountsoperationsCU_Button').click()
    cy.getDataTest('AccountsView_ButtonClose').click()


    //Open strategies lateral menu
    cy.getDataTest('LateralIcon').should('be.visible').click()
    cy.getDataTest('LateralStrategies').click()
  })  
})
