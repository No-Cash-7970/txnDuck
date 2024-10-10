import { test as base, expect, type Page } from '@playwright/test';
import { HomePage } from './pageModels';
import { mockNodeResponses } from './shared/NodeTestResponses';

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

test.slow();

// Run through the entire normal flow of creating and sending a single transaction.
test.skip('Flow — Single transaction', async ({ homePage, page }) => {
  await mockNodeResponses(page);

  /*===== Home page =====*/

  // Switch node network: TestNet -> BetaNet
  await page.getByRole('button', { name: 'TestNet' }).click();
  await page.getByText('BetaNet', { exact: true }).click();
  await expect(page.getByRole('button', { name: 'BetaNet' })).toBeVisible();

  // Click start button to go to the transaction-presets page
  await homePage.startBtn.click();

  /*===== Transaction Presets page =====*/

  // Click "Transfer Algos" button to go to the compose-transaction page
  await page.getByRole('link', { name: 'Transfer Algos' }).click();

  /*===== Compose Transaction page =====*/

  // Fill out form
  await page.getByLabel('Sender*').click();
  await page.getByLabel('Sender*')
    .fill('3F3FPW6ZQQYD6JDC7FKKQHNGVVUIBIZOUI5WPSJEHBRABZDRN6LOTBMFEY');
  await page.getByLabel('Receiver*').click();
  await page.getByLabel('Receiver*')
    .fill('3F3FPW6ZQQYD6JDC7FKKQHNGVVUIBIZOUI5WPSJEHBRABZDRN6LOTBMFEY');
  await page.getByLabel('Amount*').click();
  await page.getByLabel('Amount*').fill('0');
  // Submit form to go to sign-transaction page
  await page.getByRole('button', { name: 'Review & sign' }).click();

  /*===== Sign Transaction page =====*/

  // Check if the right data is in table
  await checkSignTxnDataTable(page);

  // Trigger dialog for connecting wallet
  await page.getByRole('button', { name: 'Connect wallet' }).click();

  // Choose mnemonic wallet and enter the mnemonic when the prompt appears
  page.on('dialog', dialog => dialog.accept(
    // eslint-disable-next-line max-len
    'sugar bronze century excuse animal jacket what rail biology symbol want craft annual soul increase question army win execute slim girl chief exhaust abstract wink'
  ));
  await page.getByRole('button', { name: 'Use mnemonic' }).click();

  // Reload page to check if data and sign button are still there
  page.reload();
  await checkSignTxnDataTable(page);
  await expect(page.getByRole('button', { name: 'Sign this transaction' })).toBeVisible();

  // Sign transaction and go to send page
  await page.getByRole('button', { name: 'Sign this transaction' }).click();

  /*===== Send Transaction page =====*/

  // See if transaction succeeded
  await expect(page.getByText('Transaction confirmed!')).toBeVisible();
  await expect(page.getByText('NC63ESPZOQI6P6DSVZWG5K2FJFFKI3VAZITE5KRW5SV5GXQDIXMA'))
    .toBeVisible();

  // Click "Done" to go back to home page
  await page.getByRole('link', { name: 'Done!' }).click();
  await expect(page).toHaveURL(HomePage.getFullUrl());
});

async function checkSignTxnDataTable(page: Page) {
  await expect(page.getByRole('row', { name: 'Node network' }).getByRole('cell'))
      .toHaveText('BetaNet');
  await expect(page.getByRole('row', { name: 'Transaction type' }).getByRole('cell'))
    .toHaveText('Payment');
  await expect(page.getByRole('row', { name: 'Sender' }).getByRole('cell'))
    .toHaveText('3F3FPW6ZQQYD6JDC7FKKQHNGVVUIBIZOUI5WPSJEHBRABZDRN6LOTBMFEY');
  await expect(page.getByRole('row', { name: 'Receiver' }).getByRole('cell'))
    .toHaveText('3F3FPW6ZQQYD6JDC7FKKQHNGVVUIBIZOUI5WPSJEHBRABZDRN6LOTBMFEY');
  await expect(page.getByRole('row', { name: 'Amount' }).getByRole('cell')).toHaveText('0 Algos');
  await expect(page.getByRole('row', { name: 'Close remainder to' }).getByRole('cell'))
    .toHaveText('None');
  await expect(page.getByRole('row', { name: 'Note' }).getByRole('cell')).toHaveText('None');
  await expect(page.getByRole('row', { name: 'Fee(Automatic)' }).getByRole('cell'))
    .toHaveText('0.001 Algos');
  await expect(
    page.getByRole('row', { name: 'Transaction’s first valid round(Automatic)' }).getByRole('cell')
  ).toHaveText('44,440,857');
  await expect(
    page.getByRole('row', { name: 'Transaction’s last valid round(Automatic)' }).getByRole('cell')
  ).toHaveText('44,441,857');
  await expect(page.getByRole('row', { name: 'Lease' }).getByRole('cell')).toHaveText('None');
  await expect(page.getByRole('row', { name: 'Rekey to' }).getByRole('cell')).toHaveText('None');
}
