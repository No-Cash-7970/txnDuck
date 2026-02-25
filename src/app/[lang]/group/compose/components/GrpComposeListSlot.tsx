import { useTranslation } from '@/app/i18n/client';
import {
  IconChevronDown,
  IconChevronUp,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react';
import { type TFunction } from 'i18next';
import { useAtom, useAtomValue } from 'jotai';
import { useSearchParams } from 'next/navigation';
import { nodeConfigAtom } from "@/app/lib/node-config";
import { TransactionType } from 'algosdk';
import * as TxnData from '@/app/lib/txn-data';
import { minFee as minFeeAtom } from '@/app/lib/txn-data/atoms';
import { baseUnitsToDecimal } from '@/app/lib/utils';

type Props = {
  /** Language */
  lng?: string
  /** Transaction index */
  txnIdx: number,
};

export default function GrpComposeListSlot({ lng, txnIdx }: Props) {
  const { t } = useTranslation(lng || '', ['grp_compose', 'compose_txn', 'txn_presets', 'common']);
  const nodeConfig = useAtomValue(nodeConfigAtom);
  const minFee = useAtomValue(minFeeAtom);
  const [grpList, setGrpList] = useAtom(TxnData.storedTxnGrpKeysAtom);
  const currentURLParams = useSearchParams();
  const urlParams = currentURLParams.toString();

  // Declare and run a function to retrieve the stored transaction data for this slot. This function
  // should be automatically memoized by the React compiler because of the function arguments. This
  // is a solution to avoiding using `useEffect` borrowed from
  // <https://react.dev/learn/you-might-not-need-an-effect#caching-expensive-calculations>.
  const storedTxnData  = ((txnList: string[], idx: number) => {
    return JSON.parse(sessionStorage.getItem(txnList[idx]) ?? 'null') as TxnData.StoredTxnData;
  })(grpList, txnIdx);

  /** Remove transaction slot from the transaction group list
   * @param slotNum The slot (index within transaction group) to remove from the transaction group
   *                list. Slot numbers start from 0.
   */
  function removeTxnSlot(slotNum: number) {
    sessionStorage.removeItem(grpList[slotNum]); // Remove transaction data
    setGrpList(grpList.toSpliced(slotNum, 1));
  }

  return <>
    {storedTxnData
      // When a transaction is set
      ? (
        // eslint-disable-next-line @stylistic/max-len
        <li className={'text-ellipsis card card-side mb-4 min-w-0 min-h-20 border border-base-content/50'}>
          <GrpTxnButtons t={t} txnIdx={txnIdx} />
          <div className="card-body flex-1 pb-4 ">
            {/* Preset badge */}
            <span className='badge badge-neutral'>
              {!!storedTxnData.preset
                ? t('txn_presets:' + storedTxnData.preset + '.heading',
                  {coinName: nodeConfig.coinName ?? t('algo_other')}
                )
                : t('txn_presets:no_preset')
              }
            </span>
            <table className='table table-xs max-w-full'>
              <tbody>
                {!storedTxnData.preset && <>
                  {/* Transaction type */}
                  <tr>
                    <th role='rowheader' className='align-top'>
                      {t('compose_txn:fields.type.label')}
                    </th>
                    <td className='align-top'>
                      {t(`compose_txn:fields.type.options.${storedTxnData.txn.type}`)}
                    </td>
                  </tr>

                  {/* OnComplete (Action type) */}
                  {storedTxnData.txn.type === TransactionType.appl && <tr>
                    <th role='rowheader' className='align-top'>
                      {t('compose_txn:fields.apan.label')}
                    </th>
                    <td>
                      {t('compose_txn:fields.apan.options.'
                        + TxnData.appTypes[(storedTxnData.txn as TxnData.AppCallTxnData).apan]
                      )}
                    </td>
                  </tr>}
                </>}
                {/* Sender */}
                <tr>
                  <th role='rowheader' className='align-top'>
                    {t('compose_txn:fields.snd.label')}
                  </th>
                  <td className='max-w-36 sm:max-w-72 md:max-w-full truncate'>
                    {storedTxnData.txn.snd}
                  </td>
                </tr>

                {/* If payment transaction (that is not a rekey transaction) */}
                {(storedTxnData.txn.type === TransactionType.pay)
                && (storedTxnData.preset !== TxnData.Preset.RekeyAccount)
                && <>
                  {/* Receiver */}
                  <tr>
                    <th role='rowheader' className='align-top'>
                      {t('compose_txn:fields.rcv.label')}
                    </th>
                    <td className='max-w-36 sm:max-w-72 md:max-w-full truncate'>
                      {(storedTxnData.txn as TxnData.PaymentTxnData).rcv}
                    </td>
                  </tr>
                  {/* Amount */}
                  <tr>
                    <th role='rowheader' className='align-top'>
                      {t('compose_txn:fields.amt.label')}
                    </th>
                    <td>
                      {t('compose_txn:fields.amt.in_coin', {
                        count: (storedTxnData.txn as TxnData.PaymentTxnData).amt,
                        coinName: nodeConfig.coinName || t('algo', {
                          count: (storedTxnData.txn as TxnData.PaymentTxnData).amt
                        }),
                        formatParams: { count: { maximumFractionDigits: 6 } }
                      })}
                    </td>
                  </tr>
                  {/** Close remainder to */}
                  {/* eslint-disable-next-line @stylistic/max-len */}
                  {(storedTxnData.preset === TxnData.Preset.CloseAccount || !storedTxnData.preset) &&
                  <tr className={(storedTxnData.txn as TxnData.PaymentTxnData).close
                    ? 'bg-warning text-warning-content'
                    : ''
                  }>
                    <th role='rowheader' className='align-top'>
                      {t('compose_txn:fields.close.label')}
                    </th>
                    <td className='max-w-36 sm:max-w-72 md:max-w-full truncate'>
                      {(storedTxnData.txn as TxnData.PaymentTxnData).close
                        || <i className='opacity-50'>{t('none')}</i>
                      }
                    </td>
                  </tr>}
                </>}

                {/* If asset transfer transaction */}
                {storedTxnData.txn.type === TransactionType.axfer && <>
                  {/* Asset ID */}
                  <tr>
                    <th role='rowheader' className='align-top'>
                      {storedTxnData.retrievedAssetInfo?.name
                        ? t('compose_txn:fields.xaid.with_name_label')
                        : t('compose_txn:fields.xaid.label')
                      }
                    </th>
                    <td>
                      {storedTxnData.retrievedAssetInfo?.name
                        ? t('compose_txn:fields.xaid.with_name', {
                          name: storedTxnData.retrievedAssetInfo?.name,
                          id: (storedTxnData.txn as TxnData.AssetTransferTxnData).xaid
                        })
                        : (storedTxnData.txn as TxnData.AssetTransferTxnData).xaid
                      }
                    </td>
                  </tr>
                  {/* Asset receiver */}
                  {(storedTxnData.preset === TxnData.Preset.AssetTransfer
                    || storedTxnData.preset === TxnData.Preset.AssetClawback
                    || !storedTxnData.preset
                  ) &&
                  <tr>
                    <th role='rowheader' className='align-top'>
                      {t('compose_txn:fields.arcv.label')}
                    </th>
                    <td className='max-w-36 sm:max-w-72 md:max-w-full truncate'>
                      {(storedTxnData.txn as TxnData.AssetTransferTxnData).arcv}
                    </td>
                  </tr>}
                  {/* Asset amount */}
                  {/* eslint-disable-next-line @stylistic/max-len */}
                  {(storedTxnData.preset === TxnData.Preset.AssetTransfer || !storedTxnData.preset) &&
                  <tr>
                    <th role='rowheader' className='align-top'>
                      {t('compose_txn:fields.aamt.label')}
                    </th>
                    <td>
                      {storedTxnData.retrievedAssetInfo?.unitName
                        ? t('asset_amount', {
                          amount: baseUnitsToDecimal(
                            (storedTxnData.txn as TxnData.AssetTransferTxnData).aamt,
                            storedTxnData.retrievedAssetInfo?.decimals
                          ),
                          asset: storedTxnData.retrievedAssetInfo?.unitName,
                          formatParams: {
                            amount: {
                              maximumFractionDigits: storedTxnData.retrievedAssetInfo?.decimals ?? 0
                            }
                          }
                        })
                        : t('number_value', {
                          value: (storedTxnData.txn as TxnData.AssetTransferTxnData).aamt,
                          formatParams: {
                            value: {
                              maximumFractionDigits: storedTxnData.retrievedAssetInfo?.decimals ?? 0
                            }
                          }
                        })
                      }
                    </td>
                  </tr>}
                  {/* Close remainder of asset to */}
                  {(storedTxnData.preset === TxnData.Preset.AssetOptOut || !storedTxnData.preset) &&
                  <tr className={(storedTxnData.txn as TxnData.AssetTransferTxnData).aclose
                    ? 'bg-warning text-warning-content'
                    : ''
                  }>
                    <th role='rowheader' className='align-top'>
                      {t('compose_txn:fields.aclose.label')}
                    </th>
                    <td className='max-w-36 sm:max-w-72 md:max-w-full truncate'>
                      {(storedTxnData.txn as TxnData.AssetTransferTxnData).aclose ||
                        <i className='opacity-50'>{t('none')}</i>}
                    </td>
                  </tr>}
                  {/* Clawback target */}
                  {/* eslint-disable-next-line @stylistic/max-len */}
                  {(storedTxnData.preset === TxnData.Preset.AssetClawback || !storedTxnData.preset) &&
                  <tr>
                    <th role='rowheader' className='align-top'>
                      {t('compose_txn:fields.asnd.label')}
                    </th>
                    <td className='max-w-36 sm:max-w-72 md:max-w-full truncate'>
                      {(storedTxnData.txn as TxnData.AssetTransferTxnData).asnd ||
                        <i className='opacity-50'>{t('none')}</i>}
                    </td>
                  </tr>}
                </>}

                {/* If asset configuration transaction */}
                {storedTxnData.txn.type === TransactionType.acfg && <>
                  { // If NOT an asset creation transaction
                  (storedTxnData.txn as TxnData.AssetConfigTxnData).caid &&
                  /** Asset ID */
                  <tr>
                    <th role='rowheader' className='align-top'>
                      {storedTxnData.retrievedAssetInfo?.name
                        ? t('compose_txn:fields.caid.with_name_label')
                        : t('compose_txn:fields.caid.label')
                      }
                    </th>
                    <td>
                      {storedTxnData.retrievedAssetInfo?.name
                        ? t('compose_txn:fields.caid.with_name', {
                          name: storedTxnData.retrievedAssetInfo?.name,
                          id: (storedTxnData.txn as TxnData.AssetConfigTxnData).caid
                        })
                        : (storedTxnData.txn as TxnData.AssetConfigTxnData).caid
                      }
                    </td>
                  </tr>}

                  { // If an asset creation transaction
                  !((storedTxnData.txn as TxnData.AssetConfigTxnData).caid) && <>
                    {/* Unit name */}
                    <tr>
                      <th role='rowheader' className='align-top'>
                        {t('compose_txn:fields.apar_un.label')}
                      </th>
                      <td>
                        {(storedTxnData.txn as TxnData.AssetConfigTxnData).apar_un ||
                          <i className='opacity-50'>{t('none')}</i>}
                      </td>
                    </tr>
                    {/* Asset name */}
                    <tr>
                      <th role='rowheader' className='align-top'>
                        {t('compose_txn:fields.apar_an.label')}
                      </th>
                      <td>
                        {(storedTxnData.txn as TxnData.AssetConfigTxnData).apar_an ||
                          <i className='opacity-50'>{t('none')}</i>}
                      </td>
                    </tr>
                    {/* Total */}
                    <tr>
                      <th role='rowheader' className='align-top'>
                        {t('compose_txn:fields.apar_t.label')}
                      </th>
                      <td>
                        {(storedTxnData.txn as TxnData.AssetConfigTxnData).apar_un
                          ? t('asset_amount', {
                            amount: baseUnitsToDecimal(
                              (storedTxnData.txn as TxnData.AssetConfigTxnData).apar_t,
                              (storedTxnData.txn as TxnData.AssetConfigTxnData).apar_dc ?? 0
                            ),
                            asset: (storedTxnData.txn as TxnData.AssetConfigTxnData).apar_un,
                            formatParams: {
                              amount: {
                                minimumFractionDigits:
                                  (storedTxnData.txn as TxnData.AssetConfigTxnData).apar_dc ?? 0
                              }
                            }
                          })
                          : t('number_value', {
                            value: baseUnitsToDecimal(
                              (storedTxnData.txn as TxnData.AssetConfigTxnData).apar_t,
                              (storedTxnData.txn as TxnData.AssetConfigTxnData).apar_dc ?? 0
                            ),
                            formatParams: {
                              value: {
                                minimumFractionDigits:
                                (storedTxnData.txn as TxnData.AssetConfigTxnData).apar_dc ?? 0
                              }
                            }
                          })
                        }
                      </td>
                    </tr>
                  </>}

                  {/* If asset reconfiguration preset or a manual transaction */}
                  {/* eslint-disable-next-line @stylistic/max-len */}
                  {(storedTxnData.preset === TxnData.Preset.AssetReconfig || !storedTxnData.preset) && <>
                    {/* Manager address */}
                    <tr>
                      <th role='rowheader' className='align-top'>
                        {t('compose_txn:fields.apar_m.label')}
                      </th>
                      <td className='max-w-36 sm:max-w-72 md:max-w-full truncate'>
                        {((storedTxnData.txn as TxnData.AssetConfigTxnData).apar_m) ||
                          <i className='opacity-50'>{t('none')}</i>}
                      </td>
                    </tr>
                    {/* Freeze address */}
                    <tr>
                      <th role='rowheader' className='align-top'>
                        {t('compose_txn:fields.apar_f.label')}
                      </th>
                      <td className='max-w-36 sm:max-w-72 md:max-w-full truncate'>
                        {((storedTxnData.txn as TxnData.AssetConfigTxnData).apar_f) ||
                          <i className='opacity-50'>{t('none')}</i>}
                      </td>
                    </tr>
                    {/* Clawback address */}
                    <tr>
                      <th role='rowheader' className='align-top'>
                        {t('compose_txn:fields.apar_c.label')}
                      </th>
                      <td className='max-w-36 sm:max-w-72 md:max-w-full truncate'>
                        {((storedTxnData.txn as TxnData.AssetConfigTxnData).apar_c) ||
                          <i className='opacity-50'>{t('none')}</i>}
                      </td>
                    </tr>
                    {/* Reserve address */}
                    <tr>
                      <th role='rowheader' className='align-top'>
                        {t('compose_txn:fields.apar_r.label')}
                      </th>
                      <td className='max-w-36 sm:max-w-72 md:max-w-full truncate'>
                        {((storedTxnData.txn as TxnData.AssetConfigTxnData).apar_r) ||
                          <i className='opacity-50'>{t('none')}</i>}
                      </td>
                    </tr>
                  </>}
                </>}

                {/* If asset freeze transaction */}
                {storedTxnData.txn.type === TransactionType.afrz && <>
                  {/* Asset ID */}
                  <tr>
                    <th role='rowheader' className='align-top'>
                      {storedTxnData.retrievedAssetInfo?.name
                        ? t('compose_txn:fields.faid.with_name_label')
                        : t('compose_txn:fields.faid.label')
                      }
                    </th>
                    <td>
                      {storedTxnData.retrievedAssetInfo?.name
                        ? t('compose_txn:fields.faid.with_name', {
                          name: storedTxnData.retrievedAssetInfo?.name,
                          id: (storedTxnData.txn as TxnData.AssetFreezeTxnData).faid
                        })
                        : (storedTxnData.txn as TxnData.AssetFreezeTxnData).faid
                      }
                    </td>
                  </tr>
                  {/* Freeze address */}
                  <tr>
                    <th role='rowheader' className='align-top'>
                      {t('compose_txn:fields.fadd.label')}
                    </th>
                    <td className='max-w-36 sm:max-w-72 md:max-w-full truncate'>
                      {(storedTxnData.txn as TxnData.AssetFreezeTxnData).fadd}
                    </td>
                  </tr>
                  {/* Freeze asset? */}
                  <tr>
                    <th role='rowheader' className='align-top'>
                      {t('compose_txn:fields.afrz.label')}
                    </th>
                    <td>
                      {(storedTxnData.txn as TxnData.AssetFreezeTxnData).afrz
                        ? <b>{t('compose_txn:fields.afrz.is_frozen')}</b>
                        : t('compose_txn:fields.afrz.is_not_frozen')
                      }
                    </td>
                  </tr>
                </>}

                {/* If key registration transaction */}
                {storedTxnData.txn.type === TransactionType.keyreg &&
                <>
                  {/* If online key registration */}
                  {/* eslint-disable-next-line @stylistic/max-len */}
                  {(storedTxnData.preset === TxnData.Preset.RegOnline || !storedTxnData.preset) && <>
                    {/* First voting round */}
                    <tr>
                      <th role='rowheader' className='align-top'>
                        {t('compose_txn:fields.votefst.label')}
                      </th>
                      <td>
                        {t('number_value', {
                          value: (storedTxnData.txn as TxnData.KeyRegTxnData).votefst
                        })}
                      </td>
                    </tr>
                    {/* Last voting round */}
                    <tr>
                      <th role='rowheader' className='align-top'>
                        {t('compose_txn:fields.votelst.label')}
                      </th>
                      <td>
                        {t('number_value', {
                          value: (storedTxnData.txn as TxnData.KeyRegTxnData).votelst
                        })}
                      </td>
                    </tr>
                  </>}
                  {/* If nonparticipation key registration */}
                  {(storedTxnData.preset === TxnData.Preset.RegNonpart || !storedTxnData.preset) &&
                    /* Nonparticipation */
                    <tr className={(storedTxnData.txn as TxnData.KeyRegTxnData)?.nonpart
                      ? 'bg-warning text-warning-content'
                      : ''
                    }>
                      <th role='rowheader' className='align-top'>
                        {t('compose_txn:fields.nonpart.label')}
                      </th>
                      <td>
                        {(storedTxnData.txn as TxnData.KeyRegTxnData).nonpart
                          ? <b>{t('compose_txn:fields.nonpart.is_nonpart')}</b>
                          : t('compose_txn:fields.nonpart.is_not_nonpart')
                        }
                      </td>
                    </tr>
                  }
                </>}

                {/* If application type */}
                {storedTxnData.txn.type === TransactionType.appl && <>
                  { // If NOT an app creation transaction
                  (storedTxnData.txn as TxnData.AppCallTxnData).apid &&
                  /* Application ID */
                  <tr>
                    <th role='rowheader' className='align-top'>
                      {t('compose_txn:fields.apid.label')}
                    </th>
                    <td>{(storedTxnData.txn as TxnData.AppCallTxnData).apid}</td>
                  </tr>}

                  {/* If application creation or update transaction */}
                  {(storedTxnData.preset === TxnData.Preset.AppDeploy
                    || storedTxnData.preset === TxnData.Preset.AppUpdate)
                  && <>
                    {/* Approval program */}
                    <tr>
                      <th role='rowheader' className='align-top'>
                        {t('compose_txn:fields.apap.label')}
                      </th>
                      <td className='max-w-36 sm:max-w-72 md:max-w-full truncate'>
                        {(storedTxnData.txn as TxnData.AppCallTxnData).apap}
                      </td>
                    </tr>
                    {/* Clear-state program */}
                    <tr>
                      <th role='rowheader' className='align-top'>
                        {t('compose_txn:fields.apsu.label')}
                      </th>
                      <td className='max-w-36 sm:max-w-72 md:max-w-full truncate'>
                        {(storedTxnData.txn as TxnData.AppCallTxnData).apsu}
                      </td>
                    </tr>
                  </>}
                </>}

                {/* Rekey */}
                {(storedTxnData.preset === TxnData.Preset.RekeyAccount || !storedTxnData.preset) &&
                <tr className={storedTxnData.txn.rekey ? 'bg-warning text-warning-content' : ''}>
                  <th role='rowheader' className='align-top'>
                    {t('compose_txn:fields.rekey.label')}
                  </th>
                  <td className='max-w-36 sm:max-w-72 md:max-w-full truncate'>
                    {(storedTxnData.txn.rekey || <i className='opacity-50'>{t('none')}</i>)}
                  </td>
                </tr>}

                {/* Fee */}
                <tr>
                  <th role='rowheader' className='align-top'>
                    {t('compose_txn:fields.fee.label')}
                  </th>
                  <td className={(storedTxnData.txn.fee ?? 0) > minFee.value ? 'font-bold' : ''}>
                    {storedTxnData.useSugFee
                      ? <i>Suggested fee</i>
                      : t('compose_txn:fields.fee.in_coin', {
                        count: storedTxnData.txn.fee,
                        coinName: nodeConfig.coinName || t('algo', {count: storedTxnData.txn.fee}),
                        formatParams: { count: { maximumFractionDigits: 6 } }
                      })
                    }
                  </td>
                </tr>
              </tbody>
            </table>

            <div className='card-actions justify-between mt-2'>
              <a title={t('edit_txn_btn_title', { index: txnIdx + 1 })}
                href={
                  `/${lng}/txn/compose?`
                  + `${storedTxnData.preset
                    ? (TxnData.Preset.ParamName + '=' + storedTxnData.preset + '&')
                    : ''
                  }`
                  + `${urlParams ? urlParams + '&' : ''}`
                  + `${TxnData.txnGrpIdxParamName}=${txnIdx}&${TxnData.txnGrpEditParamName}`
                }
                className='btn btn-outline btn-accent btn-xs sm:btn-sm'
              >
                <IconEdit size={20} stroke={1.75} />
                <span className='hidden sm:inline'>{t('edit_txn_btn')}</span>
              </a>
              <button title={t('remove_slot_btn_title', { index: txnIdx + 1 })}
                className='btn btn-outline btn-error btn-xs sm:btn-sm'
                onClick={() => removeTxnSlot(txnIdx)}
              >
                <IconTrash size={20} stroke={1.75} />
                <span className='hidden sm:inline'>{t('remove_slot_btn')}</span>
              </button>
            </div>
          </div>
        </li>
      )
      // When *no* transaction is set
      : (
        <li className={'card card-side card-dash mb-4 min-w-0 min-h-20 border-base-content/75'}>
          <GrpTxnButtons t={t} txnIdx={txnIdx} />
          <div className="card-body flex-1 truncate">
            <p className='text-lg italic text-center mb-4'>
              {t('no_txn_in_slot', { index: txnIdx + 1})}
            </p>
            <div className='card-actions justify-between'>
              <a title={`Compose transaction #${txnIdx+1}`}
                // eslint-disable-next-line @stylistic/max-len
                href={`/${lng}/txn?${urlParams ? urlParams+'&' : ''}${TxnData.txnGrpIdxParamName}=${txnIdx}`}
                className='btn btn-accent btn-xs sm:btn-sm'
              >
                <IconEdit size={20} stroke={1.75} />
                <span className='hidden sm:inline'>Compose</span>
              </a>
              <button title={t('remove_slot_btn_title', { index: txnIdx + 1 })}
                className='btn btn-outline btn-error btn-xs sm:btn-sm'
                onClick={() => removeTxnSlot(txnIdx)}
              >
                <IconTrash size={20} stroke={1.75} />
                <span className='hidden sm:inline'>{t('remove_slot_btn')}</span>
              </button>
            </div>
          </div>
        </li>
      )
    }
  </>;
}

/** The side buttons displayed for each transaction */
function GrpTxnButtons({ t, txnIdx }: {
  /** Language translation function */
  t: TFunction,
  /** Transaction index */
  txnIdx: number,
}) {
  const [grpList, setGrpList] = useAtom(TxnData.storedTxnGrpKeysAtom);

  /** Move transaction slot one slot up in the transaction group list. For example, if the slot
   * number is 2, slot #3 will be moved up to become slot #2.
   * @param slotNum The slot (index within transaction group) to move in the transaction group list.
   *                Slot numbers start from 0.
   */
  function moveSlotUp(slotNum: number) {
    if (slotNum === 0) return;
    const newList = grpList.toSpliced(slotNum, 1).toSpliced(slotNum-1, 0, grpList[slotNum]);
    setGrpList(newList);
  }

  /** Move transaction slot one slot down in the transaction group list. For example, if the slot
   * number is 2, slot #3 will be moved down to become slot #4.
   * @param slotNum The slot (index within transaction group) to move in the transaction group list.
   *                Slot numbers start from 0.
   */
  function moveSlotDown(slotNum: number) {
    if (slotNum === grpList.length-1) return;
    const newList = grpList.toSpliced(slotNum, 1).toSpliced(slotNum+1, 0, grpList[slotNum]);
    setGrpList(newList);
  }

  return (
    <div className="flex flex-col justify-center py-1 pl-3 rtl:pl-0 rtl:pr-3">
      <button className="btn-ghost btn btn-sm my-1 px-1"
        title={t('move_slot_up_btn', {index: txnIdx + 1})}
        disabled={!txnIdx}
        onClick={() => moveSlotUp(txnIdx)}
      >
        <IconChevronUp />
      </button>
      <span className="text-center">{t('number_value', {value: txnIdx + 1})}</span>
      <button className="btn-ghost btn btn-sm my-1 px-1"
        title={t('move_slot_down_btn', {index: txnIdx + 1})}
        disabled={txnIdx === grpList.length-1}
        onClick={() => moveSlotDown(txnIdx)}
      >
        <IconChevronDown />
      </button>
    </div>
  );
}
