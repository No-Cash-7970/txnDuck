import { test as base, expect } from '@playwright/test';
import { NavBarComponent as NavBar } from './shared/NavBarComponent';
import { ComposeTxnPage } from './pageModels/ComposeTxnPage';

// Extend basic test by providing a "composeTxnPage" fixture.
// Code adapted from https://playwright.dev/docs/pom
const test = base.extend<{ composeTxnPage: ComposeTxnPage }>({
  composeTxnPage: async ({ page }, use) => {
    // Set up the fixture.
    const composeTxnPage = new ComposeTxnPage(page);
    await composeTxnPage.goto();
    // Use the fixture value in the test.
    await use(composeTxnPage);
  },
});

test.describe('Compose Transaction Page', () => {

  test('has title', async ({ composeTxnPage, page }) => {
    await expect(page).toHaveTitle(composeTxnPage.titleRegEx);
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
        mainTextRegEx: /Compose/
      },
      {
        lang: 'es',
        langName: 'Spanish',
        mainTextRegEx: /Componer/
      },
    ];
    // Make a test for each language
    languageData.forEach(lngData => {
      test(`works in ${lngData.langName}`, async ({ page, baseURL }) => {
        const composeTxnPage = new ComposeTxnPage(page);
        await composeTxnPage.goto(lngData.lang);

        await expect(page).toHaveURL(baseURL + ComposeTxnPage.getFullUrl(lngData.lang));
        await expect(page.getByRole('main')).toHaveText(lngData.mainTextRegEx);
      });
    });
  });

  test.describe('Nav Bar', () => {
    NavBar.check(test, ComposeTxnPage.getFullUrl());
  });
});
