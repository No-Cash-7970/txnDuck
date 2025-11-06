import { test as base, expect } from '@playwright/test';
import { LanguageSupport, NavBarComponent as NavBar } from './shared';
import { ComposeTxnPage, HomePage, SendTxnPage, SignTxnPage, TxnPresetsPage } from './pageModels';

// Extend basic test by providing a "homePage" fixture.
// Code adapted from https://playwright.dev/docs/pom
const test = base.extend<{ homePage: HomePage }>({
  homePage: async ({ page }, use) => {
    // Set up the fixture.
    const homePage = new HomePage(page);
    // Use the fixture value in the test.
    await use(homePage);
  },
});

test.describe('Home Page', () => {

  test('has footer', async ({ homePage }) => {
    await homePage.goto();
    await expect(homePage.page.getByRole('contentinfo')).toBeVisible();
  });

  test('has "start" button link', async ({ homePage }) => {
    await homePage.goto();
    await homePage.startBtn.click();
    await expect(homePage.page).toHaveURL(TxnPresetsPage.getFullUrl());
  });

  test('has "compose transaction" button link', async ({ homePage }) => {
    await homePage.goto();
    await homePage.composeTxnBtn.click();
    await expect(homePage.page).toHaveURL(ComposeTxnPage.getFullUrl());
  });

  test('has "sign transaction" button link', async ({ homePage }) => {
    await homePage.goto();
    await homePage.signTxnBtn.click();
    await expect(homePage.page).toHaveURL(SignTxnPage.getFullUrl() + '?import');
  });

  test('has "send transaction" button link', async ({ homePage }) => {
    await homePage.goto();
    await homePage.sendTxnBtn.click();
    await expect(homePage.page).toHaveURL(SendTxnPage.getFullUrl() + '?import');
  });

  test.describe('Language Support', () => {
    (new LanguageSupport({
      en: { body: /Build/, title: /Transaction/ },
      es: { body: /Cree/, title: /transacciones/ },
    })).check(test, HomePage.url);
  });

  test.describe('Nav Bar', () => {

    NavBar.check(test, HomePage.getFullUrl());

    test.describe('With URL Parameters', () => {

      test('uses default network if the network IS NOT specified in a URL parameter',
      async ({ homePage }) => {
        await homePage.goto();
        // NOTE: Assuming that the default network is TestNet
        await expect(homePage.page.getByRole('button', { name: 'TestNet' })).toBeVisible();
      });

      test('uses network specified in URL parameter when there is NO saved network',
      async ({ homePage }) => {
        // NOTE: Assuming that the default network is TestNet
        // Select non-default network using URL parameters
        await homePage.goto('en', '?network=betanet');
        await expect(homePage.page.getByRole('button', { name: 'BetaNet' })).toBeVisible();
      });

      test('uses network specified in URL parameter when there IS saved network',
      async ({ homePage }) => {
        const page = homePage.page;
        await homePage.goto();

        // NOTE: Assuming that the default network is TestNet

        // Select MainNet from node selection menu so node configuration is stored in local storage
        await page.getByRole('button', { name: 'TestNet' }).click();
        await page.getByText('MainNet', { exact: true }).click(); // Menu item
        await page.waitForURL(HomePage.getFullUrl('en')); // Wait for menu item "link" to load

        // Select non-default network using URL parameter
        await homePage.goto('en', '?network=betanet');
        await expect(page.getByRole('button', { name: 'BetaNet' })).toBeVisible();
      });

      test('removes URL parameter if network is manually set',  async ({ homePage }) => {
        const page = homePage.page;
        await homePage.goto();

        // NOTE: Assuming that the default network is TestNet

        // Select MainNet from node selection menu so node configuration is stored in local storage
        const testnetButton = page.getByRole('button', { name: 'TestNet' });
        await testnetButton.click();
        await page.getByText('MainNet', { exact: true }).click(); // Menu item

        // Select non-default network using URL parameter
        await homePage.goto('en', '?network=betanet');
        const betanetButton = page.getByRole('button', { name: 'BetaNet' });
        await expect(betanetButton).toBeVisible();

        // Select TestNet from node selection menu
        await betanetButton.click();
        await page.getByText('TestNet', { exact: true }).click(); // Menu item
        await expect(testnetButton).toBeVisible();
      });

    });

  });

});
