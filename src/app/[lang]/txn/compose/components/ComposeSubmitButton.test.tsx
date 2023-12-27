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
  useSearchParams: () => ({ get: () => null }),
}));
// Mock the scrollIntoView() function
window.HTMLElement.prototype.scrollIntoView = jest.fn();
// Mock algokit
jest.mock('@algorandfoundation/algokit-utils', () => ({
  getAlgoClient: () => ({
    getAssetByID: () => ({
      do: () => ({ params: { name: 'Foo Token', 'unit-name': 'FOO', total: 1000, decimals: 2 } })
    })
  }),
}));
// Mock use-debounce
jest.mock('use-debounce', () => ({ useDebouncedCallback: (fn: any) => fn }));

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
    await userEvent.click(screen.getByLabelText(/fields.rcv.label/));
    await userEvent.paste('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
    await userEvent.click(screen.getByLabelText(/fields.amt.label/));
    await userEvent.paste('5');

    // Submit data
    await userEvent.click(screen.getByText('sign_txn_btn'));

    // Check session storage
    expect(JSON.parse(sessionStorage.getItem('txnData') || '{}')).toStrictEqual({
      txn: {
        type: 'pay',
        snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        rcv: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        amt: 5,
      },
      useSugFee: true,
      useSugRounds: true,
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
    await userEvent.click(screen.getByLabelText(/fields.arcv.label/));
    await userEvent.paste('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
    await userEvent.click(screen.getByLabelText(/fields.xaid.label/));
    await userEvent.paste('123456789');
    await userEvent.click(screen.getByLabelText(/fields.aamt.label/));
    await userEvent.paste('5.01');

    // Submit data
    await userEvent.click(screen.getByText('sign_txn_btn'));

    // Check session storage
    expect(JSON.parse(sessionStorage.getItem('txnData') || '{}')).toStrictEqual({
      txn: {
        type: 'axfer',
        snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        arcv: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        xaid: 123456789,
        aamt: '501',
      },
      useSugFee: true,
      useSugRounds: true,
      retrievedAssetInfo: { name: 'Foo Token', unitName: 'FOO', total: 1000, decimals: 2 },
    });
  });

  // eslint-disable-next-line max-len
  it('can store submitted *asset configuration* transaction data (with asset addresses set to sender)',
  async () => {
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    // Enter data
    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'acfg');

    await userEvent.click(screen.getByLabelText(/fields.snd.label/));
    await userEvent.paste('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
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
    await userEvent.click(screen.getByLabelText(/fields.apar_am.label/));
    await userEvent.paste('GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG');

    // Submit data
    await userEvent.click(screen.getByText('sign_txn_btn'));

    // Check session storage
    expect(JSON.parse(sessionStorage.getItem('txnData') || '{}')).toStrictEqual({
      txn: {
        type: 'acfg',
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
      },
      useSugFee: true,
      useSugRounds: true,
      apar_mUseSnd: true,
      apar_fUseSnd: true,
      apar_cUseSnd: true,
      apar_rUseSnd: true,
    });
  }, 10000);

  // eslint-disable-next-line max-len
  it('can store submitted *asset configuration* transaction data (without asset addresses set to sender)',
  async () => {
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    // Enter data
    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'acfg');
    await userEvent.click(screen.getByLabelText(/fields.snd.label/));
    await userEvent.paste('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
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
    await userEvent.click(screen.getByLabelText(/fields.apar_m_use_snd.label/)); // Toggle to "off"
    await userEvent.click(screen.getByLabelText(/fields.apar_m.label/));
    await userEvent.paste('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
    await userEvent.click(screen.getByLabelText(/fields.apar_f_use_snd.label/)); // Toggle to "off"
    await userEvent.click(screen.getByLabelText(/fields.apar_f.label/));
    await userEvent.paste('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
    await userEvent.click(screen.getByLabelText(/fields.apar_c_use_snd.label/)); // Toggle to "off"
    await userEvent.click(screen.getByLabelText(/fields.apar_c.label/));
    await userEvent.paste('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
    await userEvent.click(screen.getByLabelText(/fields.apar_r_use_snd.label/)); // Toggle to "off"
    await userEvent.click(screen.getByLabelText(/fields.apar_r.label/));
    await userEvent.paste('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
    await userEvent.click(screen.getByLabelText(/fields.apar_am.label/));
    await userEvent.paste('GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG');

    // Submit data
    await userEvent.click(screen.getByText('sign_txn_btn'));

    // Check session storage
    expect(JSON.parse(sessionStorage.getItem('txnData') || '{}')).toStrictEqual({
      txn: {
        type: 'acfg',
        snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        apar_un: 'FAKE',
        apar_an: 'Fake Token',
        apar_t: '10000000',
        apar_dc: 3,
        apar_df: true,
        apar_au: 'https://fake.token',
        apar_m: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        apar_f: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        apar_c: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        apar_r: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        apar_am: 'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
      },
      useSugFee: true,
      useSugRounds: true,
      apar_mUseSnd: false,
      apar_fUseSnd: false,
      apar_cUseSnd: false,
      apar_rUseSnd: false,
    });
  }, 10000);

  it('can store submitted *asset configuration* transaction data (reconfigure asset)',
  async () => {
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    // Enter data
    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'acfg');
    await userEvent.click(screen.getByLabelText(/fields.snd.label/));
    await userEvent.paste('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
    await userEvent.click(screen.getByLabelText(/fields.caid.label/));
    await userEvent.paste('123456789');
    await userEvent.click(screen.getByLabelText(/fields.apar_m.label/));
    await userEvent.paste('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
    await userEvent.click(screen.getByLabelText(/fields.apar_f.label/));
    await userEvent.paste('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
    await userEvent.click(screen.getByLabelText(/fields.apar_c.label/));
    await userEvent.paste('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
    await userEvent.click(screen.getByLabelText(/fields.apar_r.label/));
    await userEvent.paste('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');

    // Submit data
    await userEvent.click(screen.getByText('sign_txn_btn'));

    // Check session storage
    expect(JSON.parse(sessionStorage.getItem('txnData') || '{}')).toStrictEqual({
      txn: {
        type: 'acfg',
        caid: 123456789,
        snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        apar_un: '',
        apar_an: '',
        apar_t: '',
        apar_df: false,
        apar_au: '',
        apar_m: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        apar_f: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        apar_c: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        apar_r: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        apar_am: '',
      },
      useSugFee: true,
      useSugRounds: true,
      retrievedAssetInfo: {name: 'Foo Token', unitName: 'FOO', total: 1000, decimals: 2 },
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
    await userEvent.click(screen.getByLabelText(/fields.faid.label/));
    await userEvent.paste('123456789');
    await userEvent.click(screen.getByLabelText(/fields.fadd.label/));
    await userEvent.paste('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
    await userEvent.click(screen.getByLabelText(/fields.afrz.label/));

    // Submit data
    await userEvent.click(screen.getByText('sign_txn_btn'));

    // Check session storage
    expect(JSON.parse(sessionStorage.getItem('txnData') || '{}')).toStrictEqual({
      txn: {
        type: 'afrz',
        snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        faid: 123456789,
        fadd: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        afrz: true,
      },
      useSugFee: true,
      useSugRounds: true,
      retrievedAssetInfo: { name: 'Foo Token', unitName: 'FOO', total: 1000, decimals: 2 },
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
      txn: {
        type: 'keyreg',
        snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
        votekey: 'G/lqTV6MKspW6J8wH2d8ZliZ5XZVZsruqSBJMwLwlmo=',
        selkey: 'LrpLhvzr+QpN/bivh6IPpOaKGbGzTTB5lJtVfixmmgk=',
        // eslint-disable-next-line max-len
        sprfkey: 'RpUpNWfZMjZ1zOOjv3MF2tjO714jsBt0GKnNsw0ihJ4HSZwci+d9zvUi3i67LwFUJgjQ5Dz4zZgHgGduElnmSA==',
        votefst: 6000000,
        votelst: 6100000,
        votekd: 1730,
        nonpart: false,
      },
      useSugFee: true,
      useSugRounds: true,
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
      txn: {
        type: 'appl',
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
      },
      useSugFee: true,
      useSugRounds: true,
    });
  }, 10000);

  it('can retrieve transaction data from session storage (not using suggested parameters)',
  async () => {
    sessionStorage.setItem('txnData', JSON.stringify({
      txn: {
        type: 'pay',
        snd: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        fee: 0.001,
        fv: 5,
        lv: 1005,
        rekey: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
        rcv: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        amt: 42,
      },
      useSugFee: false,
      useSugRounds: false,
    }));
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );
    expect(await screen.findByRole('form')).toHaveFormValues({
      type: 'pay',
      snd: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      use_sug_fee: false,
      fee: 0.001,
      use_sug_rounds: false,
      fv: 5,
      lv: 1005,
      rekey: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      rcv: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      amt: 42,
    });
  });

  it('can retrieve transaction data from session storage (using suggested parameters)',
  async () => {
    sessionStorage.setItem('txnData', JSON.stringify({
      txn: {
        type: 'pay',
        snd: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        fee: 0.001, // This should be ignored
        fv: 5, // This should be ignored
        lv: 1005, // This should be ignored
        rekey: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
        rcv: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        amt: 42,
      },
      useSugFee: true,
      useSugRounds: true,
    }));
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );
    expect(await screen.findByRole('form')).toHaveFormValues({
      type: 'pay',
      snd: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      use_sug_fee: true,
      use_sug_rounds: true,
      rekey: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      rcv: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      amt: 42,
    });
  });


});
