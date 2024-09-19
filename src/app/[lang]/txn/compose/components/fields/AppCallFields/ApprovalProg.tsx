import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { type TFunction } from 'i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import * as Dialog from '@radix-ui/react-dialog';
import { bytesToBase64 } from 'algosdkv3';
import { IconFile, IconX } from '@tabler/icons-react';
import { FieldErrorMessage, FileField, TextAreaField } from '@/app/[lang]/components/form';
import {
  Preset,
  apapConditionalRequireAtom,
  applFormControlAtom,
  showFormErrorsAtom,
  presetAtom,
  tipBtnClass,
  tipContentClass
} from '@/app/lib/txn-data';
import { fileToBytes } from '@/app/lib/utils';

export default function ApprovalProg({ t }: { t: TFunction }) {
  const preset = useSearchParams().get(Preset.ParamName);
  const form = useAtomValue(applFormControlAtom);
  const setPresetAtom = useSetAtom(presetAtom);
  const apapCondReqGroup = useAtomValue(apapConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  const [dialogOpen, setDialogOpen] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (<>
    <TextAreaField label={t('fields.apap.label')}
      name='apap'
      id='apap-input'
      tip={{
        content: t('fields.apap.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.apap.placeholder')}
      containerId='apap-field'
      containerClass='max-w-lg'
      inputClass={((showFormErrors || form.touched.apap) &&
          (form.fieldErrors.apap || (!apapCondReqGroup.isValid && apapCondReqGroup.error))
        )
        ? 'textarea-error' : ''
      }
      value={form.values.apap}
      onChange={(e) => form.handleOnChange('apap')(e.target.value)}
      onFocus={form.handleOnFocus('apap')}
      onBlur={form.handleOnBlur('apap')}
      spellCheck={false}
    />
    <Dialog.Root modal={true} open={dialogOpen} onOpenChange={setDialogOpen}>
      <Dialog.Trigger asChild>
        <div className='max-w-lg'>
          <button type='button' className='btn btn-sm btn-block btn-secondary mt-1'>
            <IconFile aria-hidden />
            {t('fields.apap.import_btn')}
          </button>
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className='modal data-[state=open]:modal-open' aria-describedby={undefined}>
          <div className='modal-box prose px-0 max-w-xl'>
            <Dialog.Title className='px-6 sm:px-8'>{t('fields.apap.import_heading')}</Dialog.Title>
            <FileField
              label={t('fields.apap.import_field_label')}
              id='apap-import'
              containerId='apap-import-field'
              containerClass='max-w-full px-6 sm:px-8 pb-6'
              inputClass='file-input file-input-primary'
              labelTextClass='sm:text-lg'
              onChange={async (e) => {
                if (!!e.target.files?.length) {
                  form.handleOnChange('apap')(bytesToBase64(await fileToBytes(e.target.files[0])));
                  setDialogOpen(false);
                }
              }}
            />
            <Dialog.Close asChild>
              <button
                className='btn-ghost btn btn-sm btn-square text-base-content fixed end-3 top-3'
                title={t('close')}
              >
                <IconX aria-hidden />
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
    {(showFormErrors || form.touched.apap) && form.fieldErrors.apap &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apap.message.key}
        dict={form.fieldErrors.apap.message.dict}
      />
    }
    {(showFormErrors || form.touched.apap) &&
      !apapCondReqGroup.isValid && apapCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(apapCondReqGroup.error as any).message.key}
        dict={(apapCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}
