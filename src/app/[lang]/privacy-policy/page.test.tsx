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

// Mock the wallet provider
jest.mock('../components/wallet/WalletProvider.tsx', () => 'div');

import PrivacyPolicyPage from './page';

describe('Privacy Policy Page', () => {

  it('has page title heading', () => {
    const pageParam = new Promise<any>(resolve => { resolve({lang: ''}); });
    render(<PrivacyPolicyPage params={pageParam} />);
    expect(screen.getByRole('heading', { level: 1 })).not.toBeEmptyDOMElement();
  });

  it('shows information about Magic when it is enabled', () => {
    process.env.NEXT_PUBLIC_MAGIC_API_KEY = 'Some API Key';
    const pageParam = new Promise<any>(resolve => { resolve({lang: ''}); });
    render(<PrivacyPolicyPage params={pageParam} />);

    expect(screen.getByText('personal_info.details_magic')).toBeInTheDocument();
    expect(screen.queryByText('personal_info.details')).not.toBeInTheDocument();
    expect(screen.getByText('magic_auth.heading')).toBeInTheDocument();
  });

  it('does not show information about Magic when it is disabled', () => {
    process.env.NEXT_PUBLIC_MAGIC_API_KEY = '';
    const pageParam = new Promise<any>(resolve => { resolve({lang: ''}); });
    render(<PrivacyPolicyPage params={pageParam} />);

    expect(screen.getByText('personal_info.details')).toBeInTheDocument();
    expect(screen.queryByText('personal_info.details_magic')).not.toBeInTheDocument();
    expect(screen.queryByText('magic_auth.heading')).not.toBeInTheDocument();
  });

});
