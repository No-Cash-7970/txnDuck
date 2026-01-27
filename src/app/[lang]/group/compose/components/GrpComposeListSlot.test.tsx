import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import i18nextClientMock from '@/app/lib/testing/i18nextClientMock';

// Mock i18next before modules that use it are imported
jest.mock('react-i18next', () => i18nextClientMock);

// Mock navigation hooks
jest.mock('next/navigation', () => ({
  useSearchParams: () => ({ get: (param: string) => param }),
}));

// // Mock algosdk
// jest.mock('algosdk', () => ({
//   ...jest.requireActual('algosdk'),
//   Algodv2: class {
//     token: string;
//     constructor(token: string) { this.token = token; }
//     getAssetByID() {
//       return { do: () => ({}) };
//     }
//   }
// }));

import GrpComposeListSlot from './GrpComposeListSlot';

describe('Group Compose List Slot Component', () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it('shows empty slot when there is no transaction for the slot', () => {
    sessionStorage.setItem('txnGrpKeys', '[""]');
    render(<ol><GrpComposeListSlot txnIdx={0} /></ol>);
    expect(screen.getByText(/no_txn_in_slot/)).toBeInTheDocument();
  });

  it('displays transaction with no preset', () => {
    // eslint-disable-next-line @stylistic/max-len
    sessionStorage.setItem('txn_0d84', '{"txn":{"type":"pay","snd":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","rcv":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","amt":0},"useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false}');
    sessionStorage.setItem('txnGrpKeys', '["txn_0d84"]');
    render(<GrpComposeListSlot txnIdx={0} />);
    // TODO: Replace data text with i18n
    expect(screen.getByText(/Type:/)).toBeInTheDocument();
    expect(screen.getByText(/From:/)).toBeInTheDocument();
    expect(screen.getByText(/Fee:/)).toBeInTheDocument();
  });

  // it.skip('displays transaction with "Transfer" preset', async () => {
  //   render(<GrpComposeListSlot txnIdx={0} />);
  //   // TODO
  // });

  // it.skip('displays transaction with "Rekey" preset', async () => {
  //   render(<GrpComposeListSlot txnIdx={0} />);
  //   // TODO
  // });

  // it.skip('displays transaction with "Close Account" preset', async () => {
  //   render(<GrpComposeListSlot txnIdx={0} />);
  //   // TODO
  // });

  // it.skip('displays transaction with "Asset Transfer" preset', async () => {
  //   render(<GrpComposeListSlot txnIdx={0} />);
  //   // TODO
  // });

  // it.skip('displays transaction with "Asset Opt In" preset', async () => {
  //   render(<GrpComposeListSlot txnIdx={0} />);
  //   // TODO
  // });

  // it.skip('displays transaction with "Asset Opt Out" preset', async () => {
  //   render(<GrpComposeListSlot txnIdx={0} />);
  //   // TODO
  // });

  // it.skip('displays transaction with "Asset Create" preset', async () => {
  //   render(<GrpComposeListSlot txnIdx={0} />);
  //   // TODO
  // });

  // it.skip('displays transaction with "Asset Reconfigure" preset', async () => {
  //   render(<GrpComposeListSlot txnIdx={0} />);
  //   // TODO
  // });

  // it.skip('displays transaction with "Asset Clawback" preset', async () => {
  //   render(<GrpComposeListSlot txnIdx={0} />);
  //   // TODO
  // });

  // it.skip('displays transaction with "Asset Destroy" preset', async () => {
  //   render(<GrpComposeListSlot txnIdx={0} />);
  //   // TODO
  // });

  // it.skip('displays transaction with "Asset Freeze" preset', async () => {
  //   render(<GrpComposeListSlot txnIdx={0} />);
  //   // TODO
  // });

  // it.skip('displays transaction with "Asset Unfreeze" preset', async () => {
  //   render(<GrpComposeListSlot txnIdx={0} />);
  //   // TODO
  // });

  // it.skip('displays transaction with "App Run" preset', async () => {
  //   render(<GrpComposeListSlot txnIdx={0} />);
  //   // TODO
  // });

  // it.skip('displays transaction with "App Opt In" preset', async () => {
  //   render(<GrpComposeListSlot txnIdx={0} />);
  //   // TODO
  // });

  // it.skip('displays transaction with "App Deploy" preset', async () => {
  //   render(<GrpComposeListSlot txnIdx={0} />);
  //   // TODO
  // });

  // it.skip('displays transaction with "App Update" preset', async () => {
  //   render(<GrpComposeListSlot txnIdx={0} />);
  //   // TODO
  // });

  // it.skip('displays transaction with "App Close" preset', async () => {
  //   render(<GrpComposeListSlot txnIdx={0} />);
  //   // TODO
  // });

  // it.skip('displays transaction with "App Clear" preset', async () => {
  //   render(<GrpComposeListSlot txnIdx={0} />);
  //   // TODO
  // });

  // it.skip('displays transaction with "App Delete" preset', async () => {
  //   render(<GrpComposeListSlot txnIdx={0} />);
  //   // TODO
  // });

  // it.skip('displays transaction with "Register Online" preset', async () => {
  //   render(<GrpComposeListSlot txnIdx={0} />);
  //   // TODO
  // });


  // it.skip('displays transaction with "Register Offline" preset', async () => {
  //   render(<GrpComposeListSlot txnIdx={0} />);
  //   // TODO
  // });


  // it.skip('displays transaction with "Register Nonparticipating" preset', async () => {
  //   render(<GrpComposeListSlot txnIdx={0} />);
  //   // TODO
  // });

  // it.skip('', async () => {
  //   render(<GrpComposeListSlot txnIdx={0} />);
  //   // TODO
  // });
});
