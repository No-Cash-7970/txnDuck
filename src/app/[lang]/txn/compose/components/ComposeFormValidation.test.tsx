import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18nextClientMock from '@/app/lib/testing/i18nextClientMock';
import { JotaiProvider } from '@/app/[lang]/components'; // Must be imported after i18next mock

// Mock i18next before modules that use it are imported
jest.mock('react-i18next', () => i18nextClientMock);
// Mock useRouter
const routerPushMock = jest.fn();
let presetMockValue = '';
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: routerPushMock }),
  useSearchParams: () => ({ get: () => presetMockValue }),
}));
// Mock the scrollIntoView() function
window.HTMLElement.prototype.scrollIntoView = jest.fn();

import ComposeForm from './ComposeForm';

describe('Compose Form Component', () => {
  afterEach(() => {
    presetMockValue = '';
    localStorage.clear();
  });

  it('does not proceed and shows errors if invalid data is submitted (using suggested parameters)',
  async () => {
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/fields.type.label/)).toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.type.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.use_sug_fee.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.use_sug_rounds.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lx.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.rekey.label/)).not.toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(2);
  });

  it('does not proceed and shows errors if invalid data is submitted (not using suggested'
  +' parameters)',
  async () => {
    render(
      // Wrap component in new Jotai provider to reset data stored in Jotai atoms
      <JotaiProvider><ComposeForm /></JotaiProvider>
    );

    await userEvent.click(screen.getByText('sign_txn_btn'));

    expect(routerPushMock).not.toHaveBeenCalled();

    expect(screen.getByLabelText(/fields.type.label/)).toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.type.label/)).toHaveFocus();
    expect(screen.getByLabelText(/fields.snd.label/)).toHaveClass('input-error');

    // Turn off suggested fee
    const useSugFeeToggle = screen.getByLabelText('fields.use_sug_fee.label');
    await userEvent.click(useSugFeeToggle);
    expect(useSugFeeToggle).not.toBeChecked();
    expect(screen.getByLabelText(/fields.fee.label/)).toHaveClass('input-error');

    // Turn off suggested rounds
    const useSugRoundsToggle = screen.getByLabelText('fields.use_sug_rounds.label');
    await userEvent.click(useSugRoundsToggle);
    expect(useSugRoundsToggle).not.toBeChecked();
    expect(screen.getByLabelText(/fields.fv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lv.label/)).toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
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

  /*
   * Transaction types
   */

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
    expect(screen.getByLabelText(/fields.use_sug_fee.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.use_sug_rounds.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lx.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.rekey.label/)).not.toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.rcv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.amt.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.close.label/)).not.toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(3);
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
    expect(screen.getByLabelText(/fields.use_sug_fee.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.use_sug_rounds.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lx.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.rekey.label/)).not.toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.arcv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.xaid.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.aamt.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.asnd.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.aclose.label/)).not.toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(4);
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
    expect(screen.getByLabelText(/fields.use_sug_fee.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.use_sug_rounds.label/)).not.toHaveClass('input-error');
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

    expect(screen.getAllByText('form.error.required')).toHaveLength(3);
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
    expect(screen.getByLabelText(/fields.use_sug_fee.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.use_sug_rounds.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lx.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.rekey.label/)).not.toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.faid.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.fadd.label/)).toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(3);
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
    expect(screen.getByLabelText(/fields.use_sug_fee.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.use_sug_rounds.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lx.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.rekey.label/)).not.toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.votekey.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.selkey.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.sprfkey.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.votefst.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.votelst.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.votekd.label/)).not.toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(1);
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
    expect(screen.getByLabelText(/fields.use_sug_fee.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.use_sug_rounds.label/)).not.toHaveClass('input-error');
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

    expect(screen.getAllByText('form.error.required')).toHaveLength(12);
  });

  /*
   * Presets
   */

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
    expect(screen.getByLabelText(/fields.use_sug_fee.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.use_sug_rounds.label/)).not.toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.rcv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.amt.label/)).toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(3);
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
    expect(screen.getByLabelText(/fields.use_sug_fee.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.use_sug_rounds.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.rekey.label/)).toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(2);
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
    expect(screen.getByLabelText(/fields.use_sug_fee.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.use_sug_rounds.label/)).not.toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.close.label/)).toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(2);
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
    expect(screen.getByLabelText(/fields.use_sug_fee.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.use_sug_rounds.label/)).not.toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.arcv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.xaid.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.aamt.label/)).toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(4);
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
    expect(screen.getByLabelText(/fields.use_sug_fee.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.use_sug_rounds.label/)).not.toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.xaid.label/)).toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(2);
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
    expect(screen.getByLabelText(/fields.use_sug_fee.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.use_sug_rounds.label/)).not.toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.xaid.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.aclose.label/)).toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(3);
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
    expect(screen.getByLabelText(/fields.use_sug_fee.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.use_sug_rounds.label/)).not.toHaveClass('input-error');

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

    expect(screen.getAllByText('form.error.required')).toHaveLength(3);
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
    expect(screen.getByLabelText(/fields.use_sug_fee.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.use_sug_rounds.label/)).not.toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.caid.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apar_m.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apar_f.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apar_c.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apar_r.label/)).not.toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(2);
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
    expect(screen.getByLabelText(/fields.use_sug_fee.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.use_sug_rounds.label/)).not.toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.arcv.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.xaid.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.aamt.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.asnd.label/)).toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(5);
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
    expect(screen.getByLabelText(/fields.use_sug_fee.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.use_sug_rounds.label/)).not.toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.caid.label/)).toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(2);
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
    expect(screen.getByLabelText(/fields.use_sug_fee.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.use_sug_rounds.label/)).not.toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.faid.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.fadd.label/)).toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(3);
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
    expect(screen.getByLabelText(/fields.use_sug_fee.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.use_sug_rounds.label/)).not.toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.faid.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.fadd.label/)).toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(3);
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
    expect(screen.getByLabelText(/fields.use_sug_fee.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.use_sug_rounds.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.lx.label/)).not.toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.apan.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.apid.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apaa.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apat.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apfa.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apas.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apbx_i.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apbx_n.label/)).not.toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(6);
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
    expect(screen.getByLabelText(/fields.use_sug_fee.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.use_sug_rounds.label/)).not.toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.apan.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.apid.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apaa.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apat.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apfa.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apas.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apbx_i.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apbx_n.label/)).not.toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(6);
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
    expect(screen.getByLabelText(/fields.use_sug_fee.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.use_sug_rounds.label/)).not.toHaveClass('input-error');

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

    expect(screen.getAllByText('form.error.required')).toHaveLength(12);
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
    expect(screen.getByLabelText(/fields.use_sug_fee.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.use_sug_rounds.label/)).not.toHaveClass('input-error');

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

    expect(screen.getAllByText('form.error.required')).toHaveLength(8);
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
    expect(screen.getByLabelText(/fields.use_sug_fee.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.use_sug_rounds.label/)).not.toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.apan.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.apid.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apaa.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apat.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apfa.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apas.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apbx_i.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apbx_n.label/)).not.toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(6);
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
    expect(screen.getByLabelText(/fields.use_sug_fee.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.use_sug_rounds.label/)).not.toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.apan.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.apid.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apaa.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apat.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apfa.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apas.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apbx_i.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apbx_n.label/)).not.toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(6);
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
    expect(screen.getByLabelText(/fields.use_sug_fee.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.use_sug_rounds.label/)).not.toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.apan.label/)).not.toHaveClass('select-error');
    expect(screen.getByLabelText(/fields.apid.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apaa.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apat.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apfa.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apas.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apbx_i.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.apbx_n.label/)).not.toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(6);
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
    expect(screen.getByLabelText(/fields.use_sug_fee.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.use_sug_rounds.label/)).not.toHaveClass('input-error');

    expect(screen.getByLabelText(/fields.votekey.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.selkey.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.sprfkey.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.votefst.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.votelst.label/)).toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.votekd.label/)).toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(7);
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
    expect(screen.getByLabelText(/fields.use_sug_fee.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.use_sug_rounds.label/)).not.toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(1);
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
    expect(screen.getByLabelText(/fields.use_sug_fee.label/)).not.toHaveClass('input-error');
    expect(screen.getByLabelText(/fields.note.label/)).not.toHaveClass('textarea-error');
    expect(screen.getByLabelText(/fields.use_sug_rounds.label/)).not.toHaveClass('input-error');

    expect(screen.getAllByText('form.error.required')).toHaveLength(1);
  });

});
