/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import TextAreaField from "./TextAreaField";

describe('Form Components - TextAreaField', () => {

  it('renders input `required` attribute and asterisk if `required` is true', () => {
    render(<TextAreaField required={true} />);

    expect(screen.getByRole('textbox')).toHaveAttribute('required');
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it("does not render input's `required` attribute or asterisk if `required` is false", () => {
    render(<TextAreaField required={false} />);

    expect(screen.getByRole('textbox')).not.toHaveAttribute('required');
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('renders `title` attribute for asterisk if `requiredText` is not empty', () => {
    render(<TextAreaField required={true} requiredText='foo' />);
    expect(screen.getByText('*')).toHaveAttribute('title', 'foo');
  });

  it("renders input's `id` attribute if `inputId` is not empty", () => {
    const { container } = render(<TextAreaField id='foo' />);
    expect(container.querySelector('#foo')).toBeInTheDocument();
  });

  it("renders input's `class` attribute if `inputClass` is not empty", () => {
    const { container } = render(<TextAreaField inputClass='foo' />);
    const textareaElem = container.getElementsByTagName('textarea')[0];
    expect(textareaElem).toHaveClass('foo');
  });

  it('renders label if `label` is not empty', () => {
    render(<TextAreaField label='foo' />);
    expect(screen.getByText(/foo/)).toBeInTheDocument();
  });

  it('renders input INSIDE label if `inputInsideLabel` is true', () => {
    const { container } = render(<TextAreaField inputInsideLabel={true} />);

    expect(container.querySelector('label > textarea')).toBeInTheDocument();
    expect(container.querySelector('label + textarea')).not.toBeInTheDocument();
  });

  it('renders input OUTSIDE label if `inputInsideLabel` is false', () => {
    const { container } = render(<TextAreaField inputInsideLabel={false} />);

    expect(container.querySelector('label > textarea')).not.toBeInTheDocument();
    expect(container.querySelector('label + textarea')).toBeInTheDocument();
  });

  it('renders input OUTSIDE label by default', () => {
    const { container } = render(<TextAreaField />);

    expect(container.querySelector('label > textarea')).not.toBeInTheDocument();
    expect(container.querySelector('label + textarea')).toBeInTheDocument();
  });

  it('focuses on INNER input if label text is clicked', async () => {
    render(<TextAreaField label='foo' inputInsideLabel={true} />);
    await userEvent.click(screen.getByText(/foo/));
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('focuses on OUTER input if label text is clicked', async () => {
    render(<TextAreaField label='foo' inputInsideLabel={false} id='test-field' />);
    await userEvent.click(screen.getByText(/foo/));
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('renders container `class` attribute if `containerClass` is not empty', () => {
    const { container } = render(<TextAreaField containerClass='foo' />);
    const containerElem = container.getElementsByClassName('form-control')[0];
    expect(containerElem).toHaveClass('foo');
  });

  it('renders help message if `helpMsg` is not empty', () => {
    render(<TextAreaField helpMsg='foo' />);
    expect(screen.getByText(/foo/)).toBeInTheDocument();
  });

  it('renders placeholder if `placeholder` is not empty', () => {
    render(<TextAreaField placeholder='foo' />);
    expect(screen.getByPlaceholderText('foo')).toBeInTheDocument();
  });

  it('renders side-label before input (outside label) if `beforeSideLabel` is not empty', () => {
    const { container } = render(<TextAreaField beforeSideLabel='foo' inputInsideLabel={false} />);
    expect(container.querySelector('.join-item:first-child')).toHaveTextContent('foo');
  });

  it('renders side-label after input (outside label) if `afterSideLabel` is not empty', () => {
    const { container } = render(<TextAreaField afterSideLabel='foo' inputInsideLabel={false} />);
    expect(container.querySelector('.join-item:last-child')).toHaveTextContent('foo');
  });

  it('renders side-label before input (inside label) if `beforeSideLabel` is not empty', () => {
    const { container } = render(<TextAreaField beforeSideLabel='foo' inputInsideLabel={true} />);
    expect(container.querySelector('.join-item:first-child')).toHaveTextContent('foo');
  });

  it('renders side-label after input (inside label) if `afterSideLabel` is not empty', () => {
    const { container } = render(<TextAreaField afterSideLabel='foo' inputInsideLabel={true} />);
    expect(container.querySelector('.join-item:last-child')).toHaveTextContent('foo');
  });

});
