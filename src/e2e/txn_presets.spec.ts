import { test as base, expect } from '@playwright/test';
import { LanguageSupport, NavBarComponent as NavBar } from './shared';
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

  test.describe('Language Support', () => {
    (new LanguageSupport({
      en: { body: /preset/, title: /Transaction/ },
      es: { body: /preselección/, title: /transacción/ },
    })).check(test, TxnPresetsPage.url);
  });

  test.describe('Nav Bar', () => {
    NavBar.check(test, TxnPresetsPage.getFullUrl());
  });

  test.describe('With URL Parameters', () => {

    test('overrides the preset specified in URL in links to presets', async ({ page }) => {
      await (new TxnPresetsPage(page)).goto('en', '?preset=foo');
      // Only check one of the links instead of all 20+ links
      await expect(page.getByRole('link', { name: 'Transfer Algos' }))
        .toHaveAttribute('href', '/en/txn/compose?preset=transfer');
    });

    test('overrides the preset specified with other URL parameters in URL in links to presets',
    async ({ page }) => {
      await (new TxnPresetsPage(page)).goto('en', '?preset=foo&a=b');
      // Only check one of the links instead of all 20+ links
      await expect(page.getByRole('link', { name: 'Transfer Algos' }))
        .toHaveAttribute('href', '/en/txn/compose?a=b&preset=transfer');
    });

    test('includes current URL parameters (without preset) specified in links to presets',
    async ({ page }) => {
      await (new TxnPresetsPage(page)).goto('en', '?a=b&c=d');
      // Only check one of the links instead of all 20+ links
      await expect(page.getByRole('link', { name: 'Transfer Algos' }))
        .toHaveAttribute('href', '/en/txn/compose?a=b&c=d&preset=transfer');
    });

  });

});
