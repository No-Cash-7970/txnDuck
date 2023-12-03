import '@testing-library/jest-dom';
import { type Address, TransactionType, encodeAddress, OnApplicationComplete } from 'algosdk';
import * as processor from './processor';

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
      const txn = processor.createTxnFromData(
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
      const txn = processor.createTxnFromData(
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

    it('returns `Transaction` object with given data for a asset configuration (creation)'
    + ' transaction',
    () => {
      const txn = processor.createTxnFromData(
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

    it('returns `Transaction` object with given data for a asset configuration (destroy)'
    + ' transaction',
    () => {
      const txn = processor.createTxnFromData(
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
      const txn = processor.createTxnFromData(
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
      const txn = processor.createTxnFromData(
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
      const txn = processor.createTxnFromData(
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
      const txn = processor.createTxnFromData(
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
      const txn = processor.createTxnFromData(
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

    it('returns `Transaction` object with given data for a application call (create) transaction',
    () => {
      const txn = processor.createTxnFromData(
        {
          type: TransactionType.appl,
          snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
          note: 'Hello world',
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          apap: 'BYEB',
          apsu: 'BYEB',
          apgs_nui: 1,
          apgs_nbs: 2,
          apls_nui: 3,
          apls_nbs: 4,
          apep: 1,
          apaa: ['foo', '42', ''],
          apat: ['GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'],
          apfa: [11111111, 22222222],
          apas: [33333333, 44444444, 55555555],
          apbx: [{i: 2, n: 'Box 1' }, {i: 99999999, n: 'Boxy box' }],
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(TransactionType.appl);

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee).toBe(1000);
      expect(txn.firstRound).toBe(6000000);
      expect(txn.lastRound).toBe(6001000);
      expect(txn.lease).toHaveLength(32);
      expect(txn.appApprovalProgram.toString()).toBe('66,89,69,66');
      expect(txn.appClearProgram.toString()).toBe('66,89,69,66');
      expect(txn.appGlobalInts).toBe(1);
      expect(txn.appGlobalByteSlices).toBe(2);
      expect(txn.appLocalInts).toBe(3);
      expect(txn.appLocalByteSlices).toBe(4);
      expect(txn.extraPages).toBe(1);
      expect(txn.appArgs).toHaveLength(3);
      expect(txn.appAccounts).toHaveLength(1);
      expect(txn.appForeignApps).toHaveLength(2);
      expect(txn.appForeignAssets).toHaveLength(3);
      expect(txn.boxes).toHaveLength(2);
    });

    it('returns `Transaction` object with given data for a application call (update) transaction',
    () => {
      const txn = processor.createTxnFromData(
        {
          type: TransactionType.appl,
          snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
          note: 'Hello world',
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          apan: OnApplicationComplete.UpdateApplicationOC,
          apid: 88888888,
          apap: 'BYEB',
          apsu: 'BYEB',
          apaa: ['foo', '42', ''],
          apat: ['GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'],
          apfa: [11111111, 22222222],
          apas: [33333333, 44444444, 55555555],
          apbx: [{i: 2, n: 'Box 1' }, {i: 99999999, n: 'Boxy box' }],
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(TransactionType.appl);

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee).toBe(1000);
      expect(txn.firstRound).toBe(6000000);
      expect(txn.lastRound).toBe(6001000);
      expect(txn.lease).toHaveLength(32);
      expect(txn.appOnComplete).toBe(OnApplicationComplete.UpdateApplicationOC);
      expect(txn.appIndex).toBe(88888888);
      expect(txn.appApprovalProgram.toString()).toBe('66,89,69,66');
      expect(txn.appClearProgram.toString()).toBe('66,89,69,66');
      expect(txn.appArgs).toHaveLength(3);
      expect(txn.appAccounts).toHaveLength(1);
      expect(txn.appForeignApps).toHaveLength(2);
      expect(txn.appForeignAssets).toHaveLength(3);
      expect(txn.boxes).toHaveLength(2);
    });

    it('returns `Transaction` object with given data for a application call (delete) transaction',
    () => {
      const txn = processor.createTxnFromData(
        {
          type: TransactionType.appl,
          snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
          note: 'Hello world',
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          apan: OnApplicationComplete.DeleteApplicationOC,
          apid: 88888888,
          apaa: ['foo', '42', ''],
          apat: ['GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'],
          apfa: [11111111, 22222222],
          apas: [33333333, 44444444, 55555555],
          apbx: [{i: 2, n: 'Box 1' }, {i: 99999999, n: 'Boxy box' }],
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(TransactionType.appl);

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee).toBe(1000);
      expect(txn.firstRound).toBe(6000000);
      expect(txn.lastRound).toBe(6001000);
      expect(txn.lease).toHaveLength(32);
      expect(txn.appOnComplete).toBe(OnApplicationComplete.DeleteApplicationOC);
      expect(txn.appIndex).toBe(88888888);
    });

    it('returns `Transaction` object with given data for a application call (opt-in) transaction',
    () => {
      const txn = processor.createTxnFromData(
        {
          type: TransactionType.appl,
          snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
          note: 'Hello world',
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          apan: OnApplicationComplete.OptInOC,
          apid: 88888888,
          apaa: ['foo', '42', ''],
          apat: ['GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'],
          apfa: [11111111, 22222222],
          apas: [33333333, 44444444, 55555555],
          apbx: [{i: 2, n: 'Box 1' }, {i: 99999999, n: 'Boxy box' }],
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(TransactionType.appl);

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee).toBe(1000);
      expect(txn.firstRound).toBe(6000000);
      expect(txn.lastRound).toBe(6001000);
      expect(txn.lease).toHaveLength(32);
      expect(txn.appOnComplete).toBe(OnApplicationComplete.OptInOC);
      expect(txn.appIndex).toBe(88888888);
    });

    it('returns `Transaction` object with given data for a application call (close out)'
    + ' transaction',
    () => {
      const txn = processor.createTxnFromData(
        {
          type: TransactionType.appl,
          snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
          note: 'Hello world',
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          apan: OnApplicationComplete.CloseOutOC,
          apid: 88888888,
          apaa: ['foo', '42', ''],
          apat: ['GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'],
          apfa: [11111111, 22222222],
          apas: [33333333, 44444444, 55555555],
          apbx: [{i: 2, n: 'Box 1' }, {i: 99999999, n: 'Boxy box' }],
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(TransactionType.appl);

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee).toBe(1000);
      expect(txn.firstRound).toBe(6000000);
      expect(txn.lastRound).toBe(6001000);
      expect(txn.lease).toHaveLength(32);
      expect(txn.appOnComplete).toBe(OnApplicationComplete.CloseOutOC);
      expect(txn.appIndex).toBe(88888888);
    });

    it('returns `Transaction` object with given data for a application call (clear state)'
    +' transaction',
    () => {
      const txn = processor.createTxnFromData(
        {
          type: TransactionType.appl,
          snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
          note: 'Hello world',
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          apan: OnApplicationComplete.ClearStateOC,
          apid: 88888888,
          apaa: ['foo', '42', ''],
          apat: ['GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'],
          apfa: [11111111, 22222222],
          apas: [33333333, 44444444, 55555555],
          apbx: [{i: 2, n: 'Box 1' }, {i: 99999999, n: 'Boxy box' }],
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(TransactionType.appl);

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee).toBe(1000);
      expect(txn.firstRound).toBe(6000000);
      expect(txn.lastRound).toBe(6001000);
      expect(txn.lease).toHaveLength(32);
      expect(txn.appOnComplete).toBe(OnApplicationComplete.ClearStateOC);
      expect(txn.appIndex).toBe(88888888);
      expect(txn.appArgs).toHaveLength(3);
      expect(txn.appAccounts).toHaveLength(1);
      expect(txn.appForeignApps).toHaveLength(2);
      expect(txn.appForeignAssets).toHaveLength(3);
      expect(txn.boxes).toHaveLength(2);
    });

    it('returns `Transaction` object with given data for a application call (no-op call)'
    + ' transaction',
    () => {
      const txn = processor.createTxnFromData(
        {
          type: TransactionType.appl,
          snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
          note: 'Hello world',
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          apan: OnApplicationComplete.NoOpOC,
          apid: 88888888,
          apaa: ['foo', '42', ''],
          apat: ['GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'],
          apfa: [11111111, 22222222],
          apas: [33333333, 44444444, 55555555],
          apbx: [{i: 2, n: 'Box 1' }, {i: 99999999, n: 'Boxy box' }],
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(TransactionType.appl);

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee).toBe(1000);
      expect(txn.firstRound).toBe(6000000);
      expect(txn.lastRound).toBe(6001000);
      expect(txn.lease).toHaveLength(32);
      expect(txn.appOnComplete).toBe(OnApplicationComplete.NoOpOC);
      expect(txn.appIndex).toBe(88888888);
    });

  });
});

/** Converts an Address object to a string */
function addrToStr(addr?: Address) {
  if (!addr) return undefined;
  return encodeAddress(addr.publicKey);
}
