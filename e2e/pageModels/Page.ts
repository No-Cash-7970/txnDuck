import { type Page as PageFixture } from '@playwright/test';

export class Page {
  /** Page fixture from Playwright */
  readonly page: PageFixture;
  /** URL without the language prefix */
  private static _url: string = '';
  /** Regular Expression for the title metadata text */
  readonly titleRegEx: RegExp = /txnDuck/;

  /**
   * @param page Page fixture from Playwright
   * @param url The URL without the language prefix
   */
  constructor(page: PageFixture, url: string = '') {
    this.page = page;
    Page.url = url;
  }

  /**
   * URL without the language prefix
   */
  public static get url(): string {
    return Page._url;
  }

  // Making this setter private allows it to be set by the constructor while being read-only
  // externally
  private static set url(value: string) {
    Page._url = value;
  }

  /**
   * Get the URL with language prefix.
   * @param lang The language prefix. Must be an ISO??? code
   * @returns The URL with the language prefix
   */
  static getFullUrl(lang: string = 'en'): string {
    return '/' + lang + Page.url;
  }

  /**
   * Go to the page
   * @param lang The language prefix of the page to go to.
   */
  async goto(lang: string = 'en') {
    await this.page.goto(Page.getFullUrl(lang));
  }
}
