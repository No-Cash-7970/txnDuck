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
// Mock the scrollIntoView() function
window.HTMLElement.prototype.scrollIntoView = jest.fn();

import ComposeForm from './ComposeForm';
import { JotaiProvider } from '@/app/[lang]/components';

describe('Compose Form Component', () => {
  afterEach(() => {
    presetMockValue = '';
    sessionStorage.clear();
    localStorage.clear();
  });

  it('has instructions', async () => {
    render(<ComposeForm />);
    expect(await screen.findByText(/instructions/)).toBeInTheDocument();
  });

  it('has base transaction fields', async () => {
    render(<ComposeForm />);
    expect(await screen.findByText('fields.type.label')).toBeInTheDocument();
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

  it('has fields for asset transfer transaction type if "Asset Transfer" transaction type is'
  +' selected',
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

  it('has fields for asset configuration transaction type if "Asset Configuration" transaction type'
    + ' is selected',
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

  it('has fields for asset freeze transaction type if "Asset Freeze" transaction type is selected',
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

  it('has fields for key registration transaction type if "Key Registration" transaction type is'
  +' selected',
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

  it('has fields for application call transaction type if "Application Call" transaction type is'
  +' selected',
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

  it('has "transaction presets" button', async () => {
    render(<ComposeForm />);
    expect(await screen.findByText('txn_presets_btn')).toBeInTheDocument();
  });

  it('has "sign transaction" button', async () => {
    render(<ComposeForm />);
    expect(await screen.findByText('sign_txn_btn')).toBeEnabled();
  });


  it('goes to sign-transaction page if valid transaction data is submitted', async () => {
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    // Enter data
    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'pay');
    await userEvent.click(screen.getByLabelText(/fields.snd.label/));
    await userEvent.paste('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
    await userEvent.click(screen.getByLabelText(/fields.fee.label/));
    await userEvent.paste('0.001');
    await userEvent.click(screen.getByLabelText(/fields.fv.label/));
    await userEvent.paste('6000000');
    await userEvent.click(screen.getByLabelText(/fields.lv.label/));
    await userEvent.paste('6001000');
    await userEvent.click(screen.getByLabelText(/fields.rcv.label/));
    await userEvent.paste('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
    await userEvent.click(screen.getByLabelText(/fields.amt.label/));
    await userEvent.paste('5');

    // Submit data
    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).toHaveBeenCalled();
  });

  it('can store submitted *payment* transaction data', async () => {
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    // Enter data
    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'pay');
    await userEvent.click(screen.getByLabelText(/fields.snd.label/));
    await userEvent.paste('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
    await userEvent.click(screen.getByLabelText(/fields.fee.label/));
    await userEvent.paste('0.001');
    await userEvent.click(screen.getByLabelText(/fields.fv.label/));
    await userEvent.paste('6000000');
    await userEvent.click(screen.getByLabelText(/fields.lv.label/));
    await userEvent.paste('6001000');
    await userEvent.click(screen.getByLabelText(/fields.rcv.label/));
    await userEvent.paste('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
    await userEvent.click(screen.getByLabelText(/fields.amt.label/));
    await userEvent.paste('5');

    // Submit data
    await userEvent.click(screen.getByText('sign_txn_btn'));

    // Check session storage
    expect(JSON.parse(sessionStorage.getItem('txnData') || '{}')).toStrictEqual({
      type: 'pay',
      snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
      fee: 0.001,
      fv: 6000000,
      lv: 6001000,
      rcv: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
      amt: 5,
    });
  });

  it('can store submitted *asset transfer* transaction data', async () => {
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    // Enter data
    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'axfer');
    await userEvent.click(screen.getByLabelText(/fields.snd.label/));
    await userEvent.paste('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
    await userEvent.click(screen.getByLabelText(/fields.fee.label/));
    await userEvent.paste('0.001');
    await userEvent.click(screen.getByLabelText(/fields.fv.label/));
    await userEvent.paste('6000000');
    await userEvent.click(screen.getByLabelText(/fields.lv.label/));
    await userEvent.paste('6001000');
    await userEvent.click(screen.getByLabelText(/fields.arcv.label/));
    await userEvent.paste('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
    await userEvent.click(screen.getByLabelText(/fields.xaid.label/));
    await userEvent.paste('123456789');
    await userEvent.click(screen.getByLabelText(/fields.aamt.label/));
    await userEvent.paste('5');

    // Submit data
    await userEvent.click(screen.getByText('sign_txn_btn'));

    // Check session storage
    expect(JSON.parse(sessionStorage.getItem('txnData') || '{}')).toStrictEqual({
      type: 'axfer',
      fee: 0.001,
      fv: 6000000,
      lv: 6001000,
      snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
      arcv: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
      xaid: 123456789,
      aamt: '5',
    });
  });

  it('can store submitted *asset configuration* transaction data', async () => {
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    // Enter data
    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'acfg');

    await userEvent.click(screen.getByLabelText(/fields.snd.label/));
    await userEvent.paste('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
    await userEvent.click(screen.getByLabelText(/fields.fee.label/));
    await userEvent.paste('0.001');
    await userEvent.click(screen.getByLabelText(/fields.fv.label/));
    await userEvent.paste('6000000');
    await userEvent.click(screen.getByLabelText(/fields.lv.label/));
    await userEvent.paste('6001000');
    await userEvent.click(screen.getByLabelText(/fields.apar_un.label/));
    await userEvent.paste('FAKE');
    await userEvent.click(screen.getByLabelText(/fields.apar_an.label/));
    await userEvent.paste('Fake Token');
    await userEvent.click(screen.getByLabelText(/fields.apar_t.label/));
    await userEvent.paste('10000000');
    await userEvent.click(screen.getByLabelText(/fields.apar_dc.label/));
    await userEvent.paste('3');
    await userEvent.click(screen.getByLabelText(/fields.apar_df.label/));
    await userEvent.click(screen.getByLabelText(/fields.apar_au.label/));
    await userEvent.paste('https://fake.token');
    await userEvent.click(screen.getByLabelText(/fields.apar_m.label/));
    await userEvent.paste('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
    await userEvent.click(screen.getByLabelText(/fields.apar_f.label/));
    await userEvent.paste('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
    await userEvent.click(screen.getByLabelText(/fields.apar_c.label/));
    await userEvent.paste('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
    await userEvent.click(screen.getByLabelText(/fields.apar_r.label/));
    await userEvent.paste('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
    await userEvent.click(screen.getByLabelText(/fields.apar_am.label/));
    await userEvent.paste('GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG');

    // Submit data
    await userEvent.click(screen.getByText('sign_txn_btn'));

    // Check session storage
    expect(JSON.parse(sessionStorage.getItem('txnData') || '{}')).toStrictEqual({
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
    });
  }, 10000);

  it('can store submitted *asset freeze* transaction data', async () => {
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    // Enter data
    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'afrz');
    await userEvent.click(screen.getByLabelText(/fields.snd.label/));
    await userEvent.paste('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
    await userEvent.click(screen.getByLabelText(/fields.fee.label/));
    await userEvent.paste('0.001');
    await userEvent.click(screen.getByLabelText(/fields.fv.label/));
    await userEvent.paste('6000000');
    await userEvent.click(screen.getByLabelText(/fields.lv.label/));
    await userEvent.paste('6001000');
    await userEvent.click(screen.getByLabelText(/fields.faid.label/));
    await userEvent.paste('123456789');
    await userEvent.click(screen.getByLabelText(/fields.fadd.label/));
    await userEvent.paste('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
    await userEvent.click(screen.getByLabelText(/fields.afrz.label/));

    // Submit data
    await userEvent.click(screen.getByText('sign_txn_btn'));

    // Check session storage
    expect(JSON.parse(sessionStorage.getItem('txnData') || '{}')).toStrictEqual({
      type: 'afrz',
      fee: 0.001,
      fv: 6000000,
      lv: 6001000,
      snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
      faid: 123456789,
      fadd: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
      afrz: true,
    });
  });

  it('can store submitted *key registration* transaction data', async () => {
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    // Enter data
    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'keyreg');
    await userEvent.click(screen.getByLabelText(/fields.snd.label/));
    await userEvent.paste('MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4');
    await userEvent.click(screen.getByLabelText(/fields.fee.label/));
    await userEvent.paste('0.001');
    await userEvent.click(screen.getByLabelText(/fields.fv.label/));
    await userEvent.paste('6000000');
    await userEvent.click(screen.getByLabelText(/fields.lv.label/));
    await userEvent.paste('6001000');
    await userEvent.click(screen.getByLabelText(/fields.votekey.label/));
    await userEvent.paste('G/lqTV6MKspW6J8wH2d8ZliZ5XZVZsruqSBJMwLwlmo=');
    await userEvent.click(screen.getByLabelText(/fields.selkey.label/));
    await userEvent.paste('LrpLhvzr+QpN/bivh6IPpOaKGbGzTTB5lJtVfixmmgk=');
    await userEvent.click(screen.getByLabelText(/fields.sprfkey.label/));
    await userEvent.paste(
      'RpUpNWfZMjZ1zOOjv3MF2tjO714jsBt0GKnNsw0ihJ4HSZwci+d9zvUi3i67LwFUJgjQ5Dz4zZgHgGduElnmSA=='
    );
    await userEvent.click(screen.getByLabelText(/fields.votefst.label/));
    await userEvent.paste('6000000');
    await userEvent.click(screen.getByLabelText(/fields.votelst.label/));
    await userEvent.paste('6100000');
    await userEvent.click(screen.getByLabelText(/fields.votekd.label/));
    await userEvent.paste('1730');

    // Submit data
    await userEvent.click(screen.getByText('sign_txn_btn'));

    // Check session storage
    expect(JSON.parse(sessionStorage.getItem('txnData') || '{}')).toStrictEqual({
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
    });
  });

  it('can store submitted *application call* transaction data', async () => {
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    // Enter data
    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'appl');
    await userEvent.click(screen.getByLabelText(/fields.snd.label/));
    await userEvent.paste('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
    await userEvent.click(screen.getByLabelText(/fields.fee.label/));
    await userEvent.paste('0.001');
    await userEvent.click(screen.getByLabelText(/fields.fv.label/));
    await userEvent.paste('6000000');
    await userEvent.click(screen.getByLabelText(/fields.lv.label/));
    await userEvent.paste('6001000');

    await userEvent.click(screen.getByLabelText(/fields.apap.label/));
    await userEvent.paste('BYEB');
    await userEvent.click(screen.getByLabelText(/fields.apsu.label/));
    await userEvent.paste('BYEB');
    await userEvent.click(screen.getByLabelText(/fields.apgs_nui.label/));
    await userEvent.paste('1');
    await userEvent.click(screen.getByLabelText(/fields.apgs_nbs.label/));
    await userEvent.paste('2');
    await userEvent.click(screen.getByLabelText(/fields.apls_nui.label/));
    await userEvent.paste('3');
    await userEvent.click(screen.getByLabelText(/fields.apls_nbs.label/));
    await userEvent.paste('4');
    await userEvent.click(screen.getByLabelText(/fields.apep.label/));
    await userEvent.paste('1');

    // Add and enter arguments
    await userEvent.click(screen.getByText(/fields.apaa.add_btn/));
    await userEvent.click(screen.getByText(/fields.apaa.add_btn/));
    await userEvent.click(screen.getByText(/fields.apaa.add_btn/));
    const argInputs = screen.getAllByLabelText(/fields.apaa.label/);
    await userEvent.click(argInputs[0]);
    await userEvent.paste('foo');
    await userEvent.click(argInputs[1]);
    await userEvent.paste('42');

    // Add and enter foreign accounts
    await userEvent.click(screen.getByText(/fields.apat.add_btn/));
    await userEvent.click(screen.getByLabelText(/fields.apat.label/));
    await userEvent.paste('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');

    // Add and enter foreign applications
    await userEvent.click(screen.getByText(/fields.apfa.add_btn/));
    await userEvent.click(screen.getByText(/fields.apfa.add_btn/));
    const appInputs = screen.getAllByLabelText(/fields.apfa.label/);
    await userEvent.click(appInputs[0]);
    await userEvent.paste('11111111');
    await userEvent.click(appInputs[1]);
    await userEvent.paste('22222222');

    // Add and enter foreign assets
    await userEvent.click(screen.getByText(/fields.apas.add_btn/));
    await userEvent.click(screen.getByText(/fields.apas.add_btn/));
    await userEvent.click(screen.getByText(/fields.apas.add_btn/));
    const assetInputs = screen.getAllByLabelText(/fields.apas.label/);
    await userEvent.click(assetInputs[0]);
    await userEvent.paste('33333333');
    await userEvent.click(assetInputs[1]);
    await userEvent.paste('44444444');
    await userEvent.click(assetInputs[2]);
    await userEvent.paste('55555555');

    // Add and enter box information
    await userEvent.click(screen.getByText(/fields.apbx.add_btn/));
    await userEvent.click(screen.getByLabelText(/fields.apbx_i.label/));
    await userEvent.paste('99999999');
    await userEvent.click(screen.getByLabelText(/fields.apbx_n.label/));
    await userEvent.paste('Boxy box');

    // Submit data
    await userEvent.click(screen.getByText('sign_txn_btn'));

    // Check session storage
    expect(JSON.parse(sessionStorage.getItem('txnData') || '{}')).toStrictEqual({
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
    });
  }, 10000);


  it('can retrieve transaction data from session storage', async () => {
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
    expect(await screen.findByRole('form')).toHaveFormValues({
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


  it('has fields for "transfer algos" preset', async () => {
    presetMockValue = 'transfer_algos';
    render(<ComposeForm />);

    expect(await screen.findByLabelText(/fields.type.label/)).toHaveValue('pay');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();
    expect(screen.getByLabelText(/fields.rcv.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.amt.label/)).toBeRequired();
    expect(screen.queryByText('fields.close.label')).not.toBeInTheDocument();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.rekey.label')).not.toBeInTheDocument();
  });

  it('has fields for "rekey account" preset', async () => {
    presetMockValue = 'rekey_account';
    render(<ComposeForm />);

    expect(await screen.findByLabelText(/fields.type.label/)).toHaveValue('pay');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();
    expect(screen.queryByText('fields.rcv.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.amt.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.close.label')).not.toBeInTheDocument();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.getByLabelText(/fields.rekey.label/)).toBeRequired();
  });

  it('has fields for "close account" preset', async () => {
    presetMockValue = 'close_account';
    render(<ComposeForm />);

    expect(await screen.findByLabelText(/fields.type.label/)).toHaveValue('pay');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();
    expect(screen.queryByText('fields.rcv.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.amt.label')).not.toBeInTheDocument();
    expect(screen.getByLabelText(/fields.close.label/)).toBeRequired();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.rekey.label')).not.toBeInTheDocument();
  });

  it('has fields for "transfer asset" preset', async () => {
    presetMockValue = 'asset_transfer';
    render(<ComposeForm />);

    expect(await screen.findByLabelText(/fields.type.label/)).toHaveValue('axfer');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();
    expect(screen.getByLabelText(/fields.xaid.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.arcv.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.aamt.label/)).toBeRequired();
    expect(screen.queryByText('fields.asnd.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.aclose.label')).not.toBeInTheDocument();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.rekey.label')).not.toBeInTheDocument();
  });

  it('has fields for "opt in asset" preset', async () => {
    presetMockValue = 'asset_opt_in';
    render(<ComposeForm />);

    expect(await screen.findByLabelText(/fields.type.label/)).toHaveValue('axfer');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();
    expect(screen.getByLabelText(/fields.xaid.label/)).toBeRequired();
    expect(screen.queryByText(/fields.arcv.label/)).not.toBeInTheDocument();
    expect(screen.queryByText(/fields.aamt.label/)).not.toBeInTheDocument();
    expect(screen.queryByText('fields.asnd.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.aclose.label')).not.toBeInTheDocument();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.rekey.label')).not.toBeInTheDocument();
  });

  it('has fields for "opt out asset" preset', async () => {
    presetMockValue = 'asset_opt_out';
    render(<ComposeForm />);

    expect(await screen.findByLabelText(/fields.type.label/)).toHaveValue('axfer');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();
    expect(screen.getByLabelText(/fields.xaid.label/)).toBeRequired();
    expect(screen.queryByText(/fields.arcv.label/)).not.toBeInTheDocument();
    expect(screen.queryByText(/fields.aamt.label/)).not.toBeInTheDocument();
    expect(screen.queryByText('fields.asnd.label')).not.toBeInTheDocument();
    expect(screen.getByLabelText(/fields.aclose.label/)).toBeRequired();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.rekey.label')).not.toBeInTheDocument();
  });

  it('has fields for "create asset" preset', async () => {
    presetMockValue = 'asset_create';
    render(<ComposeForm />);

    expect(await screen.findByLabelText(/fields.type.label/)).toHaveValue('acfg');
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

  it('has fields for "reconfigure asset" preset', async () => {
    presetMockValue = 'asset_reconfig';
    render(<ComposeForm />);

    expect(await screen.findByLabelText(/fields.type.label/)).toHaveValue('acfg');
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

  it('has fields for "revoke (claw back) asset" preset', async () => {
    presetMockValue = 'asset_clawback';
    render(<ComposeForm />);

    expect(await screen.findByLabelText(/fields.type.label/)).toHaveValue('axfer');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();
    expect(screen.getByLabelText(/fields.xaid.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.arcv.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.aamt.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.asnd.label/)).toBeRequired();
    expect(screen.queryByText('fields.aclose.label')).not.toBeInTheDocument();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.rekey.label')).not.toBeInTheDocument();
  });

  it('has fields for "destroy asset" preset', async () => {
    presetMockValue = 'asset_destroy';
    render(<ComposeForm />);

    expect(await screen.findByLabelText(/fields.type.label/)).toHaveValue('acfg');
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

  it('has fields for "freeze asset" preset', async () => {
    presetMockValue = 'asset_freeze';
    render(<ComposeForm />);

    expect(await screen.findByLabelText(/fields.type.label/)).toHaveValue('afrz');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();

    expect(screen.getByLabelText(/fields.faid.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.fadd.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.afrz.label/)).toBeDisabled();
    expect(screen.getByLabelText(/fields.afrz.label/)).toBeChecked();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.rekey.label')).not.toBeInTheDocument();
  });

  it('has fields for "unfreeze asset" preset', async () => {
    presetMockValue = 'asset_unfreeze';
    render(<ComposeForm />);

    expect(await screen.findByLabelText(/fields.type.label/)).toHaveValue('afrz');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();

    expect(screen.getByLabelText(/fields.faid.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.fadd.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.afrz.label/)).toBeDisabled();
    expect(screen.getByLabelText(/fields.afrz.label/)).not.toBeChecked();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.rekey.label')).not.toBeInTheDocument();
  });

  it('has fields for "run application" preset', async () => {
    presetMockValue = 'app_run';
    render(<ComposeForm />);

    expect(await screen.findByLabelText(/fields.type.label/)).toHaveValue('appl');
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

  it('has fields for "opt in application" preset', async () => {
    presetMockValue = 'app_opt_in';
    render(<ComposeForm />);

    expect(await screen.findByLabelText(/fields.type.label/)).toHaveValue('appl');
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

  it('has fields for "deploy application" preset', async () => {
    presetMockValue = 'app_deploy';
    render(<ComposeForm />);

    expect(await screen.findByLabelText(/fields.type.label/)).toHaveValue('appl');
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

  it('has fields for "update application" preset', async () => {
    presetMockValue = 'app_update';
    render(<ComposeForm />);

    expect(await screen.findByLabelText(/fields.type.label/)).toHaveValue('appl');
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

  it('has fields for "close out application" preset', async () => {
    presetMockValue = 'app_close';
    render(<ComposeForm />);

    expect(await screen.findByLabelText(/fields.type.label/)).toHaveValue('appl');
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

  it('has fields for "clear application" preset', async () => {
    presetMockValue = 'app_clear';
    render(<ComposeForm />);

    expect(await screen.findByLabelText(/fields.type.label/)).toHaveValue('appl');
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

  it('has fields for "delete application" preset', async () => {
    presetMockValue = 'app_delete';
    render(<ComposeForm />);

    expect(await screen.findByLabelText(/fields.type.label/)).toHaveValue('appl');
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

  it('has fields for "register online" preset', async () => {
    presetMockValue = 'reg_online';
    render(<ComposeForm />);

    expect(await screen.findByLabelText(/fields.type.label/)).toHaveValue('keyreg');
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

  it('has fields for "register offline" preset', async () => {
    presetMockValue = 'reg_offline';
    render(<ComposeForm />);

    expect(await screen.findByLabelText(/fields.type.label/)).toHaveValue('keyreg');
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

  it('has fields for "register nonparticipation" preset', async () => {
    presetMockValue = 'reg_nonpart';
    render(<ComposeForm />);

    expect(await screen.findByLabelText(/fields.type.label/)).toHaveValue('keyreg');
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


  it('does not proceed and shows errors if invalid data is submitted', async () => {
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/fields.type.label/)).toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.type.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lx.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.rekey.label/)).not.toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(5);
  });

  it('continues to sign-transaction page if invalid transaction data is submitted and the "ignore'
  +' compose form validation errors" setting is on',
  async () => {
    localStorage.setItem('ignoreFormErrors', 'true');
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.click(screen.getByText('sign_txn_btn')); // Submit data

    expect(routerPushMock).toHaveBeenCalled();
  });

  it('does not proceed and shows errors if invalid *payment* transaction data is submitted',
  async () => {
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'pay');
    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/fields.type.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lx.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.rekey.label/)).not.toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.rcv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.amt.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.close.label/)).not.toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(6);
  });

  it('does not proceed and shows errors if invalid *asset transfer* transaction data is submitted',
  async () => {
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'axfer');
    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/fields.type.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lx.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.rekey.label/)).not.toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.arcv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.xaid.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.aamt.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.asnd.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.aclose.label/)).not.toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(7);
  });

  it('does not proceed and shows errors if invalid *asset configuration* transaction data is'
  + ' submitted',
  async () => {
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'acfg');
    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/fields.type.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lx.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.rekey.label/)).not.toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.caid.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apar_un.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apar_an.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apar_t.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apar_dc.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apar_au.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apar_m.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apar_f.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apar_c.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apar_r.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apar_am.label/)).not.toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(6);
  });

  it('does not proceed and shows errors if invalid *asset freeze* transaction data is submitted',
  async () => {
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'afrz');
    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/fields.type.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lx.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.rekey.label/)).not.toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.faid.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.fadd.label/)).toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(6);
  });

  it('does not proceed and shows errors if invalid *key registration* transaction data is'
  + ' submitted',
  async () => {
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'keyreg');
    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/fields.type.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lx.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.rekey.label/)).not.toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.votekey.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.selkey.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.sprfkey.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.votefst.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.votelst.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.votekd.label/)).not.toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(4);
  });

  it('does not proceed and shows errors if invalid *application call* transaction data is'
  + ' submitted',
  async () => {
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'appl');
    await Promise.all([
      userEvent.click(screen.getByText('fields.apaa.add_btn')),
      userEvent.click(screen.getByText('fields.apat.add_btn')),
      userEvent.click(screen.getByText('fields.apfa.add_btn')),
      userEvent.click(screen.getByText('fields.apas.add_btn')),
      userEvent.click(screen.getByText('fields.apbx.add_btn')),
    ]);
    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/fields.type.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lx.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.rekey.label/)).not.toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.apan.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.apid.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apaa.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apap.label/)).toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.apsu.label/)).toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.apgs_nui.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apgs_nbs.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apls_nui.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apls_nbs.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apep.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apat.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apfa.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apas.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apbx_i.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apbx_n.label/)).not.toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(15);
  });


  it('does not proceed and shows errors if invalid data using "transfer algos" preset is'
  + ' submitted',
  async () => {
    presetMockValue = 'transfer_algos';
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'pay');
    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/fields.type.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.rcv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.amt.label/)).toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(6);
  });

  it('does not proceed and shows errors if invalid data using "rekey account" preset is'
  + ' submitted',
  async () => {
    presetMockValue = 'rekey_account';
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'pay');
    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/fields.type.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.rekey.label/)).toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(5);
  });

  it('does not proceed and shows errors if invalid data using "close account" preset is'
  + ' submitted',
  async () => {
    presetMockValue = 'close_account';
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'pay');
    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/fields.type.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.close.label/)).toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(5);
  });

  it('does not proceed and shows errors if invalid data using "transfer asset" preset is'
  + ' submitted',
  async () => {
    presetMockValue = 'asset_transfer';
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'axfer');
    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/fields.type.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.arcv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.xaid.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.aamt.label/)).toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(7);
  });

  it('does not proceed and shows errors if invalid data using "opt in asset" preset is'
  + ' submitted',
  async () => {
    presetMockValue = 'asset_opt_in';
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'axfer');
    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/fields.type.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.xaid.label/)).toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(5);
  });

  it('does not proceed and shows errors if invalid data using "opt out asset" preset is'
  + ' submitted',
  async () => {
    presetMockValue = 'asset_opt_out';
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'axfer');
    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/fields.type.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.xaid.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.aclose.label/)).toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(6);
  });

  it('does not proceed and shows errors if invalid data using "create asset" preset is'
  + ' submitted',
  async () => {
    presetMockValue = 'asset_create';
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'acfg');
    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/fields.type.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.apar_un.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apar_an.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apar_t.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apar_dc.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apar_au.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apar_m.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apar_f.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apar_c.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apar_r.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apar_am.label/)).not.toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(6);
  });

  it('does not proceed and shows errors if invalid data using "reconfigure asset" preset is'
  + ' submitted',
  async () => {
    presetMockValue = 'asset_reconfig';
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'acfg');
    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/fields.type.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.caid.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apar_m.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apar_f.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apar_c.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apar_r.label/)).not.toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(5);
  });

  it('does not proceed and shows errors if invalid data using "revoke (claw back) asset" preset is'
  + ' submitted',
  async () => {
    presetMockValue = 'asset_clawback';
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'axfer');
    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/fields.type.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.arcv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.xaid.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.aamt.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.asnd.label/)).toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(8);
  });

  it('does not proceed and shows errors if invalid data using "destroy asset" preset is'
  + ' submitted',
  async () => {
    presetMockValue = 'asset_destroy';
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'acfg');
    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/fields.type.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.caid.label/)).toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(5);
  });

  it('does not proceed and shows errors if invalid data using "freeze asset" preset is'
  + ' submitted',
  async () => {
    presetMockValue = 'asset_freeze';
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'afrz');
    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/fields.type.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.faid.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.fadd.label/)).toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(6);
  });

  it('does not proceed and shows errors if invalid data using "unfreeze asset" preset is'
  + ' submitted',
  async () => {
    presetMockValue = 'asset_unfreeze';
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'afrz');
    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/fields.type.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.faid.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.fadd.label/)).toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(6);
  });

  it('does not proceed and shows errors if invalid data using "run application" preset is'
  + ' submitted',
  async () => {
    presetMockValue = 'app_run';
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'appl');
    await Promise.all([
      userEvent.click(screen.getByText('fields.apaa.add_btn')),
      userEvent.click(screen.getByText('fields.apat.add_btn')),
      userEvent.click(screen.getByText('fields.apfa.add_btn')),
      userEvent.click(screen.getByText('fields.apas.add_btn')),
      userEvent.click(screen.getByText('fields.apbx.add_btn')),
    ]);
    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/fields.type.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lx.label/)).not.toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.apan.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.apid.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apaa.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apat.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apfa.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apas.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apbx_i.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apbx_n.label/)).not.toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(9);
  });

  it('does not proceed and shows errors if invalid data using "opt in application" preset is'
  + ' submitted',
  async () => {
    presetMockValue = 'app_opt_in';
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'appl');
    await Promise.all([
      userEvent.click(screen.getByText('fields.apaa.add_btn')),
      userEvent.click(screen.getByText('fields.apat.add_btn')),
      userEvent.click(screen.getByText('fields.apfa.add_btn')),
      userEvent.click(screen.getByText('fields.apas.add_btn')),
      userEvent.click(screen.getByText('fields.apbx.add_btn')),
    ]);
    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/fields.type.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.apan.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.apid.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apaa.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apat.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apfa.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apas.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apbx_i.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apbx_n.label/)).not.toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(9);
  });

  it('does not proceed and shows errors if invalid data using "deploy application" preset is'
  + ' submitted',
  async () => {
    presetMockValue = 'app_deploy';
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'appl');
    await Promise.all([
      userEvent.click(screen.getByText('fields.apaa.add_btn')),
      userEvent.click(screen.getByText('fields.apat.add_btn')),
      userEvent.click(screen.getByText('fields.apfa.add_btn')),
      userEvent.click(screen.getByText('fields.apas.add_btn')),
      userEvent.click(screen.getByText('fields.apbx.add_btn')),
    ]);
    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/fields.type.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.apan.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.apaa.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apap.label/)).toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.apsu.label/)).toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.apgs_nui.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apgs_nbs.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apls_nui.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apls_nbs.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apep.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apat.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apfa.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apas.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apbx_i.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apbx_n.label/)).not.toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(15);
  });

  it('does not proceed and shows errors if invalid data using "update application" preset is'
  + ' submitted',
  async () => {
    presetMockValue = 'app_update';
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'appl');
    await Promise.all([
      userEvent.click(screen.getByText('fields.apaa.add_btn')),
      userEvent.click(screen.getByText('fields.apat.add_btn')),
      userEvent.click(screen.getByText('fields.apfa.add_btn')),
      userEvent.click(screen.getByText('fields.apas.add_btn')),
      userEvent.click(screen.getByText('fields.apbx.add_btn')),
    ]);
    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/fields.type.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.apan.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.apid.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apaa.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apap.label/)).toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.apsu.label/)).toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.apat.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apfa.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apas.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apbx_i.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apbx_n.label/)).not.toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(11);
  });

  it('does not proceed and shows errors if invalid data using "close out application" preset is'
  + ' submitted',
  async () => {
    presetMockValue = 'app_close';
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'appl');
    await Promise.all([
      userEvent.click(screen.getByText('fields.apaa.add_btn')),
      userEvent.click(screen.getByText('fields.apat.add_btn')),
      userEvent.click(screen.getByText('fields.apfa.add_btn')),
      userEvent.click(screen.getByText('fields.apas.add_btn')),
      userEvent.click(screen.getByText('fields.apbx.add_btn')),
    ]);
    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/fields.type.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.apan.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.apid.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apaa.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apat.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apfa.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apas.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apbx_i.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apbx_n.label/)).not.toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(9);
  });

  it('does not proceed and shows errors if invalid data using "clear application" preset is'
  + ' submitted',
  async () => {
    presetMockValue = 'app_clear';
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'appl');
    await Promise.all([
      userEvent.click(screen.getByText('fields.apaa.add_btn')),
      userEvent.click(screen.getByText('fields.apat.add_btn')),
      userEvent.click(screen.getByText('fields.apfa.add_btn')),
      userEvent.click(screen.getByText('fields.apas.add_btn')),
      userEvent.click(screen.getByText('fields.apbx.add_btn')),
    ]);
    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/fields.type.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.apan.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.apid.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apaa.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apat.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apfa.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apas.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apbx_i.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apbx_n.label/)).not.toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(9);
  });

  it('does not proceed and shows errors if invalid data using "delete application" preset is'
  + ' submitted',
  async () => {
    presetMockValue = 'app_delete';
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'appl');
    await Promise.all([
      userEvent.click(screen.getByText('fields.apaa.add_btn')),
      userEvent.click(screen.getByText('fields.apat.add_btn')),
      userEvent.click(screen.getByText('fields.apfa.add_btn')),
      userEvent.click(screen.getByText('fields.apas.add_btn')),
      userEvent.click(screen.getByText('fields.apbx.add_btn')),
    ]);
    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/fields.type.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.apan.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.apid.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apaa.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apat.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apfa.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apas.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apbx_i.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apbx_n.label/)).not.toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(9);
  });

  it('does not proceed and shows errors if invalid data using "register online" preset is'
  + ' submitted',
  async () => {
    presetMockValue = 'reg_online';
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/fields.type.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.votekey.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.selkey.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.sprfkey.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.votefst.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.votelst.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.votekd.label/)).toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(10);
  });

  it('does not proceed and shows errors if invalid data using "register offline" preset is'
  + ' submitted',
  async () => {
    presetMockValue = 'reg_offline';
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'keyreg');
    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/fields.type.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(4);
  });

  it('does not proceed and shows errors if invalid data using "register nonparticipation" preset is'
  + ' submitted',
  async () => {
    presetMockValue = 'reg_nonpart';
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'keyreg');
    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(await screen.findByLabelText(/fields.type.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(4);
  });

});
