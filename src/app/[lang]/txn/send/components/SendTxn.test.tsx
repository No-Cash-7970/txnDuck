import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as fs from "node:fs";
import i18nextClientMock from '@/app/lib/testing/i18nextClientMock';

// Mock i18next before modules that use it are imported
jest.mock('react-i18next', () => i18nextClientMock);
// Mock navigation hooks
const paramsMock = {get: jest.fn(), toString: jest.fn()};
jest.mock('next/navigation', () => ({
  useSearchParams: () => paramsMock,
}));
// Mock use-debounce
jest.mock('use-debounce', () => ({ useDebouncedCallback: (fn: any) => fn }));
// Mock the utils library because of the use of `fetch()`
jest.mock('../../../../lib/utils.ts', () => ({
  ...jest.requireActual('../../../../lib/utils.ts'),
  dataUrlToBytes: async (dataUrl: string) => new Uint8Array()
}));
// Mock algosdk
let sendErrorMsg = '', confirmErrorMsg = '';
const sendRawTxnSpy = jest.fn(), waitConfirmSpy = jest.fn();
jest.mock('algosdkv3', () => ({
  ...jest.requireActual('algosdkv3'),
  encodeJSON: jest.fn(),
  Algodv2: class {
    token: string;
    constructor(token: string) { this.token = token; }
    sendRawTransaction() {
      return {
        do: async () => {
          sendRawTxnSpy();
          if (sendErrorMsg) throw Error(sendErrorMsg);
          return {txId: ''};
        }
      };
    }
  },
  waitForConfirmation: () => {
    waitConfirmSpy();
    if (confirmErrorMsg) throw Error(confirmErrorMsg);
    return ({});
  },
}));

import SendTxn from './SendTxn';

describe('Send Transaction Component', () => {
  beforeEach(() => {
    sendErrorMsg = '';
    confirmErrorMsg = '';
    sessionStorage.clear();
    paramsMock.get.mockClear();
    paramsMock.toString.mockClear();
  });

  // eslint-disable-next-line max-len
  it('shows warning message about imported transaction overwriting saved transaction when there is a saved transaction',
  async () => {
    paramsMock.get.mockReturnValue(''); // Mock "import" URL parameter
    sessionStorage.setItem('txnData', JSON.stringify({ fake: 'txn data'}));
    render(<SendTxn />);
    expect(await screen.findByLabelText(/import_txn.label/)).toBeInTheDocument();
    expect(screen.getByText('import_txn.overwrite_warning')).toBeInTheDocument();
  });

  // eslint-disable-next-line max-len
  it('does not show any warning message when there is no saved transaction data while importing',
  async () => {
    paramsMock.get.mockReturnValue(null); // Mock "import" URL parameter not being present
    render(<SendTxn />);
    expect(await screen.findByLabelText(/import_txn.label/)).toBeInTheDocument();
    expect(screen.queryByText('import_txn.overwrite_warning')).not.toBeInTheDocument();
  });

  it('attempts to send signed transaction from uploaded file', async () => {
    paramsMock.get.mockReturnValue(null); // Mock "import" URL parameter not being present
    const data = fs.readFileSync('src/app/lib/testing/test_signed.txn.msgpack');
    const file = new File([data], 'signed.txn.msgpack', { type: 'application/octet-stream' });
    render(<SendTxn />);

    await userEvent.upload(screen.getByLabelText(/import_txn.label/), file);

    expect(await screen.findByText('success.heading')).toBeInTheDocument();
  });

  it('shows success message if transaction is successful', async () => {
    paramsMock.get.mockReturnValue(null); // Mock "import" URL parameter not being present
    sessionStorage.setItem('signedTxn', '"data:application/octet-stream;base64,"');
    render(<SendTxn />);

    expect(await screen.findByText('success.heading')).toBeInTheDocument();
    expect(await screen.findByText('done_btn')).toBeInTheDocument();
  });

  it('removes temporary transaction data from storage if transaction is successful', async () => {
    paramsMock.get.mockReturnValue(null); // Mock "import" URL parameter not being present
    sessionStorage.setItem('txnData', JSON.stringify({ fake: 'txn data'}));
    sessionStorage.setItem('signedTxn', '"data:application/octet-stream;base64,"');
    render(<SendTxn />);

    await waitFor(() => expect(sessionStorage.getItem('txnData')).toBeNull());
    expect(sessionStorage.getItem('signedTxn')).toBeNull();
  });

  it('shows fail message if transaction fails', async () => {
    paramsMock.get.mockReturnValue(null); // Mock "import" URL parameter not being present
    sessionStorage.setItem('signedTxn', '"data:application/octet-stream;base64,"');
    sendErrorMsg = 'foo';
    render(<SendTxn />);

    expect(await screen.findByText('fail.heading')).toBeInTheDocument();
    expect(await screen.findByText('compose_txn_btn')).toBeInTheDocument();
    expect(await screen.findByText('sign_txn_btn')).toBeInTheDocument();
    expect(await screen.findByText('quit_btn')).toBeInTheDocument();
  });

  it('has "retry" button when transaction fails', async() => {
    paramsMock.get.mockReturnValue(null); // Mock "import" URL parameter not being present
    sessionStorage.setItem('signedTxn', '"data:application/octet-stream;base64,"');
    sendErrorMsg = 'foo';
    render(<SendTxn />);

    await userEvent.click(await screen.findByText('retry_btn'));

    expect(sendRawTxnSpy).toHaveBeenCalledTimes(2);
  });

  it('shows warning message if transaction is not confirmed in specified number of rounds',
  async () => {
    paramsMock.get.mockReturnValue(null); // Mock "import" URL parameter not being present
    sessionStorage.setItem('signedTxn', '"data:application/octet-stream;base64,"');
    confirmErrorMsg = 'not confirmed';
    render(<SendTxn />);

    expect(await screen.findByText('warn.heading')).toBeInTheDocument();
    expect(await screen.findByText('quit_btn')).toBeInTheDocument();
  });

  it('has "retry" button when transaction is not confirmed in specified number of rounds',
  async() => {
    paramsMock.get.mockReturnValue(null); // Mock "import" URL parameter not being present
    sessionStorage.setItem('signedTxn', '"data:application/octet-stream;base64,"');
    confirmErrorMsg = 'not confirmed';
    render(<SendTxn />);

    await userEvent.click(await screen.findByText('retry_btn'));

    expect(sendRawTxnSpy).toHaveBeenCalledTimes(2);
    expect(waitConfirmSpy).toHaveBeenCalledTimes(2);
  });

  it('has "wait longer" button when transaction is not confirmed in specified number of rounds',
  async() => {
    paramsMock.get.mockReturnValue(null); // Mock "import" URL parameter not being present
    sessionStorage.setItem('signedTxn', '"data:application/octet-stream;base64,"');
    confirmErrorMsg = 'not confirmed';
    render(<SendTxn />);

    await userEvent.click(await screen.findByText('wait_longer_btn'));

    expect(waitConfirmSpy).toHaveBeenCalledTimes(2);
    expect(sendRawTxnSpy).toHaveBeenCalledTimes(1);
  });
});
