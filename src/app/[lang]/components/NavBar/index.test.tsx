import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import i18nextClientMock from '@/app/lib/testing/i18nextClientMock';

// Mock react `use` function before modules that use it are imported
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: () => ({ t: (key: string) => key }),
}));
// Mock useRouter because it is used by child components
jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: jest.fn() }),
  usePathname: () => '/current/url/of/page',
  useSearchParams: () => ({toString: () => 'q=yes'}),
}));
// Mock i18next because it is used by child components
jest.mock('react-i18next', () => i18nextClientMock);

import NavBar from '.';

describe('Nav Bar Component', () => {

  it('renders', () => {
    render(<NavBar />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('has site name', () => {
    render(<NavBar />);
    expect(screen.getByText('site_name_formatted')).toBeInTheDocument();
  });

  it('has node selector button', () => {
    render(<NavBar />);
    expect(screen.getByTitle('node_selector.choose_node')).toBeInTheDocument();
  });

  it('has language selector button', () => {
    render(<NavBar />);
    expect(screen.getByTestId('lang-btn')).toBeInTheDocument();
  });

  it('has settings button', () => {
    render(<NavBar />);
    expect(screen.getByTitle('settings.heading')).toBeInTheDocument();
  });

});
