/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */

import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

// Mock react `use` function before modules that use it are imported
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: () => ({ t: (key: string) => key }),
}));

import BuilderSteps from './BuilderSteps';

describe('Builder Steps Component', () => {

  it('can highlight in primary color', () => {
    const {container} = render(<BuilderSteps current='sign' color='primary' />);
    const highlightedSteps = container.querySelectorAll('.step-primary');
    expect(highlightedSteps).toHaveLength(2);
  });

  it('can highlight in secondary color', () => {
    const {container} = render(<BuilderSteps current='sign' color='secondary' />);
    const highlightedSteps = container.querySelectorAll('.step-secondary');
    expect(highlightedSteps).toHaveLength(2);
  });

  it('can highlight in accent color', () => {
    const {container} = render(<BuilderSteps current='sign' color='accent' />);
    const highlightedSteps = container.querySelectorAll('.step-accent');
    expect(highlightedSteps).toHaveLength(2);
  });

  it('highlights the "compose" step if it is the current step', () => {
    const {container} = render(<BuilderSteps current='compose' />);
    const highlightedSteps = container.querySelectorAll('.step-primary');
    expect(highlightedSteps).toHaveLength(1);
  });

  it('highlights the "sign" step if it is the current step', () => {
    const {container} = render(<BuilderSteps current='sign' />);
    const highlightedSteps = container.querySelectorAll('.step-primary');
    expect(highlightedSteps).toHaveLength(2);
  });

  it('highlights the "send" step if it is the current step', () => {
    const {container} = render(<BuilderSteps current='send' />);
    const highlightedSteps = container.querySelectorAll('.step-primary');
    expect(highlightedSteps).toHaveLength(3);
  });

});
