import { test as base, expect } from '@playwright/test';
import { LanguageSupport, NavBarComponent as NavBar } from './shared';
import { GroupComposePage } from './pageModels';

// Extend basic test by providing a "grpComposePage" fixture.
// Code adapted from https://playwright.dev/docs/pom
const test = base.extend<{ grpComposePage: GroupComposePage }>({
  grpComposePage: async ({ page }, use) => {
    // Set up the fixture.
    const grpComposePage = new GroupComposePage(page);
    await grpComposePage.goto();
    // Use the fixture value in the test.
    await use(grpComposePage);
  },
});

test.describe('Transaction Group Compose Page', () => {

  test.describe('Language Support', () => {
    (new LanguageSupport({
      en: { body: /Compose/, title: /Compose/ },
      es: { body: /Componer/, title: /Componer/ },
    })).check(test, GroupComposePage.url);
  });

  test.describe('Nav Bar', () => {
    NavBar.check(test, GroupComposePage.getFullUrl());
  });

});
