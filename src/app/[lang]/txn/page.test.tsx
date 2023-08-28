import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

// Mock react `use` function before modules that use it are imported
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: () => ({ t: (key: string) => key }),
}));

import TxnTemplatePage from "./page";

describe("Transaction Template Page", () => {

  it("has page title heading", () => {
    render(<TxnTemplatePage params={{lang: ''}} />);
    expect(screen.getByRole('heading', { level: 1 })).not.toBeEmptyDOMElement();
  });

});
