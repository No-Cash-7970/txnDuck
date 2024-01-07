import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider as ToastProvider, Viewport as ToastViewport } from '@radix-ui/react-toast';
import i18nextClientMock from '@/app/lib/testing/i18nextClientMock';
import { useWalletConnectedMock } from '@/app/lib/testing/useWalletMock';

// Mock i18next before modules that use it are imported
jest.mock('react-i18next', () => i18nextClientMock);
// Mock use-wallet
jest.mock('@txnlab/use-wallet', () => useWalletConnectedMock);
// Mock the wallet provider
jest.mock('../../../components/WalletProvider.tsx', () => 'div');
// Mock use-debounce
jest.mock('use-debounce', () => ({ useDebouncedCallback: (fn: any) => fn }));

import SettingsDialog from './SettingsDialog';

describe('Settings Dialog', () => {

  it('appears when trigger button is clicked', async () => {
    render(
      <ToastProvider>
        <SettingsDialog />
        <ToastViewport />
      </ToastProvider>
    );

    await userEvent.click(screen.getByRole('button'));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toBeVisible();
  });

  it('has heading', () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    expect(screen.getByRole('heading', {level: 2})).toHaveTextContent('settings.heading');
  });

  it('has "close" icon button', async () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    await userEvent.click(screen.getByTitle('close'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has connect/disconnect wallet button', () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    // Look for disconnect button because it is assumed a wallet is connected
    expect(screen.getByText(/wallet.disconnect/)).toBeInTheDocument();
  });

  it('can reset to defaults', async () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    // Change settings to non-default values
    await userEvent.click(screen.getByLabelText('settings.theme_switcher.light'));
    await userEvent.click(screen.getByLabelText('settings.ignore_form_errors'));
    await userEvent.click(screen.getByLabelText('settings.default_use_sug_fee'));
    await userEvent.click(screen.getByLabelText('settings.default_use_sug_rounds'));
    await userEvent.click(screen.getByLabelText('settings.default_apar_m_use_snd'));
    await userEvent.click(screen.getByLabelText('settings.default_apar_f_use_snd'));
    await userEvent.click(screen.getByLabelText('settings.default_apar_c_use_snd'));
    await userEvent.click(screen.getByLabelText('settings.default_apar_r_use_snd'));
    await userEvent.click(screen.getByLabelText('settings.default_auto_send'));
    await userEvent.click(screen.getByLabelText('settings.always_clear_after_send'));
    await userEvent.click(screen.getByLabelText('settings.default_hide_send_info'));
    await userEvent.type(screen.getByLabelText('settings.confirm_wait_rounds'), '5');
    // XXX: Add more settings here

    // Click reset button
    await userEvent.click(screen.getByText('settings.reset_button'));
    // Check for toast notification
    expect(screen.getByText('settings.reset_message')).toBeInTheDocument();

    // Check settings
    expect(screen.getByLabelText('settings.theme_switcher.auto')).toBeChecked();
    expect(screen.getByLabelText('settings.ignore_form_errors')).not.toBeChecked();
    expect(screen.getByLabelText('settings.default_use_sug_fee')).toBeChecked();
    expect(screen.getByLabelText('settings.default_use_sug_rounds')).toBeChecked();
    expect(screen.getByLabelText('settings.default_apar_m_use_snd')).toBeChecked();
    expect(screen.getByLabelText('settings.default_apar_f_use_snd')).toBeChecked();
    expect(screen.getByLabelText('settings.default_apar_c_use_snd')).toBeChecked();
    expect(screen.getByLabelText('settings.default_apar_r_use_snd')).toBeChecked();
    expect(screen.getByLabelText('settings.default_auto_send')).toBeChecked();
    expect(screen.getByLabelText('settings.always_clear_after_send')).toBeChecked();
    expect(screen.getByLabelText('settings.default_hide_send_info')).toBeChecked();
    expect(screen.getByLabelText('settings.confirm_wait_rounds')).toHaveValue(10);
    // XXX: Add more settings here
  });

  it('notifies when theme is changed', async () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    // Change theme from '' (default) --> 'light'
    await userEvent.click(screen.getByLabelText('settings.theme_switcher.light'));
    expect(screen.getByText('settings.saved_message')).toBeInTheDocument();
  });

  it('notifies when "ignore compose-form validation errors" setting is changed', async () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    // Change setting from unchecked (false) --> checked (true)
    await userEvent.click(screen.getByLabelText('settings.ignore_form_errors'));
    expect(screen.getByText('settings.saved_message')).toBeInTheDocument();
  });

  it('notifies when "use suggested fee by default" setting is changed', async () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    // Change setting from checked (true) --> unchecked (false)
    await userEvent.click(screen.getByLabelText('settings.default_use_sug_fee'));
    expect(screen.getByText('settings.saved_message')).toBeInTheDocument();
  });

  it('notifies when "use suggested rounds by default" setting is changed', async () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    // Change setting from checked (true) --> unchecked (false)
    await userEvent.click(screen.getByLabelText('settings.default_use_sug_rounds'));
    expect(screen.getByText('settings.saved_message')).toBeInTheDocument();
  });

  it('notifies when "manager address to the sender address by default" setting is changed',
  async () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    // Change setting from checked (true) --> unchecked (false)
    await userEvent.click(screen.getByLabelText('settings.default_apar_m_use_snd'));
    expect(screen.getByText('settings.saved_message')).toBeInTheDocument();
  });

  it('notifies when "freeze address to the sender address by default" setting is changed',
  async () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    // Change setting from checked (true) --> unchecked (false)
    await userEvent.click(screen.getByLabelText('settings.default_apar_f_use_snd'));
    expect(screen.getByText('settings.saved_message')).toBeInTheDocument();
  });

  it('notifies when "clawback address to the sender address by default" setting is changed',
  async () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    // Change setting from checked (true) --> unchecked (false)
    await userEvent.click(screen.getByLabelText('settings.default_apar_c_use_snd'));
    expect(screen.getByText('settings.saved_message')).toBeInTheDocument();
  });

  it('notifies when "reserve address to the sender address by default" setting is changed',
  async () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    // Change setting from checked (true) --> unchecked (false)
    await userEvent.click(screen.getByLabelText('settings.default_apar_r_use_snd'));
    expect(screen.getByText('settings.saved_message')).toBeInTheDocument();
  });

  it('notifies when "retrieve asset information when ID is entered" setting is changed',
  async () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    // Change setting from checked (true) --> unchecked (false)
    await userEvent.click(screen.getByLabelText('settings.get_asset_info'));
    expect(screen.getByText('settings.saved_message')).toBeInTheDocument();
  });

  it('notifies when "automatically send after signing by default" setting is changed', async () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    // Change setting from checked (true) --> unchecked (false)
    await userEvent.click(screen.getByLabelText('settings.default_auto_send'));
    expect(screen.getByText('settings.saved_message')).toBeInTheDocument();
  });

  it('notifies when "always clear after sending transaction" setting is changed', async () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    // Change setting from checked (true) --> unchecked (false)
    await userEvent.click(screen.getByLabelText('settings.always_clear_after_send'));
    expect(screen.getByText('settings.saved_message')).toBeInTheDocument();
  });

  it('notifies when "hide send information details by default" setting is changed', async () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    // Change setting from checked (true) --> unchecked (false)
    await userEvent.click(screen.getByLabelText('settings.default_hide_send_info'));
    expect(screen.getByText('settings.saved_message')).toBeInTheDocument();
  });

  it('notifies when "max number of rounds to wait" setting is changed', async () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    // Change setting
    await userEvent.type(screen.getByLabelText('settings.confirm_wait_rounds'), '5');
    expect(screen.getByText('settings.saved_message')).toBeInTheDocument();
  });

  it('removes transaction data from storage when "clear transaction data" button is clicked',
  async () => {
    sessionStorage.setItem('txnData', 'Some transaction data');
    sessionStorage.setItem('signedTxn', 'Signed transaction');
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    await userEvent.click(screen.getByText(/settings.clear_txn_data_btn/));
    // Success message is shown
    expect(screen.getByText('settings.txn_data_cleared_msg')).toBeInTheDocument();
    // Data is cleared
    expect(sessionStorage.getItem('txnData')).toBeNull();
    expect(sessionStorage.getItem('signedTxn')).toBeNull();
  });

  it('removes all data from storage when "clear all data" button is clicked', async () => {
    localStorage.setItem('local', 'This is some data stored indefinitely');
    sessionStorage.setItem('session', 'This is some temporary data');
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    await userEvent.click(screen.getByText(/settings.clear_all_data_btn/));
    // Success message is shown
    expect(screen.getByText('settings.all_data_cleared_msg')).toBeInTheDocument();
    // Data is cleared
    expect(localStorage).toHaveLength(0);
    expect(sessionStorage).toHaveLength(0);
  });

  // XXX: Add tests for more settings here

});
