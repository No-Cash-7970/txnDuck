/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import TextAreaField from "./TextAreaField";

describe('Form Components - TextAreaField', () => {

  it('has input as a required field if `required` is true', () => {
    render(<TextAreaField required={true} />);

    expect(screen.getByRole('textbox')).toBeRequired();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not have input as a required field if `required` is false', () => {
    render(<TextAreaField required={false} />);

    expect(screen.getByRole('textbox')).not.toBeRequired();
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('has required notice in label with `title` specified in `requiredText`', () => {
    render(<TextAreaField required={true} requiredText='foo' />);
    expect(screen.getByText('*')).toHaveAccessibleDescription('foo');
  });

  it('has input with `id` specified in `inputId` property', () => {
    render(<TextAreaField id='foo' />);
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'foo');
  });

  it('has input with class(es) specified in `inputClass` property', () => {
    render(<TextAreaField inputClass='foo' />);
    expect(screen.getByRole('textbox')).toHaveClass('foo');
  });

  it('has label with text specified in `label` property', () => {
    render(<TextAreaField label='foo' />);
    expect(screen.getByText(/foo/)).toBeInTheDocument();
  });

  it('has input INSIDE label if `inputInsideLabel` is true', () => {
    const { container } = render(<TextAreaField inputInsideLabel={true} />);

    expect(container.querySelector('label > textarea')).toBeInTheDocument();
    expect(container.querySelector('label + textarea')).not.toBeInTheDocument();
  });

  it('has input OUTSIDE label if `inputInsideLabel` is false', () => {
    const { container } = render(<TextAreaField inputInsideLabel={false} />);

    expect(container.querySelector('label > textarea')).not.toBeInTheDocument();
    expect(container.querySelector('label + textarea')).toBeInTheDocument();
  });

  it('has input OUTSIDE label by default', () => {
    const { container } = render(<TextAreaField />);

    expect(container.querySelector('label > textarea')).not.toBeInTheDocument();
    expect(container.querySelector('label + textarea')).toBeInTheDocument();
  });

  it('focuses on INNER input if label text is clicked', async () => {
    render(<TextAreaField label='foo' inputInsideLabel={true} />);
    await userEvent.click(screen.getByText(/foo/)); // Click label
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('focuses on OUTER input if label text is clicked', async () => {
    render(<TextAreaField label='foo' inputInsideLabel={false} id='test-field' />);
    await userEvent.click(screen.getByText(/foo/)); // Click label
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('has container with class(es) specified in `containerClass` property', () => {
    const { container } = render(<TextAreaField containerClass='foo' />);
    const containerElem = container.getElementsByClassName('form-control')[0];
    expect(containerElem).toHaveClass('foo');
  });

  it('has help message with text specified in `helpMsg` property', () => {
    render(<TextAreaField helpMsg='foo' />);
    expect(screen.getByText(/foo/)).toBeInTheDocument();
  });

  it('has placeholder with text specified in `placeholder` property', () => {
    render(<TextAreaField placeholder='foo' />);
    expect(screen.getByPlaceholderText('foo')).toBeInTheDocument();
  });

  it('has side-label with text specified in `beforeSideLabel` before input (outside label)', () => {
    const { container } = render(<TextAreaField beforeSideLabel='foo' inputInsideLabel={false} />);
    expect(container.querySelector('.join-item:first-child')).toHaveTextContent('foo');
  });

  it('has side-label with text specified in `afterSideLabel` after input (outside label)', () => {
    const { container } = render(<TextAreaField afterSideLabel='foo' inputInsideLabel={false} />);
    expect(container.querySelector('.join-item:last-child')).toHaveTextContent('foo');
  });

  it('has side-label with text specified in `beforeSideLabel` before input (inside label)', () => {
    const { container } = render(<TextAreaField beforeSideLabel='foo' inputInsideLabel={true} />);
    expect(container.querySelector('.join-item:first-child')).toHaveTextContent('foo');
  });

  it('has side-label with text specified in `afterSideLabel` after input (inside label)', () => {
    const { container } = render(<TextAreaField afterSideLabel='foo' inputInsideLabel={true} />);
    expect(container.querySelector('.join-item:last-child')).toHaveTextContent('foo');
  });

  it('has input with value specified `defaultValue` property by default', () => {
    render(<TextAreaField defaultValue='foo' />);
    expect(screen.getByRole('textbox')).toHaveValue('foo');
  });

  it('has input with name specified in `name` property', () => {
    render(<TextAreaField name='foo' />);
    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'foo');
  });

  it('disables the input if `disabled` is true', () => {
    render(<TextAreaField disabled={true} />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('enables the input if `disabled` is false', () => {
    render(<TextAreaField disabled={false} />);
    expect(screen.getByRole('textbox')).not.toBeDisabled();
  });

  it('has input with auto-complete value specified in `autoComplete` property', () => {
    render(<TextAreaField autoComplete='foo' />);
    expect(screen.getByRole('textbox')).toHaveAttribute('autocomplete', 'foo');
  });

  it('has input with spell-check enabled if `spellCheck` is true', () => {
    render(<TextAreaField disabled={true} />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

});
