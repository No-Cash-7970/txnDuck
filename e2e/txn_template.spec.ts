import { test as base, expect } from '@playwright/test';
import { NavBarComponent as NavBar } from './shared/NavBarComponent';
import { LanguageSupport } from './shared/LanguageSupport';
import { TxnTemplatePage } from './pageModels/TxnTemplatePage';

// Extend basic test by providing a "txnTemplatePage" fixture.
// Code adapted from https://playwright.dev/docs/pom
const test = base.extend<{ txnTemplatePage: TxnTemplatePage }>({
  txnTemplatePage: async ({ page }, use) => {
    // Set up the fixture.
    const txnTemplatePage = new TxnTemplatePage(page);
    await txnTemplatePage.goto();
    // Use the fixture value in the test.
    await use(txnTemplatePage);
  },
});

test.describe('Transaction Template Page', () => {

  test('has footer', async ({ txnTemplatePage, page }) => {
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });

  test.describe('Language Support', () => {
    (new LanguageSupport({
      en: { body: /template/, title: /Transaction/ },
      es: { body: /modelo/, title: /transacción/ },
    })).check(test, TxnTemplatePage.url);
  });

  test.describe('Nav Bar', () => {
    NavBar.check(test, TxnTemplatePage.getFullUrl());
  });

});
