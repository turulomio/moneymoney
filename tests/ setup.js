import { test, expect } from './fixtures.js'; // Import from your fixtures file
import { v_autocomplete_selection, v_text_input_settext } from './commons';

test('Add account', async ({ page }) => {
  // Add account
  await page.getByTestId('LateralIcon').click();
  await page.getByTestId('LateralAccounts').click();
  await page.getByTestId('MyMenuInline_Button').click();
  await page.getByTestId('MyMenuInline_Header0_Item0').click();
  
  v_text_input_settext(page, "AccountsCU_Name", "Permanent Account")
  v_autocomplete_selection(page, "AccountsCU_Bank")
  await page.getByTestId('AccountsCU_Button').click()
  await page.getByTestId('AccountsCU_Button').isHidden()

});





//       cy, 
//     wait_name="waitAccountId",
//     name="New Account", 
//     bank="Personal{downArrow}{enter}",
//     number="ES1212129817298719827197", 
// ){

//     // Add a new debit credit card
//     cy.getDataTest('MyMenuInline_Button').last().click()
//     cy.getDataTest('MyMenuInline_Header0_Item0').click()
//     cy.getDataTest('AccountsCU_Bank').type(bank)
//     cy.getDataTest('AccountsCU_Name').type(name)
//     cy.getDataTest('AccountsCU_Number').type(number)
//     cy.intercept({ method:'POST', url:'http://127.0.0.1:8004/api/accounts/', times:1,}).as("post_accounts")
//     cy.getDataTest('AccountsCU_Button').click()
//     cy.wait('@post_accounts').then((interception)=>{
//         cy.wrap(interception.response.body.id).as(wait_name) // Stores the captured ID for later us


//       add_account_from_AccountsList(cy,undefined,"Permanent account", undefined, undefined)  // Account: 5
  
//       // Add investments and io
//       add_investmentoperation_from_Home(cy, "Permanent account{downArrow}{enter}", "Permanent investment", undefined, undefined, undefined, undefined ) // Investment: 1   // IO de 100 y precio 9 // Quote precio 10
  
//       cy.wait(1000)
  
//       // Add dividend
//       add_dividend_from_InvestmentView(cy)  //Dividendo gross 10, net 9 taxes 1
  
//       // Returns to investments  list
//       cy.getDataTest("InvestmentsView_ButtonClose").click()
  
//       // Logs out
//       cy.getDataTest("BtnLogOut_Button").click()
  



