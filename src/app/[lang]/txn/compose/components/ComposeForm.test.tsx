import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18nextClientMock from '@/app/lib/testing/i18nextClientMock';

// Mock i18next before modules that use it are imported
jest.mock('react-i18next', () => i18nextClientMock);
// Mock useRouter
const routerPushMock = jest.fn();
let presetMockValue = '';
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: routerPushMock }),
  useSearchParams: () => ({
    get: () => presetMockValue
  }),
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
  afterEach(() => {
    presetMockValue = '';
  });

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

  it(
  'has fields for payment transaction type if "Asset Configuration" transaction type is selected',
  async () => {
    render(<ComposeForm />);

    expect(screen.queryByText('fields.caid.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_un.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_an.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_t.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_dc.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_df.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_au.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_m.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_f.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_c.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_r.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_am.label')).not.toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'acfg');

    expect(screen.getByText('fields.caid.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apar_un.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apar_an.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apar_t.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apar_dc.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apar_df.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apar_au.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apar_m.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apar_f.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apar_c.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apar_r.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apar_am.label')).toBeInTheDocument();
  });

  it('has fields for payment transaction type if "Asset Freeze" transaction type is selected',
  async () => {
    render(<ComposeForm />);

    expect(screen.queryByText('fields.faid.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.fadd.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.afrz.label')).not.toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'afrz');

    expect(screen.getByText('fields.faid.label')).toBeInTheDocument();
    expect(screen.getByText('fields.fadd.label')).toBeInTheDocument();
    expect(screen.getByText('fields.afrz.label')).toBeInTheDocument();
  });

  it('has fields for payment transaction type if "Key Registration" transaction type is selected',
  async () => {
    render(<ComposeForm />);

    expect(screen.queryByText('fields.votekey.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.selkey.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.sprfkey.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.votefst.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.votelst.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.votekd.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.nonpart.label')).not.toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'keyreg');

    expect(screen.getByText('fields.votekey.label')).toBeInTheDocument();
    expect(screen.getByText('fields.selkey.label')).toBeInTheDocument();
    expect(screen.getByText('fields.sprfkey.label')).toBeInTheDocument();
    expect(screen.getByText('fields.votefst.label')).toBeInTheDocument();
    expect(screen.getByText('fields.votelst.label')).toBeInTheDocument();
    expect(screen.getByText('fields.votekd.label')).toBeInTheDocument();
    expect(screen.getByText('fields.nonpart.label')).toBeInTheDocument();
  });

  it('has fields for payment transaction type if "Application Call" transaction type is selected',
  async () => {
    render(<ComposeForm />);

    expect(screen.queryByText('fields.apan.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apid.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apap.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apsu.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apgs_nui.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apgs_nbs.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apls_nui.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apls_nbs.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apep.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apat.title')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apaa.title')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apfa.title')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apas.title')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apbx.title')).not.toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'appl');

    expect(screen.getByText('fields.apan.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apid.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apap.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apsu.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apgs_nui.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apgs_nbs.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apls_nui.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apls_nbs.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apep.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apaa.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apat.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apfa.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apas.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apbx.title')).toBeInTheDocument();
  });

  it('has "transaction presets" button', () => {
    render(<ComposeForm />);
    expect(screen.getByText('txn_presets_btn')).toBeInTheDocument();
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

  it('can store submitted *asset configuration* transaction data', async () => {
    sessionStorage.removeItem('txnData'); // Clear transaction data in session storage
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    // Enter data
    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'acfg');
    await userEvent.type(screen.getByLabelText(/fields.snd.label/),
      'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4'
    );
    await userEvent.type(screen.getByLabelText(/fields.fee.label/), '0.001');
    await userEvent.type(screen.getByLabelText(/fields.fv.label/), '6000000');
    await userEvent.type(screen.getByLabelText(/fields.lv.label/), '6001000');
    await userEvent.type(screen.getByLabelText(/fields.apar_un.label/), 'FAKE');
    await userEvent.type(screen.getByLabelText(/fields.apar_an.label/), 'Fake Token');
    await userEvent.type(screen.getByLabelText(/fields.apar_t.label/), '10000000');
    await userEvent.type(screen.getByLabelText(/fields.apar_dc.label/), '3');
    await userEvent.click(screen.getByLabelText(/fields.apar_df.label/));
    await userEvent.type(screen.getByLabelText(/fields.apar_au.label/), 'https://fake.token');
    await userEvent.type(screen.getByLabelText(/fields.apar_m.label/),
      'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4'
    );
    await userEvent.type(screen.getByLabelText(/fields.apar_f.label/),
      'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4'
    );
    await userEvent.type(screen.getByLabelText(/fields.apar_c.label/),
      'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4'
    );
    await userEvent.type(screen.getByLabelText(/fields.apar_r.label/),
      'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4'
    );
    await userEvent.type(screen.getByLabelText(/fields.apar_am.label/),
      'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG'
    );

    // Submit data
    await userEvent.click(screen.getByText('sign_txn_btn'));

    // Check session storage
    expect(JSON.parse(sessionStorage.getItem('txnData') || '{}')).toStrictEqual({
      gen: 'fooNet',
      gh: 'Some genesis hash',
      txn: {
        type: 'acfg',
        fee: 0.001,
        fv: 6000000,
        lv: 6001000,
        snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        apar_un: 'FAKE',
        apar_an: 'Fake Token',
        apar_t: '10000000',
        apar_dc: 3,
        apar_df: true,
        apar_au: 'https://fake.token',
        apar_m: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        apar_f: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        apar_c: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        apar_r: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        apar_am: 'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
      }
    });
  }, 10000);

  it('can store submitted *asset freeze* transaction data', async () => {
    sessionStorage.removeItem('txnData'); // Clear transaction data in session storage
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    // Enter data
    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'afrz');
    await userEvent.type(screen.getByLabelText(/fields.snd.label/),
      'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4'
    );
    await userEvent.type(screen.getByLabelText(/fields.fee.label/), '0.001');
    await userEvent.type(screen.getByLabelText(/fields.fv.label/), '6000000');
    await userEvent.type(screen.getByLabelText(/fields.lv.label/), '6001000');
    await userEvent.type(screen.getByLabelText(/fields.faid.label/), '123456789');
    await userEvent.type(screen.getByLabelText(/fields.fadd.label/),
      'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'
    );
    await userEvent.click(screen.getByLabelText(/fields.afrz.label/));

    // Submit data
    await userEvent.click(screen.getByText('sign_txn_btn'));

    // Check session storage
    expect(JSON.parse(sessionStorage.getItem('txnData') || '{}')).toStrictEqual({
      gen: 'fooNet',
      gh: 'Some genesis hash',
      txn: {
        type: 'afrz',
        fee: 0.001,
        fv: 6000000,
        lv: 6001000,
        snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        faid: 123456789,
        fadd: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        afrz: true,
      }
    });
  });

  it('can store submitted *key registration* transaction data', async () => {
    sessionStorage.removeItem('txnData'); // Clear transaction data in session storage
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    // Enter data
    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'keyreg');
    await userEvent.type(screen.getByLabelText(/fields.snd.label/),
      'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4'
    );
    await userEvent.type(screen.getByLabelText(/fields.fee.label/), '0.001');
    await userEvent.type(screen.getByLabelText(/fields.fv.label/), '6000000');
    await userEvent.type(screen.getByLabelText(/fields.lv.label/), '6001000');
    await userEvent.type(screen.getByLabelText(/fields.votekey.label/),
      'G/lqTV6MKspW6J8wH2d8ZliZ5XZVZsruqSBJMwLwlmo='
    );
    await userEvent.type(screen.getByLabelText(/fields.selkey.label/),
      'LrpLhvzr+QpN/bivh6IPpOaKGbGzTTB5lJtVfixmmgk='
    );
    await userEvent.type(screen.getByLabelText(/fields.sprfkey.label/),
      'RpUpNWfZMjZ1zOOjv3MF2tjO714jsBt0GKnNsw0ihJ4HSZwci+d9zvUi3i67LwFUJgjQ5Dz4zZgHgGduElnmSA=='
    );
    await userEvent.type(screen.getByLabelText(/fields.votefst.label/), '6000000');
    await userEvent.type(screen.getByLabelText(/fields.votelst.label/), '6100000');
    await userEvent.type(screen.getByLabelText(/fields.votekd.label/), '1730');

    // Submit data
    await userEvent.click(screen.getByText('sign_txn_btn'));

    // Check session storage
    expect(JSON.parse(sessionStorage.getItem('txnData') || '{}')).toStrictEqual({
      gen: 'fooNet',
      gh: 'Some genesis hash',
      txn: {
        type: 'keyreg',
        fee: 0.001,
        fv: 6000000,
        lv: 6001000,
        snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
        votekey: 'G/lqTV6MKspW6J8wH2d8ZliZ5XZVZsruqSBJMwLwlmo=',
        selkey: 'LrpLhvzr+QpN/bivh6IPpOaKGbGzTTB5lJtVfixmmgk=',
        // eslint-disable-next-line max-len
        sprfkey: 'RpUpNWfZMjZ1zOOjv3MF2tjO714jsBt0GKnNsw0ihJ4HSZwci+d9zvUi3i67LwFUJgjQ5Dz4zZgHgGduElnmSA==',
        votefst: 6000000,
        votelst: 6100000,
        votekd: 1730,
        nonpart: false,
      }
    });
  });

  it('can store submitted *application call* transaction data', async () => {
    sessionStorage.removeItem('txnData'); // Clear transaction data in session storage
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    // Enter data
    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'appl');
    await userEvent.type(screen.getByLabelText(/fields.snd.label/),
      'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4'
    );
    await userEvent.type(screen.getByLabelText(/fields.fee.label/), '0.001');
    await userEvent.type(screen.getByLabelText(/fields.fv.label/), '6000000');
    await userEvent.type(screen.getByLabelText(/fields.lv.label/), '6001000');

    await userEvent.type(screen.getByLabelText(/fields.apap.label/), 'BYEB');
    await userEvent.type(screen.getByLabelText(/fields.apsu.label/), 'BYEB');
    await userEvent.type(screen.getByLabelText(/fields.apgs_nui.label/), '1');
    await userEvent.type(screen.getByLabelText(/fields.apgs_nbs.label/), '2');
    await userEvent.type(screen.getByLabelText(/fields.apls_nui.label/), '3');
    await userEvent.type(screen.getByLabelText(/fields.apls_nbs.label/), '4');
    await userEvent.type(screen.getByLabelText(/fields.apep.label/), '1');

    // Add and enter arguments
    await userEvent.click(screen.getByText(/fields.apaa.add_btn/));
    await userEvent.click(screen.getByText(/fields.apaa.add_btn/));
    await userEvent.click(screen.getByText(/fields.apaa.add_btn/));
    const argInputs = screen.getAllByLabelText(/fields.apaa.label/);
    await userEvent.type(argInputs[0], 'foo');
    await userEvent.type(argInputs[1], '42');

    // Add and enter foreign accounts
    await userEvent.click(screen.getByText(/fields.apat.add_btn/));
    await userEvent.type(screen.getByLabelText(/fields.apat.label/),
      'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'
    );

    // Add and enter foreign applications
    await userEvent.click(screen.getByText(/fields.apfa.add_btn/));
    await userEvent.click(screen.getByText(/fields.apfa.add_btn/));
    const appInputs = screen.getAllByLabelText(/fields.apfa.label/);
    await userEvent.type(appInputs[0], '11111111');
    await userEvent.type(appInputs[1], '22222222');

    // Add and enter foreign assets
    await userEvent.click(screen.getByText(/fields.apas.add_btn/));
    await userEvent.click(screen.getByText(/fields.apas.add_btn/));
    await userEvent.click(screen.getByText(/fields.apas.add_btn/));
    const assetInputs = screen.getAllByLabelText(/fields.apas.label/);
    await userEvent.type(assetInputs[0], '33333333');
    await userEvent.type(assetInputs[1], '44444444');
    await userEvent.type(assetInputs[2], '55555555');

    // Add and enter box information
    await userEvent.click(screen.getByText(/fields.apbx.add_btn/));
    await userEvent.type(screen.getByLabelText(/fields.apbx_i.label/), '99999999');
    await userEvent.type(screen.getByLabelText(/fields.apbx_n.label/), 'Boxy box');

    // Submit data
    await userEvent.click(screen.getByText('sign_txn_btn'));

    // Check session storage
    expect(JSON.parse(sessionStorage.getItem('txnData') || '{}')).toStrictEqual({
      gen: 'fooNet',
      gh: 'Some genesis hash',
      txn: {
        type: 'appl',
        fee: 0.001,
        fv: 6000000,
        lv: 6001000,
        snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        apan: 0,
        apap: 'BYEB',
        apsu: 'BYEB',
        apgs_nui: 1,
        apgs_nbs: 2,
        apls_nui: 3,
        apls_nbs: 4,
        apep: 1,
        apaa: ['foo', '42', ''],
        apat: ['GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'],
        apfa: [11111111, 22222222],
        apas: [33333333, 44444444, 55555555],
        apbx: [{i: 99999999, n: 'Boxy box' }],
      }
    });
  }, 10000);

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

  it('has fields for "transfer algos" preset', () => {
    presetMockValue = 'transfer_algos';
    render(<ComposeForm />);

    expect(screen.getByLabelText(/fields.type.label/)).toHaveValue('pay');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();
    expect(screen.getByLabelText(/fields.rcv.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.amt.label/)).toBeRequired();
    expect(screen.queryByText('fields.close.label')).not.toBeInTheDocument();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.rekey.label')).not.toBeInTheDocument();
  });

  it('has fields for "rekey account" preset', () => {
    presetMockValue = 'rekey_account';
    render(<ComposeForm />);

    expect(screen.getByLabelText(/fields.type.label/)).toHaveValue('pay');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();
    expect(screen.queryByText('fields.rcv.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.amt.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.close.label')).not.toBeInTheDocument();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.getByLabelText(/fields.rekey.label/)).toBeRequired();
  });

  it('has fields for "close account" preset', () => {
    presetMockValue = 'close_account';
    render(<ComposeForm />);

    expect(screen.getByLabelText(/fields.type.label/)).toHaveValue('pay');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();
    expect(screen.queryByText('fields.rcv.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.amt.label')).not.toBeInTheDocument();
    expect(screen.getByLabelText(/fields.close.label/)).toBeRequired();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.rekey.label')).not.toBeInTheDocument();
  });

  it('has fields for "transfer asset" preset', () => {
    presetMockValue = 'asset_transfer';
    render(<ComposeForm />);

    expect(screen.getByLabelText(/fields.type.label/)).toHaveValue('axfer');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();
    expect(screen.getByLabelText(/fields.xaid.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.arcv.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.aamt.label/)).toBeRequired();
    expect(screen.queryByText('fields.asnd.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.aclose.label')).not.toBeInTheDocument();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.rekey.label')).not.toBeInTheDocument();
  });

  it('has fields for "opt in asset" preset', () => {
    presetMockValue = 'asset_opt_in';
    render(<ComposeForm />);

    expect(screen.getByLabelText(/fields.type.label/)).toHaveValue('axfer');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();
    expect(screen.getByLabelText(/fields.xaid.label/)).toBeRequired();
    expect(screen.queryByText(/fields.arcv.label/)).not.toBeInTheDocument();
    expect(screen.queryByText(/fields.aamt.label/)).not.toBeInTheDocument();
    expect(screen.queryByText('fields.asnd.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.aclose.label')).not.toBeInTheDocument();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.rekey.label')).not.toBeInTheDocument();
  });

  it('has fields for "opt out asset" preset', () => {
    presetMockValue = 'asset_opt_out';
    render(<ComposeForm />);

    expect(screen.getByLabelText(/fields.type.label/)).toHaveValue('axfer');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();
    expect(screen.getByLabelText(/fields.xaid.label/)).toBeRequired();
    expect(screen.queryByText(/fields.arcv.label/)).not.toBeInTheDocument();
    expect(screen.queryByText(/fields.aamt.label/)).not.toBeInTheDocument();
    expect(screen.queryByText('fields.asnd.label')).not.toBeInTheDocument();
    expect(screen.getByLabelText(/fields.aclose.label/)).toBeRequired();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.rekey.label')).not.toBeInTheDocument();
  });

  it('has fields for "create asset" preset', () => {
    presetMockValue = 'asset_create';
    render(<ComposeForm />);

    expect(screen.getByLabelText(/fields.type.label/)).toHaveValue('acfg');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();
    expect(screen.queryByText('fields.caid.label')).not.toBeInTheDocument();
    expect(screen.getByLabelText(/fields.apar_un.label/)).not.toBeRequired();
    expect(screen.getByLabelText(/fields.apar_an.label/)).not.toBeRequired();
    expect(screen.getByLabelText(/fields.apar_t.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.apar_dc.label/)).toBeRequired();
    expect(screen.getByText('fields.apar_df.label')).toBeInTheDocument();
    expect(screen.getByLabelText(/fields.apar_au.label/)).not.toBeRequired();
    expect(screen.getByLabelText(/fields.apar_m.label/)).not.toBeRequired();
    expect(screen.getByLabelText(/fields.apar_f.label/)).not.toBeRequired();
    expect(screen.getByLabelText(/fields.apar_c.label/)).not.toBeRequired();
    expect(screen.getByLabelText(/fields.apar_r.label/)).not.toBeRequired();
    expect(screen.getByLabelText(/fields.apar_am.label/)).not.toBeRequired();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.rekey.label')).not.toBeInTheDocument();
  });

  it('has fields for "reconfigure asset" preset', () => {
    presetMockValue = 'asset_reconfig';
    render(<ComposeForm />);

    expect(screen.getByLabelText(/fields.type.label/)).toHaveValue('acfg');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();
    expect(screen.getByLabelText(/fields.caid.label/)).toBeRequired();
    expect(screen.queryByText('fields.apar_un.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_an.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_t.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_dc.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_df.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_au.label')).not.toBeInTheDocument();
    expect(screen.getByLabelText(/fields.apar_m.label/)).not.toBeRequired();
    expect(screen.getByLabelText(/fields.apar_f.label/)).not.toBeRequired();
    expect(screen.getByLabelText(/fields.apar_c.label/)).not.toBeRequired();
    expect(screen.getByLabelText(/fields.apar_r.label/)).not.toBeRequired();
    expect(screen.queryByText(/fields.apar_am.label/)).not.toBeInTheDocument();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.rekey.label')).not.toBeInTheDocument();
  });

  it('has fields for "revoke (claw back) asset" preset', () => {
    presetMockValue = 'asset_clawback';
    render(<ComposeForm />);

    expect(screen.getByLabelText(/fields.type.label/)).toHaveValue('axfer');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();
    expect(screen.getByLabelText(/fields.xaid.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.arcv.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.aamt.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.asnd.label/)).toBeRequired();
    expect(screen.queryByText('fields.aclose.label')).not.toBeInTheDocument();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.rekey.label')).not.toBeInTheDocument();
  });

  it('has fields for "destroy asset" preset', () => {
    presetMockValue = 'asset_destroy';
    render(<ComposeForm />);

    expect(screen.getByLabelText(/fields.type.label/)).toHaveValue('acfg');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();
    expect(screen.getByLabelText(/fields.caid.label/)).toBeRequired();
    expect(screen.queryByText('fields.apar_un.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_an.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_t.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_dc.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_df.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_au.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_m.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_f.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_c.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_r.label')).not.toBeInTheDocument();
    expect(screen.queryByText(/fields.apar_am.label/)).not.toBeInTheDocument();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.rekey.label')).not.toBeInTheDocument();
  });

  it('has fields for "freeze asset" preset', () => {
    presetMockValue = 'asset_freeze';
    render(<ComposeForm />);

    expect(screen.getByLabelText(/fields.type.label/)).toHaveValue('afrz');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();

    expect(screen.getByLabelText(/fields.faid.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.fadd.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.afrz.label/)).toBeDisabled();
    expect(screen.getByLabelText(/fields.afrz.label/)).toBeChecked();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.rekey.label')).not.toBeInTheDocument();
  });

  it('has fields for "unfreeze asset" preset', () => {
    presetMockValue = 'asset_unfreeze';
    render(<ComposeForm />);

    expect(screen.getByLabelText(/fields.type.label/)).toHaveValue('afrz');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();

    expect(screen.getByLabelText(/fields.faid.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.fadd.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.afrz.label/)).toBeDisabled();
    expect(screen.getByLabelText(/fields.afrz.label/)).not.toBeChecked();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.rekey.label')).not.toBeInTheDocument();
  });

  it('has fields for "run application" preset', () => {
    presetMockValue = 'app_run';
    render(<ComposeForm />);

    expect(screen.getByLabelText(/fields.type.label/)).toHaveValue('appl');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();

    expect(screen.getByLabelText(/fields.apan.label/)).toHaveValue('0'); // NoOp
    expect(screen.getByLabelText(/fields.apan.label/)).toBeDisabled();

    expect(screen.getByLabelText(/fields.apid.label/)).toBeRequired();
    expect(screen.queryByText('fields.apap.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apsu.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apgs_nui.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apgs_nbs.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apls_nui.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apls_nbs.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apep.label')).not.toBeInTheDocument();
    expect(screen.getByText('fields.apaa.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apat.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apfa.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apas.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apbx.title')).toBeInTheDocument();

    expect(screen.getByText('fields.lx.label')).toBeInTheDocument();
    expect(screen.queryByText('fields.rekey.label')).not.toBeInTheDocument();
  });

  it('has fields for "opt in application" preset', () => {
    presetMockValue = 'app_opt_in';
    render(<ComposeForm />);

    expect(screen.getByLabelText(/fields.type.label/)).toHaveValue('appl');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();

    expect(screen.getByLabelText(/fields.apan.label/)).toHaveValue('1'); // Opt in
    expect(screen.getByLabelText(/fields.apan.label/)).toBeDisabled();

    expect(screen.getByLabelText(/fields.apid.label/)).toBeRequired();
    expect(screen.queryByText('fields.apap.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apsu.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apgs_nui.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apgs_nbs.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apls_nui.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apls_nbs.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apep.label')).not.toBeInTheDocument();
    expect(screen.getByText('fields.apaa.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apat.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apfa.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apas.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apbx.title')).toBeInTheDocument();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.rekey.label')).not.toBeInTheDocument();
  });

  it('has fields for "deploy application" preset', () => {
    presetMockValue = 'app_deploy';
    render(<ComposeForm />);

    expect(screen.getByLabelText(/fields.type.label/)).toHaveValue('appl');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();

    expect(screen.getByLabelText(/fields.apan.label/)).toHaveValue('0'); // NoOp
    expect(screen.getByLabelText(/fields.apan.label/)).toBeDisabled();

    expect(screen.queryByText('fields.apid.label')).not.toBeInTheDocument();
    expect(screen.getByLabelText(/fields.apap.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.apsu.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.apgs_nui.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.apgs_nbs.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.apls_nui.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.apls_nbs.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.apep.label/)).toBeRequired();
    expect(screen.getByText('fields.apaa.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apat.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apfa.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apas.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apbx.title')).toBeInTheDocument();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.rekey.label')).not.toBeInTheDocument();
  });

  it('has fields for "update application" preset', () => {
    presetMockValue = 'app_update';
    render(<ComposeForm />);

    expect(screen.getByLabelText(/fields.type.label/)).toHaveValue('appl');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();

    expect(screen.getByLabelText(/fields.apan.label/)).toHaveValue('4'); // Update
    expect(screen.getByLabelText(/fields.apan.label/)).toBeDisabled();

    expect(screen.getByLabelText(/fields.apid.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.apap.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.apsu.label/)).toBeRequired();
    expect(screen.queryByText('fields.apgs_nui.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apgs_nbs.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apls_nui.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apls_nbs.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apep.label')).not.toBeInTheDocument();
    expect(screen.getByText('fields.apaa.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apat.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apfa.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apas.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apbx.title')).toBeInTheDocument();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.rekey.label')).not.toBeInTheDocument();
  });

  it('has fields for "close out application" preset', () => {
    presetMockValue = 'app_close';
    render(<ComposeForm />);

    expect(screen.getByLabelText(/fields.type.label/)).toHaveValue('appl');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();

    expect(screen.getByLabelText(/fields.apan.label/)).toHaveValue('2'); // Close Out
    expect(screen.getByLabelText(/fields.apan.label/)).toBeDisabled();

    expect(screen.getByLabelText(/fields.apid.label/)).toBeRequired();
    expect(screen.queryByText('fields.apap.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apsu.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apgs_nui.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apgs_nbs.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apls_nui.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apls_nbs.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apep.label')).not.toBeInTheDocument();
    expect(screen.getByText('fields.apaa.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apat.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apfa.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apas.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apbx.title')).toBeInTheDocument();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.rekey.label')).not.toBeInTheDocument();
  });

  it('has fields for "clear application" preset', () => {
    presetMockValue = 'app_clear';
    render(<ComposeForm />);

    expect(screen.getByLabelText(/fields.type.label/)).toHaveValue('appl');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();

    expect(screen.getByLabelText(/fields.apan.label/)).toHaveValue('3'); // Clear
    expect(screen.getByLabelText(/fields.apan.label/)).toBeDisabled();

    expect(screen.getByLabelText(/fields.apid.label/)).toBeRequired();
    expect(screen.queryByText('fields.apap.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apsu.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apgs_nui.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apgs_nbs.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apls_nui.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apls_nbs.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apep.label')).not.toBeInTheDocument();
    expect(screen.getByText('fields.apaa.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apat.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apfa.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apas.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apbx.title')).toBeInTheDocument();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.rekey.label')).not.toBeInTheDocument();
  });

  it('has fields for "delete application" preset', () => {
    presetMockValue = 'app_delete';
    render(<ComposeForm />);

    expect(screen.getByLabelText(/fields.type.label/)).toHaveValue('appl');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();

    expect(screen.getByLabelText(/fields.apan.label/)).toHaveValue('5'); // Delete
    expect(screen.getByLabelText(/fields.apan.label/)).toBeDisabled();

    expect(screen.getByLabelText(/fields.apid.label/)).toBeRequired();
    expect(screen.queryByText('fields.apap.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apsu.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apgs_nui.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apgs_nbs.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apls_nui.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apls_nbs.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apep.label')).not.toBeInTheDocument();
    expect(screen.getByText('fields.apaa.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apat.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apfa.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apas.title')).toBeInTheDocument();
    expect(screen.getByText('fields.apbx.title')).toBeInTheDocument();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.rekey.label')).not.toBeInTheDocument();
  });

  it('has fields for "register online" preset', () => {
    presetMockValue = 'reg_online';
    render(<ComposeForm />);

    expect(screen.getByLabelText(/fields.type.label/)).toHaveValue('keyreg');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();

    expect(screen.getByLabelText(/fields.votekey.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.selkey.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.sprfkey.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.votefst.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.votelst.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.votekd.label/)).toBeRequired();

    expect(screen.queryByText('fields.nonpart.label')).not.toBeInTheDocument();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.rekey.label')).not.toBeInTheDocument();
  });

  it('has fields for "register offline" preset', () => {
    presetMockValue = 'reg_offline';
    render(<ComposeForm />);

    expect(screen.getByLabelText(/fields.type.label/)).toHaveValue('keyreg');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();
    expect(screen.queryByText('fields.votekey.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.selkey.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.sprfkey.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.votefst.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.votelst.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.votekd.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.nonpart.label')).not.toBeInTheDocument();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.rekey.label')).not.toBeInTheDocument();
  });

  it('has fields for "register nonparticipation" preset', () => {
    presetMockValue = 'reg_nonpart';
    render(<ComposeForm />);

    expect(screen.getByLabelText(/fields.type.label/)).toHaveValue('keyreg');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();
    expect(screen.queryByText('fields.votekey.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.selkey.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.sprfkey.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.votefst.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.votelst.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.votekd.label')).not.toBeInTheDocument();
    expect(screen.getByLabelText('fields.nonpart.label')).toBeChecked();
    expect(screen.getByLabelText('fields.nonpart.label')).toBeDisabled();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.rekey.label')).not.toBeInTheDocument();
  });

});
