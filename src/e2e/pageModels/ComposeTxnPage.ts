import { type Page as PageFixture, type Locator } from '@playwright/test';

export class ComposeTxnPage {
  /** Page fixture from Playwright */
  readonly page: PageFixture;
  /** URL without the language prefix */
  static readonly url = '/txn/compose';

  /** Main section of the page */
  readonly main: Locator;

  /**
   * @param page Page fixture from Playwright
   */
  constructor(page: PageFixture) {
    this.page = page;
    this.main = page.getByRole('main');
  }

  /** Get the URL with language prefix.
   * @param lang The language prefix. Must be an ISO??? code
   * @returns The URL with the language prefix
   */
  static getFullUrl(lang = 'en') {
    return '/' + lang + ComposeTxnPage.url;
  }

  /** Go to the page
   * @param lang The language prefix of the page to go to.
   * @param query The query parameter string with the question mark at the beginning
   *              (e.g. "?a=1&b=2")
   */
  async goto(lang = 'en', query = '') {
    await this.page.goto(ComposeTxnPage.getFullUrl(lang) + query);
  }
}
