import { login_test_User, add_account_from_AccountsList , add_dividend_from_InvestmentView, add_investmentoperation_from_Home} from "./commons"
/**
    To fast test data permanent data will be created once with these scripts

    Testing crud operations do not modified this data and should be created un other tests and should delete all data after tests



*/


describe('e2e Permanent data', () => {
  it('Permanent data', () => {    
    login_test_User(cy)
    //Open lateral menu
    cy.getDataTest('LateralIcon').click()
    cy.getDataTest('LateralAccounts').click()
    add_account_from_AccountsList(cy,undefined,"Permanent account", undefined, undefined)  // Account: 5

    // Add investments and io
    add_investmentoperation_from_Home(cy, "Permanent account{downArrow}{enter}", "Permanent investment", undefined, undefined, undefined, undefined ) // Investment: 1   // IO de 100 y precio 9 // Quote precio 10

    cy.wait(1000)

    // Add dividend
    add_dividend_from_InvestmentView(cy)  //Dividendo gross 10, net 9 taxes 1

    // Returns to investments  list
    cy.getDataTest("InvestmentsView_ButtonClose").click()

    // Logs out
    cy.getDataTest("BtnLogOut_Button").click()

  })  
})