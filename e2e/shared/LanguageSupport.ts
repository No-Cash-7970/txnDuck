import {
  expect,
  type TestType,
  type PlaywrightTestArgs,
  type PlaywrightTestOptions,
  type PlaywrightWorkerArgs,
  type PlaywrightWorkerOptions,
} from '@playwright/test';

type LangRegExList = { [lang: string]: RegExp };

export class LanguageSupport {
  /**
   * A mapping the Regular Expressions (RegExp) for detecting each language
   *
   * Example: `{ en: /Hello/, es: /Hola/ }`
   */
  private langRegExList: LangRegExList = {};
  /** A mapping of the full name of ISO 639-1 codes */
  private langFullNames: { [lang: string]: string } = {
    en: 'English',
    es: 'Spanish',
  };

  /**
   * @param langRegExList A mapping the Regular Expressions (RegExp) for detecting each language.
   *                      Example: `{ en: /Hello/, es: /Hola/ }`
   */
  constructor(langRegExList: LangRegExList = {}) {
    this.langRegExList = langRegExList;
  }

  /**
   * Runs all the tests for the language support in the page with the given page URL
   * @param test Playwright "test" object
   * @param pageUrl URL of the page WITHOUT the language prefix
   */
  check(
    test: TestType<
      PlaywrightTestArgs & PlaywrightTestOptions,
      PlaywrightWorkerArgs & PlaywrightWorkerOptions
    >,
    pageUrl: string
  ): void {
    Object.keys(this.langRegExList).forEach((lng: string) => {
      test.describe(this.langFullNames[lng], () => {
        const fullUrlWithLang = '/' + lng + pageUrl;

        test.use({ locale: lng });

        test('redirects based on `Accept-Language` header', async({ page }) => {
          await page.goto(pageUrl);
          await expect(page).toHaveURL(fullUrlWithLang);
        });

        test('loads the correct text', async ({ page }) => {
          await page.goto(fullUrlWithLang);
          // await expect(page.getByText(lngData.testRegEx)).toBeAttached();
          await expect(page.getByRole('main')).toHaveText(this.langRegExList[lng]);
        });

        test.describe('With Cookie', () => {
          test.use({ locale: 'fake' });

          test(
            'redirects based on cookie and not headers if cookie is present',
            async({ page }) => {
              page.context().addCookies([
                { name: 'i18next', value: lng, domain: 'localhost', path: '/' }
              ]);
              await page.goto(pageUrl);
              await expect(page).toHaveURL(fullUrlWithLang);
            }
          );
        });

      });
    });
  }
}
