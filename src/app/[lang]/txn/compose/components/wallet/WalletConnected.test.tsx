import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TFunction } from 'i18next';
import i18nextClientMock from '@/app/lib/testing/i18nextClientMock';
import { fooDisconnectFn, useWalletConnectedMock } from '@/app/lib/testing/useWalletMock';

// Mock i18next before modules that use it are imported
jest.mock('react-i18next', () => i18nextClientMock);
// Mock use-wallet
jest.mock('@txnlab/use-wallet-react', () => useWalletConnectedMock);

import ConnectWallet from './ConnectWallet';

describe('Wallet Connect (in Settings) (Connected wallet)', () => {
  const t = i18nextClientMock.useTranslation().t as TFunction;

  it('has "disconnect" button', () => {
    render(<ConnectWallet t={t} setvalfn={() => {}} />);
    expect(screen.getByText('app:wallet.disconnect')).toHaveRole('button');
  });

  it('disconnects wallet when "disconnect" button is clicked', async () => {
    render(<ConnectWallet t={t} setvalfn={() => {}} />);
    await userEvent.click(screen.getByText('app:wallet.disconnect'));
    expect(fooDisconnectFn).toHaveBeenCalledTimes(1);
  });

  it('calls function to set field when "use connected account" button clicked', async () => {
    const setValFnMock = jest.fn();
    render(<ConnectWallet t={t} setvalfn={setValFnMock} />);
    await userEvent.click(screen.getByText('app:wallet.set_field_to_connected_addr'));
    expect(setValFnMock).toHaveBeenCalledTimes(1);
  });

});
