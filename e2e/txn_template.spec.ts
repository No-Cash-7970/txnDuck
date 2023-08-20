import { test as base, expect } from '@playwright/test';
import { NavBarComponent as NavBar } from './shared/NavBarComponent';
import { HomePage } from './pageModels/HomePage';
import { TxnTemplatePage } from './pageModels/TxnTemplatePage';

// Extend basic test by providing a "txnTemplatePage" fixture.
// Code adapted from https://playwright.dev/docs/pom
const test = base.extend<{ txnTemplatePage: HomePage }>({
  txnTemplatePage: async ({ page }, use) => {
    // Set up the fixture.
    const txnTemplatePage = new HomePage(page);
    await txnTemplatePage.goto();
    // Use the fixture value in the test.
    await use(txnTemplatePage);
  },
});

test.describe('Transaction Template Page', () => {

  test('has title', async ({ txnTemplatePage, page }) => {
    await expect(page).toHaveTitle(txnTemplatePage.titleRegEx);
  });

  test.describe('Language', () => {
    const languageData: {
      lang: string,
      langName: string,
      mainTextRegEx: RegExp
    }[] = [
      {
        lang: 'en',
        langName: 'English',
        mainTextRegEx: /template/
      },
      {
        lang: 'es',
        langName: 'Spanish',
        mainTextRegEx: /modelo/
      },
    ];
    // Make a test for each language
    languageData.forEach(lngData => {
      test(`works in ${lngData.langName}`, async ({ page, baseURL }) => {
        const txnTemplatePage = new TxnTemplatePage(page);
        await txnTemplatePage.goto(lngData.lang);

        await expect(page).toHaveURL(baseURL + TxnTemplatePage.getFullUrl(lngData.lang));
        await expect(page.getByRole('main')).toHaveText(lngData.mainTextRegEx);
      });
    });
  });

  test.describe('Nav Bar', () => {
    NavBar.check(test, TxnTemplatePage.getFullUrl());
  });
});
