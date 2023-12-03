import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18nextClientMock from '@/app/lib/testing/i18nextClientMock';

// Mock i18next before modules that use it are imported
jest.mock('react-i18next', () => i18nextClientMock);
// Mock useRouter
let presetMockValue = '';
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => ({ get: () => presetMockValue }),
}));

import ComposeForm from './ComposeForm';

describe('Compose Form Component', () => {
  afterEach(() => {
    presetMockValue = '';
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

});
