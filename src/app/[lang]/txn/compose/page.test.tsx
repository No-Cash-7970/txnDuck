import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

// Mock i18next before modules that use i18next are imported
import  i18nextMock from "@/app/[lang]/lib/testing/i18nextMock";
jest.mock('react-i18next', () => i18nextMock);

// Modules that use i18next
import ComposeTxnPage from "./page";

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
