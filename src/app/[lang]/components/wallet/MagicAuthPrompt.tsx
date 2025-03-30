'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { type TFunction } from 'i18next';
import { Trans } from "react-i18next";
import { type Wallet } from '@txnlab/use-wallet-react';
import { atom, useAtom } from 'jotai';
import { tipBtnClass, tipContentClass } from '@/app/lib/txn-data/constants';
import { magicEmailAtom } from '@/app/lib/wallet-utils';
import { FieldErrorMessage, TextField } from '@/app/[lang]/components/form';

/** Atom for the Magic wallet provider so the same provider instance can be used multiple
 * components
 */
export const magicProviderAtom = atom<Wallet>();
/** Atom used for notifying if the prompt for authenticating with Magic was canceled */
export const magicPromptCanceledAtom = atom(false);

/** A prompt that asks for the user's password in order to authentication using Magic */
export default function MagicAuthPrompt({ t }: { t: TFunction }) {
  const [magicProvider, setMagicProvider] = useAtom(magicProviderAtom);
  const magicEmailInputRef = useRef<HTMLInputElement>(null);
  const [magicEmail, setMagicEmail] = useAtom(magicEmailAtom);
  const [magicEmailTouched, setMagicEmailTouched] = useState(false);
  const [magicPromptCanceled, setMagicEmailCanceled] = useAtom(magicPromptCanceledAtom);
  const [doingMagicAuth, setDoingMagicAuth] = useState(false);
  const [magicAuthFailed, setMagicAuthFailed] = useState(false);

  useEffect(() => {
    // Focus on the email input field if the user is being prompted for an email address
    if (magicProvider) {
      magicEmailInputRef.current?.focus();
      return;
    }
    // Focus on "connect wallet" button only when the prompt for an email address was canceled
    if (!magicProvider && magicPromptCanceled) {
      setMagicEmailCanceled(false);
      setMagicAuthFailed(false);
      return;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [magicProvider, magicPromptCanceled]);

  return (<>
    <TextField type='email'
      name='magic_email'
      id='magic_email-input'
      inputRef={magicEmailInputRef}
      required={true}
      label={t('app:wallet.magic_prompt.email_label')}
      inputClass={ (magicEmailTouched && !magicEmail.isValid && magicEmail.isDirty)
        ? 'input-error' : undefined }
      placeholder={t('form.email_placeholder')}
      helpMsg={
        <Trans t={t} i18nKey='app:wallet.magic_prompt.disclaimer'
          components={{
            privacy: <Link href='/privacy-policy#magic-auth' target='_blank' />,
          }}
        />
      }
      tip={{
        btnIcon: 'info',
        content: t('app:wallet.magic_prompt.email_tip'),
        btnClass: tipBtnClass,
        btnTitle: t('app:wallet.magic_prompt.email_more_info'),
        contentClass: tipContentClass + ' z-2000'
      }}
      value={magicEmail.value}
      onChange={(e) => {
        setMagicEmail(e.target.value);
        setMagicAuthFailed(false);
      }}
      onBlur={() => setMagicEmailTouched(true)}
    />
    {magicEmailTouched && !magicEmail.isValid && magicEmail.isDirty &&
      <FieldErrorMessage t={t} i18nkey={(magicEmail.error as any).message.key} />
    }
    {magicAuthFailed && <FieldErrorMessage t={t} i18nkey='app:wallet.magic_prompt.fail' />}
    <div className='mt-4 grid grid-cols-1 sm:grid-cols-5 gap-3'>
      <button className='btn sm:btn-sm btn-secondary sm:col-span-3'
        disabled={!magicEmail.isValid}
        onClick={async (e) => {
          e.preventDefault();
          setDoingMagicAuth(true);
          try {
            await magicProvider?.connect({email: magicEmail.value});
            setMagicProvider(undefined);
            setMagicEmail('');
          } catch (error) {
            setMagicAuthFailed(true);
          } finally {
            setDoingMagicAuth(false);
          }
        }}
      >
        {doingMagicAuth
          ? <span className='loading loading-sm loading-spinner' />
          : t('app:wallet.magic_prompt.email_submit_btn')
        }
      </button>
      <button type='button' className='btn btn-sm sm:col-span-2' onClick={() => {
        setMagicProvider(undefined);
        setMagicEmailCanceled(true);
        setMagicEmail('');
      }}>
        {t('cancel')}
      </button>
    </div>
  </>);
}
