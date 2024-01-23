import { test as base, expect } from '@playwright/test';
import { NavBarComponent as NavBar } from './shared/NavBarComponent';
import { LanguageSupport } from './shared/LanguageSupport';
import { NotFoundPage } from './pageModels/NotFoundPage';

// Extend basic test by providing a "notFoundPage" fixture.
// Code adapted from https://playwright.dev/docs/pom
const test = base.extend<{ notFoundPage: NotFoundPage }>({
  notFoundPage: async ({ page }, use) => {
    // Set up the fixture.
    const notFoundPage = new NotFoundPage(page);
    await notFoundPage.goto();
    // Use the fixture value in the test.
    await use(notFoundPage);
  },
});

test.describe('Not Found Page', () => {

  test('has footer', async ({ notFoundPage /* Adding this loads the page */, page }) => {
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });

  test.describe('Language Support', () => {
    (new LanguageSupport({
      en: { body: /Page Not Found/, title: /Transaction/ },
      es: { body: /Página no encontrada/, title: /transacciones/ },
    })).check(test, NotFoundPage.url);
  });

  test.describe('Nav Bar', () => {
    NavBar.check(test, NotFoundPage.getFullUrl());
  });

});
