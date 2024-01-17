/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileField from './FileField';

describe('Form Components - FileField', () => {

  it('has input as a required field if `required` is true', () => {
    const {container} = render(<FileField required={true} />);
    expect(container.querySelector('.file-input')).toBeRequired();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not have input as a required field if `required` is false', () => {
    const {container} = render(<FileField required={false} />);
    expect(container.querySelector('.file-input')).not.toBeRequired();
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('has required notice in label with `title` specified in `requiredText`', () => {
    render(<FileField required={true} requiredText='foo' />);
    expect(screen.getByText('*')).toHaveAccessibleDescription('foo');
  });

  it('has input with `id` specified in `inputId` property', () => {
    const {container} = render(<FileField id='foo' />);
    expect(container.querySelector('.file-input')).toHaveAttribute('id', 'foo');
  });

  it('has input with class(es) specified in `inputClass` property', () => {
    const {container} = render(<FileField inputClass='foo' />);
    expect(container.querySelector('.file-input')).toHaveClass('foo');
  });

  it('has label with text specified in `label` property', () => {
    render(<FileField label='foo' />);
    expect(screen.getByText(/foo/)).toBeInTheDocument();
  });

  it('has input with name specified in `name` property', () => {
    const {container} = render(<FileField name='foo' />);
    expect(container.querySelector('.file-input')).toHaveAttribute('name', 'foo');
  });

  it('disables the input if `disabled` is true', () => {
    const {container} = render(<FileField disabled={true} />);
    expect(container.querySelector('.file-input')).toBeDisabled();
  });

  it('enables the input if `disabled` is false', () => {
    const {container} = render(<FileField disabled={false} />);
    expect(container.querySelector('.file-input')).not.toBeDisabled();
  });

  it('has input INSIDE label if `inputInsideLabel` is true', () => {
    const { container } = render(<FileField inputInsideLabel={true} />);
    expect(container.querySelector('label > input')).toBeInTheDocument();
    expect(container.querySelector('label + input')).not.toBeInTheDocument();
  });

  it('has input OUTSIDE label if `inputInsideLabel` is false', () => {
    const { container } = render(<FileField inputInsideLabel={false} />);
    expect(container.querySelector('label > input')).not.toBeInTheDocument();
    expect(container.querySelector('label + input')).toBeInTheDocument();
  });

  it('has input OUTSIDE label by default', () => {
    const { container } = render(<FileField />);
    expect(container.querySelector('label > input')).not.toBeInTheDocument();
    expect(container.querySelector('label + input')).toBeInTheDocument();
  });

  it('focuses on INNER input if label text is clicked', async () => {
    const {container} = render(<FileField label='foo' inputInsideLabel={true} />);
    await userEvent.click(screen.getByText(/foo/)); // Click label
    expect(container.querySelector('.file-input')).toHaveFocus();
  });

  it('focuses on OUTER input if label text is clicked', async () => {
    const {container} = render(<FileField label='foo' inputInsideLabel={false} id='test-field' />);
    await userEvent.click(screen.getByText(/foo/)); // Click label
    expect(container.querySelector('.file-input')).toHaveFocus();
  });

  it('has container with ID specified in `containerId` property', () => {
    const { container } = render(<FileField containerId='foo' />);
    const containerElem = container.getElementsByClassName('form-control')[0];
    expect(containerElem).toHaveAttribute('id', 'foo');
  });

  it('has container with class(es) specified in `containerClass` property', () => {
    const { container } = render(<FileField containerClass='foo' />);
    const containerElem = container.getElementsByClassName('form-control')[0];
    expect(containerElem).toHaveClass('foo');
  });

  it('has help message with text specified in `helpMsg` property', () => {
    render(<FileField helpMsg='foo' />);
    expect(screen.getByText(/foo/)).toBeInTheDocument();
  });

  it('has input with "on-change" event function specified by `onChange` attribute', async () => {
    const file = new File(['foo'], 'foo.txt', { type: 'text/plain' });
    const onChangeFn = jest.fn();
    const {container} = render(<FileField onChange={onChangeFn} />);

    const input = container.querySelector('.file-input') as HTMLInputElement;
    await userEvent.upload(input, file);

    expect(input).toHaveValue('C:\\fakepath\\foo.txt');
    expect(input?.files).toHaveLength(1);
    expect(onChangeFn).toHaveBeenCalledTimes(1);
  });

  it('has input with "on-focus" event function specified by `onFocus` attribute', async () => {
    const onFocusFn = jest.fn();
    const {container} = render(<FileField onFocus={onFocusFn} />);

    const input = container.querySelector('.file-input') as HTMLInputElement;
    await userEvent.click(input); // Click on input

    expect(onFocusFn).toHaveBeenCalledTimes(2);
    expect(input).toHaveFocus();
  });

  it('has input with "on-blur" event function specified by `onBlur` attribute', async () => {
    const onBlurFn = jest.fn();
    const {container} = render(<FileField onBlur={onBlurFn} />);

    const input = container.querySelector('.file-input') as HTMLInputElement;
    await userEvent.click(input); // Click on input
    await userEvent.tab(); // Tab away to lose focus

    expect(onBlurFn).toHaveBeenCalledTimes(2);
    expect(input).not.toHaveFocus();
  });

  it('has label with class(es) specified in `labelClass` property', () => {
    const { container } = render(<FileField labelClass='foo-label' />);
    expect(container.getElementsByClassName('label')[0]).toHaveClass('foo-label');
  });

  it('has label text element with class(es) specified in `labelTextClass` property', () => {
    render(<FileField label='foo' labelTextClass='foo-label-text' />);
    expect(screen.getByText('foo')).toHaveClass('foo-label-text');
  });

  it('has field tip button when `tip` is specified', () => {
    render(<FileField tip={{btnTitle: 'Foo tip'}} />);
    expect(screen.getByTitle('Foo tip')).toBeInTheDocument();
  });

  it('has with accepts the file types specified in `accept` property', () => {
    const { container } = render(<FileField accept='.jpg,.jpeg,.png' />);
    const input = container.querySelector('.file-input');
    expect(input).toHaveAttribute('accept', '.jpg,.jpeg,.png');
  });

  it('uses the camera specified in `capture` property', () => {
    const { container } = render(<FileField capture='user' />);
    const input = container.querySelector('.file-input');
    expect(input).toHaveAttribute('capture', 'user');
  });

  it('allows or disallows multiple files according to the specified `multiple` property', () => {
    const { container } = render(<FileField multiple />);
    const input = container.querySelector('.file-input');
    expect(input).toHaveAttribute('multiple', '');
  });

});
