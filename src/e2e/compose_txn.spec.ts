import { test as base, expect } from '@playwright/test';
import { NavBarComponent as NavBar } from './shared/NavBarComponent';
import { LanguageSupport } from './shared/LanguageSupport';
import { ComposeTxnPage } from './pageModels/ComposeTxnPage';
import { HomePage } from './pageModels/HomePage';
import { TxnPresetsPage } from './pageModels/TxnPresetsPage';

// Extend basic test by providing a "composeTxnPage" fixture.
// Code adapted from https://playwright.dev/docs/pom
const test = base.extend<{ composeTxnPage: ComposeTxnPage }>({
  composeTxnPage: async ({ page }, use) => {
    // Set up the fixture.
    const composeTxnPage = new ComposeTxnPage(page);
    await composeTxnPage.goto();
    // Use the fixture value in the test.
    await use(composeTxnPage);
  },
});

// Asset data for USDC token. Used to mock requests for USDC asset data. This is the exact asset
// data for USDC on MainNet as of August 2024. Using the exact data makes the mock as close to what
// would happen in production as much as possible.
const usdcAssetData = {
  index: 31566704,
  params: {
    creator: "2UEQTE5QDNXPI7M3TU44G6SYKLFWLPQO7EBZM7K7MHMQQMFI4QJPLHQFHM",
    decimals: 6,
    "default-frozen": false,
    freeze: "3ERES6JFBIJ7ZPNVQJNH2LETCBQWUPGTO4ROA6VFUR25WFSYKGX3WBO5GE",
    manager: "37XL3M57AXBUJARWMT5R7M35OERXMH3Q22JMMEFLBYNDXXADGFN625HAL4",
    name: "USDC",
    "name-b64": "VVNEQw==",
    reserve: "2UEQTE5QDNXPI7M3TU44G6SYKLFWLPQO7EBZM7K7MHMQQMFI4QJPLHQFHM",
    total: 18446744073709551615,
    "unit-name": "USDC",
    "unit-name-b64": "VVNEQw==",
    url: "https://www.centre.io/usdc",
    "url-b64":"aHR0cHM6Ly93d3cuY2VudHJlLmlvL3VzZGM="
  }
};

test.describe('Compose Transaction Page', () => {

  test('has footer', async ({ composeTxnPage /* Adding this loads the page */, page }) => {
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });

  test('has link to presets page', async ({ composeTxnPage, page }) => {
    await page.getByText(/Choose preset/).click();
    await expect(page).toHaveURL(TxnPresetsPage.getFullUrl());
  });

  test('uses the default "Automatically set fee" value set in the settings',
  async ({ page }) => {
    test.slow();

    // Change setting when on the home page
    await (new HomePage(page)).goto();
    await page.getByRole('button', { name: 'Settings' }).click();
    await page.getByLabel('Set fee automatically by default')
      .click(); // Switch to "off"

    // Go to "Compose Transaction" page
    await (new ComposeTxnPage(page)).goto();
    const useSugSetting = page.getByLabel('Set fee automatically by default');
    const useSugField = page.getByLabel('Automatically set the fee');

    // Check if the field on the "Compose Transaction" page has the correct default value
    await expect(useSugField).not.toBeChecked();
    await page.getByRole('button', { name: 'Settings' }).click();
    await expect(useSugSetting).not.toBeChecked();

    // Change the setting again, but we are on the "Compose Transaction" page this time
    await useSugSetting.click(); // Switch to "on"
    await page.getByTitle('Close').click(); // Close the settings dialog
    // Expect current value of the field on "Compose Transaction" page to change ("off" --> "on")
    // because the field was never touched
    await expect(useSugField).toBeChecked();

    // Touch the field by changing the value in "Compose Transaction" page
    await useSugField.click(); // Switch to "off"
    await page.getByRole('button', { name: 'Settings' }).click();
    await useSugSetting.click(); // Switch to "off"
    await useSugSetting.click(); // Switch to "on" again
    await page.getByTitle('Close').click(); // Close the settings dialog
    // Expect current value of the field on "Compose Transaction" page to remain unchanged
    await expect(useSugField).not.toBeChecked();

    // Refresh the "Compose Transaction" page to see if the form has the new default value
    await page.reload();
    await expect(useSugField).toBeChecked();
  });

  test('uses the default "Automatically set valid rounds" value set in the settings',
  async ({ page }) => {
    test.slow();

    // Change setting when on the home page
    await (new HomePage(page)).goto();
    await page.getByRole('button', { name: 'Settings' }).click();
    await page.getByLabel('Set valid rounds automatically by default')
      .click(); // Switch to "off"

    // Go to "Compose Transaction" page
    await (new ComposeTxnPage(page)).goto();
    const useSugSetting = page.getByLabel('Set valid rounds automatically by default');
    const useSugField = page.getByLabel('Automatically set valid rounds');

    // Check if the field on the "Compose Transaction" page has the correct default value
    await expect(useSugField).not.toBeChecked();
    await page.getByRole('button', { name: 'Settings' }).click();
    await expect(useSugSetting).not.toBeChecked();

    // Change the setting again, but we are on the "Compose Transaction" page this time
    await useSugSetting.click(); // Switch to "on"
    await page.getByTitle('Close').click(); // Close the settings dialog
    // Expect current value of the field on "Compose Transaction" page to change ("off" --> "on")
    // because the field was never touched
    await expect(useSugField).toBeChecked();

    // Touch the field by changing the value in "Compose Transaction" page
    await useSugField.click(); // Switch to "off"
    await page.getByRole('button', { name: 'Settings' }).click();
    await useSugSetting.click(); // Switch to "off"
    await useSugSetting.click(); // Switch to "on" again
    await page.getByTitle('Close').click(); // Close the settings dialog
    // Expect current value of the field on "Compose Transaction" page to remain unchanged
    await expect(useSugField).not.toBeChecked();

    // Refresh the "Compose Transaction" page to see if the form has the new default value
    await page.reload();
    await expect(useSugField).toBeChecked();
  });

  test('uses the "manager address to the sender address by default" value set in the settings',
  async ({ page }) => {
    test.slow();

    // Change setting when on the home page
    await (new HomePage(page)).goto();
    await page.getByRole('button', { name: 'Settings' }).click();
    await page.getByLabel('Set the manager address to the sender address by default')
      .click(); // Switch to "off"

    // Go to "Compose Transaction" page
    await (new ComposeTxnPage(page)).goto();
    const useSenderSetting = page.getByLabel(
      'Set the manager address to the sender address by default'
    );
    const useSenderField = page.getByLabel('Set the manager address to the sender address');

    // Check if the field on the "Compose Transaction" page has the correct default value
    await page.getByLabel(/Transaction type/).selectOption('acfg');
    await expect(useSenderField).not.toBeChecked();
    await page.getByRole('button', { name: 'Settings' }).click();
    await expect(useSenderSetting).not.toBeChecked();

    // Change the setting again, but we are on the "Compose Transaction" page this time
    await useSenderSetting.click(); // Switch to "on"
    await page.getByTitle('Close').click(); // Close the settings dialog
    // Expect current value of the field on "Compose Transaction" page to change ("off" --> "on")
    // because the field was never touched
    await expect(useSenderField).toBeChecked();

    // Touch the field by changing the value in "Compose Transaction" page
    await useSenderField.click(); // Switch to "off"
    await page.getByRole('button', { name: 'Settings' }).click();
    await useSenderSetting.click(); // Switch to "off"
    await useSenderSetting.click(); // Switch to "on" again
    await page.getByTitle('Close').click(); // Close the settings dialog
    // Expect current value of the field on "Compose Transaction" page to remain unchanged
    await expect(useSenderField).not.toBeChecked();

    // Refresh the "Compose Transaction" page to see if the form has the new default value
    await page.reload();
    await page.getByLabel(/Transaction type/).selectOption('acfg');
    await expect(useSenderField).toBeChecked();
  });

  test('uses the "freeze address to the sender address by default" value set in the settings',
  async ({ page }) => {
    test.slow();

    // Change setting when on the home page
    await (new HomePage(page)).goto();
    await page.getByRole('button', { name: 'Settings' }).click();
    await page.getByLabel('Set the freeze address to the sender address by default')
      .click(); // Switch to "off"

    // Go to "Compose Transaction" page
    await (new ComposeTxnPage(page)).goto();
    const useSenderSetting = page.getByLabel(
      'Set the freeze address to the sender address by default'
    );
    const useSenderField = page.getByLabel('Set the freeze address to the sender address');

    // Check if the field on the "Compose Transaction" page has the correct default value
    await page.getByLabel(/Transaction type/).selectOption('acfg');
    await expect(useSenderField).not.toBeChecked();
    await page.getByRole('button', { name: 'Settings' }).click();
    await expect(useSenderSetting).not.toBeChecked();

    // Change the setting again, but we are on the "Compose Transaction" page this time
    await useSenderSetting.click(); // Switch to "on"
    await page.getByTitle('Close').click(); // Close the settings dialog
    // Expect current value of the field on "Compose Transaction" page to change ("off" --> "on")
    // because the field was never touched
    await expect(useSenderField).toBeChecked();

    // Touch the field by changing the value in "Compose Transaction" page
    await useSenderField.click(); // Switch to "off"
    await page.getByRole('button', { name: 'Settings' }).click();
    await useSenderSetting.click(); // Switch to "off"
    await useSenderSetting.click(); // Switch to "on" again
    await page.getByTitle('Close').click(); // Close the settings dialog
    // Expect current value of the field on "Compose Transaction" page to remain unchanged
    await expect(useSenderField).not.toBeChecked();

    // Refresh the "Compose Transaction" page to see if the form has the new default value
    await page.reload();
    await page.getByLabel(/Transaction type/).selectOption('acfg');
    await expect(useSenderField).toBeChecked();
  });

  test('uses the "clawback address to the sender address by default" value set in the settings',
  async ({ page }) => {
    test.slow();

    // Change setting when on the home page
    await (new HomePage(page)).goto();
    await page.getByRole('button', { name: 'Settings' }).click();
    await page.getByLabel('Set the clawback address to the sender address by default')
      .click(); // Switch to "off"

    // Go to "Compose Transaction" page
    await (new ComposeTxnPage(page)).goto();
    const useSenderSetting = page.getByLabel(
      'Set the clawback address to the sender address by default'
    );
    const useSenderField = page.getByLabel('Set the clawback address to the sender address');

    // Check if the field on the "Compose Transaction" page has the correct default value
    await page.getByLabel(/Transaction type/).selectOption('acfg');
    await expect(useSenderField).not.toBeChecked();
    await page.getByRole('button', { name: 'Settings' }).click();
    await expect(useSenderSetting).not.toBeChecked();

    // Change the setting again, but we are on the "Compose Transaction" page this time
    await useSenderSetting.click(); // Switch to "on"
    await page.getByTitle('Close').click(); // Close the settings dialog
    // Expect current value of the field on "Compose Transaction" page to change ("off" --> "on")
    // because the field was never touched
    await expect(useSenderField).toBeChecked();

    // Touch the field by changing the value in "Compose Transaction" page
    await useSenderField.click(); // Switch to "off"
    await page.getByRole('button', { name: 'Settings' }).click();
    await useSenderSetting.click(); // Switch to "off"
    await useSenderSetting.click(); // Switch to "on" again
    await page.getByTitle('Close').click(); // Close the settings dialog
    // Expect current value of the field on "Compose Transaction" page to remain unchanged
    await expect(useSenderField).not.toBeChecked();

    // Refresh the "Compose Transaction" page to see if the form has the new default value
    await page.reload();
    await page.getByLabel(/Transaction type/).selectOption('acfg');
    await expect(useSenderField).toBeChecked();
  });

  test('uses the "reserve address to the sender address by default" value set in the settings',
  async ({ page }) => {
    test.slow();

    // Change setting when on the home page
    await (new HomePage(page)).goto();
    await page.getByRole('button', { name: 'Settings' }).click();
    await page.getByLabel('Set the reserve address to the sender address by default')
      .click(); // Switch to "off"

    // Go to "Compose Transaction" page
    await (new ComposeTxnPage(page)).goto();
    const useSenderSetting = page.getByLabel(
      'Set the reserve address to the sender address by default'
    );
    const useSenderField = page.getByLabel('Set the reserve address to the sender address');

    // Check if the field on the "Compose Transaction" page has the correct default value
    await page.getByLabel(/Transaction type/).selectOption('acfg');
    await expect(useSenderField).not.toBeChecked();
    await page.getByRole('button', { name: 'Settings' }).click();
    await expect(useSenderSetting).not.toBeChecked();

    // Change the setting again, but we are on the "Compose Transaction" page this time
    await useSenderSetting.click(); // Switch to "on"
    await page.getByTitle('Close').click(); // Close the settings dialog
    // Expect current value of the field on "Compose Transaction" page to change ("off" --> "on")
    // because the field was never touched
    await expect(useSenderField).toBeChecked();

    // Touch the field by changing the value in "Compose Transaction" page
    await useSenderField.click(); // Switch to "off"
    await page.getByRole('button', { name: 'Settings' }).click();
    await useSenderSetting.click(); // Switch to "off"
    await useSenderSetting.click(); // Switch to "on" again
    await page.getByTitle('Close').click(); // Close the settings dialog
    // Expect current value of the field on "Compose Transaction" page to remain unchanged
    await expect(useSenderField).not.toBeChecked();

    // Refresh the "Compose Transaction" page to see if the form has the new default value
    await page.reload();
    await page.getByLabel(/Transaction type/).selectOption('acfg');
    await expect(useSenderField).toBeChecked();
  });

  test.describe('Language Support', () => {
    (new LanguageSupport({
      en: { body: /Compose/, title: /Compose/ },
      es: { body: /Componer/, title: /Componer/ },
    })).check(test, ComposeTxnPage.url);
  });

  test.describe('Nav Bar', () => {
    NavBar.check(test, ComposeTxnPage.getFullUrl());
  });

  test.describe('With URL Parameters', () => {

    test('fills in appropriate fields for setting up an Algo payment in a donation-like style',
    async ({ page }) => {
      // eslint-disable-next-line max-len
      const formUrlParams = 'rcv=OMFLGYWNFKRIZ6Y6STE5SW3WJJQHLIG6GY4DD3FJHQRAK6MY5YMVJ6FWTY&amt=1&note=A+small+tip+for+No-Cash-7970+%3A%29';

      await (new ComposeTxnPage(page)).goto('en', `?preset=transfer&${formUrlParams}`);
      // Check if using correct preset
      await expect(page.getByText('Transfer Algos')).toBeVisible();
      // Check fields
      await expect(page.getByLabel(/Sender/)).toHaveValue('');
      await expect(page.getByLabel(/Receiver/))
        .toHaveValue('OMFLGYWNFKRIZ6Y6STE5SW3WJJQHLIG6GY4DD3FJHQRAK6MY5YMVJ6FWTY');
      await expect(page.getByLabel(/Amount/)).toHaveValue('1');
      await expect(page.getByLabel('Note')).toHaveValue('A small tip for No-Cash-7970 :)');
      await expect(page.getByLabel('Base64 encoded data')).not.toBeChecked();
      await expect(page.getByLabel('Automatically set the fee')).toBeChecked();
      await expect(page.getByLabel('Automatically set valid rounds')).toBeChecked();
      // Check link to presets list page
      await expect(page.getByRole('link', { name: 'Choose Preset' }))
        .toHaveAttribute('href', `/en/txn?${formUrlParams}`);
    });

    test('fills in appropriate fields for setting up an asset payment in a donation-like style',
    async ({ page }) => {
      // eslint-disable-next-line max-len
      const formUrlParams = 'xaid=31566704&aamt=1&arcv=OMFLGYWNFKRIZ6Y6STE5SW3WJJQHLIG6GY4DD3FJHQRAK6MY5YMVJ6FWTY';

      // Mock the Algorand node call for asset data before navigating
      await page.route('*/**/v2/assets/31566704', async route => {
        await route.fulfill({ json: usdcAssetData });
      });

      await (new ComposeTxnPage(page)).goto('en', `?preset=asset_transfer&${formUrlParams}`);
      // Check if using correct preset
      await expect(page.getByText('Transfer asset')).toBeVisible();
      // Check fields
      await expect(page.getByLabel(/Sender/)).toHaveValue('');
      await expect(page.getByLabel(/Asset receiver/))
        .toHaveValue('OMFLGYWNFKRIZ6Y6STE5SW3WJJQHLIG6GY4DD3FJHQRAK6MY5YMVJ6FWTY');
      await expect(page.getByLabel(/Asset ID/)).toHaveValue('31566704');
      await expect(page.getByText('USDC')).toHaveCount(2); // Should display correct data for asset
      await expect(page.getByLabel(/Asset amount/)).toHaveValue('1');
      await expect(page.getByLabel('Note')).toHaveValue('');
      await expect(page.getByLabel('Base64 encoded data')).not.toBeChecked();
      await expect(page.getByLabel('Automatically set the fee')).toBeChecked();
      await expect(page.getByLabel('Automatically set valid rounds')).toBeChecked();
      // Check link to presets list page
      await expect(page.getByRole('link', { name: 'Choose Preset' }))
        .toHaveAttribute('href', `/en/txn?${formUrlParams}`);
    });

    test('fills in appropriate fields for asset payment with specified fee', async ({ page }) => {
      // eslint-disable-next-line max-len
      const formUrlParams = 'xaid=31566704&aamt=1&fee=.001';

      // Mock the Algorand node call for asset data before navigating
      await page.route('*/**/v2/assets/31566704', async route => {
        await route.fulfill({ json: usdcAssetData });
      });

      await (new ComposeTxnPage(page)).goto('en', `?preset=asset_transfer&${formUrlParams}`);
      // Check if using correct preset
      await expect(page.getByText('Transfer asset')).toBeVisible();
      // Check fields
      await expect(page.getByLabel(/Sender/)).toHaveValue('');
      await expect(page.getByLabel(/Asset receiver/)).toHaveValue('');
      await expect(page.getByLabel(/Asset ID/)).toHaveValue('31566704');
      await expect(page.getByText('USDC')).toHaveCount(2); // Should display correct data for asset
      await expect(page.getByLabel(/Asset amount/)).toHaveValue('1');
      await expect(page.getByLabel('Note')).toHaveValue('');
      await expect(page.getByLabel('Base64 encoded data')).not.toBeChecked();
      await expect(page.getByLabel('Automatically set the fee')).not.toBeChecked();
      await expect(page.getByLabel(/Fee/)).toHaveValue('0.001');
      await expect(page.getByLabel('Automatically set valid rounds')).toBeChecked();
      // Check link to presets list page
      await expect(page.getByRole('link', { name: 'Choose Preset' }))
        .toHaveAttribute('href', `/en/txn?${formUrlParams}`);
    });

    test('fills in appropriate fields for opting into an asset', async ({ page }) => {
      // eslint-disable-next-line max-len
      const formUrlParams = 'xaid=31566704&snd=7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M';

      // Mock the Algorand node call for asset data before navigating
      await page.route('*/**/v2/assets/31566704', async route => {
        await route.fulfill({ json: usdcAssetData });
      });

      await (new ComposeTxnPage(page)).goto('en', `?preset=asset_opt_in&${formUrlParams}`);
      // Check if using correct preset
      await expect(page.getByText('Opt into asset')).toBeVisible();
      // Check fields
      await expect(page.getByLabel(/Sender/))
        .toHaveValue('7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M');
      await expect(page.getByLabel(/Asset ID/)).toHaveValue('31566704');
      await expect(page.getByText('USDC')).toHaveCount(1); // Should display correct data for asset
      await expect(page.getByLabel('Note')).toHaveValue('');
      await expect(page.getByLabel('Base64 encoded data')).not.toBeChecked();
      await expect(page.getByLabel('Automatically set the fee')).toBeChecked();
      await expect(page.getByLabel('Automatically set valid rounds')).toBeChecked();
      // Check link to presets list page
      await expect(page.getByRole('link', { name: 'Choose Preset' }))
        .toHaveAttribute('href', `/en/txn?${formUrlParams}`);
    });

    test('fills in appropriate fields for closing an account', async ({ page }) => {
      // eslint-disable-next-line max-len
      const formUrlParams = 'snd=7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M';

      await (new ComposeTxnPage(page)).goto('en', `?preset=close_account&${formUrlParams}`);
      // Check if using correct preset
      await expect(page.getByText('Close account')).toBeVisible();
      // Check fields
      await expect(page.getByLabel(/Sender/))
        .toHaveValue('7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M');
      await expect(page.getByLabel(/Close remainder to/)).toHaveValue('');
      await expect(page.getByLabel('Note')).toHaveValue('');
      await expect(page.getByLabel('Base64 encoded data')).not.toBeChecked();
      await expect(page.getByLabel('Automatically set the fee')).toBeChecked();
      await expect(page.getByLabel('Automatically set valid rounds')).toBeChecked();
      // Check link to presets list page
      await expect(page.getByRole('link', { name: 'Choose Preset' }))
        .toHaveAttribute('href', `/en/txn?${formUrlParams}`);
    });

    test('fills in appropriate fields for registering an account online', async ({ page }) => {
      // eslint-disable-next-line max-len
      const formUrlParams = 'snd=MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4&votekey=87iBW46PP4BpTDz6%2BIEGvxY6JqEaOtV0g%2BVWcJqoqtc%3D&selkey=1V2BE2lbFvS937H7pJebN0zxkqe1Nrv%2BaVHDTPbYRlw%3D&sprfkey=f0CYOA4yXovNBFMFX%2B1I%2FtYVBaAl7VN6e0Ki5yZA3H6jGqsU%2FLYHNaBkMQ%2FrN4M4F3UmNcpaTmbVbq%2BGgDsrhQ%3D%3D&votefst=16532750&votelst=19532750&votekd=1732';

      await (new ComposeTxnPage(page)).goto('en', `?preset=reg_online&${formUrlParams}`);
      // Check if using correct preset
      await expect(page.getByText('Register account online')).toBeVisible();
      // Check fields
      await expect(page.getByLabel(/Sender/))
        .toHaveValue('MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4');
      await expect(page.getByLabel(/Voting key/).first())
        .toHaveValue('87iBW46PP4BpTDz6+IEGvxY6JqEaOtV0g+VWcJqoqtc=');
      await expect(page.getByLabel(/Selection key/))
        .toHaveValue('1V2BE2lbFvS937H7pJebN0zxkqe1Nrv+aVHDTPbYRlw=');
      await expect(page.getByLabel(/State proof key/))
        // eslint-disable-next-line max-len
        .toHaveValue('f0CYOA4yXovNBFMFX+1I/tYVBaAl7VN6e0Ki5yZA3H6jGqsU/LYHNaBkMQ/rN4M4F3UmNcpaTmbVbq+GgDsrhQ==');
      await expect(page.getByLabel(/First voting round/)).toHaveValue('16532750');
      await expect(page.getByLabel(/Last voting round/)).toHaveValue('19532750');
      await expect(page.getByLabel(/Voting key dilution/)).toHaveValue('1732');
      await expect(page.getByLabel('Note')).toHaveValue('');
      await expect(page.getByLabel('Base64 encoded data')).not.toBeChecked();
      await expect(page.getByLabel('Automatically set the fee')).toBeChecked();
      await expect(page.getByLabel('Automatically set valid rounds')).toBeChecked();
      // Check link to presets list page
      await expect(page.getByRole('link', { name: 'Choose Preset' }))
        .toHaveAttribute('href', `/en/txn?${formUrlParams}`);
    });

    test('fills in appropriate fields for registering an account offline', async ({ page }) => {
      // eslint-disable-next-line max-len
      const formUrlParams = 'snd=MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4';

      await (new ComposeTxnPage(page)).goto('en', `?preset=reg_offline&${formUrlParams}`);
      // Check if using correct preset
      await expect(page.getByText('Register account offline')).toBeVisible();
      // Check fields
      await expect(page.getByLabel(/Sender/))
        .toHaveValue('MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4');
      await expect(page.getByLabel('Note')).toHaveValue('');
      await expect(page.getByLabel('Base64 encoded data')).not.toBeChecked();
      await expect(page.getByLabel('Automatically set the fee')).toBeChecked();
      await expect(page.getByLabel('Automatically set valid rounds')).toBeChecked();
      // Check link to presets list page
      await expect(page.getByRole('link', { name: 'Choose Preset' }))
        .toHaveAttribute('href', `/en/txn?${formUrlParams}`);
    });

    test('fills in appropriate fields when the only the first valid round is set',
    async ({ page }) => {
      const formUrlParams = 'fv=41922740';

      await (new ComposeTxnPage(page)).goto('en', `?preset=transfer&${formUrlParams}`);
      // Check if using correct preset
      await expect(page.getByText('Transfer Algos')).toBeVisible();
      // Check fields
      await expect(page.getByLabel(/Sender/)).toHaveValue('');
      await expect(page.getByLabel(/Receiver/))
        .toHaveValue('');
      await expect(page.getByLabel(/Amount/)).toHaveValue('');
      await expect(page.getByLabel('Note')).toHaveValue('');
      await expect(page.getByLabel('Base64 encoded data')).not.toBeChecked();
      await expect(page.getByLabel('Automatically set the fee')).toBeChecked();
      await expect(page.getByLabel('Automatically set valid rounds')).not.toBeChecked();
      await expect(page.getByLabel(/first valid round/)).toHaveValue('41922740');
      await expect(page.getByLabel(/last valid round/)).toHaveValue('41923740');
      // Check link to presets list page
      await expect(page.getByRole('link', { name: 'Choose Preset' }))
        .toHaveAttribute('href', `/en/txn?${formUrlParams}`);
    });

    test('fills in appropriate fields when both the first and last valid rounds are set',
    async ({ page }) => {
      const formUrlParams = 'fv=41922740&lv=';

      await (new ComposeTxnPage(page)).goto('en', `?preset=transfer&${formUrlParams}`);
      // Check if using correct preset
      await expect(page.getByText('Transfer Algos')).toBeVisible();
      // Check fields
      await expect(page.getByLabel(/Sender/)).toHaveValue('');
      await expect(page.getByLabel(/Receiver/))
        .toHaveValue('');
      await expect(page.getByLabel(/Amount/)).toHaveValue('');
      await expect(page.getByLabel('Note')).toHaveValue('');
      await expect(page.getByLabel('Base64 encoded data')).not.toBeChecked();
      await expect(page.getByLabel('Automatically set the fee')).toBeChecked();
      await expect(page.getByLabel('Automatically set valid rounds')).not.toBeChecked();
      await expect(page.getByLabel(/first valid round/)).toHaveValue('41922740');
      await expect(page.getByLabel(/last valid round/)).toHaveValue('');
      // Check link to presets list page
      await expect(page.getByRole('link', { name: 'Choose Preset' }))
        .toHaveAttribute('href', `/en/txn?${formUrlParams}`);
    });

    test('fills in appropriate fields for gracefully opting out of an application',
    async ({ page }) => {
      // eslint-disable-next-line max-len
      const formUrlParams = 'apid=1284326447&snd=7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M';

      await (new ComposeTxnPage(page)).goto('en', `?preset=app_close&${formUrlParams}`);
      // Check if using correct preset
      await expect(page.getByText('Close out application')).toBeVisible();
      // Check fields
      await expect(page.getByLabel(/Sender/))
        .toHaveValue('7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M');
      await expect(page.getByLabel(/Application ID/)).toHaveValue('1284326447');
      await expect(page.getByLabel('Note')).toHaveValue('');
      await expect(page.getByLabel('Base64 encoded data')).not.toBeChecked();
      await expect(page.getByLabel('Automatically set the fee')).toBeChecked();
      await expect(page.getByLabel('Automatically set valid rounds')).toBeChecked();
      // Check link to presets list page
      await expect(page.getByRole('link', { name: 'Choose Preset' }))
        .toHaveAttribute('href', `/en/txn?${formUrlParams}`);
    });

  });

});
