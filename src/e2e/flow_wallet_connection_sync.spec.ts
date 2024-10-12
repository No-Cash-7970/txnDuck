import { test, expect } from '@playwright/test';
import { ComposeTxnPage, HomePage } from './pageModels';

test.slow();

// Test whether the wallet connection status syncs across pages
test.skip('Flow — Connecting & disconnecting wallet across pages', async ({ page }) => {
  const settingsBtn = page.getByRole('button', { name: 'Settings' });

  // When a prompt dialog appears, enter the mnemonic when the prompt appears
  page.on('dialog', dialog => dialog.accept(
    // eslint-disable-next-line max-len
    'sugar bronze century excuse animal jacket what rail biology symbol want craft annual soul increase question army win execute slim girl chief exhaust abstract wink'
  ));

  /*===============================*/
  /*========== Home page ==========*/
  /*===============================*/

  await (new HomePage(page)).goto();

  /* 0. Initial checks */

  // Open settings dialog
  await settingsBtn.click();

  // Check wallet is not connected in settings
  const notConnectedWalletStatus = page.getByText('No wallet connected.');
  await expect(notConnectedWalletStatus).toBeVisible();

  /* 1. Connect to wallet */

  // Trigger dropdown for connecting wallet
  const connectWalletBtn = page.getByRole('button', { name: 'Connect wallet' });
  await connectWalletBtn.click();

  // Choose mnemonic wallet and enter the mnemonic when the prompt appears
  await page.getByText('Mnemonic', { exact: true }).click();

  // Check wallet is connected
  const walletAccountAddr = page.getByText(
    'Account: 3F3FPW6ZQQYD6JDC7FKKQHNGVVUIBIZOUI5WPSJEHBRABZDRN6LOTBMFEY'
  );
  await expect(walletAccountAddr).toBeVisible();
  await expect(notConnectedWalletStatus).not.toBeVisible();

  /* 2. Disconnect wallet */

  // Disconnect the wallet
  const disconnectWalletBtn = page.getByRole('button', { name: 'Disconnect wallet' });
  await disconnectWalletBtn.click();

  // Check wallet is disconnected
  await expect(notConnectedWalletStatus).toBeVisible();
  await expect(walletAccountAddr ).not.toBeVisible();

  /* 3. Reconnect wallet */

  // Trigger dropdown for connecting wallet
  await connectWalletBtn.click();

  // Choose mnemonic wallet and enter the mnemonic when the prompt appears
  await page.getByText('Mnemonic', { exact: true }).click();

  // Check wallet is connected
  await expect(walletAccountAddr).toBeVisible();

  /*=========================================================*/
  /*========== Compose Transaction page (1st time) ==========*/
  /*=========================================================*/

  // Go to compose-transaction page
  await (new ComposeTxnPage(page)).goto('en', '?preset=transfer&amt=0');

  /* 0. Initial checks */

  // Check if there are buttons for setting the Sender and Receiver fields to the connected wallet
  // address
  const fieldSetToAddrBtn = page.getByRole('button', { name: 'Set this to connected address' });
  await expect(fieldSetToAddrBtn).toHaveCount(2);
  await expect(walletAccountAddr).toHaveCount(2);
  await expect(disconnectWalletBtn).toHaveCount(2);

  // Check wallet is connected in settings
  await settingsBtn.click(); // Open settings dialog
  await expect(walletAccountAddr).toHaveCount(3);
  await expect(notConnectedWalletStatus).not.toBeVisible();

  // Close the settings dialog
  const settingsCloseBtn = page.getByTitle('Close');
  await settingsCloseBtn.click();

  /* 1. Set fields to connected wallet address */

  // Set Sender field using connected wallet
  await fieldSetToAddrBtn.first().click();
  const senderField = page.getByLabel('Sender*');
  await expect(senderField)
    .toHaveValue('3F3FPW6ZQQYD6JDC7FKKQHNGVVUIBIZOUI5WPSJEHBRABZDRN6LOTBMFEY');

  // Set Receiver field using connected wallet
  await fieldSetToAddrBtn.nth(1).click();
  const receiverField = page.getByLabel('Receiver*');
  await expect(receiverField)
    .toHaveValue('3F3FPW6ZQQYD6JDC7FKKQHNGVVUIBIZOUI5WPSJEHBRABZDRN6LOTBMFEY');

  /* 2. Disconnect wallet in the form */

  // Disconnect wallet using "disconnect" button with the Receiver field
  await disconnectWalletBtn.nth(1).click();

  // Check Sender & Receiver fields are disconnected
  await expect(connectWalletBtn).toHaveCount(2);

  // Check Sender & Receiver fields kept their values
  await expect(senderField)
    .toHaveValue('3F3FPW6ZQQYD6JDC7FKKQHNGVVUIBIZOUI5WPSJEHBRABZDRN6LOTBMFEY');
  await expect(receiverField)
    .toHaveValue('3F3FPW6ZQQYD6JDC7FKKQHNGVVUIBIZOUI5WPSJEHBRABZDRN6LOTBMFEY');

  // Check wallet is disconnected in the settings
  await settingsBtn.click(); // Open settings dialog
  await expect(notConnectedWalletStatus).toBeVisible();
  await expect(connectWalletBtn).toHaveCount(3);
  await settingsCloseBtn.click(); // Close the settings dialog

  /* 3. Reconnect wallet in the form */

  // Reconnect wallet using "disconnect" button with the Sender field
  await connectWalletBtn.first().click();
  await page.getByRole('button', { name: 'Use Mnemonic' }).click();

  // Check wallet is connected in the form
  await expect(fieldSetToAddrBtn).toHaveCount(2);
  await expect(walletAccountAddr).toHaveCount(2);
  await expect(disconnectWalletBtn).toHaveCount(2);

  // Check wallet is connected in settings
  await settingsBtn.click(); // Open settings dialog
  await expect(walletAccountAddr).toHaveCount(3);
  await expect(notConnectedWalletStatus).not.toBeVisible();

  /* 4. Disconnect wallet in the settings */

  // Disconnect the wallet
  const settingsDialog = page.getByRole('dialog');
  await settingsDialog.getByRole('button', { name: 'Disconnect wallet' }).click();

  // Check wallet is disconnected in both the form and the settings
  await expect(connectWalletBtn).toHaveCount(3);
  await settingsCloseBtn.click(); // Close the settings dialog

  /* 5. Submit form */

  // Submit form to go to sign-transaction page
  await page.getByRole('button', { name: 'Review & sign' }).click();

  /*======================================================*/
  /*========== Sign Transaction page (1st time) ==========*/
  /*======================================================*/

  /* 0. Initial checks */

  // Check wallet is disconnected & connect button on the page
  await expect(connectWalletBtn).toHaveCount(1);

  // Check wallet is disconnected in settings
  await settingsBtn.click(); // Open settings dialog
  await expect(connectWalletBtn).toHaveCount(2);
  await expect(notConnectedWalletStatus).toBeVisible();
  await settingsCloseBtn.click(); // Close the settings dialog

  /* 1. Refresh page */

  // Refresh page to reset the settings dialog and the state of other things.
  await page.reload();

  // Check wallet is disconnected & connect button on the page
  await expect(connectWalletBtn).toBeVisible();

  /* 2. Connect wallet */

  await connectWalletBtn.click(); // Open wallet dialog
  await page.getByRole('button', { name: 'Use mnemonic' }).click();

  // Check wallet is connected & sign button is there
  await expect(page.getByRole('button', { name: 'Sign this transaction' })).toBeVisible();
  await expect(walletAccountAddr).toBeVisible();
  await expect(disconnectWalletBtn).toBeVisible();

  // Check wallet is connected in settings
  await settingsBtn.click(); // Open settings dialog
  await expect(walletAccountAddr).toHaveCount(2);
  await expect(notConnectedWalletStatus).not.toBeVisible();
  await settingsCloseBtn.click(); // Close the settings dialog

  /* 3. Refresh page */

  // Refresh page to reset the settings dialog and the state of other things.
  await page.reload();
  // Check wallet is disconnected & connect button on the page
  await expect(connectWalletBtn).toHaveCount(1);

  /* 4. Go back */

  // Click button to go back to compose page
  await page.locator('div').filter({ hasText: /^Compose$/ }).getByRole('link').click();

  /*=========================================================*/
  /*========== Compose Transaction page (2nd time) ==========*/
  /*=========================================================*/

  /* 0. Initial checks */

  // Check Sender & Receiver fields kept their values
  await expect(senderField)
    .toHaveValue('3F3FPW6ZQQYD6JDC7FKKQHNGVVUIBIZOUI5WPSJEHBRABZDRN6LOTBMFEY');
  await expect(receiverField)
    .toHaveValue('3F3FPW6ZQQYD6JDC7FKKQHNGVVUIBIZOUI5WPSJEHBRABZDRN6LOTBMFEY');

  // Check wallet is connected in the form
  await expect(fieldSetToAddrBtn).toHaveCount(2);
  await expect(walletAccountAddr).toHaveCount(2);
  await expect(disconnectWalletBtn).toHaveCount(2);

  // Check wallet is connected in settings
  await settingsBtn.click(); // Open settings dialog
  await expect(walletAccountAddr).toHaveCount(3);
  await settingsCloseBtn.click(); // Close the settings dialog

  /* 1. Refresh page */

  // Refresh page to reset the settings dialog and the state of other things.
  await page.reload();

  /* 2. Submit form again */

  // Submit to go to sign page again
  await page.getByRole('button', { name: 'Review & sign' }).click();

  /*======================================================*/
  /*========== Sign Transaction page (2nd time) ==========*/
  /*======================================================*/

  /* 0. Initial checks */

  // Check wallet is connected & sign button is there
  await expect(page.getByRole('button', { name: 'Sign this transaction' })).toBeVisible();
  await expect(walletAccountAddr).toBeVisible();
  await expect(disconnectWalletBtn).toBeVisible();

  // Check wallet is connected in settings
  await settingsBtn.click(); // Open settings dialog
  await expect(walletAccountAddr).toHaveCount(2);
  await settingsCloseBtn.click(); // Close the settings dialog

  /* 1. Disconnect wallet */

  // Disconnect wallet
  await disconnectWalletBtn.click();

  // Check wallet is disconnected & connect button is there
  await expect(connectWalletBtn).toBeVisible();

  // Check wallet is disconnected in settings
  await settingsBtn.click(); // Open settings dialog
  await expect(connectWalletBtn).toHaveCount(2);
  await expect(notConnectedWalletStatus).toBeVisible();
  await settingsCloseBtn.click(); // Close the settings dialog

  /* 2. Refresh page */

  // Refresh page to reset the settings dialog and the state of other things.
  await page.reload();

  // Check wallet is disconnected & connect button is there
  await expect(connectWalletBtn).toBeVisible();

  // Check wallet is disconnected in settings
  await settingsBtn.click(); // Open settings dialog
  await expect(connectWalletBtn).toHaveCount(2);
  await expect(notConnectedWalletStatus).toBeVisible();
  await settingsCloseBtn.click(); // Close the settings dialog
});
