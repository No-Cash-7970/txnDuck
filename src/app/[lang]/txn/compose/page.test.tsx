import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

// Mock react `use` function before modules that use it are imported
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  use: () => ({ t: (key: string) => key }),
}));

import ComposeTxnPage from "./page";

describe("Compose Transaction Page", () => {

  it('has builder steps', () => {
    render(<ComposeTxnPage params={{lang: ''}} />);
    expect(screen.getByText(/builder_steps\.compose/)).toBeInTheDocument();
  });

  it('has page title heading', () => {
    render(<ComposeTxnPage params={{lang: ''}} />);
    expect(screen.getByRole('heading', { level: 1 })).not.toBeEmptyDOMElement();
  });

  it('has instructions', () => {
    render(<ComposeTxnPage params={{lang: ''}} />);
    expect(screen.getByText(/instructions/)).toBeInTheDocument();
  });

  it('has base transaction fields', () => {
    render(<ComposeTxnPage params={{lang: ''}} />);
    expect(screen.getByText('fields.type.label')).toBeInTheDocument();
    expect(screen.getByText('fields.snd.label')).toBeInTheDocument();
    expect(screen.getByText('fields.fee.label')).toBeInTheDocument();
    expect(screen.getByText('fields.fv.label')).toBeInTheDocument();
    expect(screen.getByText('fields.lv.label')).toBeInTheDocument();
    expect(screen.getByText('fields.lx.label')).toBeInTheDocument();
    expect(screen.getByText('fields.rekey.label')).toBeInTheDocument();
  });

  it('has fields for payment transaction type', () => {
    render(<ComposeTxnPage params={{lang: ''}} />);
    expect(screen.getByText('fields.rcv.label')).toBeInTheDocument();
    expect(screen.getByText('fields.amt.label')).toBeInTheDocument();
    expect(screen.getByText('fields.close.label')).toBeInTheDocument();
  });

  it('has "transaction template" button', () => {
    render(<ComposeTxnPage params={{lang: ''}} />);
    expect(screen.getByText('txn_template_btn')).toHaveClass('btn-disabled');
  });

  it('has "sign transaction" button', () => {
    render(<ComposeTxnPage params={{lang: ''}} />);
    expect(screen.getByText('sign_txn_btn')).toBeEnabled();
  });

});
