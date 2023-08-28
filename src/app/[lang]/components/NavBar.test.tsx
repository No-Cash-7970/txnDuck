import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

// Mock react `use` function before modules that use it are imported
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: () => ({ t: (key: string) => key }),
}));

import NavBar from "./NavBar";

describe('Nav Bar Component', () => {

  it('renders', () => {
    render(<NavBar />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('has site name', () => {
    render(<NavBar />);
    const siteName = screen.getByText(/site_name_formatted/);
    expect(siteName).toBeInTheDocument();
  });

});
