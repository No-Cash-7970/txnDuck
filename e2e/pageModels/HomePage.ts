import { type Page as PageFixture, type Locator } from '@playwright/test';
import { Page } from './Page';

export class HomePage extends Page {
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
    super(page, '');

    this.startBtn = page.getByTestId('startBtn');
    this.composeTxnBtn = page.getByTestId('composeTxnBtn');
    this.signTxnBtn = page.getByTestId('signTxnBtn');
    this.sendTxnBtn = page.getByTestId('sendTxnBtn');
  }
}
