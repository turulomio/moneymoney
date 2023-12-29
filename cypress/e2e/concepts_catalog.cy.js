import { login_test_User } from "./commons"
describe('e2e Concepts Catalog', () => {
  before(function(){
  })

  it('Concepts Catalog', () => {    
 

    cy.intercept('POST', 'http://127.0.0.1:8004/api/concepts/').as("post_concept")
    login_test_User(cy)
    //Open lateral menu
    cy.getDataTest('LateralIcon').click()
    cy.getDataTest('LateralAdministration').click()
    cy.getDataTest('LateralConceptsCatalog').click()

    // Open MyInlineMenu and select add concept
    cy.getDataTest('MyMenuInline_Button').click()
    cy.getDataTest('MyMenuInline_Header0_Item0').click()

    // Add a concept
    cy.getDataTest('ConceptsCU_Name').type("My first personal concept")
    cy.getDataTest('ConceptsCU_OperationsTypes').type("Expen{downArrow}{enter}")
    cy.getDataTest('ConceptsCU_Button').click()

    var concepts_id
    cy.wait('@post_concept').then((interception)=>{
      concepts_id=interception.response.body.id
      // Edit concept
      cy.getDataTest(`ConceptsCatalog_Table_ButtonUpdate${concepts_id}`).click()
      cy.getDataTest('ConceptsCU_Name').type(" updated")
      cy.getDataTest('ConceptsCU_Button').click()

      //Delete concept
      cy.getDataTest(`ConceptsCatalog_Table_ButtonDelete${concepts_id}`).click()
      cy.getDataTest('ConceptsCU_Button').click()
    })

    // Creates a new one
    // Add other concept
    cy.getDataTest('MyMenuInline_Button').click()
    cy.getDataTest('MyMenuInline_Header0_Item0').click()
    cy.getDataTest('ConceptsCU_Name').type("Concept to be migrated")
    cy.getDataTest('ConceptsCU_OperationsTypes').type("Expen{downArrow}{enter}")
    cy.getDataTest('ConceptsCU_Button').click()
    cy.wait('@post_concept').then((interception)=>{
      concepts_id=interception.response.body.id

      console.log("Concepts to migrate", concepts_id)

      //Migrate concept
      cy.getDataTest(`ConceptsCatalog_Table_ButtonMigrate${concepts_id}`).click()
      cy.getDataTest('ConceptsMigration_To').type("Negative{downArrow}{enter}")
      cy.getDataTest('ConceptsMigration_Button').click()
    })


    console.log("PASSED")


  })  
})