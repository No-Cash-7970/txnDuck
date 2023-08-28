/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import TextField from "./TextField";

describe('Form Components - TextField', () => {

  it('has input as a required field if `required` is true', () => {
    render(<TextField required={true} />);

    expect(screen.getByRole('textbox')).toHaveAttribute('required');
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not have input as a required field if `required` is false', () => {
    render(<TextField required={false} />);

    expect(screen.getByRole('textbox')).not.toHaveAttribute('required');
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('has required notice in label with `title` specified in `requiredText`', () => {
    render(<TextField required={true} requiredText='foo' />);
    expect(screen.getByText('*')).toHaveAttribute('title', 'foo');
  });

  it('has input with `id` specified in `inputId` property', () => {
    const { container } = render(<TextField id='foo' />);
    expect(container.querySelector('#foo')).toBeInTheDocument();
  });

  it('has input with class(es) specified in `inputClass` property', () => {
    const { container } = render(<TextField inputClass='foo' />);
    const inputElem = container.getElementsByTagName('input')[0];
    expect(inputElem).toHaveClass('foo');
  });

  it('has label with text specified in `label` property', () => {
    render(<TextField label='foo' />);
    expect(screen.getByText(/foo/)).toBeInTheDocument();
  });

  it('has input INSIDE label if `inputInsideLabel` is true', () => {
    const { container } = render(<TextField inputInsideLabel={true} />);

    expect(container.querySelector('label > input')).toBeInTheDocument();
    expect(container.querySelector('label + input')).not.toBeInTheDocument();
  });

  it('has input OUTSIDE label if `inputInsideLabel` is false', () => {
    const { container } = render(<TextField inputInsideLabel={false} />);

    expect(container.querySelector('label > input')).not.toBeInTheDocument();
    expect(container.querySelector('label + input')).toBeInTheDocument();
  });

  it('has input OUTSIDE label by default', () => {
    const { container } = render(<TextField />);

    expect(container.querySelector('label > input')).not.toBeInTheDocument();
    expect(container.querySelector('label + input')).toBeInTheDocument();
  });

  it('focuses on INNER input if label text is clicked', async () => {
    render(<TextField label='foo' inputInsideLabel={true} />);
    await userEvent.click(screen.getByText(/foo/));
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('focuses on OUTER input if label text is clicked', async () => {
    render(<TextField label='foo' inputInsideLabel={false} id='test-field' />);
    await userEvent.click(screen.getByText(/foo/));
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('has container with class(es) specified in `containerClass` property', () => {
    const { container } = render(<TextField containerClass='foo' />);
    const containerElem = container.getElementsByClassName('form-control')[0];
    expect(containerElem).toHaveClass('foo');
  });

  it('has help message with text specified in `helpMsg` property', () => {
    render(<TextField helpMsg='foo' />);
    expect(screen.getByText(/foo/)).toBeInTheDocument();
  });

  it('has placeholder with text specified in `placeholder` property', () => {
    render(<TextField placeholder='foo' />);
    expect(screen.getByPlaceholderText('foo')).toBeInTheDocument();
  });

  it('has side-label with text specified in `beforeSideLabel` before input (outside label)', () => {
    const { container } = render(<TextField beforeSideLabel='foo' inputInsideLabel={false} />);
    expect(container.querySelector('.join-item:first-child')).toHaveTextContent('foo');
  });

  it('has side-label with text specified in `afterSideLabel` after input (outside label)', () => {
    const { container } = render(<TextField afterSideLabel='foo' inputInsideLabel={false} />);
    expect(container.querySelector('.join-item:last-child')).toHaveTextContent('foo');
  });

  it('has side-label with text specified in `beforeSideLabel` before input (inside label)', () => {
    const { container } = render(<TextField beforeSideLabel='foo' inputInsideLabel={true} />);
    expect(container.querySelector('.join-item:first-child')).toHaveTextContent('foo');
  });

  it('has side-label with text specified in `afterSideLabel` after input (inside label)', () => {
    const { container } = render(<TextField afterSideLabel='foo' inputInsideLabel={true} />);
    expect(container.querySelector('.join-item:last-child')).toHaveTextContent('foo');
  });

});
