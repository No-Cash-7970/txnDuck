import { type Page as PageFixture, type Locator } from '@playwright/test';

export class NotFoundPage {
  /** Page fixture from Playwright */
  readonly page: PageFixture;
  /** URL without the language prefix */
  static readonly url = '/doesnt-exist';
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
    return '/' + lang + NotFoundPage.url;
  }

  /** Go to the page
   * @param lang The language prefix of the page to go to.
   */
  async goto(lang = 'en') {
    await this.page.goto(NotFoundPage.getFullUrl(lang));
  }
}
