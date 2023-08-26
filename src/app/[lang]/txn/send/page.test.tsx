import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

// Mock react `use` function before modules that use it are imported
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: () => ({ t: (key: string) => key }),
}));

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
    expect(pageTitleHeading).not.toBeEmptyDOMElement();
  });

});
