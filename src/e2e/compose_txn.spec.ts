import { test as base, expect } from '@playwright/test';
import { NavBarComponent as NavBar } from './shared/NavBarComponent';
import { LanguageSupport } from './shared/LanguageSupport';
import { ComposeTxnPage } from './pageModels/ComposeTxnPage';
import { HomePage } from './pageModels/HomePage';
import { TxnPresetsPage } from './pageModels/TxnPresetsPage';

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

  test('has footer', async ({ composeTxnPage /* Adding this loads the page */, page }) => {
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });

  test('has link to presets page', async ({ composeTxnPage, page }) => {
    await page.getByText(/Choose preset/).click();
    await expect(page).toHaveURL(TxnPresetsPage.getFullUrl());
  });

  test.describe('Language Support', () => {
    (new LanguageSupport({
      en: { body: /Compose/, title: /Compose/ },
      es: { body: /Componga/, title: /Componga/ },
    })).check(test, ComposeTxnPage.url);
  });

  test.describe('Nav Bar', () => {
    NavBar.check(test, ComposeTxnPage.getFullUrl());
  });

});
