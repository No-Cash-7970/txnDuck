import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18nextClientMock from '@/app/lib/testing/i18nextClientMock';
import { JotaiProvider } from '@/app/[lang]/components'; // Must be imported after i18next mock

// Mock i18next before modules that use it are imported
jest.mock('react-i18next', () => i18nextClientMock);
// Mock useRouter
const routerPushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: routerPushMock }),
  useSearchParams: () => ({ get: () => '' }),
}));
// Mock the scrollIntoView() function
window.HTMLElement.prototype.scrollIntoView = jest.fn();

import ComposeForm from './ComposeForm';

describe('Compose Form Component', () => {
  afterEach(() => {
    sessionStorage.clear();
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
    await userEvent.paste('2');
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
      apbx: [{i: 2, n: 'Boxy box' }],
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

});
