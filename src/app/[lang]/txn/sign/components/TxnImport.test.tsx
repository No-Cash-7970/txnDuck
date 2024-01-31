import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18nextClientMock from '@/app/lib/testing/i18nextClientMock';
import * as fs from "node:fs";
import { TextDecoder } from 'node:util';
// @ts-expect-error
global.TextDecoder = TextDecoder;

// Mock i18next before modules that use it are imported
jest.mock('react-i18next', () => i18nextClientMock);

// Mock algokit
let mockGenesisHash = '';
jest.mock('@algorandfoundation/algokit-utils', () => ({
  ...jest.requireActual('@algorandfoundation/algokit-utils'),
  getAlgoClient: () => ({}),
  getTransactionParams: () => new Promise((resolve) => resolve({
    genesisID: 'some-network-id',
    genesisHash: mockGenesisHash,
    fee: 1,
    firstRound: 10000,
    lastRound: 11000,
  }))
}));

import TxnImport from './TxnImport';

describe('Transaction Import Component', () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it('processes an unsigned transaction file', async () => {
    const data = fs.readFileSync('src/app/lib/testing/test_unsigned.txn.msgpack');
    const file = new File([data], 'unsigned.txn.msgpack', { type: 'application/octet-stream' });
    mockGenesisHash = 'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=';
    render(<TxnImport />);

    await userEvent.upload(screen.getByLabelText(/import_txn.label/), file);

    await waitFor(() => {
      // Check session storage
      expect(JSON.parse(sessionStorage.getItem('txnData') || '{}')).toStrictEqual({
        txn: {
          type: 'pay',
          snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
          rcv: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
          amt: 5,
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          note: 'Hello world!',
          lx: 'abcdefghijklmnopqrstuvwxyz012345',
        },
        useSugFee: false,
        useSugRounds: false,
        b64Note: false,
        b64Lx: false,
      });
    });
  });

  it('processes an unsigned transaction file with Base64 encoded fields', async () => {
    const data = fs.readFileSync('src/app/lib/testing/test_unsigned.txn.msgpack');
    const file = new File([data], 'unsigned.txn.msgpack', { type: 'application/octet-stream' });
    mockGenesisHash = 'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=';
    render(<TxnImport />);

    // Click checkboxes for options
    await userEvent.click(screen.getByLabelText(/import_txn.b64_note/));
    await userEvent.click(screen.getByLabelText(/import_txn.b64_lx/));
    await userEvent.click(screen.getByLabelText(/import_txn.b64_apar_am/));
    // Upload file
    await userEvent.upload(screen.getByLabelText(/import_txn.label/), file);

    await waitFor(() => {
      // Check session storage
      expect(JSON.parse(sessionStorage.getItem('txnData') || '{}')).toStrictEqual({
        txn: {
          type: 'pay',
          snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
          rcv: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
          amt: 5,
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          note: 'SGVsbG8gd29ybGQh',
          lx: 'YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU=',
        },
        useSugFee: false,
        useSugRounds: false,
        b64Note: true,
        b64Lx: true,
      });
    });
  });

  it('processes an unsigned transaction file for a different network if allowed', async () => {
    const data = fs.readFileSync('src/app/lib/testing/test_unsigned.txn.msgpack');
    const file = new File([data], 'unsigned.txn.msgpack', { type: 'application/octet-stream' });
    mockGenesisHash = 'MockGenesisHash';
    render(<TxnImport />);

    await userEvent.click(screen.getByLabelText(/no_diff_network/));
    await userEvent.upload(screen.getByLabelText(/import_txn.label/), file);

    await waitFor(() => {
      // Check session storage
      expect(JSON.parse(sessionStorage.getItem('txnData') || '{}')).toStrictEqual({
        txn: {
          type: 'pay',
          snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
          rcv: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
          amt: 5,
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          note: 'Hello world!',
          lx: 'abcdefghijklmnopqrstuvwxyz012345',
        },
        useSugFee: false,
        useSugRounds: false,
        b64Note: false,
        b64Lx: false,
      });
    });
  });

  // eslint-disable-next-line max-len
  it('does not process an unsigned transaction file for a different network if not allowed (the default)',
  async () => {
    const data = fs.readFileSync('src/app/lib/testing/test_unsigned.txn.msgpack');
    const file = new File([data], 'unsigned.txn.msgpack', { type: 'application/octet-stream' });
    mockGenesisHash = 'MockGenesisHash';
    render(<TxnImport />);

    await userEvent.upload(screen.getByLabelText(/import_txn.label/), file);

    await waitFor(() => {
      expect(screen.getByText(/import_txn.fail_heading/)).toBeInTheDocument();
    });
    // Check session storage
    expect(sessionStorage.getItem('txnData')).toBeNull();
  });

  it('processes a signed transaction file', async () => {
    const data = fs.readFileSync('src/app/lib/testing/test_signed.txn.msgpack');
    const file = new File([data], 'signed.txn.msgpack', { type: 'application/octet-stream' });
    mockGenesisHash = 'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=';
    render(<TxnImport />);

    await userEvent.upload(screen.getByLabelText(/import_txn.label/), file);

    await waitFor(() => {
      // Check session storage
      expect(JSON.parse(sessionStorage.getItem('txnData') || '{}')).toStrictEqual({
        txn: {
          type: 'pay',
          snd: '7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M',
          rcv: '7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M',
          amt: 0,
          fee: 0.001,
          fv: 1,
          lv: 2,
          note: 'Hello world!',
          lx: 'abcdefghijklmnopqrstuvwxyz012345',
        },
        useSugFee: false,
        useSugRounds: false,
        b64Note: false,
        b64Lx: false,
      });
    });
    expect(JSON.parse(sessionStorage.getItem('signedTxn') || '""')).toBe(
      'data:application/octet-stream;base64,' + data.toString('base64')
    );
  });

  it('processes a signed transaction file with Base64 encoded fields', async () => {
    const data = fs.readFileSync('src/app/lib/testing/test_signed.txn.msgpack');
    const file = new File([data], 'signed.txn.msgpack', { type: 'application/octet-stream' });
    mockGenesisHash = 'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=';
    render(<TxnImport />);

    // Click checkboxes for options
    await userEvent.click(screen.getByLabelText(/import_txn.b64_note/));
    await userEvent.click(screen.getByLabelText(/import_txn.b64_lx/));
    await userEvent.click(screen.getByLabelText(/import_txn.b64_apar_am/));
    // Upload file
    await userEvent.upload(screen.getByLabelText(/import_txn.label/), file);

    await waitFor(() => {
      // Check session storage
      expect(JSON.parse(sessionStorage.getItem('txnData') || '{}')).toStrictEqual({
        txn: {
          type: 'pay',
          snd: '7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M',
          rcv: '7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M',
          amt: 0,
          fee: 0.001,
          fv: 1,
          lv: 2,
          note: 'SGVsbG8gd29ybGQh',
          lx: 'YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU=',
        },
        useSugFee: false,
        useSugRounds: false,
        b64Note: true,
        b64Lx: true,
      });
    });
    expect(JSON.parse(sessionStorage.getItem('signedTxn') || '""')).toBe(
      'data:application/octet-stream;base64,' + data.toString('base64')
    );
  });

  it('processes a signed transaction file for a different network if allowed', async () => {
    const data = fs.readFileSync('src/app/lib/testing/test_signed.txn.msgpack');
    const file = new File([data], 'signed.txn.msgpack', { type: 'application/octet-stream' });
    mockGenesisHash = 'MockGenesisHash';
    render(<TxnImport />);

    await userEvent.click(screen.getByLabelText(/no_diff_network/));
    await userEvent.upload(screen.getByLabelText(/import_txn.label/), file);

    await waitFor(() => {
      // Check session storage
      expect(JSON.parse(sessionStorage.getItem('txnData') || '{}')).toStrictEqual({
        txn: {
          type: 'pay',
          snd: '7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M',
          rcv: '7JDB2I2R4ZXN4BAGZMRKYPZGKOTABRAG4KN2R7TWOAGMBCLUZXIMVLMA2M',
          amt: 0,
          fee: 0.001,
          fv: 1,
          lv: 2,
          note: 'Hello world!',
          lx: 'abcdefghijklmnopqrstuvwxyz012345',
        },
        useSugFee: false,
        useSugRounds: false,
        b64Note: false,
        b64Lx: false,
      });
    });
    expect(JSON.parse(sessionStorage.getItem('signedTxn') || '""')).toBe(
      'data:application/octet-stream;base64,' + data.toString('base64')
    );
  });

  // eslint-disable-next-line max-len
  it('does not process a signed transaction file for a different network if not allowed (the default)',
  async () => {
    const data = fs.readFileSync('src/app/lib/testing/test_signed.txn.msgpack');
    const file = new File([data], 'signed.txn.msgpack', { type: 'application/octet-stream' });
    mockGenesisHash = 'MockGenesisHash';
    render(<TxnImport />);

    await userEvent.upload(screen.getByLabelText(/import_txn.label/), file);

    await waitFor(() => {
      expect(screen.getByText(/import_txn.fail_heading/)).toBeInTheDocument();
    });
    // Check session storage
    expect(sessionStorage.getItem('txnData')).toBeNull();
    expect(sessionStorage.getItem('signedTxn')).toBeNull();
  });

});
