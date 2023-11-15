/** Fields for the compose-transaction form that are for application call transaction */

import { useSearchParams } from 'next/navigation';
import {
  NumberField,
  TextField,
  SelectField,
  TextAreaField,
  FieldGroup,
} from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { PrimitiveAtom, useAtom, useAtomValue } from 'jotai';
import * as Icons from '@tabler/icons-react';
import { BoxRef, Preset, txnDataAtoms } from '@/app/lib/txn-data';
import { OnApplicationComplete } from 'algosdk';

// https://developer.algorand.org/docs/get-details/parameter_tables/
// https://developer.algorand.org/docs/get-details/dapps/smart-contracts/apps/#resource-availability
const MAX_TOTAL_DEPS = 8;
const MAX_APP_ARGS = 16;
const MAX_GLOBALS = 64;
const MAX_LOCALS = 16;
const MAX_ACCTS = 4;

export function OnComplete({ t }: { t: TFunction }) {
  const [onComplete, setOnComplete] = useAtom(txnDataAtoms.apan);
  const preset = useSearchParams().get(Preset.ParamName);
  return (
    <SelectField label={t('fields.apan.label')}
      name='apan'
      id='apan-field'
      required={true}
      requiredText={t('form.required')}
      containerClass='mt-4 max-w-xs'
      disabled={!!preset}
      options={[
        { value: OnApplicationComplete.NoOpOC, text: t('fields.apan.options.no_op') },
        { value: OnApplicationComplete.OptInOC, text: t('fields.apan.options.opt_in') },
        { value: OnApplicationComplete.UpdateApplicationOC, text: t('fields.apan.options.update') },
        { value: OnApplicationComplete.ClearStateOC, text: t('fields.apan.options.clear') },
        { value: OnApplicationComplete.CloseOutOC, text: t('fields.apan.options.close_out') },
        { value: OnApplicationComplete.DeleteApplicationOC, text: t('fields.apan.options.delete') },
      ]}
      value={onComplete}
      onChange={(e) => setOnComplete(parseInt(e.target.value))}
    />
  );
}

export function AppId({ t }: { t: TFunction }) {
  const [appId, setAppId] = useAtom(txnDataAtoms.apid);
  const onComplete = useAtomValue(txnDataAtoms.apan);
  const preset = useSearchParams().get(Preset.ParamName);
  return (
    <TextField label={t('fields.apid.label')}
      name='apid'
      id='apid-field'
      required={onComplete !== OnApplicationComplete.NoOpOC || preset === Preset.AppRun}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerClass='mt-4 max-w-xs'
      value={appId ||''}
      onChange={(e) => setAppId(e.target.value === '' ? undefined : parseInt(e.target.value))}
      inputMode='numeric'
    />
  );
}

/** List of application arguments */
export function AppArgs({ t }: { t: TFunction }) {
  const [appArgs, dispatch] = useAtom(txnDataAtoms.apaa);
  return (
    <FieldGroup headingLevel={2} heading={t('fields.apaa.title')}>
      <div className='alert alert-info text-start'>{t('fields.apaa.no_abi_support')}</div>

      {!appArgs.length && <p className='italic'>{t('fields.apaa.none')}</p>}

      {appArgs.map(
        (argAtom, i) => <AppArgInput t={t} argAtom={argAtom} index={i} key={`${argAtom}`} />
      )}

      <div className='pt-4'>
        <button type='button'
          className='btn btn-sm btn-secondary w-full sm:w-auto sm:me-2 my-1'
          onClick={() => dispatch({ type: 'insert', value: '' })}
          disabled={appArgs.length >= MAX_APP_ARGS}
        >
          <Icons.IconPlus aria-hidden />
          {t('fields.apaa.add_btn')}
        </button>
        <button type='button'
          className='btn btn-sm btn-error w-full sm:w-auto sm:ms-2 my-1'
          onClick={() => dispatch({ type: 'remove', atom: appArgs[appArgs.length - 1] })}
          disabled={!appArgs.length}
        >
          <Icons.IconMinus aria-hidden />
          {t('fields.apaa.remove_btn')}
        </button>
      </div>
    </FieldGroup>
  );
}
function AppArgInput({ t, argAtom, index }:
  { t: TFunction, argAtom: PrimitiveAtom<string>, index: number }
) {
  const [arg, setArg] = useAtom(argAtom);
  return (
    <TextField label={t('fields.apaa.label', { index: index + 1 })}
      name={`apaa-${index}`}
      id={`apaa-field-${index}`}
      inputInsideLabel={false}
      placeholder={t('fields.apaa.placeholder', { index: index + 1 })}
      containerClass='mt-4 max-w-md'
      value={arg}
      onChange={(e) => setArg(e.target.value)}
    />
  );
}

function ApprovalProg({ t }: { t: TFunction }) {
  const [approvalProg, setApprovalProg] = useAtom(txnDataAtoms.apap);
  return (
    <TextAreaField label={t('fields.apap.label')}
      name='apap'
      id='apap-field'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.apap.placeholder')}
      containerClass='mt-4 max-w-lg'
      value={approvalProg}
      onChange={(e) => setApprovalProg(e.target.value)}
    />
  );
}

function ClearStateProg({ t }: { t: TFunction }) {
  const [clearStateProg, setClearStateProg] = useAtom(txnDataAtoms.apsu);
  const onComplete = useAtomValue(txnDataAtoms.apan);
  const appId = useAtomValue(txnDataAtoms.apid);
  return (
    (
      (onComplete === OnApplicationComplete.NoOpOC && !appId)
      || onComplete === OnApplicationComplete.UpdateApplicationOC
    )
    &&
    <TextAreaField label={t('fields.apsu.label')}
      name='apsu'
      id='apsu-field'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.apsu.placeholder')}
      containerClass='mt-4 max-w-lg'
      value={clearStateProg}
      onChange={(e) => setClearStateProg(e.target.value)}
    />
  );
}

function GlobalInts({ t }: { t: TFunction }) {
  const [globalInts, setGlobalInts] = useAtom(txnDataAtoms.apgs_nui);
  const globalByteSlices = useAtomValue(txnDataAtoms.apgs_nbs);
  return (
    <NumberField label={t('fields.apgs_nui.label')}
      name='apgs_nui'
      id='apgs_nui-field'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerClass='mt-4 max-w-xs'
      min={0}
      max={MAX_GLOBALS - (globalByteSlices ?? 0)}
      step={1}
      value={`${globalInts ?? ''}`}
      onChange={(e) => setGlobalInts(e.target.value === '' ? undefined : parseInt(e.target.value))}
    />
  );
}

function GlobalByteSlices({ t }: { t: TFunction }) {
  const [globalByteSlices, setGlobalByteSlices] = useAtom(txnDataAtoms.apgs_nbs);
  const globalInts = useAtomValue(txnDataAtoms.apgs_nui);
  return (
    <NumberField label={t('fields.apgs_nbs.label')}
      name='apgs_nbs'
      id='apgs_nbs-field'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerClass='mt-4 max-w-xs'
      min={0}
      max={MAX_GLOBALS - (globalInts ?? 0)}
      step={1}
      value={`${globalByteSlices ?? ''}`}
      onChange={
        (e) => setGlobalByteSlices(e.target.value === '' ? undefined : parseInt(e.target.value))
      }
    />
  );
}

function LocalInts({ t }: { t: TFunction }) {
  const [localInts, setLocalInts] = useAtom(txnDataAtoms.apls_nui);
  const localByteSlices = useAtomValue(txnDataAtoms.apls_nbs);
  return (
    <NumberField label={t('fields.apls_nui.label')}
      name='apls_nui'
      id='apls_nui-field'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerClass='mt-4 max-w-xs'
      min={0}
      max={MAX_LOCALS - (localByteSlices ?? 0)}
      step={1}
      value={`${localInts ?? ''}`}
      onChange={(e) => setLocalInts(e.target.value === '' ? undefined : parseInt(e.target.value))}
    />
  );
}

function LocalByteSlices({ t }: { t: TFunction }) {
  const [localByteSlices, setLocalByteSlices] = useAtom(txnDataAtoms.apls_nbs);
  const localInts = useAtomValue(txnDataAtoms.apls_nui);
  return (
    <NumberField label={t('fields.apls_nbs.label')}
      name='apls_nbs'
      id='apls_nbs-field'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerClass='mt-4 max-w-xs'
      min={0}
      max={MAX_LOCALS - (localInts ?? 0)}
      step={1}
      value={`${localByteSlices ?? ''}`}
      onChange={
        (e) => setLocalByteSlices(e.target.value === '' ? undefined : parseInt(e.target.value))
      }
    />
  );
}

function ExtraPages({ t }: { t: TFunction }) {
  const [extraPages, setExtraPages] = useAtom(txnDataAtoms.apep);
  return (
    <NumberField label={t('fields.apep.label')}
      name='apep'
      id='apep-field'
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      containerClass='mt-4 max-w-xs'
      min={0}
      step={1}
      value={`${extraPages ?? ''}`}
      onChange={(e) => setExtraPages(e.target.value === '' ? undefined : parseInt(e.target.value))}
    />
  );
}

/** Application properties section */
export function AppProperties({ t }: { t: TFunction }) {
  const onComplete = useAtomValue(txnDataAtoms.apan);
  const appId = useAtomValue(txnDataAtoms.apid);
  return (
    (
      (onComplete === OnApplicationComplete.NoOpOC && !appId)
      || onComplete === OnApplicationComplete.UpdateApplicationOC // updating app
    ) &&
    <FieldGroup headingLevel={2} heading={t('fields.app_props_title')}>
      <ApprovalProg t={t} />
      <ClearStateProg t={t} />
      {// Creating app
      onComplete === OnApplicationComplete.NoOpOC && <>
        <FieldGroup headingLevel={3} heading={t('fields.global_state_title')}>
          <GlobalInts t={t} />
          <GlobalByteSlices t={t} />
        </FieldGroup>
        <FieldGroup headingLevel={3} heading={t('fields.local_state_title')}>
          <LocalInts t={t} />
          <LocalByteSlices t={t} />
        </FieldGroup>
        <FieldGroup headingLevel={3} heading={t('fields.extra_pages_title')}>
          <ExtraPages t={t} />
        </FieldGroup>
      </>}
    </FieldGroup>
  );
}

/** List of application accounts */
function AppAccts({ t }: { t: TFunction }) {
  const [appAccts, dispatch] = useAtom(txnDataAtoms.apat);
  const appForeignApps = useAtomValue(txnDataAtoms.apfa);
  const appForeignAssets = useAtomValue(txnDataAtoms.apas);
  const boxes = useAtomValue(txnDataAtoms.apbx);
  return (<>
    {!appAccts.length && <p className='italic'>{t('fields.apat.none')}</p>}

    {appAccts.map(
      (acctAtom, i) => <AppAcctInput t={t} acctAtom={acctAtom} index={i} key={`${acctAtom}`} />
    )}

    <div className='py-4'>
      <button type='button'
        className='btn btn-sm btn-secondary w-full sm:w-auto sm:me-2 my-1'
        onClick={() => dispatch({ type: 'insert', value: '' })}
        disabled={
          (appAccts.length + appForeignApps.length + appForeignAssets.length + boxes.length)
            >= MAX_TOTAL_DEPS
          || appAccts.length >= MAX_ACCTS
        }
      >
        <Icons.IconPlus aria-hidden />
        {t('fields.apat.add_btn')}
      </button>
      <button type='button'
        className='btn btn-sm btn-error w-full sm:w-auto sm:ms-2 my-1'
        onClick={() => dispatch({ type: 'remove', atom: appAccts[appAccts.length - 1] })}
        disabled={!appAccts.length}
      >
        <Icons.IconMinus aria-hidden />
        {t('fields.apat.remove_btn')}
      </button>
    </div>
  </>);
}
function AppAcctInput({ t, acctAtom, index }:
  { t: TFunction, acctAtom: PrimitiveAtom<string>, index: number }
) {
  const [acct, setAcct] = useAtom(acctAtom);
  return (
    <TextField label={t('fields.apat.label', { index: index + 1 })}
      name={`apat-${index}`}
      id={`apat-field-${index}`}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.apat.placeholder', { index: index + 1 })}
      containerClass='mt-4'
      value={acct}
      onChange={(e) => setAcct(e.target.value)}
    />
  );
}

/** List of application foreign apps */
function ForeignApps({ t }: { t: TFunction }) {
  const [appForeignApps, dispatch] = useAtom(txnDataAtoms.apfa);
  const appAccts = useAtomValue(txnDataAtoms.apat);
  const appForeignAssets = useAtomValue(txnDataAtoms.apas);
  const boxes = useAtomValue(txnDataAtoms.apbx);
  return (<>
    {!appForeignApps.length && <p className='italic'>{t('fields.apfa.none')}</p>}

    {appForeignApps.map(
      (appAtom, i) => <ForeignAppInput t={t} appAtom={appAtom} index={i} key={`${appAtom}`} />
    )}

    <div className='py-4'>
      <button type='button'
        className='btn btn-sm btn-secondary w-full sm:w-auto sm:me-2 my-1'
        onClick={() => dispatch({ type: 'insert', value: null })}
        disabled={
          (appAccts.length + appForeignApps.length + appForeignAssets.length + boxes.length)
            >= MAX_TOTAL_DEPS
        }
      >
        <Icons.IconPlus aria-hidden />
        {t('fields.apfa.add_btn')}
      </button>
      <button type='button'
        className='btn btn-sm btn-error w-full sm:w-auto sm:ms-2 my-1'
        onClick={
          () => dispatch({ type: 'remove', atom: appForeignApps[appForeignApps.length - 1] })
        }
        disabled={!appForeignApps.length}
      >
        <Icons.IconMinus aria-hidden />
        {t('fields.apfa.remove_btn')}
      </button>
    </div>
  </>);
}
function ForeignAppInput({ t, appAtom, index }:
  { t: TFunction, appAtom: PrimitiveAtom<number|null>, index: number }
) {
  const [app, setApp] = useAtom(appAtom);
  return (
    <TextField label={t('fields.apfa.label', { index: index + 1 })}
      name={`apfa-${index}`}
      id={`apfa-field-${index}`}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.apfa.placeholder', { index: index + 1 })}
      containerClass='mt-4 max-w-xs'
      value={app ?? ''}
      onChange={(e) => setApp(e.target.value === '' ? null : parseInt(e.target.value))}
      inputMode='numeric'
    />
  );
}

/** List of application foreign assets */
function ForeignAssets({ t }: { t: TFunction }) {
  const [appForeignAssets, dispatch] = useAtom(txnDataAtoms.apas);
  const appAccts = useAtomValue(txnDataAtoms.apat);
  const appForeignApps = useAtomValue(txnDataAtoms.apfa);
  const boxes = useAtomValue(txnDataAtoms.apbx);
  return (<>
    {!appForeignAssets.length && <p className='italic'>{t('fields.apas.none')}</p>}

    {appForeignAssets.map(
      (assetAtom, i) => (
        <ForeignAssetInput t={t} assetAtom={assetAtom} index={i} key={`${assetAtom}`} />
      )
    )}

    <div className='py-4'>
      <button type='button'
        className='btn btn-sm btn-secondary w-full sm:w-auto sm:me-2 my-1'
        onClick={() => dispatch({ type: 'insert', value: null })}
        disabled={
          (appAccts.length + appForeignApps.length + appForeignAssets.length + boxes.length)
            >= MAX_TOTAL_DEPS
        }
      >
        <Icons.IconPlus aria-hidden />
        {t('fields.apas.add_btn')}
      </button>
      <button type='button'
        className='btn btn-sm btn-error w-full sm:w-auto sm:ms-2 my-1'
        onClick={
          () => dispatch({ type: 'remove', atom: appForeignAssets[appForeignAssets.length - 1] })
        }
        disabled={!appForeignAssets.length}
      >
        <Icons.IconMinus aria-hidden />
        {t('fields.apas.remove_btn')}
      </button>
    </div>
  </>);
}
function ForeignAssetInput({ t, assetAtom, index }:
  { t: TFunction, assetAtom: PrimitiveAtom<number|null>, index: number }
) {
  const [asset, setAsset] = useAtom(assetAtom);
  return (
    <TextField label={t('fields.apas.label', { index: index + 1 })}
      name={`apas-${index}`}
      id={`apas-field-${index}`}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.apas.placeholder', { index: index + 1 })}
      containerClass='mt-4 max-w-xs'
      value={asset ?? ''}
      onChange={(e) => setAsset(e.target.value === '' ? null : parseInt(e.target.value))}
      inputMode='numeric'
    />
  );
}

/** List of application boxes */
function Boxes({ t }: { t: TFunction }) {
  const [boxes, dispatch] = useAtom(txnDataAtoms.apbx);
  const appAccts = useAtomValue(txnDataAtoms.apat);
  const appForeignApps = useAtomValue(txnDataAtoms.apfa);
  const appForeignAssets = useAtomValue(txnDataAtoms.apas);
  return (<>
    {!boxes.length && <p className='italic'>{t('fields.apbx.none')}</p>}

    {boxes.map(
      (boxAtom, i) =>
        <FieldGroup headingLevel={4}
          heading={t('fields.apbx.box_title', { index: i + 1 })}
          key={`${boxAtom}`}
        >
          <BoxIdInput t={t} boxAtom={boxAtom} index={i} />
          <BoxNameInput t={t} boxAtom={boxAtom} index={i} />
        </FieldGroup>
    )}

    <div className='py-4'>
      <button type='button'
        className='btn btn-sm btn-secondary w-full sm:w-auto sm:me-2 my-1'
        onClick={() => dispatch({ type: 'insert', value: {i: null, n: ''} })}
        disabled={
          (appAccts.length + appForeignApps.length + appForeignAssets.length + boxes.length)
            >= MAX_TOTAL_DEPS
        }
      >
        <Icons.IconPlus aria-hidden />
        {t('fields.apbx.add_btn')}
      </button>
      <button type='button'
        className='btn btn-sm btn-error w-full sm:w-auto sm:ms-2 my-1'
        onClick={
          () => dispatch({ type: 'remove', atom: boxes[boxes.length - 1] })
        }
        disabled={!boxes.length}
      >
        <Icons.IconMinus aria-hidden />
        {t('fields.apbx.remove_btn')}
      </button>
    </div>
  </>);
}
function BoxIdInput({ t, boxAtom, index }:
  { t: TFunction, boxAtom: PrimitiveAtom<BoxRef>, index: number }
) {
  const [box, setBox] = useAtom(boxAtom);
  return (
    <TextField label={t('fields.apbx_i.label', { index: index + 1 })}
      name={`apbx_i-${index}`}
      id={`apbx_i-field-${index}`}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.apbx_i.placeholder', { index: index + 1 })}
      containerClass='mt-4 max-w-xs'
      value={box.i ?? ''}
      onChange={(e) => setBox({...box, i: e.target.value === '' ? null : parseInt(e.target.value)})}
      inputMode='numeric'
    />
  );
}
function BoxNameInput({ t, boxAtom, index }:
  { t: TFunction, boxAtom: PrimitiveAtom<BoxRef>, index: number }
) {
  const [box, setBox] = useAtom(boxAtom);
  return (
    <TextField label={t('fields.apbx_n.label', { index: index + 1 })}
      name={`apbx_n-${index}`}
      id={`apbx_n-field-${index}`}
      inputInsideLabel={false}
      placeholder={t('fields.apbx_n.placeholder', { index: index + 1 })}
      containerClass='mt-4 max-w-sm'
      value={box.n}
      onChange={(e) => setBox({...box, n: e.target.value})}
    />
  );
}

/** Application dependencies section */
export function AppDependencies({ t }: { t: TFunction }) {
  return (
    <FieldGroup headingLevel={2} heading={t('fields.app_deps_title')}>
      <FieldGroup headingLevel={3} heading={t('fields.apat.title')}>
        <AppAccts t={t} />
      </FieldGroup>
      <FieldGroup headingLevel={3} heading={t('fields.apfa.title')}>
        <ForeignApps t={t} />
      </FieldGroup>
      <FieldGroup headingLevel={3} heading={t('fields.apas.title')}>
        <ForeignAssets t={t} />
      </FieldGroup>
      <FieldGroup headingLevel={3} heading={t('fields.apbx.title')}>
        <Boxes t={t} />
      </FieldGroup>
    </FieldGroup>
  );
}
