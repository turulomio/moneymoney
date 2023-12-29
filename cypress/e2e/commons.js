

export function login_test_User(cy){
    cy.visit('http://127.0.0.1:8006/moneymoney/')
    cy.contains("Log in").click()
    cy.getDataTest("BtnLogIn_User").type("test")
    cy.getDataTest("BtnLogIn_Password").type("test")
    cy.getDataTest('BtnLogIn_cmd').click()
}
