

export function login_test_User(cy){
    cy.visit('http://127.0.0.1:8006/moneymoney/')
    cy.contains("Log in").click()
    cy.getDataTest("BtnLogIn_User").type("test")
    cy.getDataTest("BtnLogIn_Password").type("test")
    cy.getDataTest('BtnLogIn_cmd').click()
}

export function add_investment_from_Home(
    cy, 
    account_type="Cash{downArrow}{enter}", 
    investment="New investment", 
    product_type="Apalancado{downArrow}{enter}", 
    wait_name="waitInvestmentsId"
){
    cy.getDataTest('LateralIcon').click()
    cy.getDataTest('LateralInvestments').click()
    cy.getDataTest('MyMenuInline_Button').last().click()
    cy.getDataTest('MyMenuInline_Header0_Item0').click()
    cy.getDataTest('InvestmentsCU_Accounts').type(account_type)
    cy.getDataTest('InvestmentsCU_Name').type(investment)
    cy.getDataTest('InvestmentsCU_Products').type(product_type)
    cy.intercept('POST', 'http://127.0.0.1:8004/api/investments/').as("post_investment")
    cy.getDataTest('InvestmentsCU_Button').click()
    cy.wait('@post_investment').then((interception)=>{
        var investments_id=interception.response.body.id
        cy.getDataTest(`Investments_Table_ButtonAddQuote${investments_id}`).click()
        cy.getDataTest('QuotesCU_Quote').type("10")
        cy.getDataTest('QuotesCU_Button').click()
        return new Promise((resolve)=>{setTimeout(() => {resolve(investments_id);}, 0)})
    }).as(wait_name)
}



export function add_creditcard_from_AccountsView(
    cy, 
    wait_name="waitCcId",
    name="Debit CC", 
    number="0000 0000 0000 0000 0000", 
    maximum_balance="1000", 
    deferred=false,
){

    // Add a new debit credit card
    cy.getDataTest('MyMenuInline_Button').last().click()
    cy.getDataTest('MyMenuInline_Header2_Item0').click()
    cy.getDataTest('CreditcardsCU_Name').type(name)
    cy.getDataTest('CreditcardsCU_Number').type(number)
    cy.getDataTest('CreditcardsCU_MaximumBalance').type(maximum_balance)
    if (deferred) {
        cy.getDataTest("CreditcardsCU_Deferred").find("input").click()
    }
    cy.intercept({ method:'POST', url:'http://127.0.0.1:8004/api/creditcards/', times:1,}).as("post_creditcards")
    cy.getDataTest('CreditcardsCU_Button').click()
    cy.wait('@post_creditcards').then((interception)=>{
        var cc_id=interception.response.body.id
        cy.wrap(cc_id).as(wait_name) // Stores the captured ID for later us
    })
}









export function add_investmentoperation_from_Home(
    cy, 
    account_type="Cash{downArrow}{enter}", 
    investment="New investment", 
    product_type="Apalancado{downArrow}{enter}",
    wait_name_investments_id="@waitInvestmentsId",
    shares="100",
    price="9"
){
    add_investment_from_Home(cy,account_type,investment,product_type)

    cy.get(wait_name_investments_id).then( (investments_id) => {
        cy.getDataTest(`Investments_Table_Row${investments_id}`).click()
        add_investmentoperation_from_InvestmentView(cy,shares,price)

    })
}


export function add_investmentoperation_from_InvestmentView(
    cy,
    shares="100",
    price="9"
){

    cy.getDataTest('MyMenuInline_Button').last().click()
    cy.getDataTest('MyMenuInline_Header2_Item0').click()
    cy.getDataTest("InvestmentsoperationsCU_Shares").type("{backspace}").type(shares)
    cy.getDataTest("InvestmentsoperationsCU_Price").type(price)
    cy.getDataTest("InvestmentsoperationsCU_Button").click()
}