import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import i18nextClientMock from "@/app/lib/testing/i18nextClientMock";

// Mock react `use` function before modules that use it are imported
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: () => ({ t: (key: string) => key }),
}));
// Mock i18next before modules that use it are imported. This needs to be mocked because it is a
// dependency of a child client component.
jest.mock('react-i18next', () => i18nextClientMock);
// Mock useRouter because it is used by a child component
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() })
}));

import ComposeTxnPage from "./page";

describe("Compose Transaction Page", () => {

  it('has builder steps', () => {
    render(<ComposeTxnPage params={{lang: ''}} />);
    expect(screen.getByText(/builder_steps\.compose/)).toBeInTheDocument();
  });

  it('has page title heading', () => {
    render(<ComposeTxnPage params={{lang: ''}} />);
    expect(screen.getByRole('heading', { level: 1 })).not.toBeEmptyDOMElement();
  });

  it('has form', () => {
    render(<ComposeTxnPage params={{lang: ''}} />);
    expect(screen.getByRole('form')).toBeInTheDocument();
  });

});
