import { test as base, expect } from '@playwright/test';
import { NavBarComponent as NavBar } from './shared/NavBarComponent';
import { LanguageSupport } from './shared/LanguageSupport';
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

  test.describe('Language Support', () => {
    (new LanguageSupport({
      en: /Send/,
      es: /Enviar/,
    })).check(test, SendTxnPage.url);
  });

  test.describe('Nav Bar', () => {
    NavBar.check(test, SendTxnPage.getFullUrl());
  });
});
