import { test as base, expect } from '@playwright/test';
import { LanguageSupport, NavBarComponent as NavBar } from './shared';
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

  test('has footer', async ({ sendTxnPage }) => {
    await expect(sendTxnPage.page.getByRole('contentinfo')).toBeVisible();
  });

  test.describe('Language Support', () => {
    (new LanguageSupport({
      en: { body: /Send/, title: /Send/ },
      es: { body: /Enviar/, title: /Enviar/ },
    })).check(test, SendTxnPage.url);
  });

  test.describe('Nav Bar', () => {
    NavBar.check(test, SendTxnPage.getFullUrl());
  });

});
