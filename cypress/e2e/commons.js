

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
    cy.getDataTest('InvestmentsList_MyMenuInline_Button').should("be.visible").click()
    cy.getDataTest('InvestmentsList_MyMenuInline_Header0_Item0').click()
    cy.getDataTest('InvestmentsCU_Accounts').type(account_type)
    cy.getDataTest('InvestmentsCU_Name').type(investment)
    cy.getDataTest('InvestmentsCU_Products').type(product_type)
    cy.intercept({ method:'POST', url:'http://127.0.0.1:8004/api/investments/', times:1,}).as("post_investment")
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


export function add_account_from_AccountsList(
    cy, 
    wait_name="waitAccountId",
    name="New Account", 
    bank="Personal{downArrow}{enter}",
    number="ES1212129817298719827197", 
){

    // Add a new debit credit card
    cy.getDataTest('MyMenuInline_Button').last().click()
    cy.getDataTest('MyMenuInline_Header0_Item0').click()
    cy.getDataTest('AccountsCU_Bank').type(bank)
    cy.getDataTest('AccountsCU_Name').type(name)
    cy.getDataTest('AccountsCU_Number').type(number)
    cy.intercept({ method:'POST', url:'http://127.0.0.1:8004/api/accounts/', times:1,}).as("post_accounts")
    cy.getDataTest('AccountsCU_Button').click()
    cy.wait('@post_accounts').then((interception)=>{
        cy.wrap(interception.response.body.id).as(wait_name) // Stores the captured ID for later us
    })
}

export function add_accountoperation_from_AccountsView(
    cy,
    wait_name="accountoperation_id"
){
    cy.getDataTest('MyMenuInline_Button').last().click()
    cy.getDataTest('MyMenuInline_Header1_Item0').click()
    cy.getDataTest('AccountsoperationsCU_Concepts').type("Super{downArrow}{enter}")
    cy.getDataTest('AccountsoperationsCU_Amount').clear().type("-100")
    cy.getDataTest('AccountsoperationsCU_Comment').type("This is a comment")
    cy.intercept({ method:'POST', url:'/api/accountsoperations/', times:1,}).as("post_ao")
    cy.getDataTest('AccountsoperationsCU_Button').click()
    cy.wait('@post_ao').then((interception)=>{
        cy.wrap(interception.response.body.id).as(wait_name)
    })
}




export function add_creditcardoperation_from_CreditCardView({
    cy, 
    wait_name="waitCcoId",
    concepts="Super{downArrow}{enter}",
    amount="-1000", 
    comment="Comment"
}={}
){

    // Add a new debit credit card
    cy.getDataTest('MyMenuInline_Button').last().click()
    cy.getDataTest('MyMenuInline_Header0_Item0').click()
    cy.getDataTest('CreditcardsoperationsCU_Concepts').type(concepts)
    cy.getDataTest('CreditcardsoperationsCU_Amount').clear().type(amount)
    cy.getDataTest('CreditcardsoperationsCU_Comment').type(comment)
    cy.intercept({ method:'POST', url:'http://127.0.0.1:8004/api/creditcardsoperations/', times:1,}).as("post_creditcardsoperations")
    cy.getDataTest('CreditcardsoperationsCU_ButtonFollow').click()
    cy.wait('@post_creditcardsoperations').then((interception)=>{
        var cco_id=interception.response.body.id
        cy.wrap(cco_id).as(wait_name) // Stores the captured ID for later us
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

    cy.getDataTest('InvestmentsView_MyMenuInline_Button').should("be.visible")
    cy.getDataTest('InvestmentsView_MyMenuInline_Button').click()
    cy.getDataTest('InvestmentsView_MyMenuInline_Header2_Item0').click()
    cy.getDataTest("InvestmentsoperationsCU_Shares").type("{backspace}").type(shares)
    cy.getDataTest("InvestmentsoperationsCU_Price").type(price)
    cy.getDataTest("InvestmentsoperationsCU_Button").click()
    cy.getDataTest("InvestmentsoperationsCU_Button").should("not.exist")
    component_pointable("InvestmentsView_MyMenuInline_Button")
}

export function add_dividend_from_InvestmentView(
    cy,
    gross="10",
    net="9",
    taxes="1"
){
    cy.getDataTest('InvestmentsView_MyMenuInline_Button').click()
    cy.getDataTest('InvestmentsView_MyMenuInline_Header3_Item0').should("exist").click()
    cy.getDataTest("DividendsCU_Concepts").type("{downArrow}{enter}")
    cy.getDataTest("DividendsCU_Gross").type(gross)
    cy.getDataTest("DividendsCU_Net").type(net)
    cy.getDataTest("DividendsCU_Taxes").type(taxes)
    cy.getDataTest("DividendsCU_Button").click()
    cy.getDataTest("DividendsCU_Button").should("not.exist")
    component_pointable("InvestmentsView_MyMenuInline_Button")
}

export function component_pointable(name){
    cy.getDataTest(name)
        .should('have.css', 'cursor', 'pointer')
        .should('be.visible')
        .should('exist')
        .should('be.enabled')
}