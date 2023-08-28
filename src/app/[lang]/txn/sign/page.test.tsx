import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

// Mock react `use` function before modules that use it are imported
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: () => ({ t: (key: string) => key }),
}));

import SignTxnPage from "./page";

describe("Sign Transaction Page", () => {

  it("has builder steps", () => {
    render(<SignTxnPage params={{lang: ''}} />);
    expect(screen.getByText(/builder_steps\.sign/)).toBeInTheDocument();
  });

  it("has page title heading", () => {
    render(<SignTxnPage params={{lang: ''}} />);
    expect(screen.getByRole('heading', { level: 1 })).not.toBeEmptyDOMElement();
  });

});
