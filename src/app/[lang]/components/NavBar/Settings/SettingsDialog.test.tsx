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

  it('has "reset" button', () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    expect(screen.getByText('settings.reset_button')).toBeInTheDocument();
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
    // XXX: Add more settings here
  });

  it('has theme mode setting', () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    expect(screen.getByText(/settings.theme_switcher.label/)).toBeInTheDocument();
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

  it('has "ignore compose-form validation errors" setting', () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    expect(screen.getByText(/settings.ignore_form_errors/)).toBeInTheDocument();
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

  it('has "use suggested fee by default" setting', () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    expect(screen.getByText(/settings.default_use_sug_fee/)).toBeInTheDocument();
  });

  it('notifies when "use suggested fee by default" setting is changed',
  async () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    // Change setting from unchecked (false) --> checked (true)
    await userEvent.click(screen.getByLabelText('settings.default_use_sug_fee'));
    expect(screen.getByText('settings.saved_message')).toBeInTheDocument();
  });

  it('has "use suggested rounds by default" setting', () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    expect(screen.getByText(/settings.default_use_sug_rounds/)).toBeInTheDocument();
  });

  it('notifies when "use suggested rounds by default" setting is changed',
  async () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    // Change setting from unchecked (false) --> checked (true)
    await userEvent.click(screen.getByLabelText('settings.default_use_sug_rounds'));
    expect(screen.getByText('settings.saved_message')).toBeInTheDocument();
  });

  it('has "manager address to the sender address by default" setting', () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    expect(screen.getByText(/settings.default_apar_m_use_snd/)).toBeInTheDocument();
  });

  it('notifies when "manager address to the sender address by default" setting is changed',
  async () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    // Change setting from unchecked (false) --> checked (true)
    await userEvent.click(screen.getByLabelText('settings.default_apar_m_use_snd'));
    expect(screen.getByText('settings.saved_message')).toBeInTheDocument();
  });

  it('has "freeze address to the sender address by default" setting', () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    expect(screen.getByText(/settings.default_apar_f_use_snd/)).toBeInTheDocument();
  });

  it('notifies when "freeze address to the sender address by default" setting is changed',
  async () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    // Change setting from unchecked (false) --> checked (true)
    await userEvent.click(screen.getByLabelText('settings.default_apar_f_use_snd'));
    expect(screen.getByText('settings.saved_message')).toBeInTheDocument();
  });

  it('has "clawback address to the sender address by default" setting', () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    expect(screen.getByText(/settings.default_apar_c_use_snd/)).toBeInTheDocument();
  });

  it('notifies when "clawback address to the sender address by default" setting is changed',
  async () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    // Change setting from unchecked (false) --> checked (true)
    await userEvent.click(screen.getByLabelText('settings.default_apar_c_use_snd'));
    expect(screen.getByText('settings.saved_message')).toBeInTheDocument();
  });

  it('has "reserve address to the sender address by default" setting', () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    expect(screen.getByText(/settings.default_apar_r_use_snd/)).toBeInTheDocument();
  });

  it('notifies when "reserve address to the sender address by default" setting is changed',
  async () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    // Change setting from unchecked (false) --> checked (true)
    await userEvent.click(screen.getByLabelText('settings.default_apar_r_use_snd'));
    expect(screen.getByText('settings.saved_message')).toBeInTheDocument();
  });

  // XXX: Add tests for more settings here

});
