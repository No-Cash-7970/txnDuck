import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

// Mock react `use` function before modules that use it are imported
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: () => ({ t: (key: string) => key }),
}));

import TxnTemplatePage from "./page";

describe("Transaction Template Page", () => {
  it("renders without crashing", () => {
    render(<TxnTemplatePage params={{lang: ''}} />);
    expect(screen.getByText(/coming_soon/)).toBeInTheDocument();
  });

  it("has page title heading", () => {
    render(<TxnTemplatePage params={{lang: ''}} />);
    const pageTitleHeading = screen.getByRole('heading', { level: 1 });
    expect(pageTitleHeading).not.toBeEmptyDOMElement();
  });
});
