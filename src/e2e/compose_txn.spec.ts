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
      es: { body: /Componga/, title: /Componga/ },
    })).check(test, ComposeTxnPage.url);
  });

  test.describe('Nav Bar', () => {
    NavBar.check(test, ComposeTxnPage.getFullUrl());
  });

});
