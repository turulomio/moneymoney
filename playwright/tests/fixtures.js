// /full/path/to/playwright/tests/fixtures.js
import { test as baseTest, expect } from '@playwright/test';

import { promises as fs } from 'fs';
import path from 'path';
// Define a new test type that includes our authenticated page fixture
const test = baseTest.extend({


  coverage: [async ({ page }, use, testInfo) => {
    // Run the test
    await use();

    // After the test, collect coverage data from the browser
    const coverage = await page.evaluate(() => window.__coverage__);

    if (coverage) {
      // if you're using multiple tests, you can merge coverage data here
      await saveCoverage(coverage, testInfo.title);
      // console.log('JavaScript coverage data collected and saved.');
    } else {
      console.warn('No coverage data (window.__coverage__) found.');
      console.warn('Ensure your code is instrumented, e.g., with vite-plugin-istanbul.');
    }
  }, { auto: true }],

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


// This is the same function from the previous answer
async function saveCoverage(coverageData, testTitle) {
  const coverageDir = '.nyc_output';
  const sanitizedTitle = testTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const filePath = path.join(coverageDir, `coverage-${sanitizedTitle}-${Date.now()}.json`);
  
  await fs.mkdir(coverageDir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(coverageData));
  console.log(`Coverage data saved to: ${filePath}`);
}




export {test, expect }; // Re-export expect for convenience