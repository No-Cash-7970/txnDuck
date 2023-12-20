'use client';

import { useState } from 'react';
import { useAtom } from 'jotai';
import { useTranslation } from '@/app/i18n/client';
import { CheckboxField, RadioButtonGroupField } from '@/app/[lang]/components/form';
import * as Settings from '@/app/lib/app-settings';
import { WalletProvider } from '@/app/[lang]/components';
import ConnectWallet from './ConnectWallet';
import ToastNotification from './ToastNotification';

type Props = {
  /** Language */
  lng?: string
};

/** Form that contains the settings fields and the reset button */
export default function SettingsForm(props: Props) {
  const { t } = useTranslation(props.lng || '', ['app', 'common']);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  /* Settings Data */
  const [theme, setTheme] = useAtom(Settings.themeAtom);
  const [ignoreFormErrors, setIgnoreFormErrors] = useAtom(Settings.ignoreFormErrorsAtom);
  // TODO: Add more settings here

  /** Notify user that the updated settings have been saved */
  const notifySave = () => {
    setToastMsg(t('settings.saved_message'));
    setToastOpen(true);
  };

  /** Save the user's theme preference and apply it */
  const applyTheme = (themeValue: Settings.Themes, notify = true) => {
    // Update theme value in local storage
    setTheme(themeValue);

    /* Apply the theme
    * NOTE: If there are significant changes to the following line, update the script in the
    *`<head>` if necessary */
    (document.querySelector('html') as HTMLHtmlElement).dataset.theme = themeValue;

    // Notify user (if the user should be notified)
    if (notify) notifySave();
  };

  /** Reset all settings to their default values  */
  const resetSettings = () => {
    // Set to defaults
    applyTheme(Settings.defaults.theme, false);
    setIgnoreFormErrors(Settings.defaults.ignoreFormErrors);
    // TODO: Add more settings here

    // Notify user of reset
    setToastMsg(t('settings.reset_message'));
    setToastOpen(true);
  };

  return (<>
    <form noValidate={true} aria-label={t('settings.heading')}>
      {/* Setting: Theme setting */}
      <RadioButtonGroupField
        name='theme'
        label={t('settings.theme_switcher.label')}
        containerClass=''
        optionClass='btn-sm disabled:checked:opacity-20'
        options={[
          { value: Settings.Themes.light, text: t('settings.theme_switcher.light') },
          { value: Settings.Themes.dark, text: t('settings.theme_switcher.dark') },
          { value: Settings.Themes.auto, text: t('settings.theme_switcher.auto') },
        ]}
        value={theme}
        onChange={(e) => applyTheme(e.target.value as Settings.Themes)}
      />

      {/* Connect wallet */}
      <div className='mt-4'>
        <WalletProvider><ConnectWallet t={t} /></WalletProvider>
      </div>

      {/* Setting: Ignore form validation errors setting */}
      <CheckboxField
        name='ignore-form-errors'
        label={t('settings.ignore_form_errors')}
        labelClass='justify-start cursor-pointer'
        inputClass='checkbox-primary me-4'
        containerClass='mt-4'
        value={ignoreFormErrors}
        onChange={(e) => {setIgnoreFormErrors(e.target.checked); notifySave();}}
      />

      {/* TODO: Add more settings here */}
    </form>
    <div className='action mt-8 grid justify-end'>
      <button className='btn btn-sm btn-link text-base-content p-0' onClick={resetSettings}>
        {t('settings.reset_button')}
      </button>
    </div>

    <ToastNotification
      lng={props.lng}
      message={toastMsg}
      open={toastOpen}
      onOpenChange={setToastOpen}
    />
  </>);
}
