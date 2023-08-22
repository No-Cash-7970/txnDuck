import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import NavBar from "./NavBar";

// This mock makes sure any components using the translate hook can use it without a warning being
// shown
// From https://react.i18next.com/misc/testing
jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {},
    };
  },
  Trans: ({ i18nKey }: { i18nKey: string }) => {
    if (i18nKey === 'site_name_formatted') return <>txn<b>Duck</b></>;
  },
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  }
}));

describe('Nav Bar Component', () => {

  it('renders', () => {
    render(<NavBar />);

    const navBarContainer = screen.getByRole('navigation');

    expect(navBarContainer).toBeInTheDocument();
  });

  it('has site name', () => {
    render(<NavBar />);

    const siteName1 = screen.getByText(/txn/);
    const siteName2 = screen.getByText(/Duck/);

    expect(siteName1).toBeInTheDocument();
    expect(siteName2).toBeInTheDocument();
  });

});
