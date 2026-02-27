'use client';

import { useTranslation } from "@/app/i18n/client";
import { MAX_GRP_TXNS, storedTxnGrpKeysAtom } from "@/app/lib/txn-data";
import { useAtom } from "jotai";
import GrpComposeListSlot from "./GrpComposeListSlot";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

type Props = {
  /** Language */
  lng?: string
};

/** A list that contains the group transactions */
export default function GrpComposeList({ lng }: Props) {
  const { t } = useTranslation(lng || '', ['grp_compose']);
  const [grpList, setGrpList] = useAtom(storedTxnGrpKeysAtom);

  /** Adds slot to the transaction group list */
  function addTxnSlot() {
    if (grpList.length < MAX_GRP_TXNS) {
      setGrpList([...grpList, '']);
    }
  }

  return <>
    <ol className='not-prose'>
      {grpList.length
        ? grpList.map((storageKey, i) => <GrpComposeListSlot key={i} lng={lng} txnIdx={i} />)
        : <li className='text-lg text-center italic mt-10 mb-8'>{t('grp_list_no_txn')}</li>
      }
    </ol>
    <button className='btn btn-block btn-secondary btn-sm'
      disabled={grpList.length >= MAX_GRP_TXNS}
      onClick={addTxnSlot}
    >
      <IconPlus size={20} stroke={2} />
      {t('add_slot_btn')}
    </button>
    {/* <div className="mt-8 mb-4"> */}
      {/* TODO: Calculate pooled transaction fee and give error when min fee isn't covered */}
      {/* <p className='mt-0 mb-0'> */}
        {/* Current total fee: {0} Algos */}
      {/* </p> */}
      {/* <p className='mt-0 mb-0'> */}
        {/* Minimum total fee: {(grpList.length * MIN_TX_FEE) / 1_000_000} Algos */}
      {/* </p> */}
    {/* </div> */}
    <Link href={`/${lng}/group/sign`} className={
      `btn btn-lg btn-block btn-primary font-bold mt-10`
      + ((grpList.length && grpList.indexOf('') === -1) ? '' : ' btn-disabled')
    }>
      {t('review_sign_btn')}
    </Link>
  </>;
}
