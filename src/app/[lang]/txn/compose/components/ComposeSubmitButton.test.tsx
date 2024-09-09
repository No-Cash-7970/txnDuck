import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18nextClientMock from '@/app/lib/testing/i18nextClientMock';
import { JotaiProvider } from '@/app/[lang]/components'; // Must be imported after i18next mock
import { useWalletUnconnectedMock } from '@/app/lib/testing/useWalletMock';

// Mock i18next before modules that use it are imported
jest.mock('react-i18next', () => i18nextClientMock);

// Mock navigation hooks
const routerPushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: routerPushMock }),
  useSearchParams: () => ({ get: () => null }),
}));

// Mock the scrollIntoView() function
window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock algosdk
jest.mock('algosdk', () => ({
  ...jest.requireActual('algosdk'),
  Algodv2: class {
    token: string;
    constructor(token: string) { this.token = token; }
    getAssetByID() {
      return {
        do: () => ({ params: {name: 'Foo Token', 'unit-name': 'FOO', total: 1000, decimals: 2} })
      };
    }
  }
}));

// Mock use-debounce
jest.mock('use-debounce', () => ({ useDebouncedCallback: (fn: any) => fn }));

// Mock use-wallet before modules that use it are imported
jest.mock('@txnlab/use-wallet-react', () => useWalletUnconnectedMock);
// Mock the wallet provider
jest.mock('../../../components/WalletProvider.tsx', () => 'div');

import ComposeForm from './ComposeForm';

describe('Compose Form Component - Submit Button', () => {
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

  it('can store submitted transaction data with Base64 note and lease', async () => {
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

    const b64Checkboxes = screen.getAllByLabelText('fields.base64.label');
    // Enter note as Base64
    await userEvent.click(b64Checkboxes[0]); // Enable base64 for note
    await userEvent.click(screen.getByLabelText(/fields.note.label/));
    await userEvent.paste('SGVsbG8gd29ybGQh');
    // Enter lease as Base64
    await userEvent.click(b64Checkboxes[1]); // Enable base64 for note
    await userEvent.click(screen.getByLabelText(/fields.lx.label/));
    await userEvent.paste('SSB0aGluaywgdGhlcmVmb3JlIEkgYW0uIEZvb2Jhcg==');

    // Submit data
    await userEvent.click(screen.getByText('sign_txn_btn'));

    // Check session storage
    expect(JSON.parse(sessionStorage.getItem('txnData') || '{}')).toStrictEqual({
      txn: {
        type: 'pay',
        snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        rcv: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        amt: 5,
        note: 'SGVsbG8gd29ybGQh',
        lx: 'SSB0aGluaywgdGhlcmVmb3JlIEkgYW0uIEZvb2Jhcg==',
      },
      useSugFee: true,
      useSugRounds: true,
      b64Note: true,
      b64Lx: true,
    });
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
      b64Note: false,
      b64Lx: false,
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
      b64Note: false,
      b64Lx: false,
      retrievedAssetInfo: { name: 'Foo Token', unitName: 'FOO', total: '1000', decimals: 2 },
    });
  });

  it('can store submitted *asset configuration* transaction data with Base64 metadata hash',
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

    const b64Checkboxes = screen.getAllByLabelText('fields.base64.label');
    // Enter metadata hash as Base64
    await userEvent.click(b64Checkboxes[0]); // Enable base64 for metadata hash
    await userEvent.click(screen.getByLabelText(/fields.apar_am.label/));
    await userEvent.paste('VGhpcyBpcyBhIHZhbGlkIGhhc2ghISEhISEhISEhISE=');

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
        apar_am: 'VGhpcyBpcyBhIHZhbGlkIGhhc2ghISEhISEhISEhISE=',
      },
      useSugFee: true,
      useSugRounds: true,
      b64Note: false,
      b64Lx: false,
      b64Apar_am: true,
      apar_mUseSnd: true,
      apar_fUseSnd: true,
      apar_cUseSnd: true,
      apar_rUseSnd: true,
    });
  }, 10000);

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
      b64Note: false,
      b64Lx: false,
      apar_mUseSnd: true,
      apar_fUseSnd: true,
      apar_cUseSnd: true,
      apar_rUseSnd: true,
      b64Apar_am: false,
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
    await userEvent.paste('18446744073709551615'); // The maximum possible total (2^64 - 1)
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
        apar_t: '18446744073709551615',
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
      b64Note: false,
      b64Lx: false,
      apar_mUseSnd: false,
      apar_fUseSnd: false,
      apar_cUseSnd: false,
      apar_rUseSnd: false,
      b64Apar_am: false,
    });
  }, 10000);

  it('can store submitted *asset configuration* transaction data (reconfigure asset)', async () => {
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
      b64Note: false,
      b64Lx: false,
      retrievedAssetInfo: {name: 'Foo Token', unitName: 'FOO', total: '1000', decimals: 2 },
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
      b64Note: false,
      b64Lx: false,
      retrievedAssetInfo: { name: 'Foo Token', unitName: 'FOO', total: '1000', decimals: 2 },
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
      b64Note: false,
      b64Lx: false,
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
      b64Note: false,
      b64Lx: false,
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
      b64Note: false,
      b64Lx: false,
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
      b64_note: false,
      b64_lx: false,
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
      b64_note: false,
      b64_lx: false
    });
  });

  it('can retrieve transaction data from session storage with Base64 note and lease', async () => {
    sessionStorage.setItem('txnData', JSON.stringify({
      txn: {
        type: 'pay',
        snd: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        fee: 0.001, // This should be ignored
        fv: 5, // This should be ignored
        lv: 1005, // This should be ignored
        note: 'SGVsbG8gd29ybGQh',
        rekey: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
        rcv: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        amt: 42,
        lx: 'VGhpcyBpcyBhIGxlYXNl',
      },
      useSugFee: true,
      useSugRounds: true,
      b64Note: true,
      b64Lx: true,
    }));
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );
    expect(await screen.findByRole('form')).toHaveFormValues({
      type: 'pay',
      snd: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      note: 'SGVsbG8gd29ybGQh',
      use_sug_fee: true,
      use_sug_rounds: true,
      b64_note: true,
      rekey: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      rcv: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      amt: 42,
      lx: 'VGhpcyBpcyBhIGxlYXNl',
      b64_lx: true
    });
  });

});
