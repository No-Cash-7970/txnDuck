import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

// Mock i18next before modules that use i18next are imported
import  i18nextMock from "@/app/[lang]/lib/testing/i18nextMock";
jest.mock('react-i18next', () => i18nextMock);

// Modules that use i18next
import NavBar from "./NavBar";

describe('Nav Bar Component', () => {

  it('renders', () => {
    render(<NavBar />);

    const navBarContainer = screen.getByRole('navigation');

    expect(navBarContainer).toBeInTheDocument();
  });

  it('has site name', () => {
    render(<NavBar />);

    const siteName1 = screen.getByText(/name_pt_1/);
    const siteName2 = screen.getByText(/name_pt_2/);

    expect(siteName1).toBeInTheDocument();
    expect(siteName2).toBeInTheDocument();
  });

});
