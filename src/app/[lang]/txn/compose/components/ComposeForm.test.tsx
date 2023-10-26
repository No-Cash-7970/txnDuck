import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18nextClientMock from '@/app/lib/testing/i18nextClientMock';

// Mock i18next before modules that use it are imported
jest.mock('react-i18next', () => i18nextClientMock);
// Mock useRouter
const routerPushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: routerPushMock })
}));
// Mock algokit
jest.mock('@algorandfoundation/algokit-utils', () => ({
  getAlgoClient: () => ({}),
  getTransactionParams: () => ({
    genesisID: 'fooNet',
    genesisHash: 'Some genesis hash'
  })
}));

import ComposeForm from './ComposeForm';
import { JotaiProvider } from '@/app/[lang]/components';

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

  it('has fields for payment transaction type if "Payment" transaction type is selected',
  async () => {
    render(<ComposeForm />);

    expect(screen.queryByText('fields.rcv.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.amt.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.close.label')).not.toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'pay');

    expect(screen.getByText('fields.rcv.label')).toBeInTheDocument();
    expect(screen.getByText('fields.amt.label')).toBeInTheDocument();
    expect(screen.getByText('fields.close.label')).toBeInTheDocument();
  });

  it('has fields for payment transaction type if "Asset Transfer" transaction type is selected',
  async () => {
    render(<ComposeForm />);

    expect(screen.queryByText('fields.asnd.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.arcv.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.xaid.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.aamt.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.aclose.label')).not.toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'axfer');

    expect(screen.getByText('fields.asnd.label')).toBeInTheDocument();
    expect(screen.getByText('fields.arcv.label')).toBeInTheDocument();
    expect(screen.getByText('fields.xaid.label')).toBeInTheDocument();
    expect(screen.getByText('fields.aamt.label')).toBeInTheDocument();
    expect(screen.getByText('fields.aclose.label')).toBeInTheDocument();
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
    expect(JSON.parse(sessionStorage.getItem('txnData') || '{}')).toStrictEqual({
      gen: 'fooNet',
      gh: 'Some genesis hash',
      txn: {
        type: 'pay',
        snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        fee: 0.001,
        fv: 6000000,
        lv: 6001000,
        rcv: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        amt: 5,
      }
    });
  });

  it('can store submitted *asset transfer* transaction data', async () => {
    sessionStorage.removeItem('txnData'); // Clear transaction data in session storage
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    // Enter data
    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'axfer');
    await userEvent.type(screen.getByLabelText(/fields.snd.label/),
      'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4'
    );
    await userEvent.type(screen.getByLabelText(/fields.fee.label/), '0.001');
    await userEvent.type(screen.getByLabelText(/fields.fv.label/), '6000000');
    await userEvent.type(screen.getByLabelText(/fields.lv.label/), '6001000');
    await userEvent.type(screen.getByLabelText(/fields.arcv.label/),
      'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'
    );
    await userEvent.type(screen.getByLabelText(/fields.xaid.label/), '123456789');
    await userEvent.type(screen.getByLabelText(/fields.aamt.label/), '5');

    // Submit data
    await userEvent.click(screen.getByText('sign_txn_btn'));

    // Check session storage
    expect(JSON.parse(sessionStorage.getItem('txnData') || '{}')).toStrictEqual({
      gen: 'fooNet',
      gh: 'Some genesis hash',
      txn: {
        type: 'axfer',
        fee: 0.001,
        fv: 6000000,
        lv: 6001000,
        snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        arcv: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        xaid: 123456789,
        aamt: '5',
      }
    });
  });

  it('can retrieve transaction data from session storage', () => {
    sessionStorage.setItem('txnData', JSON.stringify({
      gen: '',
      gh: '',
      txn: {
        type: 'pay',
        snd: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        fee: 0.001,
        fv: 5,
        lv: 1005,
        rekey: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
        rcv: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        amt: 42,
      }
    }));
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );
    expect(screen.getByRole('form')).toHaveFormValues({
      type: 'pay',
      snd: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      fee: 0.001,
      fv: 5,
      lv: 1005,
      rekey: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      rcv: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      amt: 42,
    });
  });

  // it('does not go to sign-transaction page if invalid data is submitted', () => {

  // });

});
