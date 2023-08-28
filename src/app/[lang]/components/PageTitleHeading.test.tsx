/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import PageTitleHeading from "./PageTitleHeading";

describe('PageTitleHeading Component', () => {

  it('has heading', () => {
    render(<PageTitleHeading>Hello!</PageTitleHeading>);
    expect(screen.getByRole('heading')).toHaveTextContent('Hello!');
  });

  it('can have empty heading', () => {
    render(<PageTitleHeading></PageTitleHeading>);
    expect(screen.getByRole('heading')).toHaveTextContent('');
  });

  it('has badge with text specified in `badgeText` property', () => {
    const {container} = render(<PageTitleHeading badgeText='Greeting'></PageTitleHeading>);

    const badge = container.querySelector('.badge');

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Greeting');
  });

  it('does not have badge when `badgeText` is not given', () => {
    const {container} = render(<PageTitleHeading></PageTitleHeading>);
    expect(container.querySelector('.badge')).not.toBeInTheDocument();
  });

  it('does not have badge when `badgeText` is empty', () => {
    const {container} = render(<PageTitleHeading badgeText=''></PageTitleHeading>);
    expect(container.querySelector('.badge')).not.toBeInTheDocument();
  });

});
