import '@testing-library/jest-dom';
import { type Address, TransactionType, encodeAddress } from 'algosdk';
import * as tdp from './TxnDataProcessor';

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
      expect(addrToStr(txn.to)).toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
      expect(txn.amount).toBe(5000000);
      expect(txn.lease).toHaveLength(32);
      expect(addrToStr(txn.reKeyTo))
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
      expect(addrToStr(txn.closeRemainderTo))
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
    });

  });
});

/** Converts an Address object to a string */
function addrToStr(addr?: Address) {
  if (!addr) return undefined;
  return encodeAddress(addr.publicKey);
}
