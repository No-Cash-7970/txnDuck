import { test, expect } from '@playwright/test';

test.describe('English Version', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en');
  });

  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(/txnDuck/);
  });

  test('has heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Hello!');
  });

  test.describe('Nav Bar', () => {
    test('has site name in correct language', async({ page }) => {
      await expect(page.getByTitle('Home')).toBeVisible();
    });

    test('has site name that goes to home page when clicked on', async({ page }) => {
      await page.getByTitle('Home').click();
      await expect(page).toHaveURL(/.*\/en/);
    });
  });
});

test.describe('Spanish Version', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/es');
  });

  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(/txnPato/);
  });

  test('has heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('¡Hola!');
  });

  test.describe('Nav Bar', () => {
    test('has site name in correct language', async({ page }) => {
      await expect(page.getByTitle('Inicio')).toBeVisible();
    });

    test('has site name that goes to home page when clicked on', async({ page }) => {
      await page.getByTitle('Inicio').click();
      await expect(page).toHaveURL(/.*\/es/);
    });
  });
});
