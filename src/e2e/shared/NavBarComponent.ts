import {
  expect,
  type Page,
  type TestType,
  type PlaywrightTestArgs,
  type PlaywrightTestOptions,
  type PlaywrightWorkerArgs,
  type PlaywrightWorkerOptions
} from '@playwright/test';
import { HomePage } from '../pageModels/HomePage';

export class NavBarComponent {
  /** Checks if the navigation bar has a link to the home page, which is usually the site name.
   * @param page Playwright Page fixture
   * @param lang Language prefix for the page
   */
  static async hasHomeLink(page: Page, lang = 'en'): Promise<void> {
    await page.getByRole('navigation').getByRole('link').click();
    await expect(page).toHaveURL(HomePage.getFullUrl(lang));
  }

  /** Runs all the tests for the navigation bar in the page with the given page URL
   * @param test Playwright "test" object
   * @param pageFullUrl URL of the page WITH the language prefix
   * @param lang Language prefix for the page
   */
  static check(
    test: TestType<
      PlaywrightTestArgs & PlaywrightTestOptions,
      PlaywrightWorkerArgs & PlaywrightWorkerOptions
    >,
    pageFullUrl: string,
    lang = 'en',
  ): void {
    test.beforeEach(async ({ page }) => {
      await page.goto(pageFullUrl);
    });

    test('has link to home page', async({ page }) => {
      await page.goto(pageFullUrl);
      await this.hasHomeLink(page, lang);
    });
  }
}
