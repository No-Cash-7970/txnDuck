/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import SelectField from "./SelectField";

describe('Form Components - SelectField', () => {

  it('has input as a required field if `required` is true', () => {
    render(<SelectField required={true} />);

    expect(screen.getByRole('combobox')).toHaveAttribute('required');
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not have input as a required field if `required` is false', () => {
    render(<SelectField required={false} />);

    expect(screen.getByRole('combobox')).not.toHaveAttribute('required');
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('has required notice in label with `title` specified in `requiredText`', () => {
    render(<SelectField required={true} requiredText='foo' />);
    expect(screen.getByText('*')).toHaveAttribute('title', 'foo');
  });

  it('has input with `id` specified in `inputId` property', () => {
    const { container } = render(<SelectField id='foo' />);
    expect(container.querySelector('#foo')).toBeInTheDocument();
  });

  it('has input with class(es) specified in `inputClass` property', () => {
    const { container } = render(<SelectField inputClass='foo' />);
    const inputElem = container.getElementsByTagName('select')[0];
    expect(inputElem).toHaveClass('foo');
  });

  it('has label with text specified in `label` property', () => {
    render(<SelectField label='foo' />);
    expect(screen.getByText(/foo/)).toBeInTheDocument();
  });

  it('has input INSIDE label if `inputInsideLabel` is true', () => {
    const { container } = render(<SelectField inputInsideLabel={true} />);

    expect(container.querySelector('label > select')).toBeInTheDocument();
    expect(container.querySelector('label + select')).not.toBeInTheDocument();
  });

  it('has input OUTSIDE label if `inputInsideLabel` is false', () => {
    const { container } = render(<SelectField inputInsideLabel={false} />);

    expect(container.querySelector('label > select')).not.toBeInTheDocument();
    expect(container.querySelector('label + select')).toBeInTheDocument();
  });

  it('has input OUTSIDE label by default', () => {
    const { container } = render(<SelectField />);

    expect(container.querySelector('label > select')).not.toBeInTheDocument();
    expect(container.querySelector('label + select')).toBeInTheDocument();
  });

  it('focuses on INNER input if label text is clicked', async () => {
    render(<SelectField label='foo' inputInsideLabel={true} />);
    await userEvent.click(screen.getByText(/foo/));
    expect(screen.getByRole('combobox')).toHaveFocus();
  });

  it('focuses on OUTER input if label text is clicked', async () => {
    render(<SelectField label='foo' inputInsideLabel={false} id='test-field' />);
    await userEvent.click(screen.getByText(/foo/));
    expect(screen.getByRole('combobox')).toHaveFocus();
  });

  it('has container with class(es) specified in `containerClass` property', () => {
    const { container } = render(<SelectField containerClass='foo' />);
    const containerElem = container.getElementsByClassName('form-control')[0];
    expect(containerElem).toHaveClass('foo');
  });

  it('has help message with text specified in `helpMsg` property', () => {
    render(<SelectField helpMsg='foo' />);
    expect(screen.getByText(/foo/)).toBeInTheDocument();
  });

  it('has placeholder with text specified in `placeholder` property', () => {
    render(<SelectField placeholder='foo' />);

    expect(screen.getByText('foo')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('');
  });

  it('has side-label with text specified in `beforeSideLabel` before input (outside label)', () => {
    const { container } = render(<SelectField beforeSideLabel='foo' inputInsideLabel={false} />);
    expect(container.querySelector('.join-item:first-child')).toHaveTextContent('foo');
  });

  it('has side-label with text specified in `afterSideLabel` after input (outside label)', () => {
    const { container } = render(<SelectField afterSideLabel='foo' inputInsideLabel={false} />);
    expect(container.querySelector('.join-item:last-child')).toHaveTextContent('foo');
  });

  it('has side-label with text specified in `beforeSideLabel` before input (inside label)', () => {
    const { container } = render(<SelectField beforeSideLabel='foo' inputInsideLabel={true} />);
    expect(container.querySelector('.join-item:first-child')).toHaveTextContent('foo');
  });

  it('has side-label with text specified in `afterSideLabel` after input (inside label)', () => {
    const { container } = render(<SelectField afterSideLabel='foo' inputInsideLabel={true} />);
    expect(container.querySelector('.join-item:last-child')).toHaveTextContent('foo');
  });

  it('has input with options specified in `options` property', () => {
    render(<SelectField options={[{value: 'foo', text: 'Foo'}, {value: 'bar', text: 'Bar'}]} />);

    expect(screen.getByText(/Foo/)).toHaveAttribute('value', 'foo');
    expect(screen.getByText(/Bar/)).toHaveAttribute('value', 'bar');
  });

});
