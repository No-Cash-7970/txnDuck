import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import i18nextClientMock from "@/app/lib/testing/i18nextClientMock";

/* Polyfill for TextEncoder and the Uint8Array it uses */
import { TextEncoder } from 'util';
global.TextEncoder = TextEncoder;
// NOTE: For some reason, the Uint8Array class that the polyfills use is different from the actual
// Uint8Array class, so polyfilling Uint8array is necessary too
// @ts-ignore
global.Uint8Array = (new TextEncoder).encode().constructor;

// Mock i18next before modules that use it are imported
jest.mock('react-i18next', () => i18nextClientMock);
// Mock useRouter
const routerPushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: routerPushMock })
}));

import ComposeForm from "./ComposeForm";
import { JotaiProvider } from "@/app/[lang]/components";

describe('Compose Form Component', () => {

  it('has instructions', () => {
    render(<ComposeForm />);
    expect(screen.getByText(/instructions/)).toBeInTheDocument();
  });

  it('has base transaction fields', () => {
    render(<ComposeForm />);
    expect(screen.getByText('fields.type.label')).toBeInTheDocument();
    expect(screen.getByText('fields.snd.label')).toBeInTheDocument();
    expect(screen.getByText('fields.fee.label')).toBeInTheDocument();
    expect(screen.getByText('fields.note.label')).toBeInTheDocument();
    expect(screen.getByText('fields.fv.label')).toBeInTheDocument();
    expect(screen.getByText('fields.lv.label')).toBeInTheDocument();
    expect(screen.getByText('fields.lx.label')).toBeInTheDocument();
    expect(screen.getByText('fields.rekey.label')).toBeInTheDocument();
  });

  it('has fields for payment transaction type', () => {
    render(<ComposeForm />);
    expect(screen.getByText('fields.rcv.label')).toBeInTheDocument();
    expect(screen.getByText('fields.amt.label')).toBeInTheDocument();
    expect(screen.getByText('fields.close.label')).toBeInTheDocument();
  });

  it('has "transaction template" button', () => {
    render(<ComposeForm />);
    expect(screen.getByText('txn_template_btn')).toHaveClass('btn-disabled');
  });

  it('has "sign transaction" button', () => {
    render(<ComposeForm />);
    expect(screen.getByText('sign_txn_btn')).toBeEnabled();
  });

  it('goes to sign-transaction page if valid transaction data is submitted', async () => {
    sessionStorage.removeItem('txnData'); // Clear transaction data in session storage
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    // Enter data
    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'pay');
    await userEvent.type(screen.getByLabelText(/fields.snd.label/),
      'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4'
    );
    await userEvent.type(screen.getByLabelText(/fields.fee.label/), '0.001');
    await userEvent.type(screen.getByLabelText(/fields.fv.label/), '6000000');
    await userEvent.type(screen.getByLabelText(/fields.lv.label/), '6001000');
    await userEvent.type(screen.getByLabelText(/fields.rcv.label/),
      'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'
    );
    await userEvent.type(screen.getByLabelText(/fields.amt.label/), '5');

    // Submit data
    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).toHaveBeenCalled();
  });

  it('can store submitted *payment* transaction data', async () => {
    sessionStorage.removeItem('txnData'); // Clear transaction data in session storage
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    // Enter data
    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'pay');
    await userEvent.type(screen.getByLabelText(/fields.snd.label/),
      'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4'
    );
    await userEvent.type(screen.getByLabelText(/fields.fee.label/), '0.001');
    await userEvent.type(screen.getByLabelText(/fields.fv.label/), '6000000');
    await userEvent.type(screen.getByLabelText(/fields.lv.label/), '6001000');
    await userEvent.type(screen.getByLabelText(/fields.rcv.label/),
      'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'
    );
    await userEvent.type(screen.getByLabelText(/fields.amt.label/), '5');

    // Submit data
    await userEvent.click(screen.getByText('sign_txn_btn'));

    // Check session storage
    const storedTxnData = JSON.parse(sessionStorage.getItem('txnData') || '{}');
    expect(storedTxnData.type).toBe('pay');
    expect(storedTxnData.snd).toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
    expect(storedTxnData.fee).toBe(0.001);
    expect(storedTxnData.fv).toBe(6000000);
    expect(storedTxnData.lv).toBe(6001000);
    expect(storedTxnData.rcv).toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
    expect(storedTxnData.amt).toBe(5);
  });

  it('can retrieve transaction data from session storage', () => {
    sessionStorage.setItem('txnData', JSON.stringify({
      type: 'pay',
      snd: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      fee: 0.001,
      fv: 5,
      lv: 1005,
      rekey: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      rcv: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      amt: 42,
    }));
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    expect(screen.getByLabelText(/fields.type.label/))
      .toHaveDisplayValue('fields.type.options.pay');
    expect(screen.getByLabelText(/fields.snd.label/))
      .toHaveDisplayValue('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveDisplayValue('0.001');
    expect(screen.getByLabelText(/fields.note.label/)).toHaveDisplayValue('');
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveDisplayValue('5');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveDisplayValue('1005');
    expect(screen.getByLabelText(/fields.lx.label/)).toHaveDisplayValue('');
    expect(screen.getByLabelText(/fields.rekey.label/))
      .toHaveDisplayValue('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB');
    expect(screen.getByLabelText(/fields.rcv.label/))
      .toHaveDisplayValue('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    expect(screen.getByLabelText(/fields.amt.label/)).toHaveDisplayValue('42');
    expect(screen.getByLabelText(/fields.close.label/)).toHaveDisplayValue('');
  });

  // it('does not go to sign-transaction page if invalid data is submitted', () => {

  // });

});
