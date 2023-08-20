import { test as base, expect } from '@playwright/test';
import { NavBarComponent as NavBar } from './shared/NavBarComponent';
import { HomePage } from './pageModels/HomePage';

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
    await expect(homePage.startLink).toBeVisible();
  });

  test.describe('Language', () => {
    const languageData: {
      lang: string,
      langName: string,
      startLinkRegEx: RegExp,
    }[] = [
      {
        lang: 'en',
        langName: 'English',
        startLinkRegEx: /Start/,
      },
      {
        lang: 'es',
        langName: 'Spanish',
        startLinkRegEx: /Comience/,
      },
    ];
    // Make a test for each language
    languageData.forEach(lngData => {
      test(`works in ${lngData.langName}`, async ({ page, baseURL }) => {
        const homePage = new HomePage(page);
        await homePage.goto(lngData.lang);

        await expect(page).toHaveURL(baseURL + HomePage.getFullUrl(lngData.lang));
        await expect(homePage.startLink).toHaveText(lngData.startLinkRegEx);
      });
    });
  });

  test.describe('Nav Bar', () => {
    NavBar.check(test, HomePage.getFullUrl());
  });
});
