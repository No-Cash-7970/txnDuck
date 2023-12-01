/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CheckboxField from './CheckboxField';

describe('Form Components - CheckboxField', () => {

  it('has input as a required field if `required` is true', () => {
    render(<CheckboxField required={true} />);

    expect(screen.getByRole('checkbox')).toBeRequired();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not have input as a required field if `required` is false', () => {
    render(<CheckboxField required={false} />);

    expect(screen.getByRole('checkbox')).not.toBeRequired();
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('has required notice in label with `title` specified in `requiredText`', () => {
    render(<CheckboxField required={true} requiredText='foo' />);
    expect(screen.getByText('*')).toHaveAccessibleDescription('foo');
  });

  it('has input with `id` specified in `inputId` property', () => {
    render(<CheckboxField id='foo' />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'foo');
  });

  it('has input with class(es) specified in `inputClass` property', () => {
    render(<CheckboxField inputClass='foo' />);
    expect(screen.getByRole('checkbox')).toHaveClass('foo');
  });

  it('has label with text specified in `label` property', () => {
    render(<CheckboxField label='foo' />);
    expect(screen.getByText(/foo/)).toBeInTheDocument();
  });

  it('has input INSIDE label if `inputInsideLabel` is true', () => {
    const { container } = render(<CheckboxField inputInsideLabel={true} />);

    expect(container.querySelector('label > input')).toBeInTheDocument();
    expect(container.querySelector('input + label')).not.toBeInTheDocument();
  });

  it('has input OUTSIDE label if `inputInsideLabel` is false', () => {
    const { container } = render(<CheckboxField inputInsideLabel={false} />);

    expect(container.querySelector('label > input')).not.toBeInTheDocument();
    expect(container.querySelector('input + label')).toBeInTheDocument();
  });

  it('has input INSIDE label by default', () => {
    const { container } = render(<CheckboxField />);

    expect(container.querySelector('label > input')).toBeInTheDocument();
    expect(container.querySelector('input + label')).not.toBeInTheDocument();
  });

  it('has outside-label input before the label  if `inputPosition` is "start"', () => {
    const { container } = render(<CheckboxField inputInsideLabel={false} inputPosition='start' />);
    expect(container.querySelector('input + label')).toBeInTheDocument();
  });

  it('has outside-label input after the label  if `inputPosition` is "end"', () => {
    const { container } = render(<CheckboxField inputInsideLabel={false} inputPosition='end' />);
    expect(container.querySelector('label + input')).toBeInTheDocument();
  });

  it('has inside-label input before the label  if `inputPosition` is "start"', () => {
    const { container } = render(
      <CheckboxField label='foo' inputInsideLabel={true} inputPosition='start' />
    );
    expect(container.querySelector('input:first-child')).toBeInTheDocument();
  });

  it('has inside-label input after the label  if `inputPosition` is "end"', () => {
    const { container } = render(
      <CheckboxField label='foo' inputInsideLabel={true} inputPosition='end' />
    );
    expect(container.querySelector('input:last-child')).toBeInTheDocument();
  });

  it('toggles INNER input if label text is clicked', async () => {
    render(<CheckboxField label='foo' inputInsideLabel={true} />);
    await userEvent.click(screen.getByText(/foo/)); // Click label
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('toggles OUTER input if label text is clicked', async () => {
    render(<CheckboxField label='foo' inputInsideLabel={false} id='test-field' />);
    await userEvent.click(screen.getByText(/foo/)); // Click label
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('has container with ID specified in `containerId` property', () => {
    const { container } = render(<CheckboxField containerId='foo' />);
    const containerElem = container.getElementsByClassName('form-control')[0];
    expect(containerElem).toHaveAttribute('id', 'foo');
  });

  it('has container with class(es) specified in `containerClass` property', () => {
    const { container } = render(<CheckboxField containerClass='foo' />);
    const containerElem = container.getElementsByClassName('form-control')[0];
    expect(containerElem).toHaveClass('foo');
  });

  it('has help message with text specified in `helpMsg` property', () => {
    render(<CheckboxField helpMsg='foo' />);
    expect(screen.getByText(/foo/)).toBeInTheDocument();
  });

  it('has input checked by default if `defaultValue` is true', () => {
    render(<CheckboxField defaultValue={true} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('does not have input checked by default if `defaultValue` is false', () => {
    render(<CheckboxField defaultValue={false} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('has input with name specified in `name` property', () => {
    render(<CheckboxField name='foo' />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('name', 'foo');
  });

  it('disables the input if `disabled` is true', () => {
    render(<CheckboxField disabled={true} />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('enables the input if `disabled` is false', () => {
    render(<CheckboxField disabled={false} />);
    expect(screen.getByRole('checkbox')).not.toBeDisabled();
  });

  it('has input with value specified in `value` attribute', () => {
    render(<CheckboxField value={true} onChange={() => null} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('has input with "on-change" event function specified by `onChange` attribute', async () => {
    const onChangeFn = jest.fn();
    render(<CheckboxField onChange={onChangeFn} />);

    const input = screen.getByRole('checkbox');
    await userEvent.click(input); // Check the box

    expect(input).toBeChecked();
    expect(onChangeFn).toBeCalledTimes(1);
  });

  it('has input with "on-focus" event function specified by `onFocus` attribute', async () => {
    const onFocusFn = jest.fn();
    render(<CheckboxField onFocus={onFocusFn} />);

    const input = screen.getByRole('checkbox');
    await userEvent.click(input); // Click on box

    expect(onFocusFn).toBeCalledTimes(1);
    expect(input).toHaveFocus();
  });

  it('has input with "on-blur" event function specified by `onBlur` attribute', async () => {
    const onBlurFn = jest.fn();
    render(<CheckboxField onBlur={onBlurFn} />);

    const input = screen.getByRole('checkbox');
    await userEvent.click(input); // Click on box
    await userEvent.tab(); // Tab away to lose focus

    expect(onBlurFn).toBeCalledTimes(1);
    expect(input).not.toHaveFocus();
  });

  it('has label with class(es) specified in `labelClass` property', () => {
    const { container } = render(<CheckboxField labelClass='foo-label' />);
    expect(container.getElementsByClassName('label')[0]).toHaveClass('foo-label');
  });

  it('has label text element with class(es) specified in `labelTextClass` property', () => {
    render(<CheckboxField label='foo' labelTextClass='foo-label-text' />);
    expect(screen.getByText('foo')).toHaveClass('foo-label-text');
  });

  it('has field tip button when `tip` is specified', () => {
    render(<CheckboxField tip={{btnTitle: 'Foo tip'}} />);
    expect(screen.getByTitle('Foo tip')).toBeInTheDocument();
  });

});
