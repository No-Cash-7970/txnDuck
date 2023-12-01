import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FieldTip from './FieldTip';

// This solution to the "ResizeObserver is not defined" error caused by Radix UI Popover (only in
// Jest) found at
// https://greenonsoftware.com/articles/testing/testing-and-mocking-resize-observer-in-java-script/
global.ResizeObserver = class MockedResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
};

describe('Form Components - FieldTip', () => {

  it('shows tooltip when button is clicked', async () => {
    render(<FieldTip tipProps={{content: 'foo'}} />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/foo/)).toBeInTheDocument();
  });

});
