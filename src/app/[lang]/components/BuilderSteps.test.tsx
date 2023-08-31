/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

// Mock react `use` function before modules that use it are imported
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: () => ({ t: (key: string) => key }),
}));

import BuilderSteps from "./BuilderSteps";

describe('Builder Steps Component', () => {

  it('can highlight in primary color', () => {
    const {container} = render(<BuilderSteps current='sign' color='primary' />);

    const completedSteps = container.querySelectorAll('.text-primary');
    const highlightedSteps = container.querySelectorAll('.step-primary');

    expect(completedSteps).toHaveLength(1);
    expect(highlightedSteps).toHaveLength(2);
  });

  it('can highlight in secondary color', () => {
    const {container} = render(<BuilderSteps current='sign' color='secondary' />);

    const completedSteps = container.querySelectorAll('.text-secondary');
    const highlightedSteps = container.querySelectorAll('.step-secondary');

    expect(completedSteps).toHaveLength(1);
    expect(highlightedSteps).toHaveLength(2);
  });

  it('can highlight in accent color', () => {
    const {container} = render(<BuilderSteps current='sign' color='accent' />);

    const completedSteps = container.querySelectorAll('.text-accent');
    const highlightedSteps = container.querySelectorAll('.step-accent');

    expect(completedSteps).toHaveLength(1);
    expect(highlightedSteps).toHaveLength(2);
  });

  it('highlights the "compose" step if it is the current step', () => {
    const {container} = render(<BuilderSteps current='compose' />);

    const completedSteps = container.querySelector('.text-primary');
    const highlightedSteps = container.querySelectorAll('.step-primary');

    expect(completedSteps).not.toBeInTheDocument();
    expect(highlightedSteps).toHaveLength(1);
  });

  it('highlights the "sign" step if it is the current step', () => {
    const {container} = render(<BuilderSteps current='sign' />);

    const completedSteps = container.querySelectorAll('.text-primary');
    const highlightedSteps = container.querySelectorAll('.step-primary');

    expect(completedSteps).toHaveLength(1);
    expect(highlightedSteps).toHaveLength(2);
  });

  it('highlights the "send" step if it is the current step', () => {
    const {container} = render(<BuilderSteps current='send' />);

    const completedSteps = container.querySelectorAll('.text-primary');
    const highlightedSteps = container.querySelectorAll('.step-primary');

    expect(completedSteps).toHaveLength(2);
    expect(highlightedSteps).toHaveLength(3);
  });

  it('fully highlights the all steps if current step is "done"', () => {
    const {container} = render(<BuilderSteps current='done' />);

    const completedSteps = container.querySelectorAll('.text-primary');
    const highlightedSteps = container.querySelectorAll('.step-primary');
    const doneStep = container.querySelector('[data-content="★"]');

    expect(completedSteps).toHaveLength(3);
    expect(highlightedSteps).toHaveLength(3);
    expect(doneStep).toBeInTheDocument();
  });

});
