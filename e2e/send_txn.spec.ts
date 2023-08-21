import { test as base, expect } from '@playwright/test';
import { NavBarComponent as NavBar } from './shared/NavBarComponent';
import { SendTxnPage } from './pageModels/SendTxnPage';

// Extend basic test by providing a "sendTxnPage" fixture.
// Code adapted from https://playwright.dev/docs/pom
const test = base.extend<{ sendTxnPage: SendTxnPage }>({
  sendTxnPage: async ({ page }, use) => {
    // Set up the fixture.
    const sendTxnPage = new SendTxnPage(page);
    await sendTxnPage.goto();
    // Use the fixture value in the test.
    await use(sendTxnPage);
  },
});

test.describe('Send Transaction Page', () => {

  test('has title', async ({ sendTxnPage, page }) => {
    await expect(page).toHaveTitle(sendTxnPage.titleRegEx);
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
        mainTextRegEx: /Send/
      },
      {
        lang: 'es',
        langName: 'Spanish',
        mainTextRegEx: /Enviar/
      },
    ];
    // Make a test for each language
    languageData.forEach(lngData => {
      test(`works in ${lngData.langName}`, async ({ page }) => {
        const sendTxnPage = new SendTxnPage(page);
        await sendTxnPage.goto(lngData.lang);

        await expect(page).toHaveURL(SendTxnPage.getFullUrl(lngData.lang));
        await expect(page.getByRole('main')).toHaveText(lngData.mainTextRegEx);
      });
    });
  });

  test.describe('Nav Bar', () => {
    NavBar.check(test, SendTxnPage.getFullUrl());
  });
});
