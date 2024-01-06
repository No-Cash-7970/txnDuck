'use client';

import { useState } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { useTranslation } from '@/app/i18n/client';
import { CheckboxField, RadioButtonGroupField, ToggleField } from '@/app/[lang]/components/form';
import * as Settings from '@/app/lib/app-settings';
import { WalletProvider } from '@/app/[lang]/components';
import ConnectWallet from './ConnectWallet';
import ToastNotification from './ToastNotification';
import { storedSignedTxnAtom, storedTxnDataAtom } from '@/app/lib/txn-data';
import { RESET } from 'jotai/utils';

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
  const [defaultUseSugFee, setDefaultUseSugFee] = useAtom(Settings.defaultUseSugFee);
  const [assetInfoGet, setAssetInfoGet] = useAtom(Settings.assetInfoGet);
  const [defaultUseSugRounds, setDefaultUseSugRounds] = useAtom(Settings.defaultUseSugRounds);
  const [defaultApar_mUseSnd, setDefaultApar_mUseSnd] = useAtom(Settings.defaultApar_mUseSnd);
  const [defaultApar_fUseSnd, setDefaultApar_fUseSnd] = useAtom(Settings.defaultApar_fUseSnd);
  const [defaultApar_cUseSnd, setDefaultApar_cUseSnd] = useAtom(Settings.defaultApar_cUseSnd);
  const [defaultApar_rUseSnd, setDefaultApar_rUseSnd] = useAtom(Settings.defaultApar_rUseSnd);
  const [defaultAutoSend, setDefaultAutoSend] = useAtom(Settings.defaultAutoSend);
  const setStoredTxnData = useSetAtom(storedTxnDataAtom);
  const setSignedTxn = useSetAtom(storedSignedTxnAtom);
  // XXX: Add more settings here

  /** Notify user that the updated settings have been saved */
  const notifySave = () => {
    setToastMsg(t('settings.saved_message'));
    setToastOpen(true);
  };

  /** Notify user that the stored transaction data has been cleared */
  const notifyTxnDataCleared = () => {
    setToastMsg(t('settings.txn_data_cleared_msg'));
    setToastOpen(true);
  };

  /** Notify user that all stored data has been cleared */
  const notifyAllDataCleared = () => {
    setToastMsg(t('settings.all_data_cleared_msg'));
    setToastOpen(true);
  };

  /** Save the user's theme preference and apply it */
  const applyTheme = (themeValue: Settings.Themes, notify = true) => {
    // Update theme value in local storage
    setTheme(themeValue);

    // Apply the theme
    // NOTE: If there are significant changes to the following line, update the script in the
    //`<head>` if necessary */
    (document.querySelector('html') as HTMLHtmlElement).dataset.theme = themeValue;

    // Notify user (if the user should be notified)
    if (notify) notifySave();
  };

  /** Reset all settings to their default values  */
  const resetSettings = () => {
    // Set to defaults
    applyTheme(Settings.defaults.theme, false);
    setIgnoreFormErrors(Settings.defaults.ignoreFormErrors);
    setDefaultUseSugFee(Settings.defaults.defaultUseSugFee);
    setDefaultUseSugRounds(Settings.defaults.defaultUseSugRounds);
    setAssetInfoGet(Settings.defaults.assetInfoGet);
    setDefaultApar_mUseSnd(Settings.defaults.defaultApar_mUseSnd);
    setDefaultApar_fUseSnd(Settings.defaults.defaultApar_fUseSnd);
    setDefaultApar_cUseSnd(Settings.defaults.defaultApar_cUseSnd);
    setDefaultApar_rUseSnd(Settings.defaults.defaultApar_rUseSnd);
    setDefaultAutoSend(Settings.defaults.defaultAutoSend);
    // XXX: Add more settings here

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
        name='ignore_form_errors'
        label={t('settings.ignore_form_errors')}
        labelClass='justify-start cursor-pointer'
        inputClass='checkbox-primary me-4'
        containerClass='mt-4'
        value={ignoreFormErrors}
        onChange={(e) => {setIgnoreFormErrors(e.target.checked); notifySave();}}
      />

      {/* Setting: Use suggested fee by default */}
      <ToggleField
        name='default_use_sug_fee'
        label={t('settings.default_use_sug_fee')}
        inputClass='toggle-primary'
        containerClass='mt-4'
        value={defaultUseSugFee}
        onChange={(e) => {setDefaultUseSugFee(e.target.checked); notifySave();}}
      />

      {/* Setting: Use suggested rounds by default */}
      <ToggleField
        name='default_use_sug_rounds'
        label={t('settings.default_use_sug_rounds')}
        inputClass='toggle-primary'
        containerClass='mt-4'
        value={defaultUseSugRounds}
        onChange={(e) => {setDefaultUseSugRounds(e.target.checked); notifySave();}}
      />

      {/* Setting: Retrieve asset information */}
      <ToggleField
        name='get_asset_info'
        label={t('settings.get_asset_info')}
        inputClass='toggle-primary'
        containerClass='mt-4'
        value={assetInfoGet}
        onChange={(e) => {setAssetInfoGet(e.target.checked); notifySave();}}
      />

      {/* Setting: Automatically send after signing by default */}
      <ToggleField
        name='default_auto_send'
        label={t('settings.default_auto_send')}
        inputClass='toggle-primary'
        containerClass='mt-4'
        value={defaultAutoSend}
        onChange={(e) => {setDefaultAutoSend(e.target.checked); notifySave();}}
      />

      <h3>{t('settings.asset_create_title')}</h3>

      {/* Setting: Set manager address to the sender address by default */}
      <ToggleField
        name='default_apar_m_use_snd'
        label={t('settings.default_apar_m_use_snd')}
        inputClass='toggle-primary'
        containerClass='mt-3'
        value={defaultApar_mUseSnd}
        onChange={(e) => {setDefaultApar_mUseSnd(e.target.checked); notifySave();}}
      />

      {/* Setting: Set freeze address to the sender address by default */}
      <ToggleField
        name='default_apar_f_use_snd'
        label={t('settings.default_apar_f_use_snd')}
        inputClass='toggle-primary'
        containerClass='mt-3'
        value={defaultApar_fUseSnd}
        onChange={(e) => {setDefaultApar_fUseSnd(e.target.checked); notifySave();}}
      />

      {/* Setting: Set clawback address to the sender address by default */}
      <ToggleField
        name='default_apar_c_use_snd'
        label={t('settings.default_apar_c_use_snd')}
        inputClass='toggle-primary'
        containerClass='mt-3'
        value={defaultApar_cUseSnd}
        onChange={(e) => {setDefaultApar_cUseSnd(e.target.checked); notifySave();}}
      />

      {/* Setting: Set reserve address to the sender address by default */}
      <ToggleField
        name='default_apar_r_use_snd'
        label={t('settings.default_apar_r_use_snd')}
        inputClass='toggle-primary'
        containerClass='mt-3'
        value={defaultApar_rUseSnd}
        onChange={(e) => {setDefaultApar_rUseSnd(e.target.checked); notifySave();}}
      />

      <h3>{t('settings.clear_data_title')}</h3>

      {/* Clear data buttons */}
      <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2'>
        <button
          className='btn btn-sm btn-error'
          onClick={(e) => {
            e.preventDefault();
            setStoredTxnData(RESET);
            setSignedTxn(RESET);
            notifyTxnDataCleared();
          }}
        >
          {t('settings.clear_txn_data_btn')}
        </button>
        <button
          className='btn btn-sm btn-outline btn-error'
          onClick={(e) => {
            e.preventDefault();
            localStorage.clear();
            sessionStorage.clear();
            notifyAllDataCleared();
          }}
        >
          {t('settings.clear_all_data_btn')}
        </button>
      </div>

      {/* XXX: Add more settings here */}
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
