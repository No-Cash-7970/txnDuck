import { type Page as PageFixture, type Locator } from '@playwright/test';
import { Page } from './Page';

export class HomePage extends Page {
  /** The "start" button link that directs the user to use the app. */
  readonly startLink: Locator;

  /**
   * @param page Page fixture from Playwright
   */
  constructor(page: PageFixture) {
    super(page, '');

    this.startLink = page.getByTestId('hero').getByRole('link');
  }
}
