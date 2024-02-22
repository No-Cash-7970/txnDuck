import '@testing-library/jest-dom';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18nextClientMock from '@/app/lib/testing/i18nextClientMock';
import { JotaiProvider } from '@/app/[lang]/components';
import * as fs from "node:fs";

// Mock i18next before modules that use it are imported
jest.mock('react-i18next', () => i18nextClientMock);

// Mock useRouter
let presetMockValue: string|null = null;
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => ({ get: () => presetMockValue }),
}));

// Mock algosdk
jest.mock('algosdk', () => ({
  ...jest.requireActual('algosdk'),
  Algodv2: class {
    token: string;
    constructor(token: string) { this.token = token; }
    getAssetByID() {
      return {
        do: () => ({ params: {
          name: 'Foo Token',
          'unit-name': 'FOO',
          total: 1000,
          decimals: 2,
          manager: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          freeze: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
          clawback: 'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
          reserve: 'DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD',
        } })
      };
    }
  }
}));

// Mock use-debounce
jest.mock('use-debounce', () => ({ useDebouncedCallback: (fn: any) => fn }));

import ComposeForm from './ComposeForm';

describe('Compose Form Component', () => {
  afterEach(() => {
    presetMockValue = null;
    localStorage.clear();
  });

  it('has instructions', async () => {
    render(<ComposeForm />);
    expect(await screen.findByText(/instructions/)).toBeInTheDocument();
  });

  it('has base transaction fields (using suggested parameters)', async () => {
    render(<ComposeForm />);

    expect(await screen.findByText('fields.type.label')).toBeInTheDocument();
    expect(screen.getByText('fields.snd.label')).toBeInTheDocument();
    expect(screen.getByText('fields.use_sug_fee.label')).toBeInTheDocument();
    expect(screen.queryByText('fields.fee.label')).not.toBeInTheDocument();
    expect(screen.getByText('fields.note.label')).toBeInTheDocument();
    expect(screen.getByText('fields.use_sug_rounds.label')).toBeInTheDocument();
    expect(screen.queryByText('fields.fv.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.lv.label')).not.toBeInTheDocument();
    expect(screen.getByText('fields.lx.label')).toBeInTheDocument();
    expect(screen.getByText('fields.rekey.label')).toBeInTheDocument();
    expect(screen.getAllByText('fields.base64.label')).toHaveLength(2);
  });

  it('has base transaction fields (not using suggested parameters)', async () => {
    render(<ComposeForm />);

    expect(await screen.findByText('fields.type.label')).toBeInTheDocument();
    expect(screen.getByText('fields.snd.label')).toBeInTheDocument();

    // Turn off suggested fee
    const useSugFeeToggle = screen.getByLabelText('fields.use_sug_fee.label');
    await userEvent.click(useSugFeeToggle);
    expect(useSugFeeToggle).not.toBeChecked();
    expect(screen.getByText('fields.fee.label')).toBeInTheDocument();

    // Turn off suggested rounds
    const useSugRoundsToggle = screen.getByLabelText('fields.use_sug_rounds.label');
    await userEvent.click(useSugRoundsToggle);
    expect(useSugRoundsToggle).not.toBeChecked();
    expect(screen.getByText('fields.fv.label')).toBeInTheDocument();
    expect(screen.getByText('fields.lv.label')).toBeInTheDocument();
    expect(screen.getByText('fields.note.label')).toBeInTheDocument();
    expect(screen.getByText('fields.lx.label')).toBeInTheDocument();
    expect(screen.getByText('fields.rekey.label')).toBeInTheDocument();
    expect(screen.getAllByText('fields.base64.label')).toHaveLength(2);
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

  // eslint-disable-next-line max-len
  it('has fields for asset transfer transaction type if "Asset Transfer" transaction type is selected',
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

  // eslint-disable-next-line max-len
  it('retrieves asset information when "asset ID" is entered in an "Asset Transfer" transaction when enabled in the settings (default)',
  async () => {
    render(<ComposeForm />);

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'axfer');
    // Enter asset ID
    await userEvent.click(screen.getByLabelText(/fields.xaid.label/));
    await userEvent.paste('123456789');

    // Check if asset name appears
    expect(screen.getByText('Foo Token')).toBeInTheDocument();
    // Check if "amount" field has correct "step" attribute
    expect(screen.getByLabelText(/fields.aamt.label/)).toHaveAttribute('step', '0.01');
    // Check if "amount" field shows correct unit
    expect(screen.getByText('FOO')).toBeInTheDocument();
  });

  // eslint-disable-next-line max-len
  it('does not retrieve asset information when "asset ID" is entered in an "Asset Transfer" transaction when disabled in the settings)',
  async () => {
    localStorage.setItem('getAssetInfo', 'false');
    render(<ComposeForm />);

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'axfer');
    // Enter asset ID
    await userEvent.click(screen.getByLabelText(/fields.xaid.label/));
    await userEvent.paste('123456789');

    // Check if asset name appears
    expect(screen.queryByText('Foo Token')).not.toBeInTheDocument();
    // Check if "amount" field has correct "step" attribute
    expect(screen.getByLabelText(/fields.aamt.label/)).toHaveAttribute('step', '1');
    // Check if "amount" field shows correct unit
    expect(screen.queryByText('FOO')).not.toBeInTheDocument();
  });

  // eslint-disable-next-line max-len
  it('has fields (with asset addresses set to sender) for asset configuration transaction type if "Asset Configuration" type is selected',
  async () => {
    render(<ComposeForm />);

    expect(screen.queryByText('fields.caid.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_un.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_an.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_t.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_dc.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_df.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_au.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_m_use_snd.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_m.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_f_use_snd.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_f.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_c_use_snd.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_c.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_r_use_snd.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_r.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_am.label')).not.toBeInTheDocument();
    expect(screen.getAllByText('fields.base64.label')).toHaveLength(2);

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'acfg');

    expect(screen.getByText('fields.caid.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apar_un.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apar_an.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apar_t.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apar_dc.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apar_df.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apar_au.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apar_m_use_snd.label')).toBeInTheDocument();
    expect(screen.queryByText('fields.apar_m.label')).not.toBeInTheDocument();
    expect(screen.getByText('fields.apar_f_use_snd.label')).toBeInTheDocument();
    expect(screen.queryByText('fields.apar_f.label')).not.toBeInTheDocument();
    expect(screen.getByText('fields.apar_c_use_snd.label')).toBeInTheDocument();
    expect(screen.queryByText('fields.apar_c.label')).not.toBeInTheDocument();
    expect(screen.getByText('fields.apar_r_use_snd.label')).toBeInTheDocument();
    expect(screen.queryByText('fields.apar_r.label')).not.toBeInTheDocument();
    expect(screen.getByText('fields.apar_am.label')).toBeInTheDocument();
    expect(screen.getAllByText('fields.base64.label')).toHaveLength(3);
  });

  // eslint-disable-next-line max-len
  it('has fields (without asset addresses set to sender) for asset configuration transaction type if "Asset Configuration" type is selected',
  async () => {
    render(<ComposeForm />);

    expect(screen.queryByText('fields.caid.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_un.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_an.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_t.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_dc.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_df.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_au.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_m_use_snd.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_m.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_f_use_snd.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_f.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_c_use_snd.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_c.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_r_use_snd.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_r.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apar_am.label')).not.toBeInTheDocument();
    expect(screen.getAllByText('fields.base64.label')).toHaveLength(2);

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'acfg');

    expect(screen.getByText('fields.caid.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apar_un.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apar_an.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apar_t.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apar_dc.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apar_df.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apar_au.label')).toBeInTheDocument();
    expect(screen.getByText('fields.apar_am.label')).toBeInTheDocument();
    expect(screen.getAllByText('fields.base64.label')).toHaveLength(3);

    // Turn off using sender for manager address
    const aparMSndToggle = screen.getByLabelText('fields.apar_m_use_snd.label');
    await userEvent.click(aparMSndToggle);
    expect(aparMSndToggle).not.toBeChecked();
    expect(screen.getByText('fields.apar_m.label')).toBeInTheDocument();

    // Turn off using sender for freeze address
    const aparFSndToggle = screen.getByLabelText('fields.apar_f_use_snd.label');
    await userEvent.click(aparFSndToggle);
    expect(aparFSndToggle).not.toBeChecked();
    expect(screen.getByText('fields.apar_f.label')).toBeInTheDocument();

    // Turn off using sender for clawback address
    const aparCSndToggle = screen.getByLabelText('fields.apar_c_use_snd.label');
    await userEvent.click(aparCSndToggle);
    expect(aparCSndToggle).not.toBeChecked();
    expect(screen.getByText('fields.apar_c.label')).toBeInTheDocument();

    // Turn off using sender for reserve address
    const aparRSndToggle = screen.getByLabelText('fields.apar_r_use_snd.label');
    await userEvent.click(aparRSndToggle);
    expect(aparRSndToggle).not.toBeChecked();
    expect(screen.getByText('fields.apar_r.label')).toBeInTheDocument();

  });

  // eslint-disable-next-line max-len
  it('retrieves asset information when "asset ID" is entered in an "Asset Configuration" transaction when enabled in the settings (default)',
  async () => {
    render(<ComposeForm />);

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'acfg');
    // Enter asset ID
    await userEvent.click(screen.getByLabelText(/fields.caid.label/));
    await userEvent.paste('123456789');

    // Check if asset name appears
    expect(screen.getByText('Foo Token')).toBeInTheDocument();
    // Check if asset addresses have the retrieved values
    expect(screen.getByLabelText(/fields.apar_m.label/))
      .toHaveValue('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    expect(screen.getByLabelText(/fields.apar_f.label/))
      .toHaveValue('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB');
    expect(screen.getByLabelText(/fields.apar_c.label/))
      .toHaveValue('CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC');
    expect(screen.getByLabelText(/fields.apar_r.label/))
      .toHaveValue('DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD');
  });

  // eslint-disable-next-line max-len
  it('does not retrieve asset information when "asset ID" is entered in an "Asset Configuration" transaction when disabled in the settings',
  async () => {
    localStorage.setItem('getAssetInfo', 'false');
    render(<JotaiProvider><ComposeForm /></JotaiProvider>);

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'acfg');
    // Enter asset ID
    await userEvent.click(screen.getByLabelText(/fields.caid.label/));
    await userEvent.paste('123456789');

    // Check if asset name appears
    expect(screen.queryByText('Foo Token')).not.toBeInTheDocument();
    // Check if asset addresses have the retrieved values
    expect(screen.getByLabelText(/fields.apar_m.label/))
      .not.toHaveValue('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    expect(screen.getByLabelText(/fields.apar_f.label/))
      .not.toHaveValue('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB');
    expect(screen.getByLabelText(/fields.apar_c.label/))
      .not.toHaveValue('CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC');
    expect(screen.getByLabelText(/fields.apar_r.label/))
      .not.toHaveValue('DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD');
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

  // eslint-disable-next-line max-len
  it('retrieves asset information when "asset ID" is entered in an "Asset Freeze" transaction when enabled in the settings (default)',
  async () => {
    render(<ComposeForm />);

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'afrz');
    // Enter asset ID
    await userEvent.click(screen.getByLabelText(/fields.faid.label/));
    await userEvent.paste('123456789');

    // Check if asset name appears
    expect(screen.getByText('Foo Token')).toBeInTheDocument();
  });

  // eslint-disable-next-line max-len
  it('does not retrieve asset information when "asset ID" is entered in an "Asset Freeze" transaction when disabled in the settings',
  async () => {
    localStorage.setItem('getAssetInfo', 'false');
    render(<ComposeForm />);

    await userEvent.selectOptions(screen.getByLabelText(/fields.type.label/), 'afrz');
    // Enter asset ID
    await userEvent.click(screen.getByLabelText(/fields.faid.label/));
    await userEvent.paste('123456789');

    // Check if asset name appears
    expect(screen.queryByText('Foo Token')).not.toBeInTheDocument();
  });

  // eslint-disable-next-line max-len
  it('has fields for key registration transaction type if "Key Registration" transaction type is selected',
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

  // eslint-disable-next-line max-len
  it('has fields for application call transaction type if "Application Call" transaction type is selected',
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
    expect(screen.queryByText('fields.apat.heading')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apaa.heading')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apfa.heading')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apas.heading')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.apbx.heading')).not.toBeInTheDocument();

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
    expect(screen.getByText('fields.apaa.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apat.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apfa.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apas.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apbx.heading')).toBeInTheDocument();
  });

  it('has "transaction presets" button', async () => {
    render(<ComposeForm />);
    expect(await screen.findByText('txn_presets_btn')).toBeInTheDocument();
  });

  it('has "sign transaction" button', async () => {
    render(<ComposeForm />);
    expect(await screen.findByText('sign_txn_btn')).toBeEnabled();
  });

  it('has fields for "transfer" preset', async () => {
    presetMockValue = 'transfer';
    render(<ComposeForm />);

    expect(await screen.findByLabelText(/fields.type.label/)).toHaveValue('pay');
    expect(screen.getByLabelText(/fields.type.label/)).toBeDisabled();
    expect(screen.getByLabelText(/fields.rcv.label/)).toBeRequired();
    expect(screen.getByLabelText(/fields.amt.label/)).toBeRequired();
    expect(screen.queryByText('fields.close.label')).not.toBeInTheDocument();

    expect(screen.queryByText('fields.lx.label')).not.toBeInTheDocument();
    expect(screen.queryByText('fields.rekey.label')).not.toBeInTheDocument();
  });

  it('has fields for "transfer algos" preset (same as "transfer" preset)', async () => {
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
    expect(screen.getByLabelText(/fields.apar_m_use_snd.label/)).toBeInTheDocument();
    expect(screen.getByLabelText(/fields.apar_f_use_snd.label/)).toBeInTheDocument();
    expect(screen.getByLabelText(/fields.apar_c_use_snd.label/)).toBeInTheDocument();
    expect(screen.getByLabelText(/fields.apar_r_use_snd.label/)).toBeInTheDocument();
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
    expect(screen.getByText('fields.apaa.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apat.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apfa.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apas.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apbx.heading')).toBeInTheDocument();

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
    expect(screen.getByText('fields.apaa.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apat.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apfa.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apas.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apbx.heading')).toBeInTheDocument();

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
    expect(screen.getByText('fields.apaa.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apat.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apfa.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apas.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apbx.heading')).toBeInTheDocument();

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
    expect(screen.getByText('fields.apaa.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apat.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apfa.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apas.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apbx.heading')).toBeInTheDocument();

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
    expect(screen.getByText('fields.apaa.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apat.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apfa.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apas.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apbx.heading')).toBeInTheDocument();

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
    expect(screen.getByText('fields.apaa.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apat.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apfa.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apas.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apbx.heading')).toBeInTheDocument();

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
    expect(screen.getByText('fields.apaa.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apat.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apfa.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apas.heading')).toBeInTheDocument();
    expect(screen.getByText('fields.apbx.heading')).toBeInTheDocument();

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

  it('can import approval program file', async () => {
    const data = fs.readFileSync('src/app/lib/testing/test_compiled.teal');
    const file = new File([data], 'test_compiled.teal', { type: 'application/octet-stream' });
    presetMockValue = 'app_deploy';
    render(<ComposeForm />);

    await userEvent.click(screen.getByText('fields.apap.import_btn'));
    await userEvent.upload(await screen.findByLabelText(/fields.apap.import_field_label/), file);
    try {
      await waitForElementToBeRemoved(screen.queryByRole('dialog'));
    } catch (e) { // The element is already removed
      // No need to do anything here
    }

    expect(screen.getByLabelText(/fields.apap.label/)).toHaveValue('BYEB');
  });

  it('can import clear-state program', async () => {
    const data = fs.readFileSync('src/app/lib/testing/test_compiled.teal');
    const file = new File([data], 'test_compiled.teal', { type: 'application/octet-stream' });
    presetMockValue = 'app_deploy';
    render(<ComposeForm />);

    await userEvent.click(screen.getByText('fields.apsu.import_btn'));
    await userEvent.upload(await screen.findByLabelText(/fields.apsu.import_field_label/), file);
    try {
      await waitForElementToBeRemoved(screen.queryByRole('dialog'));
    } catch (e) { // The element is already removed
      // No need to do anything here
    }

    expect(screen.getByLabelText(/fields.apsu.label/)).toHaveValue('BYEB');
  });

});
