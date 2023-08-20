import { type Page as PageFixture, type Locator } from '@playwright/test';
import { Page } from './Page';

export class TxnTemplatePage extends Page {
  /**
   * @param page Page fixture from Playwright
   */
  constructor(page: PageFixture) {
    super(page, '/txn');
  }
}
