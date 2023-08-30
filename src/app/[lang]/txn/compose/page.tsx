import { use } from 'react';
import { type Metadata } from 'next';
import Link from 'next/link';
import { Trans } from 'react-i18next/TransWithoutContext';
import {
  IconAlertTriangle,
  IconAlertTriangleFilled,
  IconArrowLeft,
  IconArrowRight
} from '@tabler/icons-react';
import { generateLangAltsMetadata, useTranslation } from '@/app/i18n';
import { BuilderSteps, PageTitleHeading, ShowIf } from '@/app/[lang]/components';
import {
  TextField,
  NumberField,
  SelectField,
  TextAreaField,
  ToggleField,
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
  const { t } = use(useTranslation(lang, ['compose_txn', 'common']));
  const formId = 'compose-txn-form';

  return (
    <main className='prose max-w-4xl min-h-screen mx-auto pt-4 px-4 pb-12'>
      <BuilderSteps lng={lang} current='compose' />
      <PageTitleHeading badgeText=''>{t('title')}</PageTitleHeading>

      <form id={formId} className='max-w-3xl mx-auto mt-12 px-4'>

        <p className=' text-sm mb-8'>
          <Trans t={t} i18nKey='instructions'>
            asterisk_fields (<span className='text-error'>*</span>) required
          </Trans>
        </p>

        <SelectField label={t('fields.type.label')}
          name='type'
          id='type-field'
          required={true}
          requiredText={t('form.required')}
          inputInsideLabel={true}
          inputClass='ms-2'
          containerClass='max-w-sm'
          placeholder={t('fields.type.placeholder')}
          options={[
            { value: 'pay', text: t('fields.type.options.pay') },
            { value: 'axfer', text: t('fields.type.options.axfer') },
            { value: 'acfg', text: t('fields.type.options.acfg') },
            { value: 'afrz', text: t('fields.type.options.afrz') },
            { value: 'appl', text: t('fields.type.options.appl') },
            { value: 'keyreg', text: t('fields.type.options.keyreg') },
          ]}
        />
        <TextField label={t('fields.snd.label')}
          name='snd'
          id='snd-field'
          required={true}
          requiredText={t('form.required')}
          inputInsideLabel={false}
          placeholder={t('fields.snd.placeholder')}
          containerClass='mt-4 max-w-2xl'
        />

        {/* If payment type */}
        <ShowIf cond={true}>
          <TextField label={t('fields.rcv.label')}
            name='rcv'
            id='rcv-field'
            required={true}
            requiredText={t('form.required')}
            inputInsideLabel={false}
            placeholder={t('fields.rcv.placeholder')}
            containerClass='mt-4 max-w-2xl'
          />
          <NumberField label={t('fields.amt.label')}
            name='amt'
            id='amt-field'
            required={true}
            requiredText={t('form.required')}
            inputInsideLabel={false}
            containerClass='mt-4 max-w-xs'
            afterSideLabel={t('algo_other')}
            min={0}
            step={0.000001}
          />
        </ShowIf>

        <NumberField label={t('fields.fee.label')}
          name='fee'
          id='fee-field'
          required={true}
          requiredText={t('form.required')}
          inputInsideLabel={false}
          containerClass='mt-4 max-w-xs'
          afterSideLabel={t('algo_other')}
          min={0.001}
          step={0.000001}
          helpMsg={t('fields.fee.help_msg', { count: 0.001 })}
        />
        <TextAreaField label={t('fields.note.label')}
          name='note'
          id='note-field'
          inputInsideLabel={false}
          placeholder={t('fields.note.placeholder')}
          containerClass='mt-4 max-w-lg'
        />

        <div>
          <NumberField label={t('fields.fv.label')}
            name='fv'
            id='fv-field'
            required={true}
            requiredText={t('form.required')}
            inputInsideLabel={false}
            containerClass='mt-4 max-w-xs'
            min={1}
            step={1}
          />
          <NumberField label={t('fields.lv.label')}
            name='lv'
            id='lv-field'
            required={true}
            requiredText={t('form.required')}
            inputInsideLabel={false}
            containerClass='mt-4 max-w-xs'
            min={1}
            step={1}
          />
          <TextField label={t('fields.lx.label')}
            name='lx'
            id='lx-field'
            inputInsideLabel={false}
            containerClass='mt-4 max-w-sm'
          />
          <TextField label={t('fields.rekey.label')}
            name='rekey'
            id='rekey-field'
            inputInsideLabel={false}
            placeholder={t('fields.rekey.placeholder')}
            containerClass='mt-4 max-w-2xl'
          />
          <div className='alert alert-warning not-prose max-w-2xl my-1'>
            <IconAlertTriangle aria-hidden />
            <span>
              <Trans t={t} i18nKey='fields.rekey.warning'>
                <strong>rekeying_can_result_in_loss</strong> learn_more_at
                <a
                  href="https://developer.algorand.org/docs/get-details/accounts/rekey"
                  className="underline"
                >
                  algo_docs
                </a>.
              </Trans>
            </span>
          </div>
          {/* If payment type */}
          <ShowIf cond={true}>
            <TextField label={t('fields.close.label')}
              name='close'
              id='close-field'
              inputInsideLabel={false}
              placeholder={t('fields.close.placeholder')}
              containerClass='mt-4 max-w-2xl'
            />
            <div className='alert alert-warning not-prose max-w-2xl my-1'>
              <IconAlertTriangle aria-hidden />
              <span>
                <Trans t={t} i18nKey='fields.close.warning'>
                  if_given <strong>all_funds_will_be_sent_to_given_address</strong>
                  make_sure_you_know_what_you_are_doing
                </Trans>
              </span>
            </div>
          </ShowIf>
        </div>

        {/* Buttons */}
        <div className='grid gap-6 grid-cols-2 grid-rows-1 mx-auto mt-16'>
          <div>
            <Link type='button' href='' className='btn w-full btn-disabled'>
              <IconArrowLeft aria-hidden className='rtl:hidden' />
              <IconArrowRight aria-hidden className='hidden rtl:inline' />
              {t('txn_template_btn')}
            </Link>
            {/* <div className='alert bg-base-100 gap-1 border-0 py-0 mt-2'>
              <IconAlertTriangleFilled
                aria-hidden
                className='text-warning align-middle my-auto me-2'
              />
              <small>{t('txn_template_btn_warning')}</small>
            </div> */}
          </div>
          <div>
            <button type='button' className='btn btn-primary w-full'>
              {t('sign_txn_btn')}
              <IconArrowRight aria-hidden className='rtl:hidden' />
              <IconArrowLeft aria-hidden className='hidden rtl:inline' />
            </button>
          </div>
        </div>

      </form>
    </main>
  );
}
