

export function login_test_User(cy){
    cy.visit('http://127.0.0.1:8006/moneymoney/')
    cy.contains("Log in").click()
    cy.get("#BtnLogIn_User").type("test")
    cy.get("#BtnLogIn_Password").type("test")
    cy.get('#BtnLogIn_cmd').click() //Find by id
}
