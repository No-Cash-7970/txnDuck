import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import FieldGroup from "./FieldGroup";

describe('Form Components - FieldGroup', () => {
  it('renders children', () => {
    render(<FieldGroup>foo</FieldGroup>);
    expect(screen.getByText(/foo/)).toBeInTheDocument();
  });

  it('renders heading', () => {
    render(<FieldGroup heading='Foo Group'></FieldGroup>);
    expect(screen.getByRole('heading')).toHaveTextContent(/Foo Group/);
  });

  it('renders heading of specified level', () => {
    render(<FieldGroup heading='Foo Group' headingLevel={5}></FieldGroup>);
    expect(screen.getByRole('heading', { level: 5 })).toHaveTextContent(/Foo Group/);
  });

  it('renders heading with class if `headingClass` is specified', () => {
    render(<FieldGroup heading='Foo Group' headingClass='foo-class'></FieldGroup>);
    expect(screen.getByRole('heading')).toHaveClass('foo-class');
  });

  it('renders heading with `id` if `headingId` is specified', () => {
    render(<FieldGroup heading='Foo Group' headingId='foo-id'></FieldGroup>);
    expect(screen.getByRole('heading')).toHaveAttribute('id', 'foo-id');
  });

  it('renders container with class(es) specified in `containerClass`', () => {
    render(<FieldGroup containerClass='foo'></FieldGroup>);
    expect(screen.getByRole('group')).toHaveClass('foo');
  });

});
