import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { type TFunction } from 'i18next';
import { useAtomValue, useSetAtom } from 'jotai';
import * as Dialog from '@radix-ui/react-dialog';
import { IconFile, IconX } from '@tabler/icons-react';
import { FileField, TextAreaField } from '@/app/[lang]/components/form';
import {
  Preset,
  apsuConditionalRequireAtom,
  applFormControlAtom,
  showFormErrorsAtom,
  presetAtom,
  tipBtnClass,
  tipContentClass
} from '@/app/lib/txn-data';
import { bytesToBase64 } from '@/app/lib/utils';
import FieldErrorMessage from '../FieldErrorMessage';

export default function ClearStateProg({ t }: { t: TFunction }) {
  const preset = useSearchParams().get(Preset.ParamName);
  const form = useAtomValue(applFormControlAtom);
  const setPresetAtom = useSetAtom(presetAtom);
  const apsuCondReqGroup = useAtomValue(apsuConditionalRequireAtom);
  const showFormErrors = useAtomValue(showFormErrorsAtom);
  const [dialogOpen, setDialogOpen] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setPresetAtom(preset), [preset]);

  return (<>
    <TextAreaField label={t('fields.apsu.label')}
      name='apsu'
      id='apsu-input'
      tip={{
        content: t('fields.apsu.tip'),
        btnClass: tipBtnClass,
        btnTitle: t('fields.more_info'),
        contentClass: tipContentClass
      }}
      required={true}
      requiredText={t('form.required')}
      inputInsideLabel={false}
      placeholder={t('fields.apsu.placeholder')}
      containerId='apsu-field'
      containerClass='mt-4 max-w-lg'
      inputClass={((showFormErrors || form.touched.apsu) &&
          (form.fieldErrors.apsu || (!apsuCondReqGroup.isValid && apsuCondReqGroup.error))
        )
        ? 'textarea-error' : ''
      }
      value={form.values.apsu}
      onChange={(e) => form.handleOnChange('apsu')(e.target.value)}
      onFocus={form.handleOnFocus('apsu')}
      onBlur={form.handleOnBlur('apsu')}
      spellCheck={false}
    />
    <Dialog.Root modal={true} open={dialogOpen} onOpenChange={setDialogOpen}>
      <Dialog.Trigger asChild>
        <div className='max-w-lg'>
          <button type='button' className='btn btn-sm btn-block btn-secondary mt-1'>
            <IconFile aria-hidden />
            {t('fields.apsu.import_btn')}
          </button>
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className='modal data-[state=open]:modal-open' aria-describedby={undefined}>
          <div className='modal-box prose px-0 max-w-xl'>
            <Dialog.Title className='px-6 sm:px-8'>{t('fields.apsu.import_heading')}</Dialog.Title>
            <FileField
              label={t('fields.apsu.import_field_label')}
              id='apsu-import'
              containerId='apsu-import-field'
              containerClass='max-w-full px-6 sm:px-8 pb-6'
              inputClass='file-input file-input-primary'
              labelTextClass='sm:text-lg'
              onChange={async (e) => {
                if (!!e.target.files?.length) {
                  const file = e.target.files[0];
                  const fileData = await new Promise((resolve, reject) => {
                    const reader = Object.assign(new FileReader(), {
                      onload: () => resolve(reader.result),
                      onerror: () => reject(reader.error),
                    });
                    reader.readAsArrayBuffer(file);
                  });
                  const byteData = new Uint8Array(fileData as ArrayBuffer);
                  form.handleOnChange('apsu')(await bytesToBase64(byteData));
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
    {(showFormErrors || form.touched.apsu) && form.fieldErrors.apsu &&
      <FieldErrorMessage t={t}
        i18nkey={form.fieldErrors.apsu.message.key}
        dict={form.fieldErrors.apsu.message.dict}
      />
    }
    {(showFormErrors || form.touched.apsu) &&
      !apsuCondReqGroup.isValid && apsuCondReqGroup.error &&
      <FieldErrorMessage t={t}
        i18nkey={(apsuCondReqGroup.error as any).message.key}
        dict={(apsuCondReqGroup.error as any).message.dict}
      />
    }
  </>);
}
