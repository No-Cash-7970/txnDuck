import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Create Next App/);
});

test('has heading', async ({ page }) => {
  await page.goto('/');

  // Expect an h1 heading with "Home"
  await expect(page.locator('h1')).toContainText('Hello!')
});
