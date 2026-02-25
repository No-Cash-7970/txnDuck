import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import i18nextClientMock from '@/app/lib/testing/i18nextClientMock';

// Mock react `use` function before modules that use it are imported
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: () => ({ t: (key: string) => key }),
}));

// Mock i18next before modules that use it are imported because it is used by a child component
jest.mock('react-i18next', () => i18nextClientMock);

// Mock navigation hooks
jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: () => null,
    size: 1,
    toString: () => 'param=test',
  }),
}));

// Mock the wallet provider
jest.mock('../components/wallet/WalletProvider.tsx', () => 'div');

import TxnPresetsPage from './page';

describe('Transaction Presets Page', () => {

  it('has page title heading', () => {
    const pageParam = new Promise<any>(resolve => { resolve({lang: ''}); });
    render(<TxnPresetsPage params={pageParam} />);
    expect(screen.getByRole('heading', { level: 1 })).not.toBeEmptyDOMElement();
  });

  it('has a "skip preset" link that has the pages URL search parameters', () => {
    const pageParam = new Promise<any>(resolve => { resolve({lang: ''}); });
    render(<TxnPresetsPage params={pageParam} />);
    expect(screen.getByText('skip_btn')).toHaveAttribute('href', '/txn/compose?param=test');
  });
});
