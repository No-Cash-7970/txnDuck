import { type Page as PageFixture, type Locator } from '@playwright/test';

export class HomePage {
  /** Page fixture from Playwright */
  readonly page: PageFixture;
  /** URL without the language prefix */
  static readonly url = '';

  /** The "start" button link that directs the user to use the app. */
  readonly startBtn: Locator;
  /** The "compose transaction" button that directs user to compose a transaction */
  readonly composeTxnBtn: Locator;
  /** The "sign transaction" button that directs user to compose a transaction */
  readonly signTxnBtn: Locator;
  /** The "send transaction" button that directs user to compose a transaction */
  readonly sendTxnBtn: Locator;

  /**
   * @param page Page fixture from Playwright
   */
  constructor(page: PageFixture) {
    this.page = page;
    this.startBtn = page.getByTestId('startBtn');
    this.composeTxnBtn = page.getByTestId('composeTxnBtn');
    this.signTxnBtn = page.getByTestId('signTxnBtn');
    this.sendTxnBtn = page.getByTestId('sendTxnBtn');
  }

  /** Get the URL with language prefix.
   * @param lang The language prefix. Must be an ISO??? code
   * @returns The URL with the language prefix
   */
  static getFullUrl(lang = 'en') {
    return '/' + lang + HomePage.url;
  }

  /** Go to the page
   * @param lang The language prefix of the page to go to.
   * @param query The query parameter string with the question mark at the beginning
   *              (e.g. "?a=1&b=2")
   */
  async goto(lang = 'en', query = '') {
    await this.page.goto(HomePage.getFullUrl(lang) + query);
  }
}
