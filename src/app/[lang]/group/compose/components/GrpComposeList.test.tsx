import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18nextClientMock from '@/app/lib/testing/i18nextClientMock';
import { useWalletUnconnectedMock } from '@/app/lib/testing/useWalletMock';

// Mock i18next before modules that use it are imported
jest.mock('react-i18next', () => i18nextClientMock);
// Mock use-wallet before modules that use it are imported
jest.mock('@txnlab/use-wallet-react', () => useWalletUnconnectedMock);

// Mock navigation hooks
jest.mock('next/navigation', () => ({
  useSearchParams: () => ({ get: (param: string) => param }),
}));

// Mock algosdk
jest.mock('algosdk', () => ({
  ...jest.requireActual('algosdk'),
  Algodv2: class {
    token: string;
    constructor(token: string) { this.token = token; }
    getAssetByID() {
      return { do: () => ({}) };
    }
  }
}));

import GrpComposeList from './GrpComposeList';

describe('Group Compose List Component', () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it('shows "No transactions" when there are no transaction slots', () => {
    render(<GrpComposeList />);
    expect(screen.getByText(/grp_list_no_txn/)).toBeInTheDocument();
    expect(screen.getByText(/review_sign_btn/)).toHaveClass('btn-disabled');
  });

  it('loads all saved transactions slots in group', () => {
    // eslint-disable-next-line @stylistic/max-len
    sessionStorage.setItem('txn_0d84', '{"txn":{"type":"pay","snd":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","rcv":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","amt":0},"useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false}');
    // eslint-disable-next-line @stylistic/max-len
    sessionStorage.setItem('txn_a14f', '{"txn":{"type":"pay","snd":"BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB","rcv":"BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB","amt":0},"useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false}');
    sessionStorage.setItem('txnGrpKeys', '["txn_0d84","","txn_a14f"]');
    render(<GrpComposeList />);
    expect(screen.getAllByText(/Type\: pay/)).toHaveLength(2);
    expect(screen.getByText(/no_txn_in_slot/)).toBeInTheDocument();
    expect(screen.getByText(/review_sign_btn/)).toHaveClass('btn-disabled');
  });

  it('adds slot when "Add transaction slot" button is clicked', async () => {
    // eslint-disable-next-line @stylistic/max-len
    sessionStorage.setItem('txn_0d84', '{"txn":{"type":"pay","snd":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","rcv":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","amt":0},"useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false}');
    sessionStorage.setItem('txnGrpKeys', '["txn_0d84"]');
    render(<GrpComposeList />);

    await userEvent.click(screen.getByText(/add_slot_btn/));
    expect(await screen.findByText(/no_txn_in_slot/)).toBeInTheDocument();
    expect(sessionStorage.getItem('txnGrpKeys')).toBe('["txn_0d84",""]');

    // Click the button again
    await userEvent.click(screen.getByText(/add_slot_btn/));
    expect(await screen.findAllByText(/no_txn_in_slot/)).toHaveLength(2);
    expect(sessionStorage.getItem('txnGrpKeys')).toBe('["txn_0d84","",""]');
  });

  it('disables "Add transaction slot" button when there are 16 (the max) slots', () => {
    sessionStorage.setItem('txnGrpKeys', '["","","","","","","","","","","","","","","",""]');
    render(<GrpComposeList />);
    expect(screen.getByText(/add_slot_btn/)).toBeDisabled();
  });

  it('removes an empty slot when its "Remove" button is clicked', async () => {
    // eslint-disable-next-line @stylistic/max-len
    sessionStorage.setItem('txn_0d84', '{"txn":{"type":"pay","snd":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","rcv":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","amt":0},"useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false}');
    // eslint-disable-next-line @stylistic/max-len
    sessionStorage.setItem('txnGrpKeys', '["","txn_0d84","","","","","","","","","","","","","",""]');
    render(<GrpComposeList />);

    // Click the first "Remove" button (for an empty slot)
    await userEvent.click(screen.getAllByText(/remove_slot_btn/)[0]);
    expect(await screen.findAllByText(/no_txn_in_slot/)).toHaveLength(14);
    expect(await screen.findByText(/Type\: pay/)).toBeInTheDocument();
    expect(await screen.findByText(/add_slot_btn/)).not.toBeDisabled();
    expect(sessionStorage.getItem('txnGrpKeys'))
      .toBe('["txn_0d84","","","","","","","","","","","","","",""]');

    // Click the first "Remove" button again (This time for a slot with a transaction)
    await userEvent.click(screen.getAllByText(/remove_slot_btn/)[0]);
    expect(await screen.findAllByText(/no_txn_in_slot/)).toHaveLength(14);
    expect(screen.queryByText(/Type\: pay/)).not.toBeInTheDocument();
    expect(await screen.findByText(/add_slot_btn/)).not.toBeDisabled();
    expect(sessionStorage.getItem('txnGrpKeys'))
      .toBe('["","","","","","","","","","","","","",""]');
    expect(sessionStorage.getItem('txn_0d84')).toBeNull();
  });

  it('can move the slots', async () => {
    // eslint-disable-next-line @stylistic/max-len
    sessionStorage.setItem('txn_0d84', '{"txn":{"type":"pay","snd":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","rcv":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","amt":0},"useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false}');
    // eslint-disable-next-line @stylistic/max-len
    sessionStorage.setItem('txn_a14f', '{"txn":{"type":"pay","snd":"BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB","rcv":"BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB","amt":0},"useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false}');
    sessionStorage.setItem('txnGrpKeys', '["txn_0d84","","","txn_a14f"]');
    render(<GrpComposeList />);

    const moveSlotUpBtns = screen.getAllByTitle(/move_slot_up_btn/);
    const moveSlotDownBtns = screen.getAllByTitle(/move_slot_down_btn/);

    // Check if 1st move-up button is disabled
    expect(moveSlotUpBtns[0]).toBeDisabled();
    // Check if last move-up button is disabled
    expect(moveSlotDownBtns[moveSlotDownBtns.length-1]).toBeDisabled();

    // Move 1st slot (with a transaction) down
    await userEvent.click(moveSlotDownBtns[0]);
    expect(sessionStorage.getItem('txnGrpKeys')).toBe(`["","txn_0d84","","txn_a14f"]`);

    // Move 2nd slot (with a transaction) up
    await userEvent.click(moveSlotUpBtns[1]);
    expect(sessionStorage.getItem('txnGrpKeys')).toBe(`["txn_0d84","","","txn_a14f"]`);

    // Move 2nd slot (without transaction) down
    await userEvent.click(moveSlotDownBtns[1]);
    expect(sessionStorage.getItem('txnGrpKeys')).toBe(`["txn_0d84","","","txn_a14f"]`);

    // Move last slot (with a transaction) up
    await userEvent.click(moveSlotUpBtns[moveSlotUpBtns.length-1]);
    expect(sessionStorage.getItem('txnGrpKeys')).toBe(`["txn_0d84","","txn_a14f",""]`);

    // Move 3rd slot (with a transaction) up
    await userEvent.click(moveSlotUpBtns[2]);
    expect(sessionStorage.getItem('txnGrpKeys')).toBe(`["txn_0d84","txn_a14f","",""]`);

    // Move 2nd slot (with a transaction) up
    await userEvent.click(moveSlotUpBtns[1]);
    expect(sessionStorage.getItem('txnGrpKeys')).toBe(`["txn_a14f","txn_0d84","",""]`);
  });

  // TODO: Test Compose/Edit buttons

  // it.skip('', async () => {
  //   render(<GrpComposeList />);
  //   // TODO
  // });

});
