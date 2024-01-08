import { FieldGroup } from '@/app/[lang]/components/form';
import { type TFunction } from 'i18next';
import { useAtomValue } from 'jotai';
import { IconExclamationCircle } from '@tabler/icons-react';
import { MAX_APP_TOTAL_DEPS, tipBtnClass, tipContentClass } from '@/app/lib/txn-data';
import * as txnDataAtoms from '@/app/lib/txn-data/atoms';
import AppAccts from './AppAccts';
import ForeignApps from './ForeignApps';
import ForeignAssets from './ForeignAssets';
import Boxes from './Boxes';

/** Application dependencies section */
export default function AppDependencies({ t }: { t: TFunction }) {
  const appAccts = useAtomValue(txnDataAtoms.apat);
  const appForeignApps = useAtomValue(txnDataAtoms.apfa);
  const appForeignAssets = useAtomValue(txnDataAtoms.apas);
  const boxes = useAtomValue(txnDataAtoms.apbx);
  return (
    <FieldGroup headingLevel={2} heading={t('fields.app_deps.heading')} headingClass='mb-0'>
      {
        ((appAccts.length + appForeignApps.length + appForeignAssets.length + boxes.length)
          > MAX_APP_TOTAL_DEPS)
        &&
        <div className='alert alert-error text-start' id='apdeps-field'>
          <IconExclamationCircle aria-hidden />
          {t('form.error.app.max_deps', {count: MAX_APP_TOTAL_DEPS})}
        </div>
      }
      <FieldGroup
        headingLevel={3}
        heading={t('fields.apat.heading')}
        tip={{
          content: t('fields.apat.tip'),
          btnClass: tipBtnClass,
          btnTitle: t('fields.more_info_section'),
          contentClass: tipContentClass
        }}
      >
        <AppAccts t={t} />
      </FieldGroup>
      <FieldGroup
        headingLevel={3}
        heading={t('fields.apfa.heading')}
        tip={{
          content: t('fields.apfa.tip'),
          btnClass: tipBtnClass,
          btnTitle: t('fields.more_info_section'),
          contentClass: tipContentClass
        }}
      >
        <ForeignApps t={t} />
      </FieldGroup>
      <FieldGroup
        headingLevel={3}
        heading={t('fields.apas.heading')}
        tip={{
          content: t('fields.apas.tip'),
          btnClass: tipBtnClass,
          btnTitle: t('fields.more_info_section'),
          contentClass: tipContentClass
        }}
      >
        <ForeignAssets t={t} />
      </FieldGroup>
      <FieldGroup
        headingLevel={3}
        heading={t('fields.apbx.heading')}
        tip={{
          content: t('fields.apbx.tip'),
          btnClass: tipBtnClass,
          btnTitle: t('fields.more_info_section'),
          contentClass: tipContentClass
        }}
      >
        <Boxes t={t} />
      </FieldGroup>
    </FieldGroup>
  );
}
