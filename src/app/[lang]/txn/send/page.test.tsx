import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import i18nextClientMock from '@/app/lib/testing/i18nextClientMock';
import { JotaiProvider } from '@/app/[lang]/components';

// Mock i18next before modules that use it are imported because it is used by a child component
jest.mock('react-i18next', () => i18nextClientMock);
// Mock navigation hooks
jest.mock('next/navigation', () => ({ useSearchParams: () => ({get: () => 'foo'}) }));
// Mock use-debounce because it is a dependency of a child client component
jest.mock('use-debounce', () => ({ useDebouncedCallback: (fn: any) => fn }));
// Mock the wallet provider
jest.mock('../../components/wallet/WalletProvider.tsx', () => 'div');

// Mock react `use` function before modules that use it are imported
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: () => ({ t: (key: string) => key }),
}));

// Mock the utils library because of the use of `fetch()`. This needs to be mocked because it is a
// dependency of a child client component.
jest.mock('../../../lib/utils.ts', () => ({
  dataUrlToBytes: async (dataUrl: string) => new Uint8Array()
}));

// Mock navigation hooks because they are used by a child components
const paramsMock = {get: jest.fn()};
jest.mock('next/navigation', () => ({
  useRouter: () => ({}),
  useSearchParams: () => paramsMock,
}));

import SendTxnPage from './page';

describe('Send Transaction Page', () => {
  afterEach(() => {
    paramsMock.get.mockClear();
  });

  it('has builder steps', () => {
    render(<SendTxnPage params={{lang: ''}} />);
    expect(screen.getByText(/builder_steps\.send/)).toBeInTheDocument();
  });

  it('has page title heading', () => {
    render(<SendTxnPage params={{lang: ''}} />);
    expect(screen.getByRole('heading', { level: 1 })).not.toBeEmptyDOMElement();
  });

  // eslint-disable-next-line max-len
  it('immediately attempts to send stored signed transaction if there is a stored signed transaction',
  async () => {
    paramsMock.get.mockReturnValue(null);
    sessionStorage.setItem('signedTxn', JSON.stringify('data:application/octet-stream;base64,'));
    render(<JotaiProvider><SendTxnPage params={{lang: ''}} /></JotaiProvider>);
    expect(await screen.findByText('txn_confirm_wait')).toBeInTheDocument();
  });

  it('has file field for importing transaction if there is NO stored signed transaction',
  async () => {
    paramsMock.get.mockReturnValue(null);
    sessionStorage.clear();
    render(<JotaiProvider><SendTxnPage params={{lang: ''}} /></JotaiProvider>);
    expect(await screen.findByText(/import_txn.label/)).toBeInTheDocument();
  });

  // eslint-disable-next-line max-len
  it('has file field for importing transaction if "import" parameter is present in the URL and there is a stored signed transaction',
  async () => {
    paramsMock.get.mockReturnValue('');
    sessionStorage.setItem('signedTxn', JSON.stringify('data:application/octet-stream;base64,'));
    render(<JotaiProvider><SendTxnPage params={{lang: ''}} /></JotaiProvider>);
    expect(await screen.findByText(/import_txn.label/)).toBeInTheDocument();
  });

});
