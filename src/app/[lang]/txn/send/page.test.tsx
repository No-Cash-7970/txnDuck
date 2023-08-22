import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import SendTxnPage from "./page";

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
  Trans: ({ lng }: { lng: string }) => lng,
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  }
}));

describe("Send Transaction Page", () => {

  it("renders without crashing", () => {
    render(<SendTxnPage params={{lang: ''}} />);
    expect(screen.getByText(/coming_soon/)).toBeInTheDocument();
  });

  it("has builder steps", () => {
    render(<SendTxnPage params={{lang: ''}} />);
    expect(screen.getByText(/builder_steps\.send/)).toBeInTheDocument();
  });

});
