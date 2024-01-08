import { useSearchParams } from 'next/navigation';
import { FieldGroup } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import { OnApplicationComplete } from 'algosdk';
import { Preset, applFormControlAtom } from '@/app/lib/txn-data';
import ApprovalProg from './ApprovalProg';
import ClearStateProg from './ClearStateProg';
import dynamic from 'next/dynamic';
import { ExtraSmallField } from '../LoadingPlaceholders';

const GlobalInts = dynamic(() => import('./GlobalInts'),
  { ssr: false, loading: () => <ExtraSmallField containerClass='mt-6' /> },
);
const GlobalByteSlices = dynamic(() => import('./GlobalByteSlices'),
  { ssr: false, loading: () => <ExtraSmallField containerClass='mt-6' /> },
);
const LocalInts = dynamic(() => import('./LocalInts'),
  { ssr: false, loading: () => <ExtraSmallField containerClass='mt-6' /> },
);
const LocalByteSlices = dynamic(() => import('./LocalByteSlices'),
  { ssr: false, loading: () => <ExtraSmallField containerClass='mt-6' /> },
);
const ExtraPages = dynamic(() => import('./ExtraPages'),
  { ssr: false, loading: () => <ExtraSmallField containerClass='mt-6' /> },
);

/** Application properties section */
export default function AppProperties({ t }: { t: TFunction }) {
  const form = useAtomValue(applFormControlAtom);
  const preset = useSearchParams().get(Preset.ParamName);
  return (
    ( // Creating application
      ((!preset && form.values.apan === OnApplicationComplete.NoOpOC && !form.values.apid)
        || preset === Preset.AppDeploy)
      // updating application
      || form.values.apan === OnApplicationComplete.UpdateApplicationOC
    ) &&
    <FieldGroup headingLevel={2} heading={t('fields.app_props_heading')}>
      <ApprovalProg t={t} />
      <ClearStateProg t={t} />
      {// Creating app
      form.values.apan === OnApplicationComplete.NoOpOC && <>
        <FieldGroup headingLevel={3} heading={t('fields.app_global_state.heading')}>
          <GlobalInts t={t} />
          <GlobalByteSlices t={t} />
        </FieldGroup>
        <FieldGroup headingLevel={3} heading={t('fields.app_local_state.heading')}>
          <LocalInts t={t} />
          <LocalByteSlices t={t} />
        </FieldGroup>
        <FieldGroup headingLevel={3} heading={t('fields.apep.section_heading')}>
          <ExtraPages t={t} />
        </FieldGroup>
      </>}
    </FieldGroup>
  );
}
