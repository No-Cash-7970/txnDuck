import '@testing-library/jest-dom';
import { type Address, TransactionType, encodeAddress } from 'algosdk';
import * as tdp from './txn-data-processor';

/* Polyfill for TextEncoder, TextDecoder and the Uint8Array they use */
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
// NOTE: For some reason, the Uint8Array class that the polyfills use is different from the actual
// Uint8Array class, so polyfilling Uint8array is necessary too
// @ts-ignore
global.Uint8Array = (new TextEncoder).encode().constructor;

describe('Transaction Data Processor', () => {
  describe('createTxnFromData()', () => {

    it('returns `Transaction` object with given data for a payment transaction', () => {
      const txn = tdp.createTxnFromData(
        {
          type: TransactionType.pay,
          snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
          note: 'Hello world',
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          rcv: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
          amt: 5,
          lx: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          rekey: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
          close: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(TransactionType.pay);
      expect(addrToStr(txn.from))
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee).toBe(1000);
      expect(txn.firstRound).toBe(6000000);
      expect(txn.lastRound).toBe(6001000);
      expect(txn.lease).toHaveLength(32);
      expect(addrToStr(txn.reKeyTo))
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
      expect(addrToStr(txn.to)).toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
      expect(txn.amount).toBe(5000000);
      expect(addrToStr(txn.closeRemainderTo))
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
    });

    it('returns `Transaction` object with given data for a asset transfer transaction', () => {
      const txn = tdp.createTxnFromData(
        {
          type: TransactionType.axfer,
          snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
          note: 'Hello world',
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          rekey: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
          asnd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
          arcv: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
          xaid: 88888888,
          aamt: 500,
          aclose: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(TransactionType.axfer);
      expect(addrToStr(txn.from))
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee).toBe(1000);
      expect(txn.firstRound).toBe(6000000);
      expect(txn.lastRound).toBe(6001000);
      expect(txn.lease).toHaveLength(32);
      expect(addrToStr(txn.reKeyTo))
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
      expect(addrToStr(txn.assetRevocationTarget))
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
      expect(addrToStr(txn.to)).toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
      expect(txn.assetIndex).toBe(88888888);
      expect(txn.amount.toString()).toBe('500');
      expect(addrToStr(txn.closeRemainderTo))
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
    });

    it(
    'returns `Transaction` object with given data for a asset configuration (creation) transaction',
    () => {
      const txn = tdp.createTxnFromData(
        {
          type: TransactionType.acfg,
          snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
          note: 'Hello world',
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          rekey: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
          apar_un: 'FAKE',
          apar_an: 'Fake Token',
          apar_t: 10000000,
          apar_dc: 5,
          apar_df: true,
          apar_au: 'https://fake.token',
          apar_m: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
          apar_f: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
          apar_c: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
          apar_r: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
          apar_am: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(TransactionType.acfg);
      expect(addrToStr(txn.from))
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee).toBe(1000);
      expect(txn.firstRound).toBe(6000000);
      expect(txn.lastRound).toBe(6001000);
      expect(txn.lease).toHaveLength(32);
      expect(addrToStr(txn.reKeyTo))
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
      expect(txn.assetUnitName).toBe('FAKE');
      expect(txn.assetName).toBe('Fake Token');
      expect(txn.assetTotal.toString()).toBe('10000000');
      expect(txn.assetDecimals).toBe(5);
      expect(txn.assetDefaultFrozen).toBe(true);
      expect(txn.assetURL).toBe('https://fake.token');
      expect(addrToStr(txn.assetManager))
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
      expect(addrToStr(txn.assetFreeze))
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
      expect(addrToStr(txn.assetClawback))
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
      expect(addrToStr(txn.assetReserve))
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
      expect(txn.assetMetadataHash).toHaveLength(32);
    });

    it(
    'returns `Transaction` object with given data for a asset configuration (destroy) transaction',
    () => {
      const txn = tdp.createTxnFromData(
        {
          type: TransactionType.acfg,
          snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
          note: 'Hello world',
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          rekey: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
          caid: 88888888,
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(TransactionType.acfg);
      expect(addrToStr(txn.from))
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee).toBe(1000);
      expect(txn.firstRound).toBe(6000000);
      expect(txn.lastRound).toBe(6001000);
      expect(txn.lease).toHaveLength(32);
      expect(addrToStr(txn.reKeyTo))
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');

      expect(txn.assetIndex).toBe(88888888);
    });

    it('returns `Transaction` object with given data for a asset configuration (reconfiguration)'
    + ' transaction',
    () => {
      const txn = tdp.createTxnFromData(
        {
          type: TransactionType.acfg,
          snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
          note: 'Hello world',
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          rekey: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
          caid: 88888888,
          apar_m: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
          apar_f: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
          apar_c: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
          apar_r: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(TransactionType.acfg);
      expect(addrToStr(txn.from))
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee).toBe(1000);
      expect(txn.firstRound).toBe(6000000);
      expect(txn.lastRound).toBe(6001000);
      expect(txn.lease).toHaveLength(32);
      expect(addrToStr(txn.reKeyTo))
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
      expect(txn.assetIndex).toBe(88888888);
      expect(addrToStr(txn.assetManager))
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
      expect(addrToStr(txn.assetFreeze))
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
      expect(addrToStr(txn.assetClawback))
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
      expect(addrToStr(txn.assetReserve))
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
    });

    it('returns `Transaction` object with given data for a asset freeze transaction', () => {
      const txn = tdp.createTxnFromData(
        {
          type: TransactionType.afrz,
          snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
          note: 'Hello world',
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          rekey: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
          faid: 88888888,
          fadd: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
          afrz: true,
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(TransactionType.afrz);

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee).toBe(1000);
      expect(txn.firstRound).toBe(6000000);
      expect(txn.lastRound).toBe(6001000);
      expect(txn.lease).toHaveLength(32);
      expect(addrToStr(txn.reKeyTo))
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
      expect(txn.assetIndex).toBe(88888888);
      expect(addrToStr(txn.freezeAccount))
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
      expect(txn.freezeState).toBe(true);
    });

    it('returns `Transaction` object with given data for a key registration (online) transaction',
    () => {
      const txn = tdp.createTxnFromData(
        {
          type: TransactionType.keyreg,
          snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
          note: 'Hello world',
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          votekey: 'G/lqTV6MKspW6J8wH2d8ZliZ5XZVZsruqSBJMwLwlmo=',
          selkey: 'LrpLhvzr+QpN/bivh6IPpOaKGbGzTTB5lJtVfixmmgk=',
          // eslint-disable-next-line max-len
          sprfkey: 'RpUpNWfZMjZ1zOOjv3MF2tjO714jsBt0GKnNsw0ihJ4HSZwci+d9zvUi3i67LwFUJgjQ5Dz4zZgHgGduElnmSA==',
          votefst: 6000000,
          votelst: 6100000,
          votekd: 1730,
          nonpart: false,
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(TransactionType.keyreg);

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee).toBe(1000);
      expect(txn.firstRound).toBe(6000000);
      expect(txn.lastRound).toBe(6001000);
      expect(txn.lease).toHaveLength(32);
      expect(txn.voteKey.toString('base64')).toBe('G/lqTV6MKspW6J8wH2d8ZliZ5XZVZsruqSBJMwLwlmo=');
      expect(txn.selectionKey.toString('base64'))
        .toBe('LrpLhvzr+QpN/bivh6IPpOaKGbGzTTB5lJtVfixmmgk=');
      expect(txn.stateProofKey.toString('base64')).toBe(
        'RpUpNWfZMjZ1zOOjv3MF2tjO714jsBt0GKnNsw0ihJ4HSZwci+d9zvUi3i67LwFUJgjQ5Dz4zZgHgGduElnmSA=='
      );
      expect(txn.voteFirst).toBe(6000000);
      expect(txn.voteLast).toBe(6100000);
      expect(txn.voteKeyDilution).toBe(1730);
      expect(txn.nonParticipation).toBe(false);
    });

    it('returns `Transaction` object with given data for a key registration (offline) transaction',
    () => {
      const txn = tdp.createTxnFromData(
        {
          type: TransactionType.keyreg,
          snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
          note: 'Hello world',
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          votekey: '',
          selkey: '',
          // eslint-disable-next-line max-len
          sprfkey: '',
          nonpart: false,
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(TransactionType.keyreg);

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee).toBe(1000);
      expect(txn.firstRound).toBe(6000000);
      expect(txn.lastRound).toBe(6001000);
      expect(txn.lease).toHaveLength(32);
      expect(txn.voteKey).toBeUndefined();
      expect(txn.selectionKey).toBeUndefined();
      expect(txn.stateProofKey).toBeUndefined();
      expect(txn.voteFirst).toBeUndefined();
      expect(txn.voteLast).toBeUndefined();
      expect(txn.voteKeyDilution).toBeUndefined();
      expect(txn.nonParticipation).toBe(false);
    });

    it('returns `Transaction` object with given data for a key registration (nonparticipating)'
    +' transaction',
    () => {
      const txn = tdp.createTxnFromData(
        {
          type: TransactionType.keyreg,
          snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
          note: 'Hello world',
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          votekey: '',
          selkey: '',
          // eslint-disable-next-line max-len
          sprfkey: '',
          nonpart: true,
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(TransactionType.keyreg);

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee).toBe(1000);
      expect(txn.firstRound).toBe(6000000);
      expect(txn.lastRound).toBe(6001000);
      expect(txn.lease).toHaveLength(32);
      expect(txn.voteKey).toBeUndefined();
      expect(txn.selectionKey).toBeUndefined();
      expect(txn.stateProofKey).toBeUndefined();
      expect(txn.voteFirst).toBeUndefined();
      expect(txn.voteLast).toBeUndefined();
      expect(txn.voteKeyDilution).toBeUndefined();
      expect(txn.nonParticipation).toBe(true);
    });

  });
});

/** Converts an Address object to a string */
function addrToStr(addr?: Address) {
  if (!addr) return undefined;
  return encodeAddress(addr.publicKey);
}
