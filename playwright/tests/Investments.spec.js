import { test, expect } from './fixtures.js'; // Import from your fixtures file
import {
  investment_add_from_InvestmentsList,
  investmentoperation_add_from_InvestmentsView,
  quote_add_from_InvestmentsList
} from "./commons"


test('Investments list', async ({ page }) => {
  await page.getByTestId('LateralIcon').click();
  await page.getByTestId('LateralInvestments').click();

  const investments_id=await investment_add_from_InvestmentsList(page)
  await quote_add_from_InvestmentsList(page, investments_id)
  await expect(page.getByTestId(`Investments_Table_Row${investments_id}`)).toBeVisible();
  await page.getByTestId(`Investments_Table_Row${investments_id}`).click()
  await investmentoperation_add_from_InvestmentsView(page)




  // login_test_User(cy)

  // // Add investments
  // add_investmentoperation_from_Home(cy)

  // cy.wait(5000)

  // // Add dividend
  // add_dividend_from_InvestmentView(cy)

  // // See investments chart
  // component_pointable("InvestmentsView_MyMenuInline_Button")
  // cy.getDataTest('InvestmentsView_MyMenuInline_Button').click()
  // cy.getDataTest('InvestmentsView_MyMenuInline_Header0_Item0').click()
  // cy.getDataTest('ChartInvestments_ButtonClose').click()

  // // Change investment active status twice
  // cy.wait(5000)
  // component_pointable("InvestmentsView_MyMenuInline_Button")
  // cy.getDataTest('InvestmentsView_MyMenuInline_Button').click()
  // cy.getDataTest('InvestmentsView_MyMenuInline_Header0_Item1').click()


  // cy.wait(5000)
  // component_pointable("InvestmentsView_MyMenuInline_Button")
  // cy.getDataTest('InvestmentsView_MyMenuInline_Button').click()
  // cy.getDataTest('InvestmentsView_MyMenuInline_Header0_Item1').click()

  // // Evolution chart
  // cy.wait(5000)
  // component_pointable("InvestmentsView_MyMenuInline_Button")
  // cy.getDataTest('InvestmentsView_MyMenuInline_Button').click()
  // cy.getDataTest('InvestmentsView_MyMenuInline_Header0_Item2').click()
  // cy.getDataTest('ChartInvestmentsoperationsEvolution_ButtonClose').should("be.visible").click()
  // cy.getDataTest('InvestmentsView_MyMenuInline_Button').should('have.css', 'cursor', 'pointer'); // Is pointable o clickable


  // // Open show evolution chart
  // component_pointable("InvestmentsView_MyMenuInline_Button")
  // cy.getDataTest('InvestmentsView_MyMenuInline_Button').click()
  // cy.getDataTest('InvestmentsView_MyMenuInline_Header0_Item3').click()


})

