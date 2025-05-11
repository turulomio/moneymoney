import { login_test_User, add_investmentoperation_from_Home } from "./commons"

describe('e2e Strateegies List', () => {
  it('Strategies list', () => {
    login_test_User(cy)

    // Add investments
    add_investmentoperation_from_Home(cy) // Is a promise
    cy.getDataTest("InvestmentsView_ButtonClose").click()


    //Open strategies lateral menu
    cy.wait(1000)
    cy.getDataTest('LateralIcon').should('be.visible').click()
    cy.getDataTest('LateralStrategies').click()

    // Add a new strategy ranged
    cy.getDataTest('MyMenuInline_Button').last().click()
    cy.getDataTest('MyMenuInline_Header0_Item0').click()
    cy.getDataTest('StrategyCU_Name').type("Range strategy")
    cy.getDataTest('StrategyCU_Investments').type("Cash{downArrow}{enter}")
    cy.getDataTest('StrategyCU_Type').type("{downArrow}{downArrow}{enter}")
    cy.wait(1000) // A lot of products, needed more time
    cy.getDataTest('StrategyCU_Products').type("Apalanc{downArrow}{enter}")
    cy.getDataTest('StrategyCU_Comment').type("My strategy comment")
    cy.getDataTest('StrategyCU_Additional2').type("10000")
    cy.getDataTest('StrategyCU_Additional3').type("10000")
    cy.getDataTest('StrategyCU_Additional4').type("10000")
    cy.getDataTest('StrategyCU_RecomendationMethod').type("All{downArrow}{enter}")
    cy.getDataTest('StrategyCU_Additional6').type("1")
    cy.intercept({ method:'POST', url:'http://127.0.0.1:8004/api/strategies/', times:1,}).as("post_strategies")
    cy.getDataTest('StrategyCU_Button').click()
    cy.wait('@post_strategies').then((interception)=>{
        console.log("AHORA", interception.response.body.id)
        cy.wrap(interception.response.body.id).as('strategy_id') // Stores the captured ID for later us
    })

    cy.get("@strategy_id").then((strategy_id)  =>{
      // Opens strategy view
      cy.getDataTest(`StrategiesList_Table_IconView${strategy_id}`).click()
      cy.wait(1000)

      // Closes strategy view
      cy.getDataTest('StrategiesView_ButtonClose').click()

      // Opens strategy product range
      cy.getDataTest(`StrategiesList_Table_Row${strategy_id}`).click()

      // Returns to strategy view buscando un typeable para hacer uno dos esc y vuelve a StrategyList
      cy.getDataTest('ProductsRanges_Product').type("{esc}{esc}")

      // Sets an strategy inactive (dt_end not null)
      cy.getDataTest(`StrategiesList_Table_IconEdit${strategy_id}`).click()
      cy.get('[data-test="StrategyCU_DtTo"] > .d-flex > .v-input > .v-input__prepend > .mdi-calendar-clock').click()
      cy.getDataTest('StrategyCU_Button').click()  
      cy.getDataTest(`StrategiesList_Table_IconEdit${strategy_id}`).should('not.exist');
       // Select elements whose ID starts with 'checkbox'
      cy.get('[id^="checkbox"]').first().click()
      cy.getDataTest(`StrategiesList_Table_IconEdit${strategy_id}`).should('exist');
      //Deletes it
      cy.getDataTest(`StrategiesList_Table_IconDelete${strategy_id}`).click()
      cy.getDataTest('StrategyCU_ButtonDelete').click()


      

    })
  })  
})
