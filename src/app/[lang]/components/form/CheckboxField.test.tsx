/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import CheckboxField from "./CheckboxField";

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

  it('has container with class(es) specified in `containerClass` property', () => {
    const { container } = render(<CheckboxField containerClass='foo' />);
    const containerElem = container.getElementsByClassName('form-control')[0];
    expect(containerElem).toHaveClass('foo');
  });

  it('has help message with text specified in `helpMsg` property', () => {
    render(<CheckboxField helpMsg='foo' />);
    expect(screen.getByText(/foo/)).toBeInTheDocument();
  });

  it('has checked input if `checked` is true', async () => {
    render(<CheckboxField checked={true} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('does not have checked input if `checked` is false', async () => {
    render(<CheckboxField checked={false} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

});
