/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextField from './TextField';

describe('Form Components - TextField', () => {

  it('has input as a required field if `required` is true', () => {
    render(<TextField required={true} />);

    expect(screen.getByRole('textbox')).toBeRequired();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not have input as a required field if `required` is false', () => {
    render(<TextField required={false} />);

    expect(screen.getByRole('textbox')).not.toBeRequired();
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('has required notice in label with `title` specified in `requiredText`', () => {
    render(<TextField required={true} requiredText='foo' />);
    expect(screen.getByText('*')).toHaveAccessibleDescription('foo');
  });

  it('has input with `id` specified in `inputId` property', () => {
    render(<TextField id='foo' />);
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'foo');
  });

  it('has input with class(es) specified in `inputClass` property', () => {
    render(<TextField inputClass='foo' />);
    expect(screen.getByRole('textbox')).toHaveClass('foo');
  });

  it('has label with text specified in `label` property', () => {
    render(<TextField label='foo' />);
    expect(screen.getByText(/foo/)).toBeInTheDocument();
  });

  it('has input with value specified `defaultValue` property by default', () => {
    render(<TextField defaultValue='foo' />);
    expect(screen.getByRole('textbox')).toHaveValue('foo');
  });

  it('has input with name specified in `name` property', () => {
    render(<TextField name='foo' />);
    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'foo');
  });

  it('disables the input if `disabled` is true', () => {
    render(<TextField disabled={true} />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('enables the input if `disabled` is false', () => {
    render(<TextField disabled={false} />);
    expect(screen.getByRole('textbox')).not.toBeDisabled();
  });

  it('has input INSIDE label if `inputInsideLabel` is true', () => {
    const { container } = render(<TextField inputInsideLabel={true} />);

    expect(container.querySelector('label > input')).toBeInTheDocument();
    expect(container.querySelector('label + input')).not.toBeInTheDocument();
  });

  it('has input OUTSIDE label if `inputInsideLabel` is false', () => {
    const { container } = render(<TextField inputInsideLabel={false} />);

    expect(container.querySelector('label > input')).not.toBeInTheDocument();
    expect(container.querySelector('label + input')).toBeInTheDocument();
  });

  it('has input OUTSIDE label by default', () => {
    const { container } = render(<TextField />);

    expect(container.querySelector('label > input')).not.toBeInTheDocument();
    expect(container.querySelector('label + input')).toBeInTheDocument();
  });

  it('focuses on INNER input if label text is clicked', async () => {
    render(<TextField label='foo' inputInsideLabel={true} />);
    await userEvent.click(screen.getByText(/foo/)); // Click label
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('focuses on OUTER input if label text is clicked', async () => {
    render(<TextField label='foo' inputInsideLabel={false} id='test-field' />);
    await userEvent.click(screen.getByText(/foo/)); // Click label
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('has container with class(es) specified in `containerClass` property', () => {
    const { container } = render(<TextField containerClass='foo' />);
    const containerElem = container.getElementsByClassName('form-control')[0];
    expect(containerElem).toHaveClass('foo');
  });

  it('has help message with text specified in `helpMsg` property', () => {
    render(<TextField helpMsg='foo' />);
    expect(screen.getByText(/foo/)).toBeInTheDocument();
  });

  it('has placeholder with text specified in `placeholder` property', () => {
    render(<TextField placeholder='foo' />);
    expect(screen.getByPlaceholderText('foo')).toBeInTheDocument();
  });

  it('has side-label with text specified in `beforeSideLabel` before input (outside label)', () => {
    const { container } = render(<TextField beforeSideLabel='foo' inputInsideLabel={false} />);
    expect(container.querySelector('.join-item:first-child')).toHaveTextContent('foo');
  });

  it('has side-label with text specified in `afterSideLabel` after input (outside label)', () => {
    const { container } = render(<TextField afterSideLabel='foo' inputInsideLabel={false} />);
    expect(container.querySelector('.join-item:last-child')).toHaveTextContent('foo');
  });

  it('has side-label with text specified in `beforeSideLabel` before input (inside label)', () => {
    const { container } = render(<TextField beforeSideLabel='foo' inputInsideLabel={true} />);
    expect(container.querySelector('.join-item:first-child')).toHaveTextContent('foo');
  });

  it('has side-label with text specified in `afterSideLabel` after input (inside label)', () => {
    const { container } = render(<TextField afterSideLabel='foo' inputInsideLabel={true} />);
    expect(container.querySelector('.join-item:last-child')).toHaveTextContent('foo');
  });

  it('has input with auto-complete value specified in `autoComplete` property', () => {
    render(<TextField autoComplete='foo' />);
    expect(screen.getByRole('textbox')).toHaveAttribute('autocomplete', 'foo');
  });

  it('has input with spell-check enabled if `spellCheck` is true', () => {
    render(<TextField spellCheck={true} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('spellcheck', 'true');
  });

  it('has input with value specified in `value` attribute', () => {
    render(<TextField value={'foo'} onChange={() => null} />);
    expect(screen.getByRole('textbox')).toHaveValue('foo');
  });

  it('has input with "on-change" event function specified by `onChange` attribute', async () => {
    const onChangeFn = jest.fn();
    render(<TextField onChange={onChangeFn} />);

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'bar'); // Enter 'bar' into the box

    expect(input).toHaveValue('bar');
    expect(onChangeFn).toBeCalledTimes(3);
  });

  it('has input with input mode enabled if `input` is true', () => {
    render(<TextField inputMode='decimal' />);
    expect(screen.getByRole('textbox')).toHaveAttribute('inputmode', 'decimal');
  });

  it('has input with input mode specified in `inputMode` property', () => {
    render(<TextField inputMode='numeric' />);
    expect(screen.getByRole('textbox')).toHaveAttribute('inputmode', 'numeric');
  });

  it('has input with type specified in `type` property', () => {
    render(<TextField type='email' />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
  });

});
