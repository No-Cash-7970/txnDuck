import { test as base, expect } from '@playwright/test';
import { NavBarComponent as NavBar } from './shared/NavBarComponent';
import { LanguageSupport } from './shared/LanguageSupport';
import { SignTxnPage } from './pageModels/SignTxnPage';
import { ComposeTxnPage } from './pageModels/ComposeTxnPage';

// Extend basic test by providing a "signTxnPage" fixture.
// Code adapted from https://playwright.dev/docs/pom
const test = base.extend<{ signTxnPage: SignTxnPage }>({
  signTxnPage: async ({ page }, use) => {
    // Set up the fixture.
    const signTxnPage = new SignTxnPage(page);
    await signTxnPage.goto();
    // Use the fixture value in the test.
    await use(signTxnPage);
  },
});

// Transaction parameters data. Used to mock requests for current transaction parameters. This is
// the exact response of a request for transaction parameters in August 2024. Using the exact data
// of a real request makes the mock as close to what would happen in production as much as possible.
const txnParamsData = {
  // eslint-disable-next-line max-len
  "consensus-version": "https://github.com/algorandfoundation/specs/tree/925a46433742afb0b51bb939354bd907fa88bf95",
  "fee": 0,
  "genesis-hash": "wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=",
  "genesis-id": "mainnet-v1.0",
  "last-round": 42104636,
  "min-fee": 1000
};

test.describe('Sign Transaction Page', () => {

  test('has footer', async ({ signTxnPage /* Adding this loads the page */, page }) => {
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });

  test.describe('Language Support', () => {
    (new LanguageSupport({
      en: { body: /Sign/, title: /Sign/ },
      es: { body: /firmar/, title: /firmar/ },
    })).check(test, SignTxnPage.url);
  });

  test.describe('Nav Bar', () => {
    NavBar.check(test, SignTxnPage.getFullUrl());

    test.describe('With URL Parameters', () => {
      const presetURLParam = '?preset=reg_offline';
      // eslint-disable-next-line max-len
      const urlParams = `${presetURLParam}&snd=MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4`;

      test.beforeEach(async ({ page }) => {
        // Mock the Algorand node call for transaction parameters data before doing anything
        await page.route('*/**/v2/transactions/params', async route => {
          await route.fulfill({ json: txnParamsData });
        });
        // Fill out form and submit so transaction summary is shown
        await (new ComposeTxnPage(page)).goto('en', urlParams);
        await page.getByRole('button', { name: 'Review & sign' }).click();
        await page.waitForURL(SignTxnPage.getFullUrl('en') + urlParams);
      });

      test('uses default network if the network IS NOT specified in a URL parameter',
      async ({ page }) => {
        // NOTE: Assuming that the default network is MainNet
        await expect(page.getByText('MainNet')).toHaveCount(2);
      });

      test('uses network specified in URL parameter when there IS NO saved network',
      async ({ page }) => {
        // NOTE: Assuming that the default network is MainNet

        // Select non-default network using URL parameter
        await (new SignTxnPage(page)).goto('en',`${presetURLParam}&network=betanet`);
        await expect(page.getByText('BetaNet')).toHaveCount(2);
      });

      test('uses network specified in URL parameter when there IS saved network',
      async ({ page }) => {
        // NOTE: Assuming that the default network is MainNet

        // Select TestNet from node selection menu so node configuration is stored in local storage
        await page.getByRole('button', { name: 'MainNet' }).click();
        await page.getByText('TestNet', { exact: true }).click();
        // Make sure switching networks works
        await expect(page.getByText('TestNet')).toHaveCount(2);
        // Select non-default network using URL parameter
        await (new SignTxnPage(page)).goto('en',`${presetURLParam}&network=betanet`);
        await expect(page.getByText('BetaNet')).toHaveCount(2);
      });

      test('removes URL parameter if network is manually set',
      async ({ page }) => {
        // NOTE: Assuming that the default network is MainNet

        // Select TestNet from node selection menu so node configuration is stored in local storage
        const mainnetButton = page.getByRole('button', { name: 'MainNet' });
        await mainnetButton.click();
        await page.getByText('TestNet', { exact: true }).click(); // Menu item

        // Select non-default network using URL parameter
        await (new SignTxnPage(page)).goto('en',`${presetURLParam}&network=betanet`);
        const betanetButton = page.getByRole('button', { name: 'BetaNet' });
        await expect(betanetButton).toBeVisible();

        // Select MainNet from node selection menu
        await betanetButton.click();
        await page.getByText('MainNet').click(); // Menu item

        // Check for correct URL by waiting for it
        await page.waitForURL(SignTxnPage.getFullUrl('en') + presetURLParam);
        await expect(mainnetButton).toBeVisible();
      });
    });

  });

});
