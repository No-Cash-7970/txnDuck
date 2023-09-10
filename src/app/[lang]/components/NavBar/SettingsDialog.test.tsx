/* eslint-disable testing-library/no-container */
/* eslint-disable testing-library/no-node-access */

import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider as ToastProvider, Viewport as ToastViewport } from '@radix-ui/react-toast';
import i18nextClientMock from "@/app/lib/testing/i18nextClientMock";

// Mock i18next before modules that use it are imported
jest.mock('react-i18next', () => i18nextClientMock);

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

  it('saves when a setting is changed', async () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );

    // TODO: Change an actual setting
    await userEvent.click(screen.getByText('🦆'));

    expect(screen.getByText('settings.saved_message')).toBeInTheDocument();
  });

  it('can reset to defaults', async () => {
    render(
      <ToastProvider>
        <SettingsDialog open={true} />
        <ToastViewport />
      </ToastProvider>
    );
    await userEvent.click(screen.getByText('settings.reset_button'));
    expect(screen.getByText('settings.reset_message')).toBeInTheDocument();
    // TODO: Check if setting fields are at the defaults
  });

});
