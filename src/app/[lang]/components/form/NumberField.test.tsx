/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import NumberField from "./NumberField";

describe('Form Components - NumberField', () => {

  it('has input as a required field if `required` is true', () => {
    render(<NumberField required={true} />);

    expect(screen.getByRole('spinbutton')).toHaveAttribute('required');
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not have input as a required field if `required` is false', () => {
    render(<NumberField required={false} />);

    expect(screen.getByRole('spinbutton')).not.toHaveAttribute('required');
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('has required notice in label with `title` specified in `requiredText`', () => {
    render(<NumberField required={true} requiredText='foo' />);
    expect(screen.getByText('*')).toHaveAttribute('title', 'foo');
  });

  it('has input with `id` specified in `inputId` property', () => {
    const { container } = render(<NumberField id='foo' />);
    expect(container.querySelector('#foo')).toBeInTheDocument();
  });

  it('has input with class(es) specified in `inputClass` property', () => {
    const { container } = render(<NumberField inputClass='foo' />);
    const inputElem = container.getElementsByTagName('input')[0];
    expect(inputElem).toHaveClass('foo');
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
    await userEvent.click(screen.getByText(/foo/));
    expect(screen.getByRole('spinbutton')).toHaveFocus();
  });

  it('focuses on OUTER input if label text is clicked', async () => {
    render(<NumberField label='foo' inputInsideLabel={false} id='test-field' />);
    await userEvent.click(screen.getByText(/foo/));
    expect(screen.getByRole('spinbutton')).toHaveFocus();
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

});
