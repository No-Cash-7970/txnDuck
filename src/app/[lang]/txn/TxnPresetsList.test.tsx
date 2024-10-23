import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18nextClientMock from '@/app/lib/testing/i18nextClientMock';

// Mock i18next before modules that use it are imported
jest.mock('react-i18next', () => i18nextClientMock);

// Mock navigation hooks
jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: () => null
  }),
}));

import TxnPresetsList from './TxnPresetsList';

describe('Transaction Presets List', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('only shows favorite items when "favorites" category is selected', async () => {
    localStorage.setItem('txnPresetFavs', '["transfer","reg_offline","asset_transfer"]');
    render(<TxnPresetsList />);

    await userEvent.selectOptions(screen.getByRole('combobox'), 'favorites'); // Select 'favorites'

    expect(screen.getByRole('heading', {level: 2})).toHaveTextContent('favorites.heading');
    expect(screen.getByText('transfer_algos.description')).toBeInTheDocument();
    expect(screen.getByText('reg_offline.description')).toBeInTheDocument();
    expect(screen.getByText('asset_transfer.description')).toBeInTheDocument();
  });

  it('only shows general items when "general" category is selected', async () => {
    render(<TxnPresetsList />);

    await userEvent.selectOptions(screen.getByRole('combobox'), 'general'); // Select 'general'

    expect(screen.getByRole('heading', {level: 2})).toHaveTextContent('general_heading');
    expect(screen.getByText('transfer_algos.description')).toBeInTheDocument();
    expect(screen.getByText('rekey_account.description')).toBeInTheDocument();
    expect(screen.getByText('close_account.description')).toBeInTheDocument();
  });

  it('only shows asset items when "asset" category is selected', async () => {
    render(<TxnPresetsList />);

    await userEvent.selectOptions(screen.getByRole('combobox'), 'asset'); // Select 'asset'

    expect(screen.getByRole('heading', {level: 2})).toHaveTextContent('asset_heading');
    expect(screen.getByText('asset_transfer.description')).toBeInTheDocument();
    expect(screen.getByText('asset_opt_in.description')).toBeInTheDocument();
    expect(screen.getByText('asset_opt_out.description')).toBeInTheDocument();
    expect(screen.getByText('asset_create.description')).toBeInTheDocument();
    expect(screen.getByText('asset_reconfig.description')).toBeInTheDocument();
    expect(screen.getByText('asset_clawback.description')).toBeInTheDocument();
    expect(screen.getByText('asset_freeze.description')).toBeInTheDocument();
    expect(screen.getByText('asset_unfreeze.description')).toBeInTheDocument();
    expect(screen.getByText('asset_destroy.description')).toBeInTheDocument();
  });

  it('only shows application items when "application" category is selected', async () => {
    render(<TxnPresetsList />);

    await userEvent.selectOptions(screen.getByRole('combobox'), 'app'); // Select 'app'

    expect(screen.getByRole('heading', {level: 2})).toHaveTextContent('app_heading');
    expect(screen.getByText('app_run.description')).toBeInTheDocument();
    expect(screen.getByText('app_opt_in.description')).toBeInTheDocument();
    expect(screen.getByText('app_deploy.description')).toBeInTheDocument();
    expect(screen.getByText('app_update.description')).toBeInTheDocument();
    expect(screen.getByText('app_close.description')).toBeInTheDocument();
    expect(screen.getByText('app_clear.description')).toBeInTheDocument();
    expect(screen.getByText('app_delete.description')).toBeInTheDocument();
  });

  it('only shows participation key items when "participation key" category is selected',
  async () => {
    render(<TxnPresetsList />);

    await userEvent.selectOptions(screen.getByRole('combobox'), 'part_key'); // Select 'part_key'

    expect(screen.getByRole('heading', {level: 2})).toHaveTextContent('part_key_heading');
    expect(screen.getByText('reg_online.description')).toBeInTheDocument();
    expect(screen.getByText('reg_offline.description')).toBeInTheDocument();
    expect(screen.getByText('reg_nonpart.description')).toBeInTheDocument();
  });

  it('only shows all items when "all" category is selected', async () => {
    render(<TxnPresetsList />);

    await userEvent.selectOptions(screen.getByRole('combobox'), 'all'); // Select 'all'

    expect(screen.getAllByRole('heading', {level: 2})).toHaveLength(5); // Have all 4 headings

    expect(screen.getByText('transfer_algos.description')).toBeInTheDocument();
    expect(screen.getByText('rekey_account.description')).toBeInTheDocument();
    expect(screen.getByText('close_account.description')).toBeInTheDocument();

    expect(screen.getByText('asset_transfer.description')).toBeInTheDocument();
    expect(screen.getByText('asset_opt_in.description')).toBeInTheDocument();
    expect(screen.getByText('asset_opt_out.description')).toBeInTheDocument();
    expect(screen.getByText('asset_create.description')).toBeInTheDocument();
    expect(screen.getByText('asset_reconfig.description')).toBeInTheDocument();
    expect(screen.getByText('asset_clawback.description')).toBeInTheDocument();
    expect(screen.getByText('asset_freeze.description')).toBeInTheDocument();
    expect(screen.getByText('asset_unfreeze.description')).toBeInTheDocument();
    expect(screen.getByText('asset_destroy.description')).toBeInTheDocument();

    expect(screen.getByText('app_run.description')).toBeInTheDocument();
    expect(screen.getByText('app_opt_in.description')).toBeInTheDocument();
    expect(screen.getByText('app_deploy.description')).toBeInTheDocument();
    expect(screen.getByText('app_update.description')).toBeInTheDocument();
    expect(screen.getByText('app_close.description')).toBeInTheDocument();
    expect(screen.getByText('app_clear.description')).toBeInTheDocument();
    expect(screen.getByText('app_delete.description')).toBeInTheDocument();

    expect(screen.getByText('reg_online.description')).toBeInTheDocument();
    expect(screen.getByText('reg_offline.description')).toBeInTheDocument();
    expect(screen.getByText('reg_nonpart.description')).toBeInTheDocument();
  });

  it('adds preset to "favorites" when "add favorite" button for preset is clicked', async () => {
    render(<TxnPresetsList />);

    expect(screen.getByText('favorites.none')).toBeInTheDocument();

    const favBtn = screen.getAllByTitle('favorites.add')[0];
    await userEvent.click(favBtn);

    const storedFavs = localStorage.getItem('txnPresetFavs') ?? '';
    expect(storedFavs).toBe('["transfer"]');
    expect(screen.getAllByTitle('favorites.remove'))
      .toHaveLength(2);
  });

  // eslint-disable-next-line max-len
  it('removes preset from "favorites" category when "remove favorite" button of the copy in the "favorites" category is clicked',
  async () => {
    localStorage.setItem('txnPresetFavs', '["transfer"]');
    render(<TxnPresetsList />);

    // Get the favorites button for the copy of the preset listed under "Favorites"
    const favBtn = screen.getAllByTitle('favorites.remove')[0];
    await userEvent.click(favBtn);

    const storedFavs = localStorage.getItem('txnPresetFavs') ?? '';
    expect(storedFavs).toBe('[]');
    expect(screen.getByText('favorites.none')).toBeInTheDocument();
  });

  // eslint-disable-next-line max-len
  it('removes preset from "favorites" category when "remove favorite" button of the copy NOT in the "favorites" category is clicked',
  async () => {
    localStorage.setItem('txnPresetFavs', '["transfer"]');
    render(<TxnPresetsList />);

    // Get the favorites button for the preset listed under its normal category
    const favBtn = screen.getAllByTitle('favorites.remove')[1];
    await userEvent.click(favBtn);

    const storedFavs = localStorage.getItem('txnPresetFavs') ?? '';
    expect(storedFavs).toBe('[]');
    expect(screen.getByText('favorites.none')).toBeInTheDocument();
  });

});
