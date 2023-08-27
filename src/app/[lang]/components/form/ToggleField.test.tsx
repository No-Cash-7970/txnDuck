/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import ToggleField from "./ToggleField";

describe('Form Components - ToggleField', () => {

  it('renders input `required` attribute and asterisk if `required` is true', () => {
    render(<ToggleField required={true} />);

    expect(screen.getByRole('checkbox')).toHaveAttribute('required');
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it("does not render input's `required` attribute or asterisk if `required` is false", () => {
    render(<ToggleField required={false} />);

    expect(screen.getByRole('checkbox')).not.toHaveAttribute('required');
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('renders `title` attribute for asterisk if `requiredText` is not empty', () => {
    render(<ToggleField required={true} requiredText='foo' />);
    expect(screen.getByText('*')).toHaveAttribute('title', 'foo');
  });

  it("renders input's `id` attribute if `inputId` is not empty", () => {
    const { container } = render(<ToggleField id='foo' />);
    expect(container.querySelector('#foo')).toBeInTheDocument();
  });

  it("renders input's `class` attribute if `inputClass` is not empty", () => {
    const { container } = render(<ToggleField inputClass='foo' />);
    const inputElem = container.getElementsByTagName('input')[0];
    expect(inputElem).toHaveClass('foo');
  });

  it('renders label if `label` is not empty', () => {
    render(<ToggleField label='foo' />);
    expect(screen.getByText(/foo/)).toBeInTheDocument();
  });

  it('renders input INSIDE label if `inputInsideLabel` is true', () => {
    const { container } = render(<ToggleField inputInsideLabel={true} />);

    expect(container.querySelector('label > input')).toBeInTheDocument();
    expect(container.querySelector('label + input')).not.toBeInTheDocument();
  });

  it('renders input OUTSIDE label if `inputInsideLabel` is false', () => {
    const { container } = render(<ToggleField inputInsideLabel={false} />);

    expect(container.querySelector('label > input')).not.toBeInTheDocument();
    expect(container.querySelector('label + input')).toBeInTheDocument();
  });

  it('renders input INSIDE label by default', () => {
    const { container } = render(<ToggleField />);

    expect(container.querySelector('label > input')).toBeInTheDocument();
    expect(container.querySelector('label + input')).not.toBeInTheDocument();
  });

  it('renders outside-label input before the label  if `inputPosition` is "start"', () => {
    const { container } = render(<ToggleField inputInsideLabel={false} inputPosition='start' />);
    expect(container.querySelector('input + label')).toBeInTheDocument();
  });

  it('renders outside-label input after the label  if `inputPosition` is "end"', () => {
    const { container } = render(<ToggleField inputInsideLabel={false} inputPosition='end' />);
    expect(container.querySelector('label + input')).toBeInTheDocument();
  });

  it('renders inside-label input before the label  if `inputPosition` is "start"', () => {
    const { container } = render(
      <ToggleField label='foo' inputInsideLabel={true} inputPosition='start' />
    );
    expect(container.querySelector('input:first-child')).toBeInTheDocument();
  });

  it('renders inside-label input after the label  if `inputPosition` is "end"', () => {
    const { container } = render(
      <ToggleField label='foo' inputInsideLabel={true} inputPosition='end' />
    );
    expect(container.querySelector('input:last-child')).toBeInTheDocument();
  });

  it('toggles INNER input if label text is clicked', async () => {
    render(<ToggleField label='foo' inputInsideLabel={true} />);
    await userEvent.click(screen.getByText(/foo/));
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('toggles OUTER input if label text is clicked', async () => {
    render(<ToggleField label='foo' inputInsideLabel={false} id='test-field' />);
    await userEvent.click(screen.getByText(/foo/));
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('renders container `class` attribute if `containerClass` is not empty', () => {
    const { container } = render(<ToggleField containerClass='foo' />);
    const containerElem = container.getElementsByClassName('form-control')[0];
    expect(containerElem).toHaveClass('foo');
  });

  it('renders help message if `helpMsg` is not empty', () => {
    render(<ToggleField helpMsg='foo' />);
    expect(screen.getByText(/foo/)).toBeInTheDocument();
  });

  it('checks input if `checked` is true', async () => {
    render(<ToggleField checked={true} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('does not check input if `checked` is false', async () => {
    render(<ToggleField checked={false} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

});
