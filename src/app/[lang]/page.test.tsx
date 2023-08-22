import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

// Mock i18next before modules that use i18next are imported
import  i18nextMock from "@/app/lib/testing/i18nextMock";
jest.mock('react-i18next', () => i18nextMock);

// Modules that use i18next
import HomePage from "./page";

describe("Home Page", () => {
  it("should render without crashing", () => {
    render(<HomePage params={{lang: ''}} />);

    const startBtn = screen.getByText(/start_button/);

    expect(startBtn).toBeInTheDocument();
  });
});
