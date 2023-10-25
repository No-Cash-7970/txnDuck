import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18nextClientMock from '@/app/lib/testing/i18nextClientMock';

// Mock i18next before modules that use it are imported
jest.mock('react-i18next', () => i18nextClientMock);
// Mock the utils library because of the use of `fetch()`
jest.mock('../../../../lib/utils.ts', () => ({
  dataUrlToBytes: async (dataUrl: string) => new Uint8Array()
}));
// Mock algokit
let sendErrorMsg = '', confirmErrorMsg = '';
const sendRawTxnSpy = jest.fn(), waitConfirmSpy = jest.fn();
jest.mock('@algorandfoundation/algokit-utils', () => ({
  getAlgoClient: () => ({
    sendRawTransaction: () => ({
      do: () => {
        sendRawTxnSpy();
        if (sendErrorMsg) throw Error(sendErrorMsg);
        return {txId: ''};
      }
    })
  }),
  waitForConfirmation: () => {
    waitConfirmSpy();
    if (confirmErrorMsg) throw Error(confirmErrorMsg);
    return { get_obj_for_encoding: () => ({}) };
  }
}));

import SendTxn from './SendTxn';

describe('Send Transaction Component', () => {
  beforeEach(() => {
    sendErrorMsg = '';
    confirmErrorMsg = '';
  });

  it('shows "waiting" message if waiting for transaction confirmation', async () => {
    sessionStorage.setItem('signedTxn', '"data:application/octet-stream;base64,"');
    render(<SendTxn />);
    expect(await screen.findByText('txn_confirm_wait')).toBeInTheDocument();
  });

  it('shows success message if transaction is successful', async () => {
    sessionStorage.setItem('signedTxn', '"data:application/octet-stream;base64,"');
    render(<SendTxn />);

    expect(await screen.findByText('success.heading')).toBeInTheDocument();
    expect(await screen.findByText('done_btn')).toBeInTheDocument();
  });

  it('removes temporary transaction data from storage if transaction is successful', async () => {
    sessionStorage.setItem('txnData', JSON.stringify({ fake: 'txn data'}));
    sessionStorage.setItem('signedTxn', '"data:application/octet-stream;base64,"');
    render(<SendTxn />);

    await waitFor(() => expect(sessionStorage.getItem('txnData')).toBeNull());
    expect(sessionStorage.getItem('signedTxn')).toBeNull();
  });

  it('shows fail message if transaction fails', async () => {
    sessionStorage.setItem('signedTxn', '"data:application/octet-stream;base64,"');
    sendErrorMsg = 'foo';
    render(<SendTxn />);

    expect(await screen.findByText('fail.heading')).toBeInTheDocument();
    expect(await screen.findByText('compose_txn_btn')).toBeInTheDocument();
    expect(await screen.findByText('sign_txn_btn')).toBeInTheDocument();
    expect(await screen.findByText('quit_btn')).toBeInTheDocument();
  });

  it('has "retry" button when transaction fails', async() => {
    sessionStorage.setItem('signedTxn', '"data:application/octet-stream;base64,"');
    sendErrorMsg = 'foo';
    render(<SendTxn />);

    await userEvent.click(await screen.findByText('retry_btn'));

    expect(sendRawTxnSpy).toBeCalledTimes(2);
  });

  it('shows warning message if transaction is not confirmed in specified number of rounds',
  async () => {
    sessionStorage.setItem('signedTxn', '"data:application/octet-stream;base64,"');
    confirmErrorMsg = 'not confirmed';
    render(<SendTxn />);

    expect(await screen.findByText('warn.heading')).toBeInTheDocument();
    expect(await screen.findByText('quit_btn')).toBeInTheDocument();
  });

  it('has "retry" button when transaction is not confirmed in specified number of rounds',
  async() => {
    sessionStorage.setItem('signedTxn', '"data:application/octet-stream;base64,"');
    confirmErrorMsg = 'not confirmed';
    render(<SendTxn />);

    await userEvent.click(await screen.findByText('retry_btn'));

    expect(sendRawTxnSpy).toBeCalledTimes(2);
    expect(waitConfirmSpy).toBeCalledTimes(2);
  });

  it('has "wait longer" button when transaction is not confirmed in specified number of rounds',
  async() => {
    sessionStorage.setItem('signedTxn', '"data:application/octet-stream;base64,"');
    confirmErrorMsg = 'not confirmed';
    render(<SendTxn />);

    await userEvent.click(await screen.findByText('wait_longer_btn'));

    expect(waitConfirmSpy).toBeCalledTimes(2);
    expect(sendRawTxnSpy).toBeCalledTimes(1);
  });
});
