import { use } from 'react';
import { Trans } from 'react-i18next/TransWithoutContext';
import { generateLangAltsMetadata, useTranslation } from '@/app/i18n';
import { type Metadata } from 'next';
import Link from 'next/link';
import { BuilderSteps, PageTitleHeading } from '@/app/[lang]/components';
import {
  TextField,
  NumberField,
  SelectField,
  TextAreaField,
  CheckboxField,
  ToggleField,
  FieldGroup,
} from '@/app/[lang]/components/form';

export async function generateMetadata(
  { params }: { params: { lang: string } },
): Promise<Metadata> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(params.lang, 'compose_txn');

  return {
    title: t('title'),
    alternates: generateLangAltsMetadata('/txn/compose'),
  };
}

/**
 * Compose Transaction page
 */
export default function ComposeTxnPage({ params: { lang } }: {
  params: { lang: string }
}) {
  const { t } = use(useTranslation(lang, 'compose_txn'));

  return (
    <main className='prose max-w-4xl min-h-screen mx-auto pt-4 px-4 pb-12'>
      <BuilderSteps lng={lang} current='compose' />
      <PageTitleHeading badgeText=''>{t('title')}</PageTitleHeading>
      <p className='mx-4 mb-8 text-sm'>
        <Trans t={t} i18nKey='instructions'>
          asterisk_fields (<span className='text-error'>*</span>) required
        </Trans>
      </p>
      {t('coming_soon')}
      <form>
      <TextField
        label="Your Name"
        id="test-text-field"
        inputInsideLabel={true}
        containerClass='max-w-md mt-4'
        defaultValue='Duck'
        afterSideLabel='ちゃん'
        placeholder='Name'
      />
      <TextAreaField
        label="Tell us everything..."
        id="test-textarea-field"
        containerClass='max-w-lg mt-4 min-h-lg'
        inputClass='w-full'
        beforeSideLabel='👉'
        helpMsg='If you leave something out, we will punish you.'
        required={true}
        defaultValue={42}
      />

      <FieldGroup
        heading='Some Stuff'
        headingId='some-stuff'
        headingClass='text-accent mt-0'
        headingLevel={3}
        containerClass='bg-base-200 bg-opacity-50 p-4'
      >
        <NumberField
          label="Test Number Field"
          id="test-number-field"
          inputInsideLabel={false}
          containerClass='max-w-md mt-4'
          beforeSideLabel='$'
          afterSideLabel='Fee'
          min={0.01}
          step='any'
          helpMsg='Minimum fee is $0.01'
        />
        <SelectField
          label="Select something"
          id="test-select-field"
          inputInsideLabel={false}
          containerClass='max-w-xs mt-4'
          options={[
            {value: '1st', text: 'First'},
            {value: '2nd', text: 'Second'},
            {value: '3rd', text: 'Third'},
          ]}
          placeholder='Pick one'
          afterSideLabel='Option'
          defaultValue='2nd'
        />
      </FieldGroup>
      <CheckboxField
        label="I agree to all the things."
        id="test-checkbox-field"
        containerClass='mt-6 max-w-xs'
        inputClass='ms-3'
        inputInsideLabel={true}
        required={true}
        inputPosition='end'
      />
      <ToggleField
        label="Turn on the lights?"
        id="test-toggle-field"
        containerClass='mt-6 max-w-xs'
        inputClass='toggle-secondary me-4'
        inputInsideLabel={true}
        inputPosition='start'
        defaultValue={true}
      />
      </form>
    </main>
  );
}
