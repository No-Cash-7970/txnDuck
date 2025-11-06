import { test as base, expect } from '@playwright/test';
import { LanguageSupport, NavBarComponent as NavBar } from './shared';
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

  test('has footer', async ({ notFoundPage }) => {
    await expect(notFoundPage.page.getByRole('contentinfo')).toBeVisible();
  });

  test.describe('Language Support', () => {
    (new LanguageSupport({
      // The new behavior of Next.js is to have no title. It is not certain if this is the intended
      // behavior or not, but it is fine for this web app.
      en: { body: /Page Not Found/, title: new RegExp('') },
      es: { body: /Página no encontrada/, title: new RegExp('') },

      // These old tests for the page title broke when upgrading to Next 15.2.4
      // en: { body: /Page Not Found/, title: /Transaction/ },
      // es: { body: /Página no encontrada/, title: /transacciones/ },
    })).check(test, NotFoundPage.url);
  });

  test.describe('Nav Bar', () => {
    NavBar.check(test, NotFoundPage.getFullUrl());
  });

});
