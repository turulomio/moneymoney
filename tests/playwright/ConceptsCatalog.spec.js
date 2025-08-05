import { test, expect } from './fixtures.js';
import {
  v_text_input_settext,
  v_autocomplete_selection,
  concept_add_from_ConceptsCatalog,
  expect_native_confirm_and_accept_it,
} from "./commons.js";

test('Concepts catalog', async ({ page }) => {
    // Navigate to concepts catalog
    await page.getByTestId('LateralIcon').click();
    await page.getByTestId('LateralAdministration').click();
    await page.getByTestId('LateralConceptsCatalog').click();
    await expect(page).toHaveURL("http://127.0.0.1:8006/moneymoney/concepts/catalog/");

    // Open MyInlineMenu and add concept
    const concept_id=await concept_add_from_ConceptsCatalog(page, "My first personal concept")
    
    // Edit concept
    await page.getByTestId(`ConceptsCatalog_Table_ButtonUpdate${concept_id}`).click();
    await v_text_input_settext(page, "ConceptsCU_Name", "My first personal concept updated");
    await page.getByTestId('ConceptsCU_Button').click();
    await expect(page.getByTestId('ConceptsCU_Button')).toBeHidden();

    // Delete concept
    await page.getByTestId(`ConceptsCatalog_Table_ButtonDelete${concept_id}`).click();
    expect_native_confirm_and_accept_it(page)
    await page.getByTestId('ConceptsCU_Button').click();
    await expect(page.getByTestId('ConceptsCU_Button')).toBeHidden();

    // Migrate concept
    const concept2_id=await concept_add_from_ConceptsCatalog(page, "My second personal concept")
    await page.getByTestId(`ConceptsCatalog_Table_ButtonMigrate${concept2_id}`).click();
    await v_autocomplete_selection(page, "ConceptsMigration_To", "Negative");
    await page.getByTestId('ConceptsMigration_Button').click();
    await expect(page.getByTestId('ConceptsMigration_Button')).toBeHidden();
});