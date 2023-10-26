import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { TFunction } from 'i18next';
import i18nextClientMock from '@/app/lib/testing/i18nextClientMock';

// Mock i18next before modules that use it are imported
jest.mock('react-i18next', () => i18nextClientMock);

import TxnDataTable from './TxnDataTable';

describe('Transaction Data Table Component', () => {
  const t = i18nextClientMock.useTranslation().t as TFunction;

  it('displays general transaction data', () => {
    sessionStorage.setItem('txnData', JSON.stringify({
      gen: '',
      gh: '',
      txn: {
        type: 'pay',
        snd: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        fee: 0.0042,
        note: 'Hello world',
        fv: 42,
        lv: 43,
        lx: 'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
        rekey: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      }
    }));
    render(<TxnDataTable />);

    expect(screen.getByText('fields.type.label')).toBeInTheDocument();
    expect(screen.getByText('fields.type.options.pay')).toBeInTheDocument();

    expect(screen.getByText('fields.snd.label')).toBeInTheDocument();
    expect(screen.getByText('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'))
      .toBeInTheDocument();

    expect(screen.getByText('fields.fee.label')).toBeInTheDocument();
    expect(screen.getByText('fields.fee.in_algos')).toBeInTheDocument();

    expect(screen.getByText('fields.note.label')).toBeInTheDocument();
    expect(screen.getByText('Hello world')).toBeInTheDocument();

    expect(screen.getByText('fields.fv.label')).toBeInTheDocument();
    expect(screen.getByText('fields.lv.label')).toBeInTheDocument();
    expect(screen.getAllByText('number_value')).toHaveLength(2);

    expect(screen.getByText('fields.lx.label')).toBeInTheDocument();
    expect(screen.getByText('EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE')).toBeInTheDocument();

    expect(screen.getByText('fields.rekey.label')).toBeInTheDocument();
    expect(screen.getByText('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'))
      .toBeInTheDocument();
  });

  it('displays "none" when there is no note', async () => {
    sessionStorage.setItem('txnData', JSON.stringify({
      gen: '',
      gh: '',
      txn: {
        note: '',
        lx: 'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
        rekey: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      }
    }));
    render(<TxnDataTable />);
    expect(screen.getByText('none')).toBeInTheDocument();
  });

  it('displays "none" when there is no lease', async () => {
    sessionStorage.setItem('txnData', JSON.stringify({
      gen: '',
      gh: '',
      txn: {
        note: 'Hello world',
        lx: '',
        rekey: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      }
    }));
    render(<TxnDataTable />);
    expect(screen.getByText('none')).toBeInTheDocument();
  });

  it('displays "none" when there is no rekey address', async () => {
    sessionStorage.setItem('txnData', JSON.stringify({
      gen: '',
      gh: '',
      txn: {
        note: 'Hello world',
        lx: 'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
        rekey: '',
      }
    }));
    render(<TxnDataTable />);
    expect(screen.getByText('none')).toBeInTheDocument();
  });

  describe('Payment Transaction', () => {

    it('displays payment transaction data', async () => {
      sessionStorage.setItem('txnData', JSON.stringify({
        gen: '',
        gh: '',
        txn: {
          type: 'pay',
          rcv: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          amt: 42,
          close: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'
        }
      }));
      render(<TxnDataTable />);

      expect(screen.getByText('fields.rcv.label')).toBeInTheDocument();
      expect(screen.getByText('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'))
        .toBeInTheDocument();

      expect(screen.getByText('fields.amt.label')).toBeInTheDocument();
      expect(screen.getByText('fields.amt.in_algos')).toBeInTheDocument();

      expect(screen.getByText('fields.close.label')).toBeInTheDocument();
      expect(screen.getByText('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'))
        .toBeInTheDocument();
    });

    it('displays "none" when there is no close-to address', async () => {
      sessionStorage.setItem('txnData', JSON.stringify({
        gen: '',
        gh: '',
        txn: {
          type: 'pay',
          note: 'Hello world',
          lx: 'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
          rekey: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
          rcv: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          amt: 42,
          close: ''
        }
      }));
      render(<TxnDataTable />);
      expect(screen.getByText('none')).toBeInTheDocument();
    });

  });

  describe('Asset Transfer Transaction', () => {

    it('displays asset transfer transaction data', async () => {
      sessionStorage.setItem('txnData', JSON.stringify({
        gen: '',
        gh: '',
        txn: {
          type: 'axfer',
          arcv: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          xaid: 1234,
          aamt: 42,
          asnd: 'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
          aclose: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'
        }
      }));
      render(<TxnDataTable />);

      expect(screen.getByText('fields.arcv.label')).toBeInTheDocument();
      expect(screen.getByText('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'))
        .toBeInTheDocument();

      expect(screen.getByText('fields.xaid.label')).toBeInTheDocument();
      expect(screen.getByText('1234')).toBeInTheDocument();

      expect(screen.getByText('fields.aamt.label')).toBeInTheDocument();

      expect(screen.getByText('fields.asnd.label')).toBeInTheDocument();
      expect(screen.getByText('CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC'))
        .toBeInTheDocument();

      expect(screen.getByText('fields.aclose.label')).toBeInTheDocument();
      expect(screen.getByText('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'))
        .toBeInTheDocument();
    });

    it('displays "none" when there is no clawback target address', async () => {
      sessionStorage.setItem('txnData', JSON.stringify({
        gen: '',
        gh: '',
        txn: {
          type: 'axfer',
          note: 'Hello world',
          lx: 'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
          rekey: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
          arcv: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          xaid: 1234,
          aamt: 42,
          asnd: '',
          aclose: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'
        }
      }));
      render(<TxnDataTable />);
      expect(screen.getByText('none')).toBeInTheDocument();
    });

    it('displays "none" when there is no close-to address', async () => {
      sessionStorage.setItem('txnData', JSON.stringify({
        gen: '',
        gh: '',
        txn: {
          type: 'axfer',
          note: 'Hello world',
          lx: 'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
          rekey: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
          arcv: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          xaid: 1234,
          aamt: 42,
          asnd: 'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
          aclose: ''
        }
      }));
      render(<TxnDataTable />);
      expect(screen.getByText('none')).toBeInTheDocument();
    });

  });

});
