import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
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
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => ({get: () => 'foo'})
}));


// Mock use-wallet before modules that use it are imported
jest.mock('@txnlab/use-wallet-react', () => useWalletUnconnectedMock);
// Mock the wallet provider
jest.mock('../../components/WalletProvider.tsx', () => 'div');

import ComposeTxnPage from './page';

describe('Compose Transaction Page', () => {

  it('has builder steps', async () => {
    render(<ComposeTxnPage params={{lang: ''}} />);
    expect(await screen.findByText(/builder_steps\.compose/)).toBeInTheDocument();
  });

  it('has page title heading', async () => {
    render(<ComposeTxnPage params={{lang: ''}} />);
    expect(await screen.findByRole('heading', { level: 1 })).not.toBeEmptyDOMElement();
  });

  it('has form', async () => {
    render(<ComposeTxnPage params={{lang: ''}} />);
    expect(await screen.findByRole('form')).toBeInTheDocument();
  });

});
