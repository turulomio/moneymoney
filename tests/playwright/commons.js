
import { expect } from './fixtures.js';
import {
  v_autocomplete_selection_with_role_option,
  v_autocomplete_selection_with_role_listbox,
  v_text_input_settext,
  promise_to_get_id_from_post_response,
  mymenuinline_selection,
} from "./playwright_vuetify.js";





export async function account_add_from_AccountsList(page, name="Permanent Account"){
  await mymenuinline_selection(page, "AccountsList_MyMenuInline", 0, 0)

  // Set up the promise to wait for the response *before* the action.
  const idPromise = promise_to_get_id_from_post_response(page, "/api/accounts/");

  await v_text_input_settext(page, "AccountsCU_Name", name);
  await v_autocomplete_selection_with_role_option(page, "AccountsCU_Bank", "Personal Management");

  // This is the action that triggers the POST request.
  await page.getByTestId('AccountsCU_Button').click();

  // Now we wait for the promise to resolve with the ID from the response.
  const newAccountId = await idPromise;
  // console.log(`New account created with ID: ${newAccountId}`);
  expect(newAccountId).toBeDefined();

  // Wait for the dialog to close.
  await expect(page.getByTestId('AccountsCU_Button')).toBeHidden();
  return newAccountId
}

export async function accountoperation_add_from_AccountsView(page, concept, amount, comment){
  await mymenuinline_selection(page, "AccountsView_MyMenuInline", 1, 0)
  await v_autocomplete_selection_with_role_option(page, "AccountsoperationsCU_Concepts", concept);
  await v_text_input_settext(page, "AccountsoperationsCU_Amount", amount);
  await v_text_input_settext(page, "AccountsoperationsCU_Comment", comment);

  // Set up the promise to wait for the response *before* the action.
  const idPromise = promise_to_get_id_from_post_response(page, "/api/accountsoperations/");
  // This is the action that triggers the POST request.
  await page.getByTestId('AccountsoperationsCU_Button').click();
  // Now we wait for the promise to resolve with the ID from the response.
  const newId = await idPromise;
  expect(newId).toBeDefined();

  // Wait for the dialog to close.
  await expect(page.getByTestId('AccountsoperationsCU_Button')).toBeHidden();
  return newId
}



export async function creditcard_add_from_AccountsView(page, name, deferred){
    await mymenuinline_selection(page, "AccountsView_MyMenuInline", 2, 0)
    await v_text_input_settext(page, "CreditcardsCU_Name", name);
    await v_text_input_settext(page, "CreditcardsCU_Number", "1234567890123456");
    await v_text_input_settext(page, "CreditcardsCU_MaximumBalance", "1000");
    await page.getByTestId('CreditcardsCU_Active').getByRole("checkbox").check();
    if (deferred) await page.getByTestId('CreditcardsCU_Deferred').getByRole("checkbox").check();
    const cc_id_promise = promise_to_get_id_from_post_response(page, "/api/creditcards/");
    await page.getByTestId('CreditcardsCU_Button').click(); 
    const cc_id= await cc_id_promise;
    await expect(page.getByTestId('CreditcardsCU_Button')).toBeHidden();
    await expect(page.getByTestId(`AccountsView_Tablecc_Row${cc_id}`)).toBeVisible();
    return cc_id
}

export async function creditcardoperation_add_from_CreditCardsView(page, concepts, follow=false){
  /*
    follow to use ButtonFollow or not
  */
    await mymenuinline_selection(page, "CreditCardsView_MyMenuInline", 0, 0)

    await v_autocomplete_selection_with_role_option(page, "CreditcardsoperationsCU_Concepts", concepts);
    await v_text_input_settext(page, "CreditcardsoperationsCU_Amount", "-100")
    await v_text_input_settext(page, "CreditcardsoperationsCU_Comment", "This is a comment")
    const cc_id_promise = promise_to_get_id_from_post_response(page, "/api/creditcardsoperations/");
    if (follow){
      await page.getByTestId('CreditcardsoperationsCU_ButtonFollow').click();
    } else {
      await expect(page.getByTestId('CreditcardsoperationsCU_Button')).toBeHidden();
      await expect(page.getByTestId(`CreditCardsView_Tablecc_Row${cc_id}`)).toBeVisible();
    }
    const cc_id= await cc_id_promise;
    return cc_id
}

export async function concept_add_from_ConceptsCatalog(page, name="My first personal concept"){
    await mymenuinline_selection(page, "ConceptsCatalog_MyMenuInline", 0, 0)
    await v_text_input_settext(page, "ConceptsCU_Name", name);
    await v_autocomplete_selection_with_role_listbox(page, "ConceptsCU_OperationsTypes", "Expense", true);

    const concept_id_promise = promise_to_get_id_from_post_response(page, "/api/concepts/");
    await page.getByTestId('ConceptsCU_Button').click();
    const concept_id= await concept_id_promise;
    await expect(page.getByTestId(`ConceptsCatalog_Table_ButtonUpdate${concept_id}`)).toBeVisible();
    return concept_id
}

export async function investment_add_from_InvestmentsList(page, name="New Test Investment", product_name="LYXOR IBEX DOBLE APALANCADO (Madrid Stock Exchange)"){
  // This is a placeholder implementation based on the function name.
  // You may need to adjust the selectors and values.
  await mymenuinline_selection(page, "InvestmentsList_MyMenuInline", 0, 0)
  const idPromise = promise_to_get_id_from_post_response(page, "/api/investments/");
  await v_text_input_settext(page, "InvestmentsCU_Name", name);
  await v_autocomplete_selection_with_role_listbox(page, "InvestmentsCU_Accounts", "Cash");
  await v_autocomplete_selection_with_role_listbox(page, "InvestmentsCU_Products", product_name);
  await page.getByTestId('InvestmentsCU_Button').click();
  return await idPromise
}

export async function quote_add_from_InvestmentsList(page, investment_id){
  await expect(page.getByTestId(`Investments_Table_ButtonAddQuote${investment_id}`)).toBeVisible();
  await page.getByTestId(`Investments_Table_ButtonAddQuote${investment_id}`).click()
  await v_text_input_settext(page, "QuotesCU_Quote", "10");
  await page.getByTestId('QuotesCU_Button').click();
  await expect(page.getByTestId('QuotesCU_Button')).toBeHidden()
}



export async function quote_add_from_ProductsView(page, price="10"){
    await mymenuinline_selection(page, "ProductsView_MyMenuInline", 0, 0)
    await v_text_input_settext(page, "QuotesCU_Quote", price);
    await page.getByTestId('QuotesCU_Button').click();
    await expect(page.getByTestId('QuotesCU_Button')).toBeHidden()
}


export async function investmentoperation_add_from_InvestmentsView(page){
  await expect(page.getByTestId('InvestmentsView_ButtonClose')).toBeVisible({timeout: 15000});
  await mymenuinline_selection(page, "InvestmentsView_MyMenuInline", 2, 0)
  await v_text_input_settext(page, "InvestmentsoperationsCU_Shares", "100")
  await v_text_input_settext(page, "InvestmentsoperationsCU_Price", "9");
  const idPromise = promise_to_get_id_from_post_response(page, "/api/investmentsoperations/");
  await page.getByTestId('InvestmentsoperationsCU_Button').click();
  const id= await idPromise
  await expect(page.getByTestId('InvestmentsoperationsCU_Button')).toBeHidden()
  return id
}



export async function dividend_add_from_InvestmentView(
    page,
    gross="10",
    net="9",
    taxes="1"
){
    await expect(page.getByTestId('InvestmentsView_ButtonClose')).toBeVisible({timeout: 15000});
    await mymenuinline_selection(page, "InvestmentsView_MyMenuInline", 3, 0)
    await v_autocomplete_selection_with_role_option(page, "DividendsCU_Concepts", "Dividends. Sale of rights");
    await v_text_input_settext(page, "DividendsCU_Gross", gross);
    await v_text_input_settext(page, "DividendsCU_Net", net);
    await v_text_input_settext(page, "DividendsCU_Taxes", taxes);
    await page.getByTestId('DividendsCU_Button').click();
    await expect(page.getByTestId('DividendsCU_Button')).toBeHidden()

}

