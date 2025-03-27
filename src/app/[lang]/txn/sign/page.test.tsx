import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import algosdk from 'algosdk';
import i18nextClientMock from '@/app/lib/testing/i18nextClientMock';
import { useWalletUnconnectedMock } from '@/app/lib/testing/useWalletMock';

// Mock react `use` function before modules that use it are imported
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: () => ({ t: (key: string) => key }),
}));

// Mock i18next before modules that use it are imported because it is used by a child component
jest.mock('react-i18next', () => i18nextClientMock);

// Mock navigation hooks because they are used by a child components
const paramsMock = {get: jest.fn()};
jest.mock('next/navigation', () => ({
  useRouter: () => ({}),
  useSearchParams: () => paramsMock
}));

// Mock the utils library because of the use of `fetch()`. This needs to be mocked because it is a
// dependency of a child client component.
jest.mock('../../../lib/utils.ts', () => ({
  dataUrlToBytes: async (dataUrl: string) => new Uint8Array([
    // eslint-disable-next-line max-len
    130,163,115,105,103,196,64,160,45,30,164,227,212,130,37,87,3,93,161,194,63,37,179,191,45,203,242,194,252,68,41,124,98,31,205,31,64,146,186,209,7,176,68,44,15,23,205,201,247,241,24,66,239,201,233,231,168,154,207,107,77,81,180,144,116,147,151,159,140,250,14,163,116,120,110,136,163,102,101,101,205,3,232,162,102,118,206,2,202,109,170,163,103,101,110,172,116,101,115,116,110,101,116,45,118,49,46,48,162,103,104,196,32,72,99,181,24,164,179,200,78,200,16,242,45,79,16,129,203,15,113,240,89,167,172,32,222,198,47,127,112,229,9,58,34,162,108,118,206,2,202,113,146,163,114,99,118,196,32,217,118,87,219,217,132,48,63,36,98,249,84,168,29,166,173,104,128,163,46,162,59,103,201,36,56,98,0,228,113,111,150,163,115,110,100,196,32,217,118,87,219,217,132,48,63,36,98,249,84,168,29,166,173,104,128,163,46,162,59,103,201,36,56,98,0,228,113,111,150,164,116,121,112,101,163,112,97,121
  ])
}));

// Mock use-wallet before modules that use it are imported
jest.mock('@txnlab/use-wallet-react', () => useWalletUnconnectedMock);
// Mock the wallet provider
jest.mock('../../components/wallet/WalletProvider.tsx', () => 'div');

// Mock algosdk
jest.mock('algosdk', () => ({
  ...jest.requireActual('algosdk'),
  Algodv2: class {
    token: string;
    constructor(token: string) { this.token = token; }
    getTransactionParams() {
      return {
        do: async () => ({
          genesisID: 'testnet-v1.0',
          genesisHash: algosdk.base64ToBytes('SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI='),
          fee: BigInt(1),
          minFee: BigInt(1),
          firstValid: BigInt(10000),
          lastValid: BigInt(11000),
        })
      };
    }
  },
}));

import SignTxnPage from './page';

describe('Sign Transaction Page', () => {
  afterEach(() => {
    paramsMock.get.mockClear();
    sessionStorage.clear();
  });

  it('has builder steps', () => {
    render(<SignTxnPage
      // Create async function to convert parameters object into a Promise. The parameters must be a
      // Promise.
      params={(async () => ({lang: ''}))()}
    />);
    expect(screen.getByText(/builder_steps\.sign/)).toBeInTheDocument();
  });

  it('has page title heading', () => {
    render(<SignTxnPage params={(async () => ({lang: ''}))()} />);
    expect(screen.getByRole('heading', { level: 1 })).not.toBeEmptyDOMElement();
  });

  it('has transaction information if there is stored transaction data', async () => {
    paramsMock.get.mockReturnValue(null);
    sessionStorage.setItem('txnData',
      // eslint-disable-next-line max-len
      '{"txn":{"type":"pay","snd":"3F3FPW6ZQQYD6JDC7FKKQHNGVVUIBIZOUI5WPSJEHBRABZDRN6LOTBMFEY","rcv":"3F3FPW6ZQQYD6JDC7FKKQHNGVVUIBIZOUI5WPSJEHBRABZDRN6LOTBMFEY","amt":0},"useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false}'
    );
    render(<SignTxnPage params={(async () => ({lang: ''}))()} />);
    expect(await screen.findByRole('table')).toBeInTheDocument();
  });

  it('has connect wallet/sign button if there is stored transaction data', async () => {
    paramsMock.get.mockReturnValue(null);
    sessionStorage.setItem('txnData',
      // eslint-disable-next-line max-len
      '{"txn":{"type":"pay","snd":"3F3FPW6ZQQYD6JDC7FKKQHNGVVUIBIZOUI5WPSJEHBRABZDRN6LOTBMFEY","rcv":"3F3FPW6ZQQYD6JDC7FKKQHNGVVUIBIZOUI5WPSJEHBRABZDRN6LOTBMFEY","amt":0},"useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false}'
    );
    render(<SignTxnPage params={(async () => ({lang: ''}))()} />);
    expect(await screen.findByText('wallet.connect')).toBeInTheDocument();
  });

  // eslint-disable-next-line max-len
  it('has file field for importing transaction if there is NO stored transaction data', async () => {
    paramsMock.get.mockReturnValue('');
    render(<SignTxnPage params={(async () => ({lang: ''}))()} />);
    expect(await screen.findByText(/import_txn.label/)).toBeInTheDocument();
  });

  it('has "compose transaction" (back) button', async () => {
    paramsMock.get.mockReturnValue(null);
    sessionStorage.setItem('txnData',
      // eslint-disable-next-line max-len
      '{"txn":{"type":"pay","snd":"3F3FPW6ZQQYD6JDC7FKKQHNGVVUIBIZOUI5WPSJEHBRABZDRN6LOTBMFEY","rcv":"3F3FPW6ZQQYD6JDC7FKKQHNGVVUIBIZOUI5WPSJEHBRABZDRN6LOTBMFEY","amt":0},"useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false}'
    );
    render(<SignTxnPage params={(async () => ({lang: ''}))()} />);
    expect(await screen.findByText('sign_txn:compose_txn_btn')).toBeEnabled();
  });

  // eslint-disable-next-line max-len
  it('has disabled "send transaction" (next step) button if transaction is NOT signed', async () => {
    paramsMock.get.mockReturnValue(null);
    sessionStorage.setItem('txnData',
      // eslint-disable-next-line max-len
      '{"txn":{"type":"pay","snd":"3F3FPW6ZQQYD6JDC7FKKQHNGVVUIBIZOUI5WPSJEHBRABZDRN6LOTBMFEY","rcv":"3F3FPW6ZQQYD6JDC7FKKQHNGVVUIBIZOUI5WPSJEHBRABZDRN6LOTBMFEY","amt":0},"useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false}'
    );
    render(<SignTxnPage params={(async () => ({lang: ''}))()} />);
    expect(await screen.findByText('send_txn_btn')).toHaveClass('btn-disabled');
  });

  it('has enabled "send transaction" (next step) button if transaction is signed', async () => {
    paramsMock.get.mockReturnValue(null);
    sessionStorage.setItem('txnData',
      // eslint-disable-next-line max-len
      '{"txn":{"type":"pay","snd":"3F3FPW6ZQQYD6JDC7FKKQHNGVVUIBIZOUI5WPSJEHBRABZDRN6LOTBMFEY","rcv":"3F3FPW6ZQQYD6JDC7FKKQHNGVVUIBIZOUI5WPSJEHBRABZDRN6LOTBMFEY","amt":0},"useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false}'
    );
    sessionStorage.setItem('signedTxn',
      // eslint-disable-next-line max-len
      '"data:application/octet-stream;base64,gqNzaWfEQLzVMbs6aqTbdYxSVHyTr4F30ZMvAawfKFXW9YWRQeAd+Rtrm4sXrVWpey1TV0ZExkYqawfSRiY5KWf5yrkc5AujdHhuiKNmZWXNA+iiZnbOAsptfqNnZW6sdGVzdG5ldC12MS4womdoxCBIY7UYpLPITsgQ8i1PEIHLD3HwWaesIN7GL39w5Qk6IqJsds4CynFmo3JjdsQg2XZX29mEMD8kYvlUqB2mrWiAoy6iO2fJJDhiAORxb5ajc25kxCDZdlfb2YQwPyRi+VSoHaataICjLqI7Z8kkOGIA5HFvlqR0eXBlo3BheQ=="'
    );
    render(<SignTxnPage params={(async () => ({lang: ''}))()} />);
    await waitFor(() => expect(screen.getByText('send_txn_btn')).not.toHaveClass('btn-disabled'));
  });

});
