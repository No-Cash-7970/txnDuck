import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type TFunction } from 'i18next';
import i18nextClientMock from '@/app/lib/testing/i18nextClientMock';
import {
  barConnectFn,
  fooConnectFn,
  magicConnectFn,
  useWalletUnconnectedMock
} from '@/app/lib/testing/useWalletMock';
// This must be imported after the mock classes are imported
import { JotaiProvider } from '@/app/[lang]/components';

// Mock i18next before modules that use it are imported
jest.mock('react-i18next', () => i18nextClientMock);
// Mock use-wallet
jest.mock('@txnlab/use-wallet-react', () => useWalletUnconnectedMock);

import ConnectWallet from './ConnectWallet';

describe('Wallet Connect (in Settings) (Unconnected wallet)', () => {
  const t = i18nextClientMock.useTranslation().t as TFunction;

  it('has "connect" button', () => {
    render(<JotaiProvider><ConnectWallet t={t} setvalfn={() => {}} /></JotaiProvider>);
    expect(screen.getByRole('button')).toHaveTextContent('app:wallet.connect');
  });

  it('shows modal with selection of wallets', async () => {
    render(<JotaiProvider><ConnectWallet t={t} setvalfn={() => {}} /></JotaiProvider>);

    await userEvent.click(screen.getByText('app:wallet.connect'));

    expect(screen.getByText('app:wallet.providers_list_title')).toBeInTheDocument();
    expect(screen.getByText('app:wallet.providers.fooWallet')).toBeInTheDocument();
  });

  it('tries to connect to available wallet provider when it is selected', async () => {
    fooConnectFn.mockReturnValueOnce(new Promise(() => {}));
    render(<JotaiProvider><ConnectWallet t={t} setvalfn={() => {}} /></JotaiProvider>);

    await userEvent.click(screen.getByText('app:wallet.connect'));
    // "Foo wallet" should be the first one listed
    await userEvent.click(screen.getAllByText('app:wallet.use_provider_btn')[0]);

    expect(fooConnectFn).toHaveBeenCalledTimes(1);
    expect(barConnectFn).not.toHaveBeenCalled();
  });

  it('prompts for email address when "Magic" is selected as the wallet', async () => {
    render(<JotaiProvider><ConnectWallet t={t} setvalfn={() => {}} /></JotaiProvider>);

    await userEvent.click(screen.getByText('app:wallet.connect'));
    // "Magic wallet" should be the third one listed
    await userEvent.click(screen.getAllByText('app:wallet.use_provider_btn')[2]);

    expect(magicConnectFn).not.toHaveBeenCalled();
    expect(screen.getByText(/wallet.magic_prompt.heading/)).toBeInTheDocument();
    expect(screen.getByLabelText(/wallet.magic_prompt.email_label/))
      .toBeInTheDocument();
    expect(screen.getByText(/wallet.magic_prompt.email_submit_btn/)).toHaveRole('button');
    expect(screen.getByText('cancel')).toHaveRole('button');
  });

  it('shows list of wallets after the Magic wallet prompt is canceled', async () => {
    render(<JotaiProvider><ConnectWallet t={t} setvalfn={() => {}} /></JotaiProvider>);

    // Trigger prompt to enter email for Magic wallet
    await userEvent.click(screen.getByText('app:wallet.connect'));
    // "Magic wallet" should be the third one listed
    await userEvent.click(screen.getAllByText('app:wallet.use_provider_btn')[2]);
    // Cancel prompt
    await userEvent.click(screen.getByText('cancel'));

    expect(screen.getByText('app:wallet.providers_list_title')).toBeInTheDocument();
    expect(screen.getByText('app:wallet.providers.fooWallet')).toBeInTheDocument();
  });

  it('tries to connect using Magic if the given email address is valid', async () => {
    render(<JotaiProvider><ConnectWallet t={t} setvalfn={() => {}} /></JotaiProvider>);

    // Trigger prompt to enter email for Magic wallet and submit it
    await userEvent.click(screen.getByText('app:wallet.connect'));
    // "Magic wallet" should be the third one listed
    await userEvent.click(screen.getAllByText('app:wallet.use_provider_btn')[2]);
    await userEvent.click(screen.getByLabelText(/wallet.magic_prompt.email_label/));
    await userEvent.paste('magic.user@example.com');
    await userEvent.click(screen.getByText(/wallet.magic_prompt.email_submit_btn/));

    // Check if there was an attempt to connect using Magic
    expect(magicConnectFn).toHaveBeenCalledWith({email: 'magic.user@example.com'});
  });

  it('shows error message if Magic authentication fails', async () => {
    render(<JotaiProvider><ConnectWallet t={t} setvalfn={() => {}} /></JotaiProvider>);
    // Simulate error from attempting to connect and authenticate using Magic
    magicConnectFn.mockRejectedValueOnce('error!');

    // Trigger prompt to enter email for Magic wallet and submit it
    await userEvent.click(screen.getByText('app:wallet.connect'));
    // "Magic wallet" should be the third one listed
    await userEvent.click(screen.getAllByText('app:wallet.use_provider_btn')[2]);
    await userEvent.click(screen.getByLabelText(/wallet.magic_prompt.email_label/));
    await userEvent.paste('magic.user@example.com');
    await userEvent.click(screen.getByText(/wallet.magic_prompt.email_submit_btn/));

    // Check if attempt to connect using Magic failed
    expect(screen.getByText(/wallet.magic_prompt.fail/)).toBeInTheDocument();
  });

});
