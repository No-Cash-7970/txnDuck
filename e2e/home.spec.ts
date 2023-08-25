import { test as base, expect } from '@playwright/test';
import { NavBarComponent as NavBar } from './shared/NavBarComponent';
import { LanguageSupport } from './shared/LanguageSupport';
import { HomePage } from './pageModels/HomePage';
import { ComposeTxnPage } from './pageModels/ComposeTxnPage';

// Extend basic test by providing a "homePage" fixture.
// Code adapted from https://playwright.dev/docs/pom
const test = base.extend<{ homePage: HomePage }>({
  homePage: async ({ page }, use) => {
    // Set up the fixture.
    const homePage = new HomePage(page);
    await homePage.goto();
    // Use the fixture value in the test.
    await use(homePage);
  },
});

test.describe('Home Page', () => {

  test('has title', async ({ homePage, page }) => {
    await expect(page).toHaveTitle(homePage.titleRegEx);
  });

  test('has "start" button link', async ({ homePage, page }) => {
    await homePage.startBtn.click();
    await expect(page).toHaveURL(ComposeTxnPage.getFullUrl());
  });

  test('has "compose transaction" button link', async ({ homePage, page }) => {
    await homePage.composeTxnBtn.click();
    await expect(page).toHaveURL(ComposeTxnPage.getFullUrl());
  });

  // test('has "sign transaction" button link', async ({ homePage, page }) => {
  //   await homePage.signTxnBtn.click();
  //   await expect(page).toHaveURL(SignTxnPage.getFullUrl());
  // });

  // test('has "send transaction" button link', async ({ homePage, page }) => {
  //   await homePage.sendTxnBtn.click();
  //   await expect(page).toHaveURL(SendTxnPage.getFullUrl());
  // });

  test.describe('Language Support', () => {
    (new LanguageSupport({
      en: /Start/,
      es: /Comience/,
    })).check(test, HomePage.url);
  });

  test.describe('Nav Bar', () => {
    NavBar.check(test, HomePage.getFullUrl());
  });
});
