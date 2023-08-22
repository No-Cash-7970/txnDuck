import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ComposeTxnPage from "./page";

// This mock makes sure any components using the translate hook can use it without a warning being
// shown
// From https://react.i18next.com/misc/testing
jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  Trans: ({ children }: { children: React.ReactNode }) => children,
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  }
}));

describe("Compose Transaction Page", () => {

  it("renders without crashing", () => {
    render(<ComposeTxnPage params={{lang: ''}} />);
    expect(screen.getByText(/coming_soon/)).toBeInTheDocument();
  });

  it("has builder steps", () => {
    render(<ComposeTxnPage params={{lang: ''}} />);
    expect(screen.getByText(/builder_steps\.compose/)).toBeInTheDocument();
  });

  it("has page title heading", () => {
    render(<ComposeTxnPage params={{lang: ''}} />);
    const pageTitleHeading = screen.getByRole('heading', { level: 1 });
    expect(pageTitleHeading.innerHTML).toBe('title');
  });

  it("has instructions", () => {
    render(<ComposeTxnPage params={{lang: ''}} />);
    expect(screen.getByText(/asterisk_fields/)).toBeInTheDocument();
  });

});
