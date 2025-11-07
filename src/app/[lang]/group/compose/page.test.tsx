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
jest.mock('../../components/wallet/WalletProvider.tsx', () => 'div');

import GroupComposePage from './page';

describe('Group Transactions Compose Page', () => {

  it('has builder steps', async () => {
    const pageParam = new Promise<any>(resolve => { resolve({lang: ''}); });
    render(<GroupComposePage params={pageParam} />);
    expect(await screen.findByText(/builder_steps\.compose/)).toBeInTheDocument();
  });

  it('has page title heading', async () => {
    const pageParam = new Promise<any>(resolve => { resolve({lang: ''}); });
    render(<GroupComposePage params={pageParam} />);
    expect(await screen.findByRole('heading', { level: 1 })).not.toBeEmptyDOMElement();
  });

  it('has transaction group list', async () => {
    const pageParam = new Promise<any>(resolve => { resolve({lang: ''}); });
    render(<GroupComposePage params={pageParam} />);
    expect(await screen.findByText(/grp_list_no_txn/)).toBeInTheDocument();
  });

});
