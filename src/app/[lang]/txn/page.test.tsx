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
    get: () => null
  }),
}));

// Mock the wallet provider
jest.mock('../components/wallet/WalletProvider.tsx', () => 'div');

import TxnPresetsPage from './page';

describe('Transaction Presets Page', () => {

  it('has page title heading', () => {
    render(<TxnPresetsPage params={{lang: ''}} />);
    expect(screen.getByRole('heading', { level: 1 })).not.toBeEmptyDOMElement();
  });

});
