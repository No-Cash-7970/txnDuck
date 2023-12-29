import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import i18nextClientMock from '@/app/lib/testing/i18nextClientMock';

// Mock i18next before modules that use it are imported
jest.mock('react-i18next', () => i18nextClientMock);

import TxnDataTable from './TxnDataTable';

describe('Transaction Data Table Component', () => {

  it('displays general transaction data (using suggested parameters)', () => {
    sessionStorage.setItem('txnData', JSON.stringify({
      txn: {
        type: 'pay',
        snd: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        note: 'Hello world',
        lx: 'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
        rekey: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      },
      useSugFee: true,
      useSugRounds: true,
    }));
    render(<TxnDataTable />);

    expect(screen.getByText('app:node_selector.node_network')).toBeInTheDocument();
    expect(screen.getByText('app:node_selector.testnet')).toBeInTheDocument();

    expect(screen.getByText('fields.type.label')).toBeInTheDocument();
    expect(screen.getByText('fields.type.options.pay')).toBeInTheDocument();

    expect(screen.getByText('fields.snd.label')).toBeInTheDocument();
    expect(screen.getByText('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'))
      .toBeInTheDocument();

    expect(screen.getByText('fields.fee.label')).toBeInTheDocument();
    expect(screen.getByText('fields.use_sug_fee.using_sug')).toBeInTheDocument();
    expect(screen.getByText('fields.fee.in_algos')).toBeInTheDocument();

    expect(screen.getByText('fields.note.label')).toBeInTheDocument();
    expect(screen.getByText('Hello world')).toBeInTheDocument();

    expect(screen.getByText('fields.fv.label')).toBeInTheDocument();
    expect(screen.getByText('fields.lv.label')).toBeInTheDocument();
    expect(screen.getAllByText('number_value')).toHaveLength(2);
    expect(screen.getAllByText('fields.use_sug_rounds.using_sug')).toHaveLength(2);

    expect(screen.getByText('fields.lx.label')).toBeInTheDocument();
    expect(screen.getByText('EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE')).toBeInTheDocument();

    expect(screen.getByText('fields.rekey.label')).toBeInTheDocument();
    expect(screen.getByText('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'))
      .toBeInTheDocument();
  });

  it('displays general transaction data (not using suggested parameters)', () => {
    sessionStorage.setItem('txnData', JSON.stringify({
      txn: {
        type: 'pay',
        snd: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        fee: 0.0042,
        note: 'Hello world',
        fv: 42,
        lv: 43,
        lx: 'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
        rekey: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      },
      useSugFee: false,
      useSugRounds: false,
    }));
    render(<TxnDataTable />);

    expect(screen.getByText('app:node_selector.node_network')).toBeInTheDocument();
    expect(screen.getByText('app:node_selector.testnet')).toBeInTheDocument();

    expect(screen.getByText('fields.type.label')).toBeInTheDocument();
    expect(screen.getByText('fields.type.options.pay')).toBeInTheDocument();

    expect(screen.getByText('fields.snd.label')).toBeInTheDocument();
    expect(screen.getByText('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'))
      .toBeInTheDocument();

    expect(screen.getByText('fields.fee.label')).toBeInTheDocument();
    expect(screen.getByText('fields.use_sug_fee.not_using_sug')).toBeInTheDocument();
    expect(screen.getByText('fields.fee.in_algos')).toBeInTheDocument();

    expect(screen.getByText('fields.note.label')).toBeInTheDocument();
    expect(screen.getByText('Hello world')).toBeInTheDocument();

    expect(screen.getByText('fields.fv.label')).toBeInTheDocument();
    expect(screen.getByText('fields.lv.label')).toBeInTheDocument();
    expect(screen.getAllByText('number_value')).toHaveLength(2);
    expect(screen.getAllByText('fields.use_sug_rounds.not_using_sug')).toHaveLength(2);

    expect(screen.getByText('fields.lx.label')).toBeInTheDocument();
    expect(screen.getByText('EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE')).toBeInTheDocument();

    expect(screen.getByText('fields.rekey.label')).toBeInTheDocument();
    expect(screen.getByText('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'))
      .toBeInTheDocument();
  });

  it('displays "none" when there is no note', () => {
    sessionStorage.setItem('txnData', JSON.stringify({
      txn: {
        note: '',
        lx: 'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
        rekey: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      }
    }));
    render(<TxnDataTable />);
    expect(screen.getByText('none')).toBeInTheDocument();
  });

  it('indicates when note is Base64 encoded', () => {
    sessionStorage.setItem('txnData', JSON.stringify({
      txn: { note: 'SGVsbG8gd29ybGQ=' },
      b64Note: true,
    }));
    render(<TxnDataTable />);
    expect(screen.getByText(/fields.base64.with_label/)).toBeInTheDocument();
  });

  it('displays "none" when there is no lease', () => {
    sessionStorage.setItem('txnData', JSON.stringify({
      txn: {
        note: 'Hello world',
        lx: '',
        rekey: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
      }
    }));
    render(<TxnDataTable />);
    expect(screen.getByText('none')).toBeInTheDocument();
  });

  it('indicates when lease is Base64 encoded', () => {
    sessionStorage.setItem('txnData', JSON.stringify({
      txn: { lx: 'SGVsbG8gd29ybGQ=' },
      b64Lx: true,
    }));
    render(<TxnDataTable />);
    expect(screen.getByText(/fields.base64.with_label/)).toBeInTheDocument();
  });

  it('displays "none" when there is no rekey address', () => {
    sessionStorage.setItem('txnData', JSON.stringify({
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

    it('displays payment transaction data', () => {
      sessionStorage.setItem('txnData', JSON.stringify({
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

    it('displays "none" when there is no close-to address', () => {
      sessionStorage.setItem('txnData', JSON.stringify({
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

    it('displays asset transfer transaction data', () => {
      sessionStorage.setItem('txnData', JSON.stringify({
        txn: {
          type: 'axfer',
          arcv: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          xaid: 123456789,
          aamt: 42,
          asnd: 'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
          aclose: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'
        },
        retrievedAssetInfo: { name: 'Foo Token', unitName: 'FOO', total: 1000, decimals: 2 },
      }));
      render(<TxnDataTable />);

      expect(screen.getByText('fields.arcv.label')).toBeInTheDocument();
      expect(screen.getByText('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'))
        .toBeInTheDocument();

      expect(screen.getByText('fields.xaid.with_name_label')).toBeInTheDocument();
      expect(screen.getByText('fields.xaid.with_name')).toBeInTheDocument();

      expect(screen.getByText('fields.aamt.label')).toBeInTheDocument();

      expect(screen.getByText('fields.asnd.label')).toBeInTheDocument();
      expect(screen.getByText('CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC'))
        .toBeInTheDocument();

      expect(screen.getByText('fields.aclose.label')).toBeInTheDocument();
      expect(screen.getByText('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'))
        .toBeInTheDocument();
    });

    it('displays "none" when there is no clawback target address', () => {
      sessionStorage.setItem('txnData', JSON.stringify({
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

    it('displays "none" when there is no close-to address', () => {
      sessionStorage.setItem('txnData', JSON.stringify({
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

  describe('Asset Configuration Transaction', () => {

    it('displays asset configuration transaction data for asset creation', () => {
      sessionStorage.setItem('txnData', JSON.stringify({
        txn: {
          type: 'acfg',
          apar_un: 'FAKE',
          apar_an: 'Fake Token',
          apar_t: 10000000,
          apar_dc: 5,
          apar_df: true,
          apar_au: 'https://fake.token',
          apar_m: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          apar_f: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
          apar_c: 'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
          apar_r: 'DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD',
          apar_am: 'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
        }
      }));
      render(<TxnDataTable />);

      expect(screen.queryByText('fields.caid.label')).not.toBeInTheDocument();
      expect(screen.getByText('fields.type.options.acfg_create')).toBeInTheDocument();

      expect(screen.getByText('fields.apar_un.label')).toBeInTheDocument();
      expect(screen.getByText('FAKE')).toBeInTheDocument();

      expect(screen.getByText('fields.apar_an.label')).toBeInTheDocument();
      expect(screen.getByText('Fake Token')).toBeInTheDocument();

      expect(screen.getByText('fields.apar_t.label')).toBeInTheDocument();

      expect(screen.getByText('fields.apar_dc.label')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();

      expect(screen.getByText('fields.apar_df.label')).toBeInTheDocument();
      expect(screen.getByText('fields.apar_df.is_frozen')).toBeInTheDocument();

      expect(screen.getByText('fields.apar_au.label')).toBeInTheDocument();
      expect(screen.getByText('https://fake.token')).toBeInTheDocument();

      expect(screen.getByText('fields.apar_m.label')).toBeInTheDocument();
      expect(screen.getByText('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'))
        .toBeInTheDocument();

      expect(screen.getByText('fields.apar_f.label')).toBeInTheDocument();
      expect(screen.getByText('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'))
        .toBeInTheDocument();

      expect(screen.getByText('fields.apar_c.label')).toBeInTheDocument();
      expect(screen.getByText('CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC'))
        .toBeInTheDocument();

      expect(screen.getByText('fields.apar_r.label')).toBeInTheDocument();
      expect(screen.getByText('DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD'))
        .toBeInTheDocument();

      expect(screen.getByText('fields.apar_am.label')).toBeInTheDocument();
      expect(screen.getByText('GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG'))
        .toBeInTheDocument();
    });

    it('displays asset configuration transaction data for asset reconfiguration', () => {
      sessionStorage.setItem('txnData', JSON.stringify({
        txn: {
          type: 'acfg',
          caid: 123456789,
          apar_m: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          apar_f: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
          apar_c: 'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
          apar_r: 'DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD',
        },
        retrievedAssetInfo: { name: 'Foo Token', unitName: 'FOO', total: 1000, decimals: 2 },
      }));
      render(<TxnDataTable />);

      expect(screen.getByText('fields.caid.with_name_label')).toBeInTheDocument();
      expect(screen.getByText('fields.caid.with_name')).toBeInTheDocument();
      expect(screen.getByText('fields.type.options.acfg_reconfig')).toBeInTheDocument();
      expect(screen.queryByText('fields.apar_un.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apar_an.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apar_t.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apar_dc.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apar_df.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apar_df.is_frozen')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apar_au.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apar_am.label')).not.toBeInTheDocument();

      expect(screen.getByText('fields.apar_m.label')).toBeInTheDocument();
      expect(screen.getByText('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'))
        .toBeInTheDocument();

      expect(screen.getByText('fields.apar_f.label')).toBeInTheDocument();
      expect(screen.getByText('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'))
        .toBeInTheDocument();

      expect(screen.getByText('fields.apar_c.label')).toBeInTheDocument();
      expect(screen.getByText('CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC'))
        .toBeInTheDocument();

      expect(screen.getByText('fields.apar_r.label')).toBeInTheDocument();
      expect(screen.getByText('DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD'))
        .toBeInTheDocument();
    });

    it('displays asset configuration transaction data for asset deletion', () => {
      sessionStorage.setItem('txnData', JSON.stringify({
        txn: {
          type: 'acfg',
          caid: 123456789,
        },
        retrievedAssetInfo: { name: 'Foo Token', unitName: 'FOO', total: 1000, decimals: 2 },
      }));
      render(<TxnDataTable />);

      expect(screen.getByText('fields.caid.with_name_label')).toBeInTheDocument();
      expect(screen.getByText('fields.caid.with_name')).toBeInTheDocument();
      expect(screen.getByText('fields.type.options.acfg_destroy')).toBeInTheDocument();
      expect(screen.queryByText('fields.apar_un.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apar_an.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apar_t.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apar_dc.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apar_df.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apar_df.is_frozen')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apar_au.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apar_am.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apar_m.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apar_f.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apar_c.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apar_r.label')).not.toBeInTheDocument();
    });

    it('displays "none" when there is no metadata hash', () => {
      sessionStorage.setItem('txnData', JSON.stringify({
        txn: {
          type: 'acfg',
          note: 'Hello world',
          lx: 'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
          rekey: 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
          apar_un: 'FAKE',
          apar_an: 'Fake Token',
          apar_t: 10000000,
          apar_dc: 5,
          apar_df: true,
          apar_au: 'https://fake.token',
          apar_m: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          apar_f: 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
          apar_c: 'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
          apar_r: 'DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD',
          apar_am: '',
        }
      }));
      render(<TxnDataTable />);
      expect(screen.getByText('none')).toBeInTheDocument();
    });

    it('indicates when metadata hash is Base64 encoded', () => {
      sessionStorage.setItem('txnData', JSON.stringify({
        txn: {
          type: 'acfg',
          apar_am: 'VGhpcyBpcyBhIHZhbGlkIGhhc2ghISEhISEhISEhISE='
        },
        b64Apar_am: true,
      }));
      render(<TxnDataTable />);
      expect(screen.getByText(/fields.base64.with_label/)).toBeInTheDocument();
    });

  });

  describe('Asset Freeze Transaction', () => {

    it('displays asset freeze transaction data', () => {
      sessionStorage.setItem('txnData', JSON.stringify({
        txn: {
          type: 'afrz',
          faid: 1234,
          fadd: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
          afrz: true,
        },
        retrievedAssetInfo: { name: 'Foo Token', unitName: 'FOO', total: 1000, decimals: 2 },
      }));
      render(<TxnDataTable />);

      expect(screen.getByText('fields.faid.with_name_label')).toBeInTheDocument();
      expect(screen.getByText('fields.faid.with_name')).toBeInTheDocument();

      expect(screen.getByText('fields.fadd.label')).toBeInTheDocument();
      expect(screen.getByText('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'))
        .toBeInTheDocument();

      expect(screen.getByText('fields.afrz.label')).toBeInTheDocument();
      expect(screen.getByText('fields.afrz.is_frozen')).toBeInTheDocument();
    });

  });

  describe('Key Registration Transaction', () => {

    it('displays key registration transaction data for marking "online"', () => {
      sessionStorage.setItem('txnData', JSON.stringify({
        txn: {
          type: 'keyreg',
          votekey: 'G/lqTV6MKspW6J8wH2d8ZliZ5XZVZsruqSBJMwLwlmo=',
          selkey: 'LrpLhvzr+QpN/bivh6IPpOaKGbGzTTB5lJtVfixmmgk=',
          // eslint-disable-next-line max-len
          sprfkey: 'RpUpNWfZMjZ1zOOjv3MF2tjO714jsBt0GKnNsw0ihJ4HSZwci+d9zvUi3i67LwFUJgjQ5Dz4zZgHgGduElnmSA==',
          votefst: 6000000,
          votelst: 6100000,
          votekd: 1730,
          nonpart: false,
        }
      }));
      render(<TxnDataTable />);

      expect(screen.getByText('fields.type.options.keyreg_on')).toBeInTheDocument();

      expect(screen.getByText('fields.votekey.label')).toBeInTheDocument();
      expect(screen.getByText('G/lqTV6MKspW6J8wH2d8ZliZ5XZVZsruqSBJMwLwlmo=')).toBeInTheDocument();

      expect(screen.getByText('fields.selkey.label')).toBeInTheDocument();
      expect(screen.getByText('LrpLhvzr+QpN/bivh6IPpOaKGbGzTTB5lJtVfixmmgk=')).toBeInTheDocument();

      expect(screen.getByText('fields.sprfkey.label')).toBeInTheDocument();
      expect(screen.getByText(
        'RpUpNWfZMjZ1zOOjv3MF2tjO714jsBt0GKnNsw0ihJ4HSZwci+d9zvUi3i67LwFUJgjQ5Dz4zZgHgGduElnmSA=='
      )).toBeInTheDocument();

      expect(screen.getByText('fields.votefst.label')).toBeInTheDocument();
      expect(screen.getByText('fields.votelst.label')).toBeInTheDocument();
      expect(screen.getByText('fields.votekd.label')).toBeInTheDocument();

      expect(screen.queryByText('fields.nonpart.label')).not.toBeInTheDocument();
    });

    it('displays key registration transaction data for marking "offline"', () => {
      sessionStorage.setItem('txnData', JSON.stringify({
        txn: {
          type: 'keyreg',
          votekey: '',
          selkey: '',
          sprfkey: '',
        }
      }));
      render(<TxnDataTable />);

      expect(screen.getByText('fields.type.options.keyreg_off')).toBeInTheDocument();
      expect(screen.queryByText('fields.votekey.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.selkey.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.sprfkey.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.votefst.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.votelst.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.votekd.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.nonpart.label')).not.toBeInTheDocument();
    });

    it('displays key registration transaction data for marking "nonparticipating"', () => {
      sessionStorage.setItem('txnData', JSON.stringify({
        txn: {
          type: 'keyreg',
          nonpart: true,
        }
      }));
      render(<TxnDataTable />);

      expect(screen.getByText('fields.type.options.keyreg_nonpart')).toBeInTheDocument();
      expect(screen.queryByText('fields.votekey.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.selkey.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.sprfkey.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.votefst.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.votelst.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.votekd.label')).not.toBeInTheDocument();

      expect(screen.getByText('fields.nonpart.label')).toBeInTheDocument();
      expect(screen.getByText('fields.nonpart.is_nonpart')).toBeInTheDocument();
    });

  });

  describe('Application Call Transaction', () => {

    it('displays application call transaction data for application creation', () => {
      sessionStorage.setItem('txnData', JSON.stringify({
        txn: {
          type: 'appl',
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
          apbx: [{i: 2, n: 'Boxy box' }],
        }
      }));
      render(<TxnDataTable />);

      expect(screen.getByText('fields.type.options.appl_create')).toBeInTheDocument();
      expect(screen.queryByText('fields.apid.label')).not.toBeInTheDocument();

      expect(screen.getByText('fields.apan.label')).toBeInTheDocument();
      expect(screen.getByText('fields.apan.options.no_op')).toBeInTheDocument();

      expect(screen.getByText('fields.apap.label')).toBeInTheDocument();
      expect(screen.getByText('fields.apsu.label')).toBeInTheDocument();
      expect(screen.getByText('fields.apgs_nui.label')).toBeInTheDocument();
      expect(screen.getByText('fields.apgs_nbs.label')).toBeInTheDocument();
      expect(screen.getByText('fields.apls_nui.label')).toBeInTheDocument();
      expect(screen.getByText('fields.apls_nbs.label')).toBeInTheDocument();
      expect(screen.getByText('fields.apep.label')).toBeInTheDocument();
      expect(screen.getByText('fields.apaa.title')).toBeInTheDocument();
      expect(screen.getByText('fields.apat.title')).toBeInTheDocument();
      expect(screen.getByText('fields.apfa.title')).toBeInTheDocument();
      expect(screen.getByText('fields.apas.title')).toBeInTheDocument();
      expect(screen.getByText('fields.apbx.title')).toBeInTheDocument();
    });

    it('displays application call transaction data for application update', () => {
      sessionStorage.setItem('txnData', JSON.stringify({
        txn: {
          type: 'appl',
          apid: 12345678,
          apan: 4,
          apap: 'BYEB',
          apsu: 'BYEB',
          apaa: ['foo', '42', ''],
          apat: ['GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'],
          apfa: [11111111, 22222222],
          apas: [33333333, 44444444, 55555555],
          apbx: [{i: 2, n: 'Boxy box' }],
        }
      }));
      render(<TxnDataTable />);

      expect(screen.getByText('fields.type.options.appl_update')).toBeInTheDocument();
      expect(screen.getByText('fields.apid.label')).toBeInTheDocument();

      expect(screen.getByText('fields.apan.label')).toBeInTheDocument();
      expect(screen.getByText('fields.apan.options.update')).toBeInTheDocument();

      expect(screen.getByText('fields.apap.label')).toBeInTheDocument();
      expect(screen.getByText('fields.apsu.label')).toBeInTheDocument();
      expect(screen.queryByText('fields.apgs_nui.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apgs_nbs.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apls_nui.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apls_nbs.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apep.label')).not.toBeInTheDocument();
      expect(screen.getByText('fields.apaa.title')).toBeInTheDocument();
      expect(screen.getByText('fields.apat.title')).toBeInTheDocument();
      expect(screen.getByText('fields.apfa.title')).toBeInTheDocument();
      expect(screen.getByText('fields.apas.title')).toBeInTheDocument();
      expect(screen.getByText('fields.apbx.title')).toBeInTheDocument();
    });

    it('displays application call transaction data for application deletion', () => {
      sessionStorage.setItem('txnData', JSON.stringify({
        txn: {
          type: 'appl',
          apid: 12345678,
          apan: 5,
          apaa: ['foo', '42', ''],
          apat: ['GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'],
          apfa: [11111111, 22222222],
          apas: [33333333, 44444444, 55555555],
          apbx: [{i: 2, n: 'Boxy box' }],
        }
      }));
      render(<TxnDataTable />);

      expect(screen.getByText('fields.type.options.appl_delete')).toBeInTheDocument();
      expect(screen.getByText('fields.apid.label')).toBeInTheDocument();

      expect(screen.getByText('fields.apan.label')).toBeInTheDocument();
      expect(screen.getByText('fields.apan.options.delete')).toBeInTheDocument();

      expect(screen.queryByText('fields.apap.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apsu.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apgs_nui.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apgs_nbs.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apls_nui.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apls_nbs.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apep.label')).not.toBeInTheDocument();
      expect(screen.getByText('fields.apaa.title')).toBeInTheDocument();
      expect(screen.getByText('fields.apat.title')).toBeInTheDocument();
      expect(screen.getByText('fields.apfa.title')).toBeInTheDocument();
      expect(screen.getByText('fields.apas.title')).toBeInTheDocument();
      expect(screen.getByText('fields.apbx.title')).toBeInTheDocument();
    });

    it('displays application call transaction data for application opt-in', () => {
      sessionStorage.setItem('txnData', JSON.stringify({
        txn: {
          type: 'appl',
          apid: 12345678,
          apan: 1,
          apaa: ['foo', '42', ''],
          apat: ['GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'],
          apfa: [11111111, 22222222],
          apas: [33333333, 44444444, 55555555],
          apbx: [{i: 2, n: 'Boxy box' }],
        }
      }));
      render(<TxnDataTable />);

      expect(screen.getByText('fields.type.options.appl_opt_in')).toBeInTheDocument();
      expect(screen.getByText('fields.apid.label')).toBeInTheDocument();

      expect(screen.getByText('fields.apan.label')).toBeInTheDocument();
      expect(screen.getByText('fields.apan.options.opt_in')).toBeInTheDocument();

      expect(screen.queryByText('fields.apap.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apsu.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apgs_nui.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apgs_nbs.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apls_nui.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apls_nbs.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apep.label')).not.toBeInTheDocument();
      expect(screen.getByText('fields.apaa.title')).toBeInTheDocument();
      expect(screen.getByText('fields.apat.title')).toBeInTheDocument();
      expect(screen.getByText('fields.apfa.title')).toBeInTheDocument();
      expect(screen.getByText('fields.apas.title')).toBeInTheDocument();
      expect(screen.getByText('fields.apbx.title')).toBeInTheDocument();
    });

    it('displays application call transaction data for application close-out', () => {
      sessionStorage.setItem('txnData', JSON.stringify({
        txn: {
          type: 'appl',
          apid: 12345678,
          apan: 2,
          apaa: ['foo', '42', ''],
          apat: ['GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'],
          apfa: [11111111, 22222222],
          apas: [33333333, 44444444, 55555555],
          apbx: [{i: 2, n: 'Boxy box' }],
        }
      }));
      render(<TxnDataTable />);

      expect(screen.getByText('fields.type.options.appl_close_out')).toBeInTheDocument();
      expect(screen.getByText('fields.apid.label')).toBeInTheDocument();

      expect(screen.getByText('fields.apan.label')).toBeInTheDocument();
      expect(screen.getByText('fields.apan.options.close_out')).toBeInTheDocument();

      expect(screen.queryByText('fields.apap.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apsu.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apgs_nui.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apgs_nbs.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apls_nui.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apls_nbs.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apep.label')).not.toBeInTheDocument();
      expect(screen.getByText('fields.apaa.title')).toBeInTheDocument();
      expect(screen.getByText('fields.apat.title')).toBeInTheDocument();
      expect(screen.getByText('fields.apfa.title')).toBeInTheDocument();
      expect(screen.getByText('fields.apas.title')).toBeInTheDocument();
      expect(screen.getByText('fields.apbx.title')).toBeInTheDocument();
    });

    it('displays application call transaction data for application clear-state', () => {
      sessionStorage.setItem('txnData', JSON.stringify({
        txn: {
          type: 'appl',
          apid: 12345678,
          apan: 3,
          apaa: ['foo', '42', ''],
          apat: ['GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'],
          apfa: [11111111, 22222222],
          apas: [33333333, 44444444, 55555555],
          apbx: [{i: 2, n: 'Boxy box' }],
        }
      }));
      render(<TxnDataTable />);

      expect(screen.getByText('fields.type.options.appl_clear')).toBeInTheDocument();
      expect(screen.getByText('fields.apid.label')).toBeInTheDocument();

      expect(screen.getByText('fields.apan.label')).toBeInTheDocument();
      expect(screen.getByText('fields.apan.options.clear')).toBeInTheDocument();

      expect(screen.queryByText('fields.apap.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apsu.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apgs_nui.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apgs_nbs.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apls_nui.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apls_nbs.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apep.label')).not.toBeInTheDocument();
      expect(screen.getByText('fields.apaa.title')).toBeInTheDocument();
      expect(screen.getByText('fields.apat.title')).toBeInTheDocument();
      expect(screen.getByText('fields.apfa.title')).toBeInTheDocument();
      expect(screen.getByText('fields.apas.title')).toBeInTheDocument();
      expect(screen.getByText('fields.apbx.title')).toBeInTheDocument();
    });

    it('displays application call transaction data for application no-op call', () => {
      sessionStorage.setItem('txnData', JSON.stringify({
        txn: {
          type: 'appl',
          apid: 12345678,
          apan: 0,
          apaa: ['foo', '42', ''],
          apat: ['GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'],
          apfa: [11111111, 22222222],
          apas: [33333333, 44444444, 55555555],
          apbx: [{i: 2, n: 'Boxy box' }],
        }
      }));
      render(<TxnDataTable />);

      expect(screen.getByText('fields.type.options.appl_no_op')).toBeInTheDocument();
      expect(screen.getByText('fields.apid.label')).toBeInTheDocument();

      expect(screen.getByText('fields.apan.label')).toBeInTheDocument();
      expect(screen.getByText('fields.apan.options.no_op')).toBeInTheDocument();

      expect(screen.queryByText('fields.apap.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apsu.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apgs_nui.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apgs_nbs.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apls_nui.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apls_nbs.label')).not.toBeInTheDocument();
      expect(screen.queryByText('fields.apep.label')).not.toBeInTheDocument();
      expect(screen.getByText('fields.apaa.title')).toBeInTheDocument();
      expect(screen.getByText('fields.apat.title')).toBeInTheDocument();
      expect(screen.getByText('fields.apfa.title')).toBeInTheDocument();
      expect(screen.getByText('fields.apas.title')).toBeInTheDocument();
      expect(screen.getByText('fields.apbx.title')).toBeInTheDocument();
    });

  });

});
