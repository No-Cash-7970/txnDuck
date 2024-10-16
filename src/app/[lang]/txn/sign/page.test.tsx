import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import algosdk from 'algosdkv3';
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
  dataUrlToBytes: async (dataUrl: string) => new Uint8Array()
}));

// Mock use-wallet before modules that use it are imported
jest.mock('@txnlab/use-wallet-react', () => useWalletUnconnectedMock);
// Mock the wallet provider
jest.mock('../../components/wallet/WalletProvider.tsx', () => 'div');

// Mock algosdk
jest.mock('algosdkv3', () => ({
  ...jest.requireActual('algosdkv3'),
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
  });

  it('has builder steps', () => {
    render(<SignTxnPage params={{lang: ''}} />);
    expect(screen.getByText(/builder_steps\.sign/)).toBeInTheDocument();
  });

  it('has page title heading', () => {
    render(<SignTxnPage params={{lang: ''}} />);
    expect(screen.getByRole('heading', { level: 1 })).not.toBeEmptyDOMElement();
  });

  it('has transaction information if there is stored transaction data', async () => {
    paramsMock.get.mockReturnValue(null);
    sessionStorage.setItem('txnData',
      '{"txn":{"type":"pay","snd":"7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M",'
      + '"fee":0.001,"fv":1,"lv":2,' // Change the fee
      + '"rcv":"7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M","amt":0},'
      + '"useSugFee":false,"useSugRounds":false,"apar_mUseSnd":false,"apar_fUseSnd":false,'
      + '"apar_cUseSnd":false,"apar_rUseSnd":false}'
    );
    render(<SignTxnPage params={{lang: ''}} />);
    expect(await screen.findByRole('table')).toBeInTheDocument();
  });

  it('has connect wallet/sign button if there is stored transaction data', () => {
    paramsMock.get.mockReturnValue(null);
    sessionStorage.setItem('txnData',
      '{"txn":{"type":"pay","snd":"7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M",'
      + '"fee":0.001,"fv":1,"lv":2,' // Change the fee
      + '"rcv":"7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M","amt":0},'
      + '"useSugFee":false,"useSugRounds":false,"apar_mUseSnd":false,"apar_fUseSnd":false,'
      + '"apar_cUseSnd":false,"apar_rUseSnd":false}'
    );
    render(<SignTxnPage params={{lang: ''}} />);
    expect(screen.getByText('wallet.connect')).toBeInTheDocument();
  });

  it('has file field for importing transaction if there is NO stored transaction data', () => {
    paramsMock.get.mockReturnValue('');
    render(<SignTxnPage params={{lang: ''}} />);
    expect(screen.getByText(/import_txn.label/)).toBeInTheDocument();
  });

  it('has "compose transaction" (back) button', () => {
    paramsMock.get.mockReturnValue(null);
    sessionStorage.setItem('txnData',
      '{"txn":{"type":"pay","snd":"7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M",'
      + '"fee":0.001,"fv":1,"lv":2,' // Change the fee
      + '"rcv":"7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M","amt":0},'
      + '"useSugFee":false,"useSugRounds":false,"apar_mUseSnd":false,"apar_fUseSnd":false,'
      + '"apar_cUseSnd":false,"apar_rUseSnd":false}'
    );
    render(<SignTxnPage params={{lang: ''}} />);
    expect(screen.getByText('sign_txn:compose_txn_btn')).toBeEnabled();
  });

  it('has disabled "send transaction" (next step) button if transaction is NOT signed', () => {
    paramsMock.get.mockReturnValue(null);
    sessionStorage.setItem('txnData',
      '{"txn":{"type":"pay","snd":"7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M",'
      + '"fee":0.001,"fv":1,"lv":2,' // Change the fee
      + '"rcv":"7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M","amt":0},'
      + '"useSugFee":false,"useSugRounds":false,"apar_mUseSnd":false,"apar_fUseSnd":false,'
      + '"apar_cUseSnd":false,"apar_rUseSnd":false}'
    );
    sessionStorage.removeItem('signedTxn');
    render(<SignTxnPage params={{lang: ''}} />);
    expect(screen.getByText('send_txn_btn')).toHaveClass('btn-disabled');
  });

  it('has enabled "send transaction" (next step) button if transaction is signed', async () => {
    paramsMock.get.mockReturnValue(null);
    sessionStorage.setItem('txnData',
      '{"txn":{"type":"pay","snd":"7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M",'
      + '"fee":0.001,"fv":1,"lv":2,' // Change the fee
      + '"rcv":"7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M","amt":0},'
      + '"useSugFee":false,"useSugRounds":false,"apar_mUseSnd":false,"apar_fUseSnd":false,'
      + '"apar_cUseSnd":false,"apar_rUseSnd":false}'
    );
    sessionStorage.setItem('signedTxn', JSON.stringify('a signed transaction'));
    render(<SignTxnPage params={{lang: ''}} />);
    await waitFor(() => expect(screen.getByText('send_txn_btn')).not.toHaveClass('btn-disabled'));
  });

});
