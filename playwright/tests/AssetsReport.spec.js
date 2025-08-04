import { test, expect } from './fixtures.js';
import {
  v_text_input_settext,
} from "./commons.js";

  test('Assets report', async ({ page }) => {
    // 1. Navigate to settings to configure name
    await page.getByTestId('LateralSettings').click();
    await v_text_input_settext(page, "Settings_FirstName", "Paco");
    await v_text_input_settext(page, "Settings_LastName", "Pérez Gutiérrez");
    await page.getByTestId('Settings_ButtonSave').click();
    await expect(page).toHaveURL('home/');

    // 2. Launches assets report
    await page.getByTestId('LateralAssetsReport').click();
    await expect(page.getByTestId('AssetsReport_ButtonGenerate')).toBeEnabled({timeout: 60000});
    await page.getByTestId('AssetsReport_ButtonGenerate').click();
    await expect(page.getByTestId('AssetsReport_ButtonGenerate')).toBeEnabled({timeout: 60000});

  });