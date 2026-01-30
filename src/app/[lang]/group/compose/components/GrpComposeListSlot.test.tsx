import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import i18nextClientMock from '@/app/lib/testing/i18nextClientMock';

// Mock i18next before modules that use it are imported
jest.mock('react-i18next', () => i18nextClientMock);

// Mock navigation hooks
jest.mock('next/navigation', () => ({
  useSearchParams: () => ({ get: (param: string) => param }),
}));

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
    expect(screen.getByText('txn_presets:no_preset')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.type.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.snd.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.rekey.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.close.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.fee.label')).toBeInTheDocument();
  });

  it('displays transaction with "Transfer" preset', async () => {
    // eslint-disable-next-line @stylistic/max-len
    sessionStorage.setItem('txn_0d84', '{"txn":{"type":"pay","snd":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","rcv":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","amt":0},"preset":"transfer","useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false}');
    sessionStorage.setItem('txnGrpKeys', '["txn_0d84"]');
    render(<GrpComposeListSlot txnIdx={0} />);
    expect(screen.getByText('txn_presets:transfer.heading')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.snd.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.fee.label')).toBeInTheDocument();

    expect(screen.getByText('compose_txn:fields.rcv.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.amt.label')).toBeInTheDocument();
  });

  it('displays transaction with "Rekey" preset', async () => {
    // eslint-disable-next-line @stylistic/max-len
    sessionStorage.setItem('txn_0d84', '{"txn":{"type":"pay","snd":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","rekey":"BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB","rcv":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","amt":0},"preset":"rekey_account","useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false}');
    sessionStorage.setItem('txnGrpKeys', '["txn_0d84"]');
    render(<GrpComposeListSlot txnIdx={0} />);
    expect(screen.getByText('txn_presets:rekey_account.heading')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.snd.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.fee.label')).toBeInTheDocument();

    expect(screen.getByText('compose_txn:fields.rekey.label')).toBeInTheDocument();
  });

  it('displays transaction with "Close Account" preset', async () => {
    // eslint-disable-next-line @stylistic/max-len
    sessionStorage.setItem('txn_0d84', '{"txn":{"type":"pay","snd":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","rcv":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","amt":0,"close":"BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB"},"preset":"close_account","useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false}');
    sessionStorage.setItem('txnGrpKeys', '["txn_0d84"]');
    render(<GrpComposeListSlot txnIdx={0} />);
    expect(screen.getByText('txn_presets:close_account.heading')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.snd.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.fee.label')).toBeInTheDocument();

    expect(screen.getByText('compose_txn:fields.close.label')).toBeInTheDocument();
  });

  it('displays transaction with "Asset Transfer" preset', async () => {
    // eslint-disable-next-line @stylistic/max-len
    sessionStorage.setItem('txn_0d84', '{"txn":{"type":"axfer","snd":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","fee":0.001,"arcv":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","xaid":31566704,"aamt":"1000000"},"preset":"asset_transfer","useSugFee":false,"useSugRounds":true,"b64Note":false,"b64Lx":false,"retrievedAssetInfo":{"id":"31566704","name":"USDC","unitName":"USDC","total":"18446744073709551615","decimals":6}}');
    sessionStorage.setItem('txnGrpKeys', '["txn_0d84"]');
    render(<GrpComposeListSlot txnIdx={0} />);
    expect(screen.getByText('txn_presets:asset_transfer.heading')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.snd.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.fee.label')).toBeInTheDocument();

    expect(screen.getByText('compose_txn:fields.xaid.with_name_label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.arcv.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.aamt.label')).toBeInTheDocument();
  });

  it('displays transaction with "Asset Opt In" preset', async () => {
    // eslint-disable-next-line @stylistic/max-len
    sessionStorage.setItem('txn_0d84', '{"txn":{"type":"axfer","snd":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","arcv":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","xaid":31566704,"aamt":0},"preset":"asset_opt_in","useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false,"retrievedAssetInfo":{"id":"31566704","name":"USDC","unitName":"USDC","total":"18446744073709551615","decimals":6}}');
    sessionStorage.setItem('txnGrpKeys', '["txn_0d84"]');
    render(<GrpComposeListSlot txnIdx={0} />);
    expect(screen.getByText('txn_presets:asset_opt_in.heading')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.snd.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.fee.label')).toBeInTheDocument();

    expect(screen.getByText('compose_txn:fields.xaid.with_name_label')).toBeInTheDocument();
  });

  it('displays transaction with "Asset Opt Out" preset', async () => {
    // eslint-disable-next-line @stylistic/max-len
    sessionStorage.setItem('txn_0d84', '{"txn":{"type":"axfer","snd":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","arcv":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","xaid":31566704,"aamt":0,"aclose":"BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB"},"preset":"asset_opt_out","useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false,"retrievedAssetInfo":{"id":"31566704","name":"USDC","unitName":"USDC","total":"18446744073709551615","decimals":6}}');
    sessionStorage.setItem('txnGrpKeys', '["txn_0d84"]');
    render(<GrpComposeListSlot txnIdx={0} />);
    expect(screen.getByText('txn_presets:asset_opt_out.heading')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.snd.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.fee.label')).toBeInTheDocument();

    expect(screen.getByText('compose_txn:fields.xaid.with_name_label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.aclose.label')).toBeInTheDocument();
  });

  it('displays transaction with "Asset Clawback" preset', async () => {
    // eslint-disable-next-line @stylistic/max-len
    sessionStorage.setItem('txn_0d84', '{"txn":{"type":"axfer","snd":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","arcv":"BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB","xaid":31566704,"aamt":"1000000","asnd":"CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC"},"preset":"asset_clawback","useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false,"retrievedAssetInfo":{"id":"31566704","name":"USDC","unitName":"USDC","total":"18446744073709551615","decimals":6}}');
    sessionStorage.setItem('txnGrpKeys', '["txn_0d84"]');
    render(<GrpComposeListSlot txnIdx={0} />);
    expect(screen.getByText('txn_presets:asset_clawback.heading')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.snd.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.fee.label')).toBeInTheDocument();

    expect(screen.getByText('compose_txn:fields.xaid.with_name_label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.arcv.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.asnd.label')).toBeInTheDocument();
  });

  it('displays transaction with "Asset Create" preset', async () => {
    // eslint-disable-next-line @stylistic/max-len
    sessionStorage.setItem('txn_0d84', '{"txn":{"type":"acfg","snd":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","apar_un":"TEST2","apar_an":"Second Test","apar_t":"100000000000","apar_dc":2,"apar_df":false,"apar_au":"","apar_m":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","apar_f":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","apar_c":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","apar_r":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","apar_am":""},"preset":"asset_create","useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false,"apar_mUseSnd":true,"apar_fUseSnd":true,"apar_cUseSnd":true,"apar_rUseSnd":true,"b64Apar_am":false}');
    sessionStorage.setItem('txnGrpKeys', '["txn_0d84"]');
    render(<GrpComposeListSlot txnIdx={0} />);
    expect(screen.getByText('txn_presets:asset_create.heading')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.snd.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.fee.label')).toBeInTheDocument();

    expect(screen.getByText('compose_txn:fields.apar_un.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.apar_an.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.apar_t.label')).toBeInTheDocument();
  });

  it('displays transaction with "Asset Reconfigure" preset', async () => {
    // eslint-disable-next-line @stylistic/max-len
    sessionStorage.setItem('txn_0d84', '{"txn":{"type":"acfg","snd":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","caid":31566704,"apar_un":"","apar_an":"","apar_t":"","apar_df":false,"apar_au":"","apar_m":"37XL3M57AXBUJARWMT5R7M35OERXMH3Q22JMMEFLBYNDXXADGFN625HAL4","apar_f":"3ERES6JFBIJ7ZPNVQJNH2LETCBQWUPGTO4ROA6VFUR25WFSYKGX3WBO5GE","apar_c":"","apar_r":"2UEQTE5QDNXPI7M3TU44G6SYKLFWLPQO7EBZM7K7MHMQQMFI4QJPLHQFHM","apar_am":""},"preset":"asset_reconfig","useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false,"retrievedAssetInfo":{"id":"31566704","name":"USDC","unitName":"USDC","total":"18446744073709551615","decimals":6}}');
    sessionStorage.setItem('txnGrpKeys', '["txn_0d84"]');
    render(<GrpComposeListSlot txnIdx={0} />);
    expect(screen.getByText('txn_presets:asset_reconfig.heading')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.snd.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.fee.label')).toBeInTheDocument();

    expect(screen.getByText('compose_txn:fields.caid.with_name_label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.apar_m.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.apar_f.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.apar_c.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.apar_r.label')).toBeInTheDocument();
  });

  it('displays transaction with "Asset Destroy" preset', async () => {
    // eslint-disable-next-line @stylistic/max-len
    sessionStorage.setItem('txn_0d84', '{"txn":{"type":"acfg","snd":"BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB","caid":31566704,"apar_un":"","apar_an":"","apar_t":"","apar_df":false,"apar_au":"","apar_am":""},"preset":"asset_destroy","useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false,"retrievedAssetInfo":{"id":"31566704","name":"USDC","unitName":"USDC","total":"18446744073709551615","decimals":6}}');
    sessionStorage.setItem('txnGrpKeys', '["txn_0d84"]');
    render(<GrpComposeListSlot txnIdx={0} />);
    expect(screen.getByText('txn_presets:asset_destroy.heading')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.snd.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.fee.label')).toBeInTheDocument();

    expect(screen.getByText('compose_txn:fields.caid.with_name_label')).toBeInTheDocument();
  });

  it('displays transaction with "Asset Freeze" preset', async () => {
    // eslint-disable-next-line @stylistic/max-len
    sessionStorage.setItem('txn_0d84', '{"txn":{"type":"afrz","snd":"BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB","faid":31566704,"fadd":"CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC","afrz":true},"preset":"asset_freeze","useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false,"retrievedAssetInfo":{"id":"31566704","name":"USDC","unitName":"USDC","total":"18446744073709551615","decimals":6}}');
    sessionStorage.setItem('txnGrpKeys', '["txn_0d84"]');
    render(<GrpComposeListSlot txnIdx={0} />);
    expect(screen.getByText('txn_presets:asset_freeze.heading')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.snd.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.fee.label')).toBeInTheDocument();

    expect(screen.getByText('compose_txn:fields.faid.with_name_label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.fadd.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.afrz.label')).toBeInTheDocument();
  });

  it('displays transaction with "Asset Unfreeze" preset', async () => {
    // eslint-disable-next-line @stylistic/max-len
    sessionStorage.setItem('txn_0d84', '{"txn":{"type":"afrz","snd":"BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB","faid":31566704,"fadd":"CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC","afrz":false},"preset":"asset_unfreeze","useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false,"retrievedAssetInfo":{"id":"31566704","name":"USDC","unitName":"USDC","total":"18446744073709551615","decimals":6}}');
    sessionStorage.setItem('txnGrpKeys', '["txn_0d84"]');
    render(<GrpComposeListSlot txnIdx={0} />);
    expect(screen.getByText('txn_presets:asset_unfreeze.heading')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.snd.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.fee.label')).toBeInTheDocument();

    expect(screen.getByText('compose_txn:fields.faid.with_name_label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.fadd.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.afrz.label')).toBeInTheDocument();
  });

  it('displays transaction with "App Run" preset', async () => {
    // eslint-disable-next-line @stylistic/max-len
    sessionStorage.setItem('txn_0d84', '{"txn":{"type":"appl","snd":"MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4","apid":88888888,"apan":0,"apaa":[],"apat":[],"apfa":[],"apas":[],"apbx":[]},"preset":"app_run","useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false,"b64Apaa":false}');
    sessionStorage.setItem('txnGrpKeys', '["txn_0d84"]');
    render(<GrpComposeListSlot txnIdx={0} />);
    expect(screen.getByText('txn_presets:app_run.heading')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.snd.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.fee.label')).toBeInTheDocument();

    expect(screen.getByText('compose_txn:fields.apid.label')).toBeInTheDocument();
  });

  it('displays transaction with "App Opt In" preset', async () => {
    // eslint-disable-next-line @stylistic/max-len
    sessionStorage.setItem('txn_0d84', '{"txn":{"type":"appl","snd":"MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4","apid":88888888,"apan":1,"apaa":[],"apat":[],"apfa":[],"apas":[],"apbx":[]},"preset":"app_opt_in","useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false,"b64Apaa":false}');
    sessionStorage.setItem('txnGrpKeys', '["txn_0d84"]');
    render(<GrpComposeListSlot txnIdx={0} />);
    expect(screen.getByText('txn_presets:app_opt_in.heading')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.snd.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.fee.label')).toBeInTheDocument();

    expect(screen.getByText('compose_txn:fields.apid.label')).toBeInTheDocument();
  });

  it('displays transaction with "App Deploy" preset', async () => {
    // eslint-disable-next-line @stylistic/max-len
    sessionStorage.setItem('txn_0d84', '{"txn":{"type":"appl","snd":"MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4","apan":0,"apap":"BYEB","apsu":"BYEB","apgs_nui":1,"apgs_nbs":2,"apls_nui":3,"apls_nbs":4,"apep":1,"apaa":[],"apat":[],"apfa":[],"apas":[],"apbx":[]},"preset":"app_deploy","useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false,"b64Apaa":false}');
    sessionStorage.setItem('txnGrpKeys', '["txn_0d84"]');
    render(<GrpComposeListSlot txnIdx={0} />);
    expect(screen.getByText('txn_presets:app_deploy.heading')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.snd.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.fee.label')).toBeInTheDocument();

    expect(screen.getByText('compose_txn:fields.apap.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.apsu.label')).toBeInTheDocument();
  });

  it('displays transaction with "App Update" preset', async () => {
    // eslint-disable-next-line @stylistic/max-len
    sessionStorage.setItem('txn_0d84', '{"txn":{"type":"appl","snd":"MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4","apid":88888888,"apan":4,"apap":"BYEB","apsu":"BYEB","apaa":[],"apat":[],"apfa":[],"apas":[],"apbx":[]},"preset":"app_update","useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false,"b64Apaa":false}');
    sessionStorage.setItem('txnGrpKeys', '["txn_0d84"]');
    render(<GrpComposeListSlot txnIdx={0} />);
    expect(screen.getByText('txn_presets:app_update.heading')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.snd.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.fee.label')).toBeInTheDocument();

    expect(screen.getByText('compose_txn:fields.apid.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.apap.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.apsu.label')).toBeInTheDocument();
  });

  it('displays transaction with "App Close" preset', async () => {
    // eslint-disable-next-line @stylistic/max-len
    sessionStorage.setItem('txn_0d84', '{"txn":{"type":"appl","snd":"MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4","apid":88888888,"apan":2,"apaa":[],"apat":[],"apfa":[],"apas":[],"apbx":[]},"preset":"app_close","useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false,"b64Apaa":false}');
    sessionStorage.setItem('txnGrpKeys', '["txn_0d84"]');
    render(<GrpComposeListSlot txnIdx={0} />);
    expect(screen.getByText('txn_presets:app_close.heading')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.snd.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.fee.label')).toBeInTheDocument();

    expect(screen.getByText('compose_txn:fields.apid.label')).toBeInTheDocument();
  });

  it('displays transaction with "App Clear" preset', async () => {
    // eslint-disable-next-line @stylistic/max-len
    sessionStorage.setItem('txn_0d84', '{"txn":{"type":"appl","snd":"MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4","apid":88888888,"apan":3,"apaa":[],"apat":[],"apfa":[],"apas":[],"apbx":[]},"preset":"app_clear","useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false,"b64Apaa":false}');
    sessionStorage.setItem('txnGrpKeys', '["txn_0d84"]');
    render(<GrpComposeListSlot txnIdx={0} />);
    expect(screen.getByText('txn_presets:app_clear.heading')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.snd.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.fee.label')).toBeInTheDocument();

    expect(screen.getByText('compose_txn:fields.apid.label')).toBeInTheDocument();
  });

  it('displays transaction with "App Delete" preset', async () => {
    // eslint-disable-next-line @stylistic/max-len
    sessionStorage.setItem('txn_0d84', '{"txn":{"type":"appl","snd":"MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4","apid":88888888,"apan":5,"apaa":[],"apat":[],"apfa":[],"apas":[],"apbx":[]},"preset":"app_delete","useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false,"b64Apaa":false}');
    sessionStorage.setItem('txnGrpKeys', '["txn_0d84"]');
    render(<GrpComposeListSlot txnIdx={0} />);
    expect(screen.getByText('txn_presets:app_delete.heading')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.snd.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.fee.label')).toBeInTheDocument();

    expect(screen.getByText('compose_txn:fields.apid.label')).toBeInTheDocument();
  });

  it('displays transaction with "Register Online" preset', async () => {
    // eslint-disable-next-line @stylistic/max-len
    sessionStorage.setItem('txn_0d84', '{"txn":{"type":"keyreg","snd":"MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4","votekey":"G/lqTV6MKspW6J8wH2d8ZliZ5XZVZsruqSBJMwLwlmo=","selkey":"LrpLhvzr+QpN/bivh6IPpOaKGbGzTTB5lJtVfixmmgk=","sprfkey":"RpUpNWfZMjZ1zOOjv3MF2tjO714jsBt0GKnNsw0ihJ4HSZwci+d9zvUi3i67LwFUJgjQ5Dz4zZgHgGduElnmSA==","votefst":6000000,"votelst":6100000,"votekd":1730,"nonpart":false},"preset":"reg_online","useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false}');
    sessionStorage.setItem('txnGrpKeys', '["txn_0d84"]');
    render(<GrpComposeListSlot txnIdx={0} />);
    expect(screen.getByText('txn_presets:reg_online.heading')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.snd.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.fee.label')).toBeInTheDocument();

    expect(screen.getByText('compose_txn:fields.votefst.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.votelst.label')).toBeInTheDocument();
  });

  it('displays transaction with "Register Offline" preset', async () => {
    // eslint-disable-next-line @stylistic/max-len
    sessionStorage.setItem('txn_0d84', '{"txn":{"type":"keyreg","snd":"MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4"},"preset":"reg_offline","useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false}');
    sessionStorage.setItem('txnGrpKeys', '["txn_0d84"]');
    render(<GrpComposeListSlot txnIdx={0} />);
    expect(screen.getByText('txn_presets:reg_offline.heading')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.snd.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.fee.label')).toBeInTheDocument();
  });

  it('displays transaction with "Register Nonparticipating" preset', async () => {
    // eslint-disable-next-line @stylistic/max-len
    sessionStorage.setItem('txn_0d84', '{"txn":{"type":"keyreg","snd":"MWAPNXBDFFD2V5KWXAHWKBO7FO4JN36VR4CIBDKDDE7WAUAGZIXM3QPJW4","votekey":"","selkey":"","sprfkey":"","nonpart":true},"preset":"reg_nonpart","useSugFee":true,"useSugRounds":true,"b64Note":false,"b64Lx":false}');
    sessionStorage.setItem('txnGrpKeys', '["txn_0d84"]');
    render(<GrpComposeListSlot txnIdx={0} />);
    expect(screen.getByText('txn_presets:reg_nonpart.heading')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.snd.label')).toBeInTheDocument();
    expect(screen.getByText('compose_txn:fields.fee.label')).toBeInTheDocument();

    expect(screen.getByText('compose_txn:fields.nonpart.label')).toBeInTheDocument();
  });

  // it.skip('', async () => {
  //   render(<GrpComposeListSlot txnIdx={0} />);
  //   // TODO
  // });
});
