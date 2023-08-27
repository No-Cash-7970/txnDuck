/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import SelectField from "./SelectField";

describe('Form Components - SelectField', () => {

  it('renders input `required` attribute and asterisk if `required` is true', () => {
    render(<SelectField required={true} />);

    expect(screen.getByRole('combobox')).toHaveAttribute('required');
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it("does not render input's `required` attribute or asterisk if `required` is false", () => {
    render(<SelectField required={false} />);

    expect(screen.getByRole('combobox')).not.toHaveAttribute('required');
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('renders `title` attribute for asterisk if `requiredText` is not empty', () => {
    render(<SelectField required={true} requiredText='foo' />);
    expect(screen.getByText('*')).toHaveAttribute('title', 'foo');
  });

  it("renders input's `id` attribute if `inputId` is not empty", () => {
    const { container } = render(<SelectField id='foo' />);
    expect(container.querySelector('#foo')).toBeInTheDocument();
  });

  it("renders input's `class` attribute if `inputClass` is not empty", () => {
    const { container } = render(<SelectField inputClass='foo' />);
    const inputElem = container.getElementsByTagName('select')[0];
    expect(inputElem).toHaveClass('foo');
  });

  it('renders label if `label` is not empty', () => {
    render(<SelectField label='foo' />);
    expect(screen.getByText(/foo/)).toBeInTheDocument();
  });

  it('renders input INSIDE label if `inputInsideLabel` is true', () => {
    const { container } = render(<SelectField inputInsideLabel={true} />);

    expect(container.querySelector('label > select')).toBeInTheDocument();
    expect(container.querySelector('label + select')).not.toBeInTheDocument();
  });

  it('renders input OUTSIDE label if `inputInsideLabel` is false', () => {
    const { container } = render(<SelectField inputInsideLabel={false} />);

    expect(container.querySelector('label > select')).not.toBeInTheDocument();
    expect(container.querySelector('label + select')).toBeInTheDocument();
  });

  it('renders input OUTSIDE label by default', () => {
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

  it('renders container `class` attribute if `containerClass` is not empty', () => {
    const { container } = render(<SelectField containerClass='foo' />);
    const containerElem = container.getElementsByClassName('form-control')[0];
    expect(containerElem).toHaveClass('foo');
  });

  it('renders help message if `helpMsg` is not empty', () => {
    render(<SelectField helpMsg='foo' />);
    expect(screen.getByText(/foo/)).toBeInTheDocument();
  });

  it('renders placeholder if `placeholder` is not empty', () => {
    render(<SelectField placeholder='foo' />);

    expect(screen.getByText('foo')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('');
  });

  it('renders side-label before input (outside label) if `beforeSideLabel` is not empty', () => {
    const { container } = render(<SelectField beforeSideLabel='foo' inputInsideLabel={false} />);
    expect(container.querySelector('.join-item:first-child')).toHaveTextContent('foo');
  });

  it('renders side-label after input (outside label) if `afterSideLabel` is not empty', () => {
    const { container } = render(<SelectField afterSideLabel='foo' inputInsideLabel={false} />);
    expect(container.querySelector('.join-item:last-child')).toHaveTextContent('foo');
  });

  it('renders side-label before input (inside label) if `beforeSideLabel` is not empty', () => {
    const { container } = render(<SelectField beforeSideLabel='foo' inputInsideLabel={true} />);
    expect(container.querySelector('.join-item:first-child')).toHaveTextContent('foo');
  });

  it('renders side-label after input (inside label) if `afterSideLabel` is not empty', () => {
    const { container } = render(<SelectField afterSideLabel='foo' inputInsideLabel={true} />);
    expect(container.querySelector('.join-item:last-child')).toHaveTextContent('foo');
  });

  it('renders options if `options` is not empty', () => {
    render(<SelectField options={[{value: 'foo', text: 'Foo'}, {value: 'bar', text: 'Bar'}]} />);

    expect(screen.getByText(/Foo/)).toHaveAttribute('value', 'foo');
    expect(screen.getByText(/Bar/)).toHaveAttribute('value', 'bar');
  });

});
