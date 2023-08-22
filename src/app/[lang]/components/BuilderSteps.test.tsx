/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import BuilderSteps from "./BuilderSteps";

// This mock makes sure any components using the translate hook can use it without a warning being
// shown
// From https://react.i18next.com/misc/testing
jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {},
    };
  },
  Trans: ({ i18nKey }: { i18nKey: string }) => {
    if (i18nKey === 'site_name_formatted') return <>txn<b>Duck</b></>;
  },
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  }
}));

describe('Builder Steps Component', () => {

  it('renders', () => {
    const {container} = render(<BuilderSteps />);
    expect(screen.getByText(/builder_steps\.compose/)).toBeInTheDocument();
  });

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
