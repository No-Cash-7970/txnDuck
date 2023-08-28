import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

// Mock react `use` function before modules that use it are imported
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: () => ({ t: (key: string) => key }),
}));

import HomePage from "./page";

describe("Home Page", () => {
  it("renders without crashing", () => {
    render(<HomePage params={{lang: ''}} />);
    const startBtn = screen.getByText(/start_button/);
    expect(startBtn).toBeInTheDocument();
  });
});
