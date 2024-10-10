import { test as base, expect } from '@playwright/test';
import { LanguageSupport, NavBarComponent as NavBar } from './shared';
import { ComposeTxnPage, SignTxnPage } from './pageModels';

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

  test('shows manual transaction fee and valid rounds', async ({ signTxnPage, page }) => {
    // Compose a transaction and manually set fee and valid rounds
    (new ComposeTxnPage(page)).goto('en',
      '?preset=transfer'
      + '&snd=OMFLGYWNFKRIZ6Y6STE5SW3WJJQHLIG6GY4DD3FJHQRAK6MY5YMVJ6FWTY'
      + '&rcv=OMFLGYWNFKRIZ6Y6STE5SW3WJJQHLIG6GY4DD3FJHQRAK6MY5YMVJ6FWTY'
      + '&amt=0'
      + '&fv=41922740&lv=41922840&fee=.004'
    );
    // Submit form to go to sign-transaction page
    await page.getByRole('button', { name: 'Review & sign' }).click();

    // Check the fee and valid rounds
    await expect(page.getByRole('row', { name: 'Fee(Manual)' }).getByRole('cell'))
      .toHaveText('0.004 Algos');
    await expect(
      page.getByRole('row', { name: 'Transaction’s first valid round(Manual)' }).getByRole('cell')
    ).toHaveText('41,922,740');
    await expect(
      page.getByRole('row', { name: 'Transaction’s last valid round(Manual)' }).getByRole('cell')
    ).toHaveText('41,922,840');
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
        await page.waitForURL(SignTxnPage.getFullUrl('en') + presetURLParam);
      });

      test('uses default network if the network is NOT specified in a URL parameter',
      async ({ signTxnPage, page }) => {
        // NOTE: Assuming that the default network is TestNet
        await expect(page.getByText('TestNet')).toHaveCount(2);
      });

      test('uses network specified in URL parameter when there is NO saved network',
      async ({ signTxnPage, page }) => {
        // NOTE: Assuming that the default network is TestNet
        // Select non-default network using URL parameters
        await (new SignTxnPage(page)).goto('en', '?network=betanet');
        await expect(page.getByRole('button', { name: 'BetaNet' })).toBeVisible();
      });

      test('uses network specified in URL parameter when there IS saved network',
      async ({ signTxnPage, page }) => {
        // NOTE: Assuming that the default network is TestNet

        // Select MainNet from node selection menu so node configuration is stored in local storage
        await page.getByRole('button', { name: 'TestNet' }).click();
        await page.getByText('MainNet', { exact: true }).click(); // Menu item
        // Make sure switching networks works
        await expect(page.getByText('MainNet')).toHaveCount(2);
        // Select non-default network using URL parameter
        await (new SignTxnPage(page)).goto('en',`${presetURLParam}&network=betanet`);
        await expect(page.getByText('BetaNet')).toHaveCount(2);
      });

      test('removes URL parameter if network is manually set', async ({ signTxnPage, page }) => {
        // NOTE: Assuming that the default network is TestNet

        // Select MainNet from node selection menu so node configuration is stored in local storage
        const testnetButton = page.getByRole('button', { name: 'TestNet' });
        await testnetButton.click();
        await page.getByText('MainNet', { exact: true }).click(); // Menu item

        // Select non-default network using URL parameter
        await (new SignTxnPage(page)).goto('en', '?network=betanet');
        const betanetButton = page.getByRole('button', { name: 'BetaNet' });
        await expect(betanetButton).toBeVisible();

        // Select TestNet from node selection menu
        await betanetButton.click();
        await page.getByText('TestNet', { exact: true }).click(); // Menu item

        // Check for correct URL by waiting for it
        await page.waitForURL(SignTxnPage.getFullUrl('en'));
        await expect(testnetButton).toBeVisible();
      });
    });

  });

});
