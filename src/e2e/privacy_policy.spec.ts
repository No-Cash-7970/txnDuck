import { test as base, expect } from '@playwright/test';
import { LanguageSupport, NavBarComponent as NavBar } from './shared';
import { PrivacyPolicyPage } from './pageModels/PrivacyPolicyPage';

// Extend basic test by providing a "privacyPolicyPage" fixture.
// Code adapted from https://playwright.dev/docs/pom
const test = base.extend<{ privacyPolicyPage: PrivacyPolicyPage }>({
  privacyPolicyPage: async ({ page }, use) => {
    // Set up the fixture.
    const privacyPolicyPage = new PrivacyPolicyPage(page);
    await privacyPolicyPage.goto();
    // Use the fixture value in the test.
    await use(privacyPolicyPage);
  },
});

test.describe('Privacy Policy Page', () => {

  test.describe('Language Support', () => {
    (new LanguageSupport({
      en: { body: /Privacy/, title: /Privacy/ },
      es: { body: /privacidad/, title: /privacidad/ },
    })).check(test, PrivacyPolicyPage.url);
  });

  test.describe('Nav Bar', () => {
    NavBar.check(test, PrivacyPolicyPage.getFullUrl());
  });

});
