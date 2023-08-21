import { test as base, expect } from '@playwright/test';
import { NavBarComponent as NavBar } from './shared/NavBarComponent';
import { HomePage } from './pageModels/HomePage';
import { SignTxnPage } from './pageModels/SignTxnPage';

// Extend basic test by providing a "signTxnPage" fixture.
// Code adapted from https://playwright.dev/docs/pom
const test = base.extend<{ signTxnPage: HomePage }>({
  signTxnPage: async ({ page }, use) => {
    // Set up the fixture.
    const signTxnPage = new HomePage(page);
    await signTxnPage.goto();
    // Use the fixture value in the test.
    await use(signTxnPage);
  },
});

test.describe('Sign Transaction Page', () => {

  test('has title', async ({ signTxnPage, page }) => {
    await expect(page).toHaveTitle(signTxnPage.titleRegEx);
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
        mainTextRegEx: /Sign/
      },
      {
        lang: 'es',
        langName: 'Spanish',
        mainTextRegEx: /Firmar/
      },
    ];
    // Make a test for each language
    languageData.forEach(lngData => {
      test(`works in ${lngData.langName}`, async ({ page, baseURL }) => {
        const signTxnPage = new SignTxnPage(page);
        await signTxnPage.goto(lngData.lang);

        await expect(page).toHaveURL(baseURL + SignTxnPage.getFullUrl(lngData.lang));
        await expect(page.getByRole('main')).toHaveText(lngData.mainTextRegEx);
      });
    });
  });

  test.describe('Nav Bar', () => {
    NavBar.check(test, SignTxnPage.getFullUrl());
  });
});
