import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

// Mock i18next before modules that use i18next are imported
import  i18nextMock from "@/app/lib/testing/i18nextMock";
jest.mock('react-i18next', () => i18nextMock);

// Modules that use i18next
import SendTxnPage from "./page";

describe("Send Transaction Page", () => {

  it("renders without crashing", () => {
    render(<SendTxnPage params={{lang: ''}} />);
    expect(screen.getByText(/coming_soon/)).toBeInTheDocument();
  });

  it("has builder steps", () => {
    render(<SendTxnPage params={{lang: ''}} />);
    expect(screen.getByText(/builder_steps\.send/)).toBeInTheDocument();
  });

  it("has page title heading", () => {
    render(<SendTxnPage params={{lang: ''}} />);
    const pageTitleHeading = screen.getByRole('heading', { level: 1 });
    expect(pageTitleHeading.innerHTML).toBe('title');
  });

});
