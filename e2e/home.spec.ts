import { test, expect } from '@playwright/test';

test.describe('English Version', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
  });

  test('has title', async ({ page }) => {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/txnDuck/);
  });

  test('has heading', async ({ page }) => {
    // Expect an h1 heading with "Home"
    await expect(page.locator('h1')).toContainText('Hello!')
  });
});

test.describe('Spanish Version', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/es');
  });

  test('has title', async ({ page }) => {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/txnPato/);
  });

  test('has heading', async ({ page }) => {
    // Expect an h1 heading with "Home"
    await expect(page.locator('h1')).toContainText('¡Hola!')
  });
});
