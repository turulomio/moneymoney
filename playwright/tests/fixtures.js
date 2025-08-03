// /full/path/to/playwright/tests/fixtures.js
import { test as baseTest, expect } from '@playwright/test';

// Define a new test type that includes our authenticated page fixture
export const test = baseTest.extend({


  coverage: [async ({ page }, use) => {
    // START of the test
    console.log('Starting JavaScript coverage collection...');
    await page.coverage.startJSCoverage();

    // Call 'use()' to run the test body
    await use();

    // END of the test
    console.log('Stopping JavaScript coverage collection and saving data...');
    const jsCoverage = await page.coverage.stopJSCoverage();
    await saveCoverage(jsCoverage);
  }, { auto: true }], // The 'auto: true' option is key!


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
    await expect(page).toHaveURL('http://127.0.0.1:8006/moneymoney/about/');
    //await expect(page.getByTestId("LateralAssetsReport")).toBeVisible()
    
    // Use the logged-in page in the test
    await use(page);
    
    // Teardown (optional, e.g., logout) can go here after `use(page)`
    // For example:
    // await page.getByRole('button', { name: 'Logout' }).click();
    // await expect(page).toHaveURL(/.*\/login/);
  },
});

import { promises as fs } from 'fs';
import path from 'path';

// This is the same function from the previous answer
export async function saveCoverage(coverageData) {
  const coverageDir = 'coverage/e2e';
  const filePath = path.join(coverageDir, `coverage-${Date.now()}.json`);
  
  await fs.mkdir(coverageDir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(coverageData));
  console.log(`Coverage data saved to: ${filePath}`);
}




export { expect }; // Re-export expect for convenience