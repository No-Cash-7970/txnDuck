import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberField from './NumberField';

describe('Form Components - NumberField', () => {

  it('has input as a required field if `required` is true', () => {
    render(<NumberField required={true} />);

    expect(screen.getByRole('spinbutton')).toBeRequired();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not have input as a required field if `required` is false', () => {
    render(<NumberField required={false} />);

    expect(screen.getByRole('spinbutton')).not.toBeRequired();
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('has required notice in label with `title` specified in `requiredText`', () => {
    render(<NumberField required={true} requiredText='foo' />);
    expect(screen.getByText('*')).toHaveAccessibleDescription('foo');
  });

  it('has input with `id` specified in `inputId` property', () => {
    render(<NumberField id='foo' />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('id', 'foo');
  });

  it('has input with class(es) specified in `inputClass` property', () => {
    render(<NumberField inputClass='foo' />);
    expect(screen.getByRole('spinbutton')).toHaveClass('foo');
  });

  it('has label with text specified in `label` property', () => {
    render(<NumberField label='foo' />);
    expect(screen.getByText(/foo/)).toBeInTheDocument();
  });

  it('has input INSIDE label if `inputInsideLabel` is true', () => {
    const { container } = render(<NumberField inputInsideLabel={true} />);

    expect(container.querySelector('label > input')).toBeInTheDocument();
    expect(container.querySelector('label + input')).not.toBeInTheDocument();
  });

  it('has input OUTSIDE label if `inputInsideLabel` is false', () => {
    const { container } = render(<NumberField inputInsideLabel={false} />);

    expect(container.querySelector('label > input')).not.toBeInTheDocument();
    expect(container.querySelector('label + input')).toBeInTheDocument();
  });

  it('has input OUTSIDE label by default', () => {
    const { container } = render(<NumberField />);

    expect(container.querySelector('label > input')).not.toBeInTheDocument();
    expect(container.querySelector('label + input')).toBeInTheDocument();
  });

  it('focuses on INNER input if label text is clicked', async () => {
    render(<NumberField label='foo' inputInsideLabel={true} />);
    await userEvent.click(screen.getByText(/foo/)); // Click label
    expect(screen.getByRole('spinbutton')).toHaveFocus();
  });

  it('focuses on OUTER input if label text is clicked', async () => {
    render(<NumberField label='foo' inputInsideLabel={false} id='test-field' />);
    await userEvent.click(screen.getByText(/foo/)); // Click label
    expect(screen.getByRole('spinbutton')).toHaveFocus();
  });

  it('has container with ID specified in `containerId` property', () => {
    const { container } = render(<NumberField containerId='foo' />);
    const containerElem = container.getElementsByClassName('form-control')[0];
    expect(containerElem).toHaveAttribute('id', 'foo');
  });

  it('has container with class(es) specified in `containerClass` property', () => {
    const { container } = render(<NumberField containerClass='foo' />);
    const containerElem = container.getElementsByClassName('form-control')[0];
    expect(containerElem).toHaveClass('foo');
  });

  it('has help message with text specified in `helpMsg` property', () => {
    render(<NumberField helpMsg='foo' />);
    expect(screen.getByText(/foo/)).toBeInTheDocument();
  });

  it('has input with a "minimum" specified in `min` property', () => {
    render(<NumberField min={42} />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('min', '42');
  });

  it('has input with a "maximum" specified in `max` property', () => {
    render(<NumberField max={42} />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('max', '42');
  });

  it('has input with a "step" value specified in `step` property', () => {
    render(<NumberField step={42} />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('step', '42');
  });

  it('has input with a "step" value specified in `step` property', () => {
    render(<NumberField step='any' />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('step', 'any');
  });

  it('has side-label with text specified in `beforeSideLabel` before input (outside label)', () => {
    const { container } = render(<NumberField beforeSideLabel='foo' inputInsideLabel={false} />);
    expect(container.querySelector('.join-item:first-child')).toHaveTextContent('foo');
  });

  it('has side-label with text specified in `afterSideLabel` after input (outside label)', () => {
    const { container } = render(<NumberField afterSideLabel='foo' inputInsideLabel={false} />);
    expect(container.querySelector('.join-item:last-child')).toHaveTextContent('foo');
  });

  it('has side-label with text specified in `beforeSideLabel` before input (inside label)', () => {
    const { container } = render(<NumberField beforeSideLabel='foo' inputInsideLabel={true} />);
    expect(container.querySelector('.join-item:first-child')).toHaveTextContent('foo');
  });

  it('has side-label with text specified in `afterSideLabel` after input (inside label)', () => {
    const { container } = render(<NumberField afterSideLabel='foo' inputInsideLabel={true} />);
    expect(container.querySelector('.join-item:last-child')).toHaveTextContent('foo');
  });

  it('has input with value specified `defaultValue` property by default', () => {
    render(<NumberField defaultValue={42} />);
    expect(screen.getByRole('spinbutton')).toHaveValue(42);
  });

  it('has input with name specified in `name` property', () => {
    render(<NumberField name='foo' />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('name', 'foo');
  });

  it('disables the input if `disabled` is true', () => {
    render(<NumberField disabled={true} />);
    expect(screen.getByRole('spinbutton')).toBeDisabled();
  });

  it('enables the input if `disabled` is false', () => {
    render(<NumberField disabled={false} />);
    expect(screen.getByRole('spinbutton')).not.toBeDisabled();
  });

  it('has input with auto-complete value specified in `autoComplete` property', () => {
    render(<NumberField autoComplete='foo' />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('autocomplete', 'foo');
  });

  it('has input with value specified in `value` attribute', () => {
    render(<NumberField value={42} onChange={() => null} />);
    expect(screen.getByRole('spinbutton')).toHaveValue(42);
  });

  it('has input with empty value if `value` attribute is an empty string', () => {
    render(<NumberField value='' onChange={() => null} />);
    expect(screen.getByRole('spinbutton')).toHaveValue(null);
  });

  it('has input with "on-change" event function specified by `onChange` attribute', async () => {
    const onChangeFn = jest.fn();
    render(<NumberField onChange={onChangeFn} />);

    const input = screen.getByRole('spinbutton');
    await userEvent.type(input, '42'); // Enter '42' into the box

    expect(input).toHaveValue(42);
    expect(onChangeFn).toHaveBeenCalledTimes(2);
  });

  it('has input with "on-focus" event function specified by `onFocus` attribute', async () => {
    const onFocusFn = jest.fn();
    render(<NumberField onFocus={onFocusFn} />);

    const input = screen.getByRole('spinbutton');
    await userEvent.click(input); // Click on input

    expect(onFocusFn).toHaveBeenCalledTimes(1);
    expect(input).toHaveFocus();
  });

  it('has input with "on-blur" event function specified by `onBlur` attribute', async () => {
    const onBlurFn = jest.fn();
    render(<NumberField onBlur={onBlurFn} />);

    const input = screen.getByRole('spinbutton');
    await userEvent.click(input); // Click on input
    await userEvent.tab(); // Tab away to lose focus

    expect(onBlurFn).toHaveBeenCalledTimes(1);
    expect(input).not.toHaveFocus();
  });

  it('has label with class(es) specified in `labelClass` property', () => {
    const { container } = render(<NumberField labelClass='foo-label' />);
    expect(container.getElementsByClassName('label')[0]).toHaveClass('foo-label');
  });

  it('has label text element with class(es) specified in `labelTextClass` property', () => {
    render(<NumberField label='foo' labelTextClass='foo-label-text' />);
    expect(screen.getByText('foo')).toHaveClass('foo-label-text');
  });

  it('has field tip button when `tip` is specified', () => {
    render(<NumberField tip={{btnTitle: 'Foo tip'}} />);
    expect(screen.getByTitle('Foo tip')).toBeInTheDocument();
  });

});
