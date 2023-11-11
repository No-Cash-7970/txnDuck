import { test as base, expect } from '@playwright/test';
import { NavBarComponent as NavBar } from './shared/NavBarComponent';
import { LanguageSupport } from './shared/LanguageSupport';
import { TxnPresetsPage } from './pageModels/TxnPresetsPage';

// Extend basic test by providing a "txnPresetsPage" fixture.
// Code adapted from https://playwright.dev/docs/pom
const test = base.extend<{ txnPresetsPage: TxnPresetsPage }>({
  txnPresetsPage: async ({ page }, use) => {
    // Set up the fixture.
    const txnPresetsPage = new TxnPresetsPage(page);
    await txnPresetsPage.goto();
    // Use the fixture value in the test.
    await use(txnPresetsPage);
  },
});

test.describe('Transaction Presets Page', () => {

  test('has footer', async ({ txnPresetsPage /* Adding this loads the page */, page }) => {
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });

  test.describe('Language Support', () => {
    (new LanguageSupport({
      en: { body: /preset/, title: /Transaction/ },
      es: { body: /preselección/, title: /transacción/ },
    })).check(test, TxnPresetsPage.url);
  });

  test.describe('Nav Bar', () => {
    NavBar.check(test, TxnPresetsPage.getFullUrl());
  });

});
