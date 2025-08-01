// /full/path/to/playwright/tests/fixtures.js
import { test as baseTest, expect } from '@playwright/test';

// Define a new test type that includes our authenticated page fixture
export const test = baseTest.extend({
  // 'page' fixture will be overridden here for tests that use this 'test' object
  page: async ({ page }, use) => {
    // Perform login


  await page.goto('http://127.0.0.1:8006/moneymoney/');
  await page.getByTestId('LateralLogIn').click();
  await page.getByTestId('BtnLogIn_User').getByRole('textbox').fill("test");
  await page.getByTestId('BtnLogIn_Password').getByRole('textbox').fill("test");
  await page.getByTestId('BtnLogIn_cmd').click();
//   await page.waitForURL('http://127.0.0.1:8006/moneymoney/home/')
    
    // Wait for successful login, e.g., navigation to dashboard
    await expect(page).toHaveURL('http://127.0.0.1:8006/moneymoney/home/');
    //await expect(page.getByTestId("LateralAssetsReport")).toBeVisible()
    
    // Use the logged-in page in the test
    await use(page);
    
    // Teardown (optional, e.g., logout) can go here after `use(page)`
    // For example:
    // await page.getByRole('button', { name: 'Logout' }).click();
    // await expect(page).toHaveURL(/.*\/login/);
  },
});

export { expect }; // Re-export expect for convenience