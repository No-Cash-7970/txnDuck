import { test as base, expect } from '@playwright/test';
import { ComposeTxnPage } from './pageModels/ComposeTxnPage';
import { HomePage } from './pageModels/HomePage';

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

test.slow();

test.describe('Compose Transaction Settings', () => {

  test('uses the default "Automatically set fee" value set in the settings', async ({ page }) => {
    // Change setting when on the home page
    await (new HomePage(page)).goto();
    const settingsBtn = page.getByRole('button', { name: 'Settings' });
    await settingsBtn.click(); // Open settings dialog
    const useSugSetting = page.getByLabel('Set fee automatically by default');
    await useSugSetting.click(); // Switch to "off"

    // Go to "Compose Transaction" page
    await (new ComposeTxnPage(page)).goto();

    // Check if the field on the "Compose Transaction" page has the correct default value
    const useSugField = page.getByLabel('Automatically set the fee');
    await expect(useSugField).not.toBeChecked();
    await settingsBtn.click(); // Open settings dialog
    await expect(useSugSetting).not.toBeChecked();

    // Change the setting again, but we are on the "Compose Transaction" page this time
    await useSugSetting.click(); // Switch to "on"
    const settingsCloseBtn = page.getByTitle('Close');
    await settingsCloseBtn.click(); // Close the settings dialog
    // Expect current value of the field on "Compose Transaction" page to change ("off" --> "on")
    // because the field was never touched
    await expect(useSugField).toBeChecked();

    // Touch the field by changing the value in "Compose Transaction" page
    await useSugField.click(); // Switch to "off"
    await settingsBtn.click(); // Open settings dialog
    await useSugSetting.click(); // Switch to "off"
    await useSugSetting.click(); // Switch to "on" again
    await settingsCloseBtn.click(); // Close the settings dialog
    // Expect current value of the field on "Compose Transaction" page to remain unchanged
    await expect(useSugField).not.toBeChecked();

    // Refresh the "Compose Transaction" page to see if the form has the new default value
    await page.reload();
    await expect(useSugField).toBeChecked();
  });

  test('uses the default "Automatically set valid rounds" value set in the settings',
  async ({ page }) => {
    // Change setting when on the home page
    await (new HomePage(page)).goto();
    const settingsBtn = page.getByRole('button', { name: 'Settings' });
    await settingsBtn.click(); // Open settings dialog
    const useSugSetting = page.getByLabel('Set valid rounds automatically by default');
    await useSugSetting.click(); // Switch to "off"

    // Go to "Compose Transaction" page
    await (new ComposeTxnPage(page)).goto();

    // Check if the field on the "Compose Transaction" page has the correct default value
    const useSugField = page.getByLabel('Automatically set valid rounds');
    await expect(useSugField).not.toBeChecked();
    await settingsBtn.click(); // Open settings dialog
    await expect(useSugSetting).not.toBeChecked();

    // Change the setting again, but we are on the "Compose Transaction" page this time
    await useSugSetting.click(); // Switch to "on"
    const settingsCloseBtn = page.getByTitle('Close');
    await settingsCloseBtn.click(); // Close the settings dialog
    // Expect current value of the field on "Compose Transaction" page to change ("off" --> "on")
    // because the field was never touched
    await expect(useSugField).toBeChecked();

    // Touch the field by changing the value in "Compose Transaction" page
    await useSugField.click(); // Switch to "off"
    await settingsBtn.click(); // Open settings dialog
    await useSugSetting.click(); // Switch to "off"
    await useSugSetting.click(); // Switch to "on" again
    await settingsCloseBtn.click(); // Close the settings dialog
    // Expect current value of the field on "Compose Transaction" page to remain unchanged
    await expect(useSugField).not.toBeChecked();

    // Refresh the "Compose Transaction" page to see if the form has the new default value
    await page.reload();
    await expect(useSugField).toBeChecked();
  });

  test('uses the "manager address to the sender address by default" value set in the settings',
  async ({ page }) => {
    // Change setting when on the home page
    await (new HomePage(page)).goto();
    const settingsBtn = page.getByRole('button', { name: 'Settings' });
    await settingsBtn.click(); // Open settings dialog
    const useSenderSetting = page.getByLabel(
      'Set the manager address to the sender address by default'
    );
    await useSenderSetting.click(); // Switch to "off"

    // Go to "Compose Transaction" page
    await (new ComposeTxnPage(page)).goto('en', '?preset=asset_create');

    // Check if the field on the "Compose Transaction" page has the correct default value
    const useSenderField = page.getByLabel('Set the manager address to the sender address');
    await expect(useSenderField).not.toBeChecked();
    await settingsBtn.click(); // Open settings dialog
    await expect(useSenderSetting).not.toBeChecked();

    // Change the setting again, but we are on the "Compose Transaction" page this time
    await useSenderSetting.click(); // Switch to "on"
    const settingsCloseBtn = page.getByTitle('Close');
    await settingsCloseBtn.click(); // Close the settings dialog
    // Expect current value of the field on "Compose Transaction" page to change ("off" --> "on")
    // because the field was never touched
    await expect(useSenderField).toBeChecked();

    // Touch the field by changing the value in "Compose Transaction" page
    await useSenderField.click(); // Switch to "off"
    await settingsBtn.click(); // Open settings dialog
    await useSenderSetting.click(); // Switch to "off"
    await useSenderSetting.click(); // Switch to "on" again
    await settingsCloseBtn.click(); // Close the settings dialog
    // Expect current value of the field on "Compose Transaction" page to remain unchanged
    await expect(useSenderField).not.toBeChecked();

    // Refresh the "Compose Transaction" page to see if the form has the new default value
    await page.reload();
    await expect(useSenderField).toBeChecked();
  });

  test('uses the "freeze address to the sender address by default" value set in the settings',
  async ({ page }) => {
    // Change setting when on the home page
    await (new HomePage(page)).goto();
    const settingsBtn = page.getByRole('button', { name: 'Settings' });
    await settingsBtn.click(); // Open settings dialog
    const useSenderSetting = page.getByLabel(
      'Set the freeze address to the sender address by default'
    );
    await useSenderSetting.click(); // Switch to "off"

    // Go to "Compose Transaction" page
    await (new ComposeTxnPage(page)).goto('en', '?preset=asset_create');

    // Check if the field on the "Compose Transaction" page has the correct default value
    const useSenderField = page.getByLabel('Set the freeze address to the sender address');
    await expect(useSenderField).not.toBeChecked();
    await settingsBtn.click(); // Open settings dialog
    await expect(useSenderSetting).not.toBeChecked();

    // Change the setting again, but we are on the "Compose Transaction" page this time
    await useSenderSetting.click(); // Switch to "on"
    const settingsCloseBtn = page.getByTitle('Close');
    await settingsCloseBtn.click(); // Close the settings dialog
    // Expect current value of the field on "Compose Transaction" page to change ("off" --> "on")
    // because the field was never touched
    await expect(useSenderField).toBeChecked();

    // Touch the field by changing the value in "Compose Transaction" page
    await useSenderField.click(); // Switch to "off"
    await settingsBtn.click(); // Open settings dialog
    await useSenderSetting.click(); // Switch to "off"
    await useSenderSetting.click(); // Switch to "on" again
    await settingsCloseBtn.click(); // Close the settings dialog
    // Expect current value of the field on "Compose Transaction" page to remain unchanged
    await expect(useSenderField).not.toBeChecked();

    // Refresh the "Compose Transaction" page to see if the form has the new default value
    await page.reload();
    await expect(useSenderField).toBeChecked();
  });

  test('uses the "clawback address to the sender address by default" value set in the settings',
  async ({ page }) => {
    // Change setting when on the home page
    await (new HomePage(page)).goto();
    const settingsBtn = page.getByRole('button', { name: 'Settings' });
    await settingsBtn.click(); // Open settings dialog
    const useSenderSetting = page.getByLabel(
      'Set the clawback address to the sender address by default'
    );
    await useSenderSetting.click(); // Switch to "off"

    // Go to "Compose Transaction" page
    await (new ComposeTxnPage(page)).goto('en', '?preset=asset_create');

    // Check if the field on the "Compose Transaction" page has the correct default value
    const useSenderField = page.getByLabel('Set the clawback address to the sender address');
    await expect(useSenderField).not.toBeChecked();
    await settingsBtn.click(); // Open settings dialog
    await expect(useSenderSetting).not.toBeChecked();

    // Change the setting again, but we are on the "Compose Transaction" page this time
    await useSenderSetting.click(); // Switch to "on"
    const settingsCloseBtn = page.getByTitle('Close');
    await settingsCloseBtn.click(); // Close the settings dialog
    // Expect current value of the field on "Compose Transaction" page to change ("off" --> "on")
    // because the field was never touched
    await expect(useSenderField).toBeChecked();

    // Touch the field by changing the value in "Compose Transaction" page
    await useSenderField.click(); // Switch to "off"
    await settingsBtn.click(); // Open settings dialog
    await useSenderSetting.click(); // Switch to "off"
    await useSenderSetting.click(); // Switch to "on" again
    await settingsCloseBtn.click(); // Close the settings dialog
    // Expect current value of the field on "Compose Transaction" page to remain unchanged
    await expect(useSenderField).not.toBeChecked();

    // Refresh the "Compose Transaction" page to see if the form has the new default value
    await page.reload();
    await expect(useSenderField).toBeChecked();
  });

  test('uses the "reserve address to the sender address by default" value set in the settings',
  async ({ page }) => {
    // Change setting when on the home page
    await (new ComposeTxnPage(page)).goto('en', '?preset=asset_create');
    const settingsBtn = page.getByRole('button', { name: 'Settings' });
    await settingsBtn.click(); // Open settings dialog
    const useSenderSetting = page.getByLabel(
      'Set the reserve address to the sender address by default'
    );
    await useSenderSetting.click(); // Switch to "off"

    // Go to "Compose Transaction" page
    await (new ComposeTxnPage(page)).goto('en', '?preset=asset_create');

    // Check if the field on the "Compose Transaction" page has the correct default value
    const useSenderField = page.getByLabel('Set the reserve address to the sender address');
    await expect(useSenderField).not.toBeChecked();
    await settingsBtn.click(); // Open settings dialog
    await expect(useSenderSetting).not.toBeChecked();

    // Change the setting again, but we are on the "Compose Transaction" page this time
    await useSenderSetting.click(); // Switch to "on"
    const settingsCloseBtn = page.getByTitle('Close');
    await settingsCloseBtn.click(); // Close the settings dialog
    // Expect current value of the field on "Compose Transaction" page to change ("off" --> "on")
    // because the field was never touched
    await expect(useSenderField).toBeChecked();

    // Touch the field by changing the value in "Compose Transaction" page
    await useSenderField.click(); // Switch to "off"
    await settingsBtn.click(); // Open settings dialog
    await useSenderSetting.click(); // Switch to "off"
    await useSenderSetting.click(); // Switch to "on" again
    await settingsCloseBtn.click(); // Close the settings dialog
    // Expect current value of the field on "Compose Transaction" page to remain unchanged
    await expect(useSenderField).not.toBeChecked();

    // Refresh the "Compose Transaction" page to see if the form has the new default value
    await page.reload();
    await expect(useSenderField).toBeChecked();
  });

});
