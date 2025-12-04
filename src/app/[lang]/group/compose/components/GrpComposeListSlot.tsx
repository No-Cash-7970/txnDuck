import { useTranslation } from '@/app/i18n/client';
import { storedTxnGrpKeysAtom, txnGrpIdxParamName, type StoredTxnData } from '@/app/lib/txn-data';
import {
  IconChevronDown,
  IconChevronUp,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react';
import { type TFunction } from 'i18next';
import { useAtom } from 'jotai';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type Props = {
  /** Language */
  lng?: string
  /** Transaction index */
  txnIdx: number,
};

export default function GrpComposeListSlot({ lng, txnIdx }: Props) {
  const { t } = useTranslation(lng || '', ['grp_compose', 'common']);
  const [grpList, setGrpList] = useAtom(storedTxnGrpKeysAtom);
  // const [storedTxnData, setStoredTxnData] = useState<StoredTxnData|null>(null);
  const currentURLParams = useSearchParams();
  const urlParams = currentURLParams.toString();

  // Declare and run a function to retrieve the stored transaction data for this slot. This function
  // should be automatically memoized by the React compiler because of the function arguments. This
  // is a solution to avoiding using `useEffect` borrowed from
  // <https://react.dev/learn/you-might-not-need-an-effect#caching-expensive-calculations>.
  const storedTxnData  = ((txnList: string[], idx: number) => {
    return JSON.parse(sessionStorage.getItem(txnList[idx]) ?? 'null') as StoredTxnData;
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
          <div className="card-body flex-1 truncate pb-4">
            <p>Type: {storedTxnData.txn.type}</p>
            <p className='truncate'>From: {storedTxnData.txn.snd}</p>
            <p>Fee: {storedTxnData.useSugFee ? 'SUGGESTED FEE' : storedTxnData.txn.fee}</p>
            <div className='card-actions justify-between mt-2'>
              <Link title={t('edit_txn_btn_title', { index: txnIdx + 1 })}
                // eslint-disable-next-line @stylistic/max-len
                href={`/${lng}/txn/compose?${urlParams ? urlParams+'&' : ''}${txnGrpIdxParamName}=${txnIdx}`}
                className='btn btn-outline btn-accent btn-xs sm:btn-sm'
              >
                <IconEdit size={20} stroke={1.75} />
                <span className='hidden sm:inline'>{t('edit_txn_btn')}</span>
              </Link>
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
              <Link title={`Compose transaction #${txnIdx+1}`}
                // eslint-disable-next-line @stylistic/max-len
                href={`/${lng}/txn/compose?${urlParams ? urlParams+'&' : ''}${txnGrpIdxParamName}=${txnIdx}`}
                className='btn btn-accent btn-xs sm:btn-sm'
              >
                <IconEdit size={20} stroke={1.75} />
                <span className='hidden sm:inline'>Compose</span>
              </Link>
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
  const [grpList, setGrpList] = useAtom(storedTxnGrpKeysAtom);

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
