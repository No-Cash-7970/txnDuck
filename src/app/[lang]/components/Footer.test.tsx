import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

// Mock react `use` function before modules that use it are imported
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: () => ({ t: (key: string) => key }),
}));

import Footer from "./Footer";

describe('Footer Component', () => {

  it('renders', () => {
    render(<Footer />);
    const footerContainer = screen.getByRole('contentinfo');
    expect(footerContainer).toBeInTheDocument();
  });

});
