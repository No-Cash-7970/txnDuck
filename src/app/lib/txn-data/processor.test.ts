import '@testing-library/jest-dom';
import algosdk from 'algosdkv3';
import { getAppArgsForTransaction } from '@algorandfoundation/algokit-utils';
import * as processor from './processor';

describe('Transaction Data Processor', () => {
  describe('createTxnFromData()', () => {

    it('returns `Transaction` object with given data for a payment transaction', () => {
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.pay,
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

      expect(txn.type).toBe(algosdk.TransactionType.pay);
      expect(txn.sender.toString())
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(txn.lease).toHaveLength(32);
      expect(txn.rekeyTo?.toString())
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
      expect(txn.payment?.receiver.toString())
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
      expect(txn.payment?.amount.toString()).toBe('5000000');
      expect(txn.payment?.closeRemainderTo?.toString())
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
    });

    // eslint-disable-next-line max-len
    it('returns `Transaction` object with given data for a payment transaction with byte array properties',
    () => {
      const textEncoder = new TextEncoder;
      const textDecoder = new TextDecoder;
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.pay,
          snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
          note: textEncoder.encode('Hello world'), // byte array
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          rcv: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
          amt: 5,
          lx: textEncoder.encode('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'), // byte array
          rekey: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
          close: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(algosdk.TransactionType.pay);
      expect(txn.sender.toString())
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
      expect(textDecoder.decode(txn.note)).toBe('Hello world');
      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(textDecoder.decode(txn.lease)).toBe('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
      expect(txn.rekeyTo?.toString())
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
      expect(txn.payment?.receiver.toString())
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
      expect(txn.payment?.amount.toString()).toBe('5000000');
      expect(txn.payment?.closeRemainderTo?.toString())
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
    });

    it('returns `Transaction` object with given data for a asset transfer transaction', () => {
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.axfer,
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

      expect(txn.type).toBe(algosdk.TransactionType.axfer);
      expect(txn.sender.toString())
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(txn.lease).toHaveLength(32);
      expect(txn.rekeyTo?.toString())
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
      expect(txn.assetTransfer?.assetSender?.toString())
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
      expect(txn.assetTransfer?.receiver.toString())
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
      expect(txn.assetTransfer?.assetIndex.toString()).toBe('88888888');
      expect(txn.assetTransfer?.amount.toString()).toBe('500');
      expect(txn.assetTransfer?.closeRemainderTo?.toString())
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
    });

    // eslint-disable-next-line max-len
    it('returns `Transaction` object with given data for a asset transfer transaction with byte array properties',
    () => {
      const textEncoder = new TextEncoder;
      const textDecoder = new TextDecoder;
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.axfer,
          snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
          note: textEncoder.encode('Hello world'), // byte array
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: textEncoder.encode('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'), // byte array
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

      expect(txn.type).toBe(algosdk.TransactionType.axfer);
      expect(txn.sender.toString())
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
      expect(textDecoder.decode(txn.note)).toBe('Hello world');
      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(textDecoder.decode(txn.lease)).toBe('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
      expect(txn.rekeyTo?.toString())
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
      expect(txn.assetTransfer?.assetSender?.toString())
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
      expect(txn.assetTransfer?.receiver.toString())
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
      expect(txn.assetTransfer?.assetIndex.toString()).toBe('88888888');
      expect(txn.assetTransfer?.amount.toString()).toBe('500');
      expect(txn.assetTransfer?.closeRemainderTo?.toString())
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
    });

    // eslint-disable-next-line max-len
    it('returns `Transaction` object with given data for a asset configuration (creation) transaction',
    () => {
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.acfg,
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

      expect(txn.type).toBe(algosdk.TransactionType.acfg);
      expect(txn.sender.toString())
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(txn.lease).toHaveLength(32);
      expect(txn.rekeyTo?.toString())
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
      expect(txn.assetConfig?.unitName).toBe('FAKE');
      expect(txn.assetConfig?.assetName).toBe('Fake Token');
      expect(txn.assetConfig?.total.toString()).toBe('10000000');
      expect(txn.assetConfig?.decimals).toBe(5);
      expect(txn.assetConfig?.defaultFrozen).toBe(true);
      expect(txn.assetConfig?.assetURL).toBe('https://fake.token');
      expect(txn.assetConfig?.manager?.toString())
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
      expect(txn.assetConfig?.freeze?.toString())
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
      expect(txn.assetConfig?.clawback?.toString())
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
      expect(txn.assetConfig?.reserve?.toString())
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
      expect(txn.assetConfig?.assetMetadataHash).toHaveLength(32);
    });

    // eslint-disable-next-line max-len
    it('returns `Transaction` object with given data for a asset configuration (creation) transaction with byte array properties',
    () => {
      const textEncoder = new TextEncoder;
      const textDecoder = new TextDecoder;
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.acfg,
          snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
          note: textEncoder.encode('Hello world'), // byte array
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: textEncoder.encode('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'), // byte array
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
          apar_am: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(algosdk.TransactionType.acfg);
      expect(txn.sender.toString())
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
      expect(textDecoder.decode(txn.note)).toBe('Hello world');
      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(textDecoder.decode(txn.lease)).toBe('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
      expect(txn.rekeyTo?.toString())
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
      expect(txn.assetConfig?.unitName).toBe('FAKE');
      expect(txn.assetConfig?.assetName).toBe('Fake Token');
      expect(txn.assetConfig?.total.toString()).toBe('10000000');
      expect(txn.assetConfig?.decimals).toBe(5);
      expect(txn.assetConfig?.defaultFrozen).toBe(true);
      expect(txn.assetConfig?.assetURL).toBe('https://fake.token');
      expect(txn.assetConfig?.manager?.toString())
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
      expect(txn.assetConfig?.freeze?.toString())
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
      expect(txn.assetConfig?.clawback?.toString())
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
      expect(txn.assetConfig?.reserve?.toString())
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
      expect(textDecoder.decode(txn.assetConfig?.assetMetadataHash))
        .toBe('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB');
    });

    // eslint-disable-next-line max-len
    it('returns `Transaction` object with given data for a asset configuration (destroy) transaction',
    () => {
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.acfg,
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

      expect(txn.type).toBe(algosdk.TransactionType.acfg);
      expect(txn.sender.toString())
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(txn.lease).toHaveLength(32);
      expect(txn.rekeyTo?.toString())
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');

      expect(txn.assetConfig?.assetIndex.toString()).toBe('88888888');
    });

    // eslint-disable-next-line max-len
    it('returns `Transaction` object with given data for a asset configuration (destroy) transaction with byte array properties',
    () => {
      const textEncoder = new TextEncoder;
      const textDecoder = new TextDecoder;
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.acfg,
          snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
          note: textEncoder.encode('Hello world'), // byte array
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: textEncoder.encode('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'), // byte array
          rekey: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
          caid: 88888888,
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(algosdk.TransactionType.acfg);
      expect(txn.sender.toString())
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
      expect(textDecoder.decode(txn.note)).toBe('Hello world');
      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(textDecoder.decode(txn.lease)).toBe('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
      expect(txn.rekeyTo?.toString())
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');

      expect(txn.assetConfig?.assetIndex.toString()).toBe('88888888');
    });

    // eslint-disable-next-line max-len
    it('returns `Transaction` object with given data for a asset configuration (reconfiguration) transaction',
    () => {
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.acfg,
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

      expect(txn.type).toBe(algosdk.TransactionType.acfg);
      expect(txn.sender.toString())
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(txn.lease).toHaveLength(32);
      expect(txn.rekeyTo?.toString())
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
      expect(txn.assetConfig?.assetIndex.toString()).toBe('88888888');
      expect(txn.assetConfig?.manager?.toString())
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
      expect(txn.assetConfig?.freeze?.toString())
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
      expect(txn.assetConfig?.clawback?.toString())
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
      expect(txn.assetConfig?.reserve?.toString())
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
    });

    // eslint-disable-next-line max-len
    it('returns `Transaction` object with given data for a asset configuration (reconfiguration) transaction with byte array properties',
    () => {
      const textEncoder = new TextEncoder;
      const textDecoder = new TextDecoder;
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.acfg,
          snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
          note: textEncoder.encode('Hello world'), // byte array
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: textEncoder.encode('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'), // byte array
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

      expect(txn.type).toBe(algosdk.TransactionType.acfg);
      expect(txn.sender.toString())
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
      expect(textDecoder.decode(txn.note)).toBe('Hello world');
      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(textDecoder.decode(txn.lease)).toBe('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
      expect(txn.rekeyTo?.toString())
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
      expect(txn.assetConfig?.assetIndex.toString()).toBe('88888888');
      expect(txn.assetConfig?.manager?.toString())
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
      expect(txn.assetConfig?.freeze?.toString())
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
      expect(txn.assetConfig?.clawback?.toString())
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
      expect(txn.assetConfig?.reserve?.toString())
        .toBe('EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4');
    });

    it('returns `Transaction` object with given data for a asset freeze transaction', () => {
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.afrz,
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

      expect(txn.type).toBe(algosdk.TransactionType.afrz);

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(txn.lease).toHaveLength(32);
      expect(txn.rekeyTo?.toString())
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
      expect(txn.assetFreeze?.assetIndex.toString()).toBe('88888888');
      expect(txn.assetFreeze?.freezeAccount?.toString())
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
      expect(txn.assetFreeze?.frozen).toBe(true);
    });

    // eslint-disable-next-line max-len
    it('returns `Transaction` object with given data for a asset freeze transaction with byte array properties',
    () => {
      const textEncoder = new TextEncoder;
      const textDecoder = new TextDecoder;
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.afrz,
          snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
          note: textEncoder.encode('Hello world'), // byte array
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: textEncoder.encode('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'), // byte array
          rekey: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
          faid: 88888888,
          fadd: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
          afrz: true,
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(algosdk.TransactionType.afrz);
      expect(textDecoder.decode(txn.note)).toBe('Hello world');
      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(textDecoder.decode(txn.lease)).toBe('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
      expect(txn.rekeyTo?.toString())
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
      expect(txn.assetFreeze?.assetIndex.toString()).toBe('88888888');
      expect(txn.assetFreeze?.freezeAccount?.toString())
        .toBe('GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A');
      expect(txn.assetFreeze?.frozen).toBe(true);
    });

    it('returns `Transaction` object with given data for a key registration (online) transaction',
    () => {
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.keyreg,
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

      expect(txn.type).toBe(algosdk.TransactionType.keyreg);

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(txn.lease).toHaveLength(32);
      expect(algosdk.bytesToBase64(txn.keyreg?.voteKey ?? new Uint8Array))
        .toBe('G/lqTV6MKspW6J8wH2d8ZliZ5XZVZsruqSBJMwLwlmo=');
      expect(algosdk.bytesToBase64(txn.keyreg?.selectionKey ?? new Uint8Array))
        .toBe('LrpLhvzr+QpN/bivh6IPpOaKGbGzTTB5lJtVfixmmgk=');
      expect(algosdk.bytesToBase64(txn.keyreg?.stateProofKey ?? new Uint8Array)).toBe(
        'RpUpNWfZMjZ1zOOjv3MF2tjO714jsBt0GKnNsw0ihJ4HSZwci+d9zvUi3i67LwFUJgjQ5Dz4zZgHgGduElnmSA=='
      );
      expect(txn.keyreg?.voteFirst?.toString()).toBe('6000000');
      expect(txn.keyreg?.voteLast?.toString()).toBe('6100000');
      expect(txn.keyreg?.voteKeyDilution?.toString()).toBe('1730');
      expect(txn.keyreg?.nonParticipation).toBe(false);
    });

    // eslint-disable-next-line max-len
    it('returns `Transaction` object with given data for a key registration (online) transaction with byte array properties',
    () => {
      const textEncoder = new TextEncoder;
      const textDecoder = new TextDecoder;
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.keyreg,
          snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
          note: textEncoder.encode('Hello world'), // byte array
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: textEncoder.encode('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'), // byte array
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

      expect(txn.type).toBe(algosdk.TransactionType.keyreg);
      expect(textDecoder.decode(txn.note)).toBe('Hello world');
      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(textDecoder.decode(txn.lease)).toBe('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
      expect(algosdk.bytesToBase64(txn.keyreg?.voteKey ?? new Uint8Array))
        .toBe('G/lqTV6MKspW6J8wH2d8ZliZ5XZVZsruqSBJMwLwlmo=');
      expect(algosdk.bytesToBase64(txn.keyreg?.selectionKey ?? new Uint8Array))
        .toBe('LrpLhvzr+QpN/bivh6IPpOaKGbGzTTB5lJtVfixmmgk=');
      expect(algosdk.bytesToBase64(txn.keyreg?.stateProofKey ?? new Uint8Array)).toBe(
        'RpUpNWfZMjZ1zOOjv3MF2tjO714jsBt0GKnNsw0ihJ4HSZwci+d9zvUi3i67LwFUJgjQ5Dz4zZgHgGduElnmSA=='
      );
      expect(txn.keyreg?.voteFirst?.toString()).toBe('6000000');
      expect(txn.keyreg?.voteLast?.toString()).toBe('6100000');
      expect(txn.keyreg?.voteKeyDilution?.toString()).toBe('1730');
      expect(txn.keyreg?.nonParticipation).toBe(false);
    });

    it('returns `Transaction` object with given data for a key registration (offline) transaction',
    () => {
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.keyreg,
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

      expect(txn.type).toBe(algosdk.TransactionType.keyreg);

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(txn.lease).toHaveLength(32);
      expect(txn.keyreg?.voteKey).toBeUndefined();
      expect(txn.keyreg?.selectionKey).toBeUndefined();
      expect(txn.keyreg?.stateProofKey).toBeUndefined();
      expect(txn.keyreg?.voteFirst).toBeUndefined();
      expect(txn.keyreg?.voteLast).toBeUndefined();
      expect(txn.keyreg?.voteKeyDilution).toBeUndefined();
      expect(txn.keyreg?.nonParticipation).toBe(false);
    });

    // eslint-disable-next-line max-len
    it('returns `Transaction` object with given data for a key registration (offline) transaction with byte array properties',
    () => {
      const textEncoder = new TextEncoder;
      const textDecoder = new TextDecoder;
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.keyreg,
          snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
          note: textEncoder.encode('Hello world'), // byte array
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: textEncoder.encode('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'), // byte array
          votekey: '',
          selkey: '',
          // eslint-disable-next-line max-len
          sprfkey: '',
          nonpart: false,
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(algosdk.TransactionType.keyreg);
      expect(textDecoder.decode(txn.note)).toBe('Hello world');
      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(textDecoder.decode(txn.lease)).toBe('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
      expect(txn.keyreg?.voteKey).toBeUndefined();
      expect(txn.keyreg?.selectionKey).toBeUndefined();
      expect(txn.keyreg?.stateProofKey).toBeUndefined();
      expect(txn.keyreg?.voteFirst).toBeUndefined();
      expect(txn.keyreg?.voteLast).toBeUndefined();
      expect(txn.keyreg?.voteKeyDilution).toBeUndefined();
      expect(txn.keyreg?.nonParticipation).toBe(false);
    });

    // eslint-disable-next-line max-len
    it('returns `Transaction` object with given data for a key registration (nonparticipating) transaction',
    () => {
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.keyreg,
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

      expect(txn.type).toBe(algosdk.TransactionType.keyreg);

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(txn.lease).toHaveLength(32);
      expect(txn.keyreg?.voteKey).toBeUndefined();
      expect(txn.keyreg?.selectionKey).toBeUndefined();
      expect(txn.keyreg?.stateProofKey).toBeUndefined();
      expect(txn.keyreg?.voteFirst).toBeUndefined();
      expect(txn.keyreg?.voteLast).toBeUndefined();
      expect(txn.keyreg?.voteKeyDilution).toBeUndefined();
      expect(txn.keyreg?.nonParticipation).toBe(true);
    });

    // eslint-disable-next-line max-len
    it('returns `Transaction` object with given data for a key registration (nonparticipating) transaction with byte array properties',
    () => {
      const textEncoder = new TextEncoder;
      const textDecoder = new TextDecoder;
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.keyreg,
          snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
          note: textEncoder.encode('Hello world'), // byte array
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: textEncoder.encode('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'), // byte array
          votekey: '',
          selkey: '',
          // eslint-disable-next-line max-len
          sprfkey: '',
          nonpart: true,
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(algosdk.TransactionType.keyreg);
      expect(textDecoder.decode(txn.note)).toBe('Hello world');
      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(textDecoder.decode(txn.lease)).toBe('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
      expect(txn.keyreg?.voteKey).toBeUndefined();
      expect(txn.keyreg?.selectionKey).toBeUndefined();
      expect(txn.keyreg?.stateProofKey).toBeUndefined();
      expect(txn.keyreg?.voteFirst).toBeUndefined();
      expect(txn.keyreg?.voteLast).toBeUndefined();
      expect(txn.keyreg?.voteKeyDilution).toBeUndefined();
      expect(txn.keyreg?.nonParticipation).toBe(true);
    });

    it('returns `Transaction` object with given data for a application call (create) transaction',
    () => {
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.appl,
          snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
          note: 'Hello world',
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          apan: algosdk.OnApplicationComplete.NoOpOC,
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
          apbx: [{i: 2, n: 'Box 1' }, {i: 1, n: 'Boxy box' }],
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(algosdk.TransactionType.appl);

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(txn.lease).toHaveLength(32);
      expect(txn.applicationCall?.approvalProgram.toString()).toBe('66,89,69,66');
      expect(txn.applicationCall?.clearProgram.toString()).toBe('66,89,69,66');
      expect(txn.applicationCall?.numGlobalInts).toBe(1);
      expect(txn.applicationCall?.numGlobalByteSlices).toBe(2);
      expect(txn.applicationCall?.numLocalInts).toBe(3);
      expect(txn.applicationCall?.numLocalByteSlices).toBe(4);
      expect(txn.applicationCall?.extraPages).toBe(1);
      expect(txn.applicationCall?.appArgs).toHaveLength(3);
      expect(txn.applicationCall?.accounts).toHaveLength(1);
      expect(txn.applicationCall?.foreignApps).toHaveLength(2);
      expect(txn.applicationCall?.foreignAssets).toHaveLength(3);
      expect(txn.applicationCall?.boxes).toHaveLength(2);
    });

    // eslint-disable-next-line max-len
    it('returns `Transaction` object with given data for a application call (create) transaction with byte array properties',
    () => {
      const textEncoder = new TextEncoder;
      const textDecoder = new TextDecoder;
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.appl,
          snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
          note: textEncoder.encode('Hello world'), // byte array
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: textEncoder.encode('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'), // byte array
          apan: algosdk.OnApplicationComplete.NoOpOC,
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
          apbx: [{i: 2, n: 'Box 1' }, {i: 1, n: 'Boxy box' }],
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(algosdk.TransactionType.appl);
      expect(textDecoder.decode(txn.note)).toBe('Hello world');
      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(textDecoder.decode(txn.lease)).toBe('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
      expect(txn.applicationCall?.approvalProgram.toString()).toBe('66,89,69,66');
      expect(txn.applicationCall?.clearProgram.toString()).toBe('66,89,69,66');
      expect(txn.applicationCall?.numGlobalInts).toBe(1);
      expect(txn.applicationCall?.numGlobalByteSlices).toBe(2);
      expect(txn.applicationCall?.numLocalInts).toBe(3);
      expect(txn.applicationCall?.numLocalByteSlices).toBe(4);
      expect(txn.applicationCall?.extraPages).toBe(1);
      expect(txn.applicationCall?.appArgs).toHaveLength(3);
      expect(txn.applicationCall?.accounts).toHaveLength(1);
      expect(txn.applicationCall?.foreignApps).toHaveLength(2);
      expect(txn.applicationCall?.foreignAssets).toHaveLength(3);
      expect(txn.applicationCall?.boxes).toHaveLength(2);
    });

    it('returns `Transaction` object with given data for a application call (update) transaction',
    () => {
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.appl,
          snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
          note: 'Hello world',
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          apan: algosdk.OnApplicationComplete.UpdateApplicationOC,
          apid: 88888888,
          apap: 'BYEB',
          apsu: 'BYEB',
          apaa: ['foo', '42', ''],
          apat: ['GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'],
          apfa: [11111111, 22222222],
          apas: [33333333, 44444444, 55555555],
          apbx: [{i: 2, n: 'Box 1' }, {i: 1, n: 'Boxy box' }],
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(algosdk.TransactionType.appl);

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(txn.lease).toHaveLength(32);
      expect(txn.applicationCall?.onComplete)
        .toBe(algosdk.OnApplicationComplete.UpdateApplicationOC);
      expect(txn.applicationCall?.appIndex.toString()).toBe('88888888');
      expect(txn.applicationCall?.approvalProgram.toString()).toBe('66,89,69,66');
      expect(txn.applicationCall?.clearProgram.toString()).toBe('66,89,69,66');
      expect(txn.applicationCall?.appArgs).toHaveLength(3);
      expect(txn.applicationCall?.accounts).toHaveLength(1);
      expect(txn.applicationCall?.foreignApps).toHaveLength(2);
      expect(txn.applicationCall?.foreignAssets).toHaveLength(3);
      expect(txn.applicationCall?.boxes).toHaveLength(2);
    });

    // eslint-disable-next-line max-len
    it('returns `Transaction` object with given data for a application call (update) transaction with byte array properties',
    () => {
      const textEncoder = new TextEncoder;
      const textDecoder = new TextDecoder;
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.appl,
          snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
          note: textEncoder.encode('Hello world'), // byte array
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: textEncoder.encode('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'), // byte array
          apan: algosdk.OnApplicationComplete.UpdateApplicationOC,
          apid: 88888888,
          apap: 'BYEB',
          apsu: 'BYEB',
          apaa: ['foo', '42', ''],
          apat: ['GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'],
          apfa: [11111111, 22222222],
          apas: [33333333, 44444444, 55555555],
          apbx: [{i: 2, n: 'Box 1' }, {i: 1, n: 'Boxy box' }],
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(algosdk.TransactionType.appl);
      expect(textDecoder.decode(txn.note)).toBe('Hello world');
      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(textDecoder.decode(txn.lease)).toBe('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
      expect(txn.applicationCall?.onComplete)
        .toBe(algosdk.OnApplicationComplete.UpdateApplicationOC);
      expect(txn.applicationCall?.appIndex.toString()).toBe('88888888');
      expect(txn.applicationCall?.approvalProgram.toString()).toBe('66,89,69,66');
      expect(txn.applicationCall?.clearProgram.toString()).toBe('66,89,69,66');
      expect(txn.applicationCall?.appArgs).toHaveLength(3);
      expect(txn.applicationCall?.accounts).toHaveLength(1);
      expect(txn.applicationCall?.foreignApps).toHaveLength(2);
      expect(txn.applicationCall?.foreignAssets).toHaveLength(3);
      expect(txn.applicationCall?.boxes).toHaveLength(2);
    });

    it('returns `Transaction` object with given data for a application call (delete) transaction',
    () => {
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.appl,
          snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
          note: 'Hello world',
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          apan: algosdk.OnApplicationComplete.DeleteApplicationOC,
          apid: 88888888,
          apaa: ['foo', '42', ''],
          apat: ['GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'],
          apfa: [11111111, 22222222],
          apas: [33333333, 44444444, 55555555],
          apbx: [{i: 2, n: 'Box 1' }, {i: 1, n: 'Boxy box' }],
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(algosdk.TransactionType.appl);

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(txn.lease).toHaveLength(32);
      expect(txn.applicationCall?.onComplete)
        .toBe(algosdk.OnApplicationComplete.DeleteApplicationOC);
      expect(txn.applicationCall?.appIndex.toString()).toBe('88888888');
    });

    // eslint-disable-next-line max-len
    it('returns `Transaction` object with given data for a application call (delete) transaction with byte array properties',
    () => {
      const textEncoder = new TextEncoder;
      const textDecoder = new TextDecoder;
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.appl,
          snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
          note: textEncoder.encode('Hello world'), // byte array
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: textEncoder.encode('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'), // byte array
          apan: algosdk.OnApplicationComplete.DeleteApplicationOC,
          apid: 88888888,
          apaa: ['foo', '42', ''],
          apat: ['GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'],
          apfa: [11111111, 22222222],
          apas: [33333333, 44444444, 55555555],
          apbx: [{i: 2, n: 'Box 1' }, {i: 1, n: 'Boxy box' }],
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(algosdk.TransactionType.appl);
      expect(textDecoder.decode(txn.note)).toBe('Hello world');
      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(textDecoder.decode(txn.lease)).toBe('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
      expect(txn.applicationCall?.onComplete)
        .toBe(algosdk.OnApplicationComplete.DeleteApplicationOC);
      expect(txn.applicationCall?.appIndex.toString()).toBe('88888888');
    });

    it('returns `Transaction` object with given data for a application call (opt-in) transaction',
    () => {
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.appl,
          snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
          note: 'Hello world',
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          apan: algosdk.OnApplicationComplete.OptInOC,
          apid: 88888888,
          apaa: ['foo', '42', ''],
          apat: ['GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'],
          apfa: [11111111, 22222222],
          apas: [33333333, 44444444, 55555555],
          apbx: [{i: 2, n: 'Box 1' }, {i: 1, n: 'Boxy box' }],
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(algosdk.TransactionType.appl);

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(txn.lease).toHaveLength(32);
      expect(txn.applicationCall?.onComplete).toBe(algosdk.OnApplicationComplete.OptInOC);
      expect(txn.applicationCall?.appIndex.toString()).toBe('88888888');
    });

    // eslint-disable-next-line max-len
    it('returns `Transaction` object with given data for a application call (opt-in) transaction with byte array properties',
    () => {
      const textEncoder = new TextEncoder;
      const textDecoder = new TextDecoder;
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.appl,
          snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
          note: textEncoder.encode('Hello world'), // byte array
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: textEncoder.encode('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'), // byte array
          apan: algosdk.OnApplicationComplete.OptInOC,
          apid: 88888888,
          apaa: ['foo', '42', ''],
          apat: ['GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'],
          apfa: [11111111, 22222222],
          apas: [33333333, 44444444, 55555555],
          apbx: [{i: 2, n: 'Box 1' }, {i: 1, n: 'Boxy box' }],
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(algosdk.TransactionType.appl);
      expect(textDecoder.decode(txn.note)).toBe('Hello world');
      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(textDecoder.decode(txn.lease)).toBe('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
      expect(txn.applicationCall?.onComplete).toBe(algosdk.OnApplicationComplete.OptInOC);
      expect(txn.applicationCall?.appIndex.toString()).toBe('88888888');
    });

    // eslint-disable-next-line max-len
    it('returns `Transaction` object with given data for a application call (close out) transaction',
    () => {
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.appl,
          snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
          note: 'Hello world',
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          apan: algosdk.OnApplicationComplete.CloseOutOC,
          apid: 88888888,
          apaa: ['foo', '42', ''],
          apat: ['GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'],
          apfa: [11111111, 22222222],
          apas: [33333333, 44444444, 55555555],
          apbx: [{i: 2, n: 'Box 1' }, {i: 1, n: 'Boxy box' }],
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(algosdk.TransactionType.appl);

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(txn.lease).toHaveLength(32);
      expect(txn.applicationCall?.onComplete).toBe(algosdk.OnApplicationComplete.CloseOutOC);
      expect(txn.applicationCall?.appIndex.toString()).toBe('88888888');
    });

    // eslint-disable-next-line max-len
    it('returns `Transaction` object with given data for a application call (close out) transaction with byte array properties',
    () => {
      const textEncoder = new TextEncoder;
      const textDecoder = new TextDecoder;
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.appl,
          snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
          note: textEncoder.encode('Hello world'), // byte array
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: textEncoder.encode('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'), // byte array
          apan: algosdk.OnApplicationComplete.CloseOutOC,
          apid: 88888888,
          apaa: ['foo', '42', ''],
          apat: ['GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'],
          apfa: [11111111, 22222222],
          apas: [33333333, 44444444, 55555555],
          apbx: [{i: 2, n: 'Box 1' }, {i: 1, n: 'Boxy box' }],
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(algosdk.TransactionType.appl);
      expect(textDecoder.decode(txn.note)).toBe('Hello world');
      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(textDecoder.decode(txn.lease)).toBe('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
      expect(txn.applicationCall?.onComplete).toBe(algosdk.OnApplicationComplete.CloseOutOC);
      expect(txn.applicationCall?.appIndex.toString()).toBe('88888888');
    });

    // eslint-disable-next-line max-len
    it('returns `Transaction` object with given data for a application call (clear state) transaction',
    () => {
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.appl,
          snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
          note: 'Hello world',
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          apan: algosdk.OnApplicationComplete.ClearStateOC,
          apid: 88888888,
          apaa: ['foo', '42', ''],
          apat: ['GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'],
          apfa: [11111111, 22222222],
          apas: [33333333, 44444444, 55555555],
          apbx: [{i: 2, n: 'Box 1' }, {i: 1, n: 'Boxy box' }],
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(algosdk.TransactionType.appl);

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(txn.lease).toHaveLength(32);
      expect(txn.applicationCall?.onComplete).toBe(algosdk.OnApplicationComplete.ClearStateOC);
      expect(txn.applicationCall?.appIndex.toString()).toBe('88888888');
      expect(txn.applicationCall?.appArgs).toHaveLength(3);
      expect(txn.applicationCall?.accounts).toHaveLength(1);
      expect(txn.applicationCall?.foreignApps).toHaveLength(2);
      expect(txn.applicationCall?.foreignAssets).toHaveLength(3);
      expect(txn.applicationCall?.boxes).toHaveLength(2);
    });

    // eslint-disable-next-line max-len
    it('returns `Transaction` object with given data for a application call (clear state) transaction with byte array properties',
    () => {
      const textEncoder = new TextEncoder;
      const textDecoder = new TextDecoder;
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.appl,
          snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
          note: textEncoder.encode('Hello world'), // byte array
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: textEncoder.encode('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'), // byte array
          apan: algosdk.OnApplicationComplete.ClearStateOC,
          apid: 88888888,
          apaa: ['foo', '42', ''],
          apat: ['GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'],
          apfa: [11111111, 22222222],
          apas: [33333333, 44444444, 55555555],
          apbx: [{i: 2, n: 'Box 1' }, {i: 1, n: 'Boxy box' }],
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(algosdk.TransactionType.appl);
      expect(textDecoder.decode(txn.note)).toBe('Hello world');
      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(textDecoder.decode(txn.lease)).toBe('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
      expect(txn.applicationCall?.onComplete).toBe(algosdk.OnApplicationComplete.ClearStateOC);
      expect(txn.applicationCall?.appIndex.toString()).toBe('88888888');
      expect(txn.applicationCall?.appArgs).toHaveLength(3);
      expect(txn.applicationCall?.accounts).toHaveLength(1);
      expect(txn.applicationCall?.foreignApps).toHaveLength(2);
      expect(txn.applicationCall?.foreignAssets).toHaveLength(3);
      expect(txn.applicationCall?.boxes).toHaveLength(2);
    });

    // eslint-disable-next-line max-len
    it('returns `Transaction` object with given data for a application call (no-op call) transaction',
    () => {
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.appl,
          snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
          note: 'Hello world',
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          apan: algosdk.OnApplicationComplete.NoOpOC,
          apid: 88888888,
          apaa: ['foo', '42', ''],
          apat: ['GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'],
          apfa: [11111111, 22222222],
          apas: [33333333, 44444444, 55555555],
          apbx: [{i: 2, n: 'Box 1' }, {i: 1, n: 'Boxy box' }],
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(algosdk.TransactionType.appl);

      const noteText = (new TextDecoder).decode(txn.note);
      expect(noteText).toBe('Hello world');

      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(txn.lease).toHaveLength(32);
      expect(txn.applicationCall?.onComplete).toBe(algosdk.OnApplicationComplete.NoOpOC);
      expect(txn.applicationCall?.appIndex.toString()).toBe('88888888');
    });

    // eslint-disable-next-line max-len
    it('returns `Transaction` object with given data for a application call (no-op call) transaction with byte array properties',
    () => {
      const textEncoder = new TextEncoder;
      const textDecoder = new TextDecoder;
      const txn = processor.createTxnFromData(
        {
          type: algosdk.TransactionType.appl,
          snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
          note: textEncoder.encode('Hello world'), // byte array
          fee: 0.001,
          fv: 6000000,
          lv: 6001000,
          lx: textEncoder.encode('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'), // byte array
          apan: algosdk.OnApplicationComplete.NoOpOC,
          apid: 88888888,
          apaa: ['foo', '42', ''],
          apat: ['GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'],
          apfa: [11111111, 22222222],
          apas: [33333333, 44444444, 55555555],
          apbx: [{i: 2, n: 'Box 1' }, {i: 1, n: 'Boxy box' }],
        },
        'testnet-v1.0',
        'SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=',
      );

      expect(txn.type).toBe(algosdk.TransactionType.appl);
      expect(textDecoder.decode(txn.note)).toBe('Hello world');
      expect(txn.fee.toString()).toBe('1000');
      expect(txn.firstValid.toString()).toBe('6000000');
      expect(txn.lastValid.toString()).toBe('6001000');
      expect(textDecoder.decode(txn.lease)).toBe('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
      expect(txn.applicationCall?.onComplete).toBe(algosdk.OnApplicationComplete.NoOpOC);
      expect(txn.applicationCall?.appIndex.toString()).toBe('88888888');
    });

  });

  describe('createDataFromTxn()', () => {

    it('returns payment transaction data when given a payment transaction', async () => {
      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        sender: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        receiver: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        amount: 5_000_000, // 5 Algos
        note: (new TextEncoder).encode('Hello world'),
        closeRemainderTo: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        suggestedParams: {
          fee: 1000, // 0.001 Algos
          flatFee: true,
          firstValid: 6000000,
          lastValid: 6001000,
          genesisHash: algosdk.base64ToBytes('SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI='),
          genesisID: 'testnet-v1.0',
          minFee: 1000,
        }
      });
      expect(await processor.createDataFromTxn(txn)).toStrictEqual({
        type: 'pay',
        snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        note: 'Hello world',
        fee: 0.001,
        fv: 6000000,
        lv: 6001000,
        rcv: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        amt: 5,
        close: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
      });
    });

    it('returns asset transfer transaction data when given a asset transfer transaction',
    async () => {
      const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        sender: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        receiver: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        assetIndex: 88888888,
        amount: 500,
        closeRemainderTo: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        rekeyTo: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        note: (new TextEncoder).encode('Hello world'),
        suggestedParams: {
          fee: 1000, // 0.001 Algos
          flatFee: true,
          firstValid: 6000000,
          lastValid: 6001000,
          genesisHash: algosdk.base64ToBytes('SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI='),
          genesisID: 'testnet-v1.0',
          minFee: 1000,
        }
      });
      expect(await processor.createDataFromTxn(txn, {b64Note: true})).toStrictEqual({
        type: 'axfer',
        snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        fee: 0.001,
        fv: 6000000,
        lv: 6001000,
        rekey: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        note: 'SGVsbG8gd29ybGQ=',
        arcv: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        xaid: 88888888,
        aamt: '500',
        aclose: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
      });
    });

    it('returns asset configuration transaction data when given a asset configuration transaction',
    async () => {
      const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        sender: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        unitName: 'FAKE',
        assetName: 'Fake Token',
        total: 10000000,
        decimals: 5,
        defaultFrozen: true,
        assetURL: 'https://fake.token',
        manager: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        freeze: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        clawback: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        reserve: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        assetMetadataHash: (new TextEncoder).encode('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'),
        suggestedParams: {
          fee: 1000, // 0.001 Algos
          flatFee: true,
          firstValid: 6000000,
          lastValid: 6001000,
          genesisHash: algosdk.base64ToBytes('SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI='),
          genesisID: 'testnet-v1.0',
          minFee: 1000,
        }
      });
      expect(await processor.createDataFromTxn(txn)).toStrictEqual({
        type: 'acfg',
        snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        fee: 0.001,
        fv: 6000000,
        lv: 6001000,
        apar_un: 'FAKE',
        apar_an: 'Fake Token',
        apar_t: '10000000',
        apar_dc: 5,
        apar_df: true,
        apar_au: 'https://fake.token',
        apar_m: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        apar_f: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        apar_c: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        apar_r: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        apar_am: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      });
    });

    it('returns asset freeze transaction data when given a asset freeze transaction', async () => {
      const txn = algosdk.makeAssetFreezeTxnWithSuggestedParamsFromObject({
        sender: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        assetIndex: 88888888,
        freezeTarget: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        frozen: true,
        suggestedParams: {
          fee: 1000, // 0.001 Algos
          flatFee: true,
          firstValid: 6000000,
          lastValid: 6001000,
          genesisHash: algosdk.base64ToBytes('SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI='),
          genesisID: 'testnet-v1.0',
          minFee: 1000,
        }
      });
      expect(await processor.createDataFromTxn(txn)).toStrictEqual({
        type: 'afrz',
        snd: 'EW64GC6F24M7NDSC5R3ES4YUVE3ZXXNMARJHDCCCLIHZU6TBEOC7XRSBG4',
        fee: 0.001,
        fv: 6000000,
        lv: 6001000,
        faid: 88888888,
        fadd: 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A',
        afrz: true,
      });
    });

    it('returns key registration transaction data when given a key registration transaction',
    async () => {
      const txn = algosdk.makeKeyRegistrationTxnWithSuggestedParamsFromObject({
        sender: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
        voteKey: algosdk.base64ToBytes('G/lqTV6MKspW6J8wH2d8ZliZ5XZVZsruqSBJMwLwlmo='),
        selectionKey:  algosdk.base64ToBytes('LrpLhvzr+QpN/bivh6IPpOaKGbGzTTB5lJtVfixmmgk='),
        // eslint-disable-next-line max-len
        stateProofKey:  algosdk.base64ToBytes('RpUpNWfZMjZ1zOOjv3MF2tjO714jsBt0GKnNsw0ihJ4HSZwci+d9zvUi3i67LwFUJgjQ5Dz4zZgHgGduElnmSA=='),
        voteFirst: 6000000,
        voteLast: 6100000,
        voteKeyDilution: 1730,
        suggestedParams: {
          fee: 1000, // 0.001 Algos
          flatFee: true,
          firstValid: 6000000,
          lastValid: 6001000,
          genesisHash: algosdk.base64ToBytes('SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI='),
          genesisID: 'testnet-v1.0',
          minFee: 1000,
        }
      });
      expect(await processor.createDataFromTxn(txn)).toStrictEqual({
        type: 'keyreg',
        snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
        fee: 0.001,
        fv: 6000000,
        lv: 6001000,
        votekey: 'G/lqTV6MKspW6J8wH2d8ZliZ5XZVZsruqSBJMwLwlmo=',
        selkey: 'LrpLhvzr+QpN/bivh6IPpOaKGbGzTTB5lJtVfixmmgk=',
        // eslint-disable-next-line max-len
        sprfkey: 'RpUpNWfZMjZ1zOOjv3MF2tjO714jsBt0GKnNsw0ihJ4HSZwci+d9zvUi3i67LwFUJgjQ5Dz4zZgHgGduElnmSA==',
        votefst: 6000000,
        votelst: 6100000,
        votekd: 1730,
        nonpart: false,
      });
    });

    it('returns application call transaction data when given a application call transaction',
    async () => {
      const encodedAppArgs = getAppArgsForTransaction({
        accounts: ['GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'],
        appArgs: ['foo', '42', ''],
        apps: [11111111, 22222222],
        assets: [33333333, 44444444, 55555555],
        boxes: [{appId: 2, name: 'Box 1' }, {appId: 1, name: 'Boxy box' }],
      });
      const textEncoder = new TextEncoder;
      const txn = algosdk.makeApplicationCallTxnFromObject({
        ...encodedAppArgs,
        sender: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
        onComplete: 0,
        appIndex: 0,
        approvalProgram: textEncoder.encode('BYEB'),
        clearProgram: textEncoder.encode('BYEB'),
        numGlobalInts: 1,
        numGlobalByteSlices: 2,
        numLocalInts: 3,
        numLocalByteSlices: 4,
        extraPages: 1,
        suggestedParams: {
          fee: 1000, // 0.001 Algos
          flatFee: true,
          firstValid: 6000000,
          lastValid: 6001000,
          genesisHash: algosdk.base64ToBytes('SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI='),
          genesisID: 'testnet-v1.0',
          minFee: 1000,
        }
      });
      expect(await processor.createDataFromTxn(txn)).toStrictEqual({
        type: 'appl',
        snd: 'MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4',
        fee: 0.001,
        fv: 6000000,
        lv: 6001000,
        apan: 0,
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
        apbx: [{i: 2, n: 'Box 1' }, {i: 1, n: 'Boxy box' }],
      });
    });

  });
});
