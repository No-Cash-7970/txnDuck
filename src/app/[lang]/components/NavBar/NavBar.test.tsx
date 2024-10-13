import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import i18nextClientMock from '@/app/lib/testing/i18nextClientMock';
// This must be imported after the mock classes are imported
import { JotaiProvider } from '@/app/[lang]/components';

// Mock react `use` function before modules that use it are imported
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: () => ({ t: (key: string) => key }),
}));

// Mock useRouter because it is used by child components
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/current/url/of/page',
  useSearchParams: () => ({
    toString: () => 'q=yes',
    get: () => null,
  }),
}));

// Mock i18next because it is used by child components
jest.mock('react-i18next', () => i18nextClientMock);

// Mock the wallet provider
jest.mock('../wallet/WalletProvider.tsx', () => 'div');

import NavBar  from './NavBar';

describe('Nav Bar Component', () => {

  it('has site name', async () => {
    render(<JotaiProvider><NavBar /></JotaiProvider>);
    expect(await screen.findByText('site_name_pt1')).toBeInTheDocument();
    expect(screen.getByText('site_name_pt2')).toBeInTheDocument();
  });

  it('has node selector button', async () => {
    render(<JotaiProvider><NavBar /></JotaiProvider>);
    expect(await screen.findByTitle('node_selector.choose_node')).toBeInTheDocument();
  });

  it('has language selector button', async () => {
    render(<JotaiProvider><NavBar /></JotaiProvider>);
    expect(await screen.findByTestId('lang-btn')).toBeInTheDocument();
  });

  it('has settings button', async () => {
    render(<JotaiProvider><NavBar /></JotaiProvider>);
    expect(await screen.findByTitle('settings.heading')).toBeInTheDocument();
  });

});
