import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

// Mock react `use` function before modules that use it are imported
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: () => ({ t: (key: string) => key }),
}));

import BuilderSteps from './BuilderSteps';

describe('Builder Steps Component', () => {

  it('can highlight in primary color', () => {
    const {container} = render(<BuilderSteps lng='en' current='sign' color='primary' />);
    const highlightedSteps = container.querySelectorAll('.step-primary');
    expect(highlightedSteps).toHaveLength(2);
  });

  it('can highlight in secondary color', () => {
    const {container} = render(<BuilderSteps lng='en' current='sign' color='secondary' />);
    const highlightedSteps = container.querySelectorAll('.step-secondary');
    expect(highlightedSteps).toHaveLength(2);
  });

  it('can highlight in accent color', () => {
    const {container} = render(<BuilderSteps lng='en' current='sign' color='accent' />);
    const highlightedSteps = container.querySelectorAll('.step-accent');
    expect(highlightedSteps).toHaveLength(2);
  });

  it('highlights the "compose" step if it is the current step', () => {
    const {container} = render(<BuilderSteps lng='en' current='compose' />);
    const highlightedSteps = container.querySelectorAll('.step-primary');
    expect(highlightedSteps).toHaveLength(1);
  });

  it('highlights the "sign" step if it is the current step', () => {
    const {container} = render(<BuilderSteps lng='en' current='sign' />);
    const highlightedSteps = container.querySelectorAll('.step-primary');
    expect(highlightedSteps).toHaveLength(2);
  });

  it('highlights the "send" step if it is the current step', () => {
    const {container} = render(<BuilderSteps lng='en' current='send' />);
    const highlightedSteps = container.querySelectorAll('.step-primary');
    expect(highlightedSteps).toHaveLength(3);
  });

  it('has links for "sign" and "send" steps when on "compose" step for a transaction', () => {
    render(<BuilderSteps lng='en' current='compose' />);

    const stepLinks = screen.getAllByRole('link');

    expect(stepLinks).toHaveLength(2);
    expect(stepLinks[0]).toHaveTextContent('builder_steps.sign');
    expect(stepLinks[0]).toHaveAttribute('href', '/en/txn/sign');
    expect(stepLinks[1]).toHaveTextContent('builder_steps.send');
    expect(stepLinks[1]).toHaveAttribute('href', '/en/txn/send');
  });

  it('has links for "compose" and "send" steps when on "sign" step for a transaction', () => {
    render(<BuilderSteps lng='en' current='sign' />);

    const stepLinks = screen.getAllByRole('link');

    expect(stepLinks).toHaveLength(2);
    expect(stepLinks[0]).toHaveTextContent('builder_steps.compose');
    expect(stepLinks[0]).toHaveAttribute('href', '/en/txn/compose');
    expect(stepLinks[1]).toHaveTextContent('builder_steps.send');
    expect(stepLinks[1]).toHaveAttribute('href', '/en/txn/send');
  });

  it('has links for "compose" and "sign" steps when on "send" step for a transaction', () => {
    render(<BuilderSteps lng='en' current='send' />);

    const stepLinks = screen.getAllByRole('link');

    expect(stepLinks).toHaveLength(2);
    expect(stepLinks[0]).toHaveTextContent('builder_steps.compose');
    expect(stepLinks[0]).toHaveAttribute('href', '/en/txn/compose');
    expect(stepLinks[1]).toHaveTextContent('builder_steps.sign');
    expect(stepLinks[1]).toHaveAttribute('href', '/en/txn/sign');
  });

  it('has links for "sign" and "send" steps when on "compose" step for a transaction group', () => {
    render(<BuilderSteps lng='en' group={true} current='compose' />);

    const stepLinks = screen.getAllByRole('link');

    expect(stepLinks).toHaveLength(2);
    expect(stepLinks[0]).toHaveTextContent('builder_steps.sign');
    expect(stepLinks[0]).toHaveAttribute('href', '/en/group/sign');
    expect(stepLinks[1]).toHaveTextContent('builder_steps.send');
    expect(stepLinks[1]).toHaveAttribute('href', '/en/group/send');
  });

  it('has links for "compose" and "send" steps when on "sign" step for a transaction group', () => {
    render(<BuilderSteps lng='en' group={true} current='sign' />);

    const stepLinks = screen.getAllByRole('link');

    expect(stepLinks).toHaveLength(2);
    expect(stepLinks[0]).toHaveTextContent('builder_steps.compose');
    expect(stepLinks[0]).toHaveAttribute('href', '/en/group/compose');
    expect(stepLinks[1]).toHaveTextContent('builder_steps.send');
    expect(stepLinks[1]).toHaveAttribute('href', '/en/group/send');
  });

  it('has links for "compose" and "sign" steps when on "send" step for a transaction group', () => {
    render(<BuilderSteps lng='en' group={true} current='send' />);

    const stepLinks = screen.getAllByRole('link');

    expect(stepLinks).toHaveLength(2);
    expect(stepLinks[0]).toHaveTextContent('builder_steps.compose');
    expect(stepLinks[0]).toHaveAttribute('href', '/en/group/compose');
    expect(stepLinks[1]).toHaveTextContent('builder_steps.sign');
    expect(stepLinks[1]).toHaveAttribute('href', '/en/group/sign');
  });

});
