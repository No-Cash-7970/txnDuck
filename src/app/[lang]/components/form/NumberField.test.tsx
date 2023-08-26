/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import NumberField from "./NumberField";

describe('Form Components - NumberField', () => {

  it('renders input `required` attribute and asterisk if `required` is true', () => {
    render(<NumberField required={true} />);

    expect(screen.getByRole('spinbutton')).toHaveAttribute('required');
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it("does not render input's `required` attribute or asterisk if `required` is false", () => {
    render(<NumberField required={false} />);

    expect(screen.getByRole('spinbutton')).not.toHaveAttribute('required');
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('renders `title` attribute for asterisk if `requiredText` is not empty', () => {
    render(<NumberField required={true} requiredText='foo' />);
    expect(screen.getByText('*')).toHaveAttribute('title', 'foo');
  });

  it("renders input's `id` attribute if `inputId` is not empty", () => {
    const { container } = render(<NumberField id='foo' />);
    expect(container.querySelector('#foo')).toBeInTheDocument();
  });

  it("renders input's `class` attribute if `inputClass` is not empty", () => {
    const { container } = render(<NumberField inputClass='foo' />);
    const inputElem = container.getElementsByTagName('input')[0];
    expect(inputElem).toHaveClass('foo');
  });

  it('renders label if `label` is not empty', () => {
    render(<NumberField label='foo' />);
    expect(screen.getByText(/foo/)).toBeInTheDocument();
  });

  it('renders input INSIDE label if `inputInsideLabel` is true', () => {
    const { container } = render(<NumberField inputInsideLabel={true} />);

    expect(container.querySelector('label > input')).toBeInTheDocument();
    expect(container.querySelector('label + input')).not.toBeInTheDocument();
  });

  it('renders input OUTSIDE label if `inputInsideLabel` is false', () => {
    const { container } = render(<NumberField inputInsideLabel={false} />);

    expect(container.querySelector('label > input')).not.toBeInTheDocument();
    expect(container.querySelector('label + input')).toBeInTheDocument();
  });

  it('renders input OUTSIDE label by default', () => {
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

  it('renders container `class` attribute if `containerClass` is not empty', () => {
    const { container } = render(<NumberField containerClass='foo' />);
    const containerElem = container.getElementsByClassName('form-control')[0];
    expect(containerElem).toHaveClass('foo');
  });

  it('renders help message if `helpMsg` is not empty', () => {
    render(<NumberField helpMsg='foo' />);
    expect(screen.getByText(/foo/)).toBeInTheDocument();
  });

  it("renders input's `min` attribute if `min` is a number", () => {
    render(<NumberField min={42} />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('min', '42');
  });

  it("renders input's `max` attribute if `max` is a number", () => {
    render(<NumberField max={42} />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('max', '42');
  });

  it("renders input's `step` attribute if `step` is a number", () => {
    render(<NumberField step={42} />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('step', '42');
  });

  it("renders input's `step` attribute if `step` is 'any'", () => {
    render(<NumberField step='any' />);
    expect(screen.getByRole('spinbutton')).toHaveAttribute('step', 'any');
  });

  it('renders side-label before input (outside label) if `beforeSideLabel` is not empty', () => {
    const { container } = render(<NumberField beforeSideLabel='foo' inputInsideLabel={false} />);
    expect(container.querySelector('.join-item:first-child')).toHaveTextContent('foo');
  });

  it('renders side-label after input (outside label) if `afterSideLabel` is not empty', () => {
    const { container } = render(<NumberField afterSideLabel='foo' inputInsideLabel={false} />);
    expect(container.querySelector('.join-item:last-child')).toHaveTextContent('foo');
  });

  it('renders side-label before input (inside label) if `beforeSideLabel` is not empty', () => {
    const { container } = render(<NumberField beforeSideLabel='foo' inputInsideLabel={true} />);
    expect(container.querySelector('.join-item:first-child')).toHaveTextContent('foo');
  });

  it('renders side-label after input (inside label) if `afterSideLabel` is not empty', () => {
    const { container } = render(<NumberField afterSideLabel='foo' inputInsideLabel={true} />);
    expect(container.querySelector('.join-item:last-child')).toHaveTextContent('foo');
  });

});
