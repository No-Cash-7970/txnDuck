import { test as base, expect } from '@playwright/test';
import { LanguageSupport, NavBarComponent as NavBar } from './shared';
import { ComposeTxnPage, HomePage, SendTxnPage, SignTxnPage, TxnPresetsPage } from './pageModels';

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

  test('has footer', async ({ homePage /* Adding this loads the page */, page }) => {
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });

  test('has "start" button link', async ({ homePage, page }) => {
    await homePage.startBtn.click();
    await expect(page).toHaveURL(TxnPresetsPage.getFullUrl());
  });

  test('has "compose transaction" button link', async ({ homePage, page }) => {
    await homePage.composeTxnBtn.click();
    await expect(page).toHaveURL(ComposeTxnPage.getFullUrl());
  });

  test('has "sign transaction" button link', async ({ homePage, page }) => {
    await homePage.signTxnBtn.click();
    await expect(page).toHaveURL(SignTxnPage.getFullUrl() + '?import');
  });

  test('has "send transaction" button link', async ({ homePage, page }) => {
    await homePage.sendTxnBtn.click();
    await expect(page).toHaveURL(SendTxnPage.getFullUrl() + '?import');
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
      async ({ homePage, page }) => {
        // NOTE: Assuming that the default network is TestNet
        await expect(page.getByRole('button', { name: 'TestNet' })).toBeVisible();
      });

      test('uses network specified in URL parameter when there is NO saved network',
      async ({ homePage, page }) => {
        // NOTE: Assuming that the default network is TestNet
        // Select non-default network using URL parameters
        await (new HomePage(page)).goto('en', '?network=betanet');
        await expect(page.getByRole('button', { name: 'BetaNet' })).toBeVisible();
      });

      test('uses network specified in URL parameter when there IS saved network',
      async ({ homePage, page }) => {
        // NOTE: Assuming that the default network is TestNet

        // Select MainNet from node selection menu so node configuration is stored in local storage
        await page.getByRole('button', { name: 'TestNet' }).click();
        await page.getByText('MainNet', { exact: true }).click(); // Menu item

        // A workaround for NS_BINDING_ABORT errors in Firefox caused by prefetching
        if (test.info().project.name === 'firefox') {
          await page.waitForLoadState('networkidle');
        }

        // Select non-default network using URL parameter
        await (new HomePage(page)).goto('en', '?network=betanet');
        await expect(page.getByRole('button', { name: 'BetaNet' })).toBeVisible();
      });

      test('removes URL parameter if network is manually set',
      async ({ homePage, page }) => {
        // NOTE: Assuming that the default network is TestNet

        // Select MainNet from node selection menu so node configuration is stored in local storage
        const testnetButton = page.getByRole('button', { name: 'TestNet' });
        await testnetButton.click();
        await page.getByText('MainNet', { exact: true }).click(); // Menu item

        // A workaround for NS_BINDING_ABORT errors in Firefox caused by prefetching request being
        // cut off too soon by navigating to another page
        if (test.info().project.name === 'firefox') {
          await page.waitForTimeout(100);
        }

        // Select non-default network using URL parameter
        await (new HomePage(page)).goto('en', '?network=betanet');
        const betanetButton = page.getByRole('button', { name: 'BetaNet' });
        await expect(betanetButton).toBeVisible();

        // Select TestNet from node selection menu
        await betanetButton.click();
        await page.getByText('TestNet', { exact: true }).click(); // Menu item

        // Check for correct URL by waiting for it
        await page.waitForURL(HomePage.getFullUrl('en'));
        await expect(testnetButton).toBeVisible();
      });

    });

  });

});
