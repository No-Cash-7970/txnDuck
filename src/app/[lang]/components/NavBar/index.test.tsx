import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import i18nextClientMock from "@/app/lib/testing/i18nextClientMock";

// Mock react `use` function before modules that use it are imported
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: () => ({ t: (key: string) => key }),
}));
// Mock useRouter because it is used by a child component
jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: jest.fn() })
}));
// Mock i18next before modules that use it are imported. This needs to be mocked because it is a
// dependency of a child client component.
jest.mock('react-i18next', () => i18nextClientMock);

import NavBar from '.';

describe.only('Nav Bar Component', () => {

  it('renders', () => {
    render(<NavBar />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('has site name', () => {
    render(<NavBar />);
    expect(screen.getByText('site_name_formatted')).toBeInTheDocument();
  });

  it('has settings button', () => {
    render(<NavBar />);
    expect(screen.getByTitle('settings.heading')).toBeInTheDocument();
  });

});
