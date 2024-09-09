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
    render(<PrivacyPolicyPage params={{lang: ''}} />);
    expect(screen.getByRole('heading', { level: 1 })).not.toBeEmptyDOMElement();
  });

});
