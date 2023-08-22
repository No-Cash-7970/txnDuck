/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import PageTitleHeading from "./PageTitleHeading";

describe('PageTitleHeading Component', () => {

  it('renders heading', () => {
    render(<PageTitleHeading>Hello!</PageTitleHeading>);
    expect(screen.getByRole('heading')).toHaveTextContent('Hello!');
  });

  it('can render empty heading', () => {
    render(<PageTitleHeading></PageTitleHeading>);
    expect(screen.getByRole('heading')).toHaveTextContent('');
  });

  it('renders badge when badge text is given', () => {
    const {container} = render(<PageTitleHeading badgeText='Greeting'></PageTitleHeading>);

    const badge = container.querySelector('.badge');

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Greeting');
  });

  it('does not badge when badge text is not given', () => {
    const {container} = render(<PageTitleHeading></PageTitleHeading>);
    expect(container.querySelector('.badge')).not.toBeInTheDocument();
  });

  it('does not badge when badge text is empty', () => {
    const {container} = render(<PageTitleHeading badgeText=''></PageTitleHeading>);
    expect(container.querySelector('.badge')).not.toBeInTheDocument();
  });

});
