/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RadioButtonGroupField from './RadioButtonGroupField';

describe('Form Components - RadioButtonGroupField', () => {

  it('has all radios as required if `required` is true', () => {
    render(
      <RadioButtonGroupField
        required={true}
        options={[{value: 'foo', text: 'Foo'}, {value: 'bar', text: 'Bar'}]}
      />
    );

    expect(screen.getByLabelText('Foo')).toBeRequired();
    expect(screen.getByLabelText('Bar')).toBeRequired();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not have any radio marked as required if `required` is false', () => {
    render(
      <RadioButtonGroupField
        required={false}
        options={[{value: 'foo', text: 'Foo'}, {value: 'bar', text: 'Bar'}]}
      />
    );

    expect(screen.getByLabelText('Foo')).not.toBeRequired();
    expect(screen.getByLabelText('Bar')).not.toBeRequired();
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('has required notice in label with `title` specified in `requiredText`', () => {
    render(<RadioButtonGroupField required={true} requiredText='foo' />);
    expect(screen.getByText('*')).toHaveAccessibleDescription('foo');
  });

  it('has all radios with class(es) specified in `optionClass` property', () => {
    render(
      <RadioButtonGroupField
        optionClass='baz'
        options={[{value: 'foo', text: 'Foo'}, {value: 'bar', text: 'Bar'}]}
      />
    );
    expect(screen.getByLabelText('Foo')).toHaveClass('baz');
    expect(screen.getByLabelText('Bar')).toHaveClass('baz');
  });

  it('has label with text specified in `label` property', () => {
    render(<RadioButtonGroupField label='foo' />);
    expect(screen.getByText(/foo/)).toBeInTheDocument();
  });

  it('has container with ID specified in `containerId` property', () => {
    render(<RadioButtonGroupField containerId='foo' />);
    expect(screen.getByRole('radiogroup')).toHaveAttribute('id', 'foo');
  });

  it('has container with class(es) specified in `containerClass` property', () => {
    render(<RadioButtonGroupField containerClass='foo' />);
    expect(screen.getByRole('radiogroup')).toHaveClass('foo');
  });

  it('has help message with text specified in `helpMsg` property', () => {
    render(<RadioButtonGroupField helpMsg='foo' />);
    expect(screen.getByText(/foo/)).toBeInTheDocument();
  });

  it('has radios with labels and values specified in `options` property', () => {
    render(
      <RadioButtonGroupField
        defaultValue='foo'
        options={[{value: 'foo', text: 'Foo'}, {value: 'bar', text: 'Bar'}]}
      />
    );
    expect(screen.getByLabelText('Foo')).toHaveAttribute('value', 'foo');
    expect(screen.getByLabelText('Bar')).toHaveAttribute('value', 'bar');
  });

  it('selects the radio with value specified `defaultValue` property by default', () => {
    render(
      <RadioButtonGroupField
        defaultValue='foo'
        options={[{value: 'foo', text: 'Foo'}, {value: 'bar', text: 'Bar'}]}
      />
    );
    expect(screen.getByLabelText('Foo')).toBeChecked();
    expect(screen.getByLabelText('Bar')).not.toBeChecked();
  });

  it('has all radios with name specified in `name` property', () => {
    render(
      <RadioButtonGroupField
        name='foo-group'
        options={[{value: 'foo', text: 'Foo'}, {value: 'bar', text: 'Bar'}]}
      />
    );
    expect(screen.getByLabelText('Foo')).toHaveAttribute('name', 'foo-group');
    expect(screen.getByLabelText('Bar')).toHaveAttribute('name', 'foo-group');
  });

  it('disables all radios if `disabled` is true', () => {
    render(
      <RadioButtonGroupField
      disabled={true}
        options={[{value: 'foo', text: 'Foo'}, {value: 'bar', text: 'Bar'}]}
      />
    );
    expect(screen.getByLabelText('Foo')).toBeDisabled();
    expect(screen.getByLabelText('Bar')).toBeDisabled();
  });

  it('enables all radios if `disabled` is false', () => {
    render(
      <RadioButtonGroupField
        disabled={false}
        options={[{value: 'foo', text: 'Foo'}, {value: 'bar', text: 'Bar'}]}
      />
    );
    expect(screen.getByLabelText('Foo')).not.toBeDisabled();
    expect(screen.getByLabelText('Bar')).not.toBeDisabled();
  });

  it('selects radio with value specified in `value` attribute', () => {
    render(
      <RadioButtonGroupField
        value={'foo'}
        onChange={() => null}
        options={[{value: 'foo', text: 'Foo'}, {value: 'bar', text: 'Bar'}]}
      />
    );
    expect(screen.getByLabelText('Foo')).toBeChecked();
    expect(screen.getByLabelText('Bar')).not.toBeChecked();
  });

  it('has all radios with "on-change" event function specified by `onChange` attribute',
    async () => {
      const onChangeFn = jest.fn();
      render(
        <RadioButtonGroupField
          onChange={onChangeFn}
          options={[{value: 'foo', text: 'Foo'}, {value: 'bar', text: 'Bar'}]}
        />
      );
      const fooInput = screen.getByLabelText('Foo');

      await userEvent.click(fooInput);

      expect(onChangeFn).toBeCalledTimes(1);
    }
  );

  it('has input with "on-focus" event function specified by `onFocus` attribute', async () => {
    const onFocusFn = jest.fn();
    render(
      <RadioButtonGroupField
        onFocus={onFocusFn}
        options={[{value: 'foo', text: 'Foo'}, {value: 'bar', text: 'Bar'}]}
      />
    );
    const fooInput = screen.getByLabelText('Foo');

    await userEvent.click(fooInput);

    expect(onFocusFn).toBeCalledTimes(1);
    expect(fooInput).toHaveFocus();
  });

  it('has input with "on-blur" event function specified by `onBlur` attribute', async () => {
    const onBlurFn = jest.fn();
    render(
      <RadioButtonGroupField
        onBlur={onBlurFn}
        options={[{value: 'foo', text: 'Foo'}, {value: 'bar', text: 'Bar'}]}
      />
    );
    const fooInput = screen.getByLabelText('Foo');

    await userEvent.click(fooInput);
    await userEvent.tab(); // Tab away to lose focus

    expect(onBlurFn).toBeCalledTimes(1);
    expect(fooInput).not.toHaveFocus();
  });

  it('has label with class(es) specified in `labelClass` property', () => {
    const { container } = render(
      <RadioButtonGroupField
        labelClass='foo-label'
        options={[{value: 'foo', text: 'Foo'}, {value: 'bar', text: 'Bar'}]}
      />
    );
    expect(container.getElementsByClassName('label')[0]).toHaveClass('foo-label');
  });

  it('has label text element with class(es) specified in `labelTextClass` property', () => {
    render(
      <RadioButtonGroupField
        label='foobar'
        labelTextClass='foo-label-text'
        options={[{value: 'foo', text: 'Foo'}, {value: 'bar', text: 'Bar'}]}
      />
    );
    expect(screen.getByText('foobar')).toHaveClass('foo-label-text');
  });

  it('has field tip button when `tip` is specified', () => {
    render(<RadioButtonGroupField tip={{btnTitle: 'Foo tip'}} />);
    expect(screen.getByTitle('Foo tip')).toBeInTheDocument();
  });

});
