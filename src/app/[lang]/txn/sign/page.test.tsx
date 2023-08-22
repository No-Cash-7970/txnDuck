import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

// Mock i18next before modules that use i18next are imported
import  i18nextMock from "@/app/lib/testing/i18nextMock";
jest.mock('react-i18next', () => i18nextMock);

// Modules that use i18next
import SignTxnPage from "./page";

describe("Sign Transaction Page", () => {

  it("renders without crashing", () => {
    render(<SignTxnPage params={{lang: ''}} />);
    expect(screen.getByText(/coming_soon/)).toBeInTheDocument();
  });

  it("has builder steps", () => {
    render(<SignTxnPage params={{lang: ''}} />);
    expect(screen.getByText(/builder_steps\.sign/)).toBeInTheDocument();
  });

  it("has page title heading", () => {
    render(<SignTxnPage params={{lang: ''}} />);
    const pageTitleHeading = screen.getByRole('heading', { level: 1 });
    expect(pageTitleHeading.innerHTML).toBe('title');
  });

});
