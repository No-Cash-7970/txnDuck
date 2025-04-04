'use client';

import { useEffect, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
import { useTranslation } from "@/app/i18n/client";
import { Trans } from "react-i18next";
import { ToastNotification, WalletProvider, ThemeChanger } from "@/app/[lang]/components";
import { NumberField, ToggleField } from "@/app/[lang]/components/form";
import { useDebouncedCallback } from "use-debounce";
import * as Settings from "@/app/lib/app-settings";
import { storedSignedTxnAtom, storedTxnDataAtom } from "@/app/lib/txn-data";
import ConnectWallet from "./ConnectWallet";
import { IconExclamationCircle } from "@tabler/icons-react";
import { applyTheme } from "@/app/lib/utils";

type Props = {
  /** Language */
  lng?: string
};

/*
 * ADDING, REMOVING OR UPDATING SETTINGS
 *
 * When adding, removing or updating a setting, apply the relevant changes to the 3 sections here:
 *   1. Settings data
 *   2. Within the function to reset settings to default values
 *   3. Settings
 *
 * The places where you need to make the relevant changes are mark with "XXX" comments here. Also,
 * do not forget to update the tests for the settings dialog.
 */

/** Form that contains the settings fields and the reset button */
export default function SettingsForm(props: Props) {
  const { t } = useTranslation(props.lng || '', ['app', 'common']);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  /* Settings Data */
  const setTheme = useSetAtom(Settings.themeAtom);
  const [disallowFormErrors, setDisallowFormErrors] = useAtom(Settings.disallowFormErrorsAtom);
  const [defaultUseSugFee, setDefaultUseSugFee] = useAtom(Settings.defaultUseSugFee);
  const [assetInfoGet, setAssetInfoGet] = useAtom(Settings.assetInfoGet);
  const [defaultUseSugRounds, setDefaultUseSugRounds] = useAtom(Settings.defaultUseSugRounds);
  const [defaultApar_mUseSnd, setDefaultApar_mUseSnd] = useAtom(Settings.defaultApar_mUseSnd);
  const [defaultApar_fUseSnd, setDefaultApar_fUseSnd] = useAtom(Settings.defaultApar_fUseSnd);
  const [defaultApar_cUseSnd, setDefaultApar_cUseSnd] = useAtom(Settings.defaultApar_cUseSnd);
  const [defaultApar_rUseSnd, setDefaultApar_rUseSnd] = useAtom(Settings.defaultApar_rUseSnd);
  const [defaultAutoSend, setDefaultAutoSend] = useAtom(Settings.defaultAutoSend);
  const [alwaysClearAfterSend, setAlwaysClearAfterSend] = useAtom(Settings.alwaysClearAfterSend);
  const [defaultHideSendInfo, setDefaultHideSendInfo] = useAtom(Settings.defaultHideSendInfo);
  const [confirmWaitRounds, setConfirmWaitRounds] = useAtom(Settings.confirmWaitRounds);
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

  /** Reset all settings to their default values  */
  const resetSettings = () => {
    // Set to defaults
    applyTheme('', () => setTheme(RESET));
    setDisallowFormErrors(RESET);
    setDefaultUseSugFee(RESET);
    setDefaultUseSugRounds(RESET);
    setAssetInfoGet(RESET);
    setDefaultApar_mUseSnd(RESET);
    setDefaultApar_fUseSnd(RESET);
    setDefaultApar_cUseSnd(RESET);
    setDefaultApar_rUseSnd(RESET);
    setDefaultAutoSend(RESET);
    setAlwaysClearAfterSend(RESET);
    setDefaultHideSendInfo(RESET);
    setConfirmWaitRounds(RESET);
    // XXX: Add more settings here

    // Notify user of reset
    setToastMsg(t('settings.reset_message'));
    setToastOpen(true);
  };

  /** Debounced "onChange" event function for "transaction confirm wait" setting in storage so the
   * setting is saved only when the user stops changing the value
   */
  const onChangeConfirmWait = useDebouncedCallback((value) => {
    setConfirmWaitRounds(value);
    notifySave();
  }, 750);

  // Temporary state variable so the changes to the input value are not debounced
  const [tempConfirmWaitRounds, setTempConfirmWaitRounds] =
    useState<number|string>(Settings.defaults.confirmWaitRounds);

  // Set the temporary state variable for "transaction confirm wait" input value to the value in
  // storage (or default if nothing in storage)
  useEffect(() => setTempConfirmWaitRounds(confirmWaitRounds), [confirmWaitRounds]);

  return (<>
    <form noValidate={true} aria-label={t('settings.heading')} onSubmit={(e) => e.preventDefault()}>
      {/* Setting: Theme setting */}
      <ThemeChanger lng={props.lng} notify={notifySave} />

      {/* Connect wallet */}
      <div className='mt-8'>
        <WalletProvider sitename={t('site_name')}><ConnectWallet t={t} /></WalletProvider>
      </div>

      <h3>{t('settings.compose_txn_general_heading')}</h3>

      {/* Setting: Do not allow form errors setting */}
      <ToggleField
        name='disallow_form_errors'
        label={t('settings.disallow_form_errors')}
        labelClass='gap-3'
        inputClass='toggle-primary toggle-sm sm:toggle-md'
        containerClass='mt-3'
        value={disallowFormErrors}
        onChange={(e) => {setDisallowFormErrors(e.target.checked); notifySave();}}
      />

      {/* Setting: Use suggested fee by default */}
      <ToggleField
        name='default_use_sug_fee'
        label={t('settings.default_use_sug_fee')}
        labelClass='gap-3'
        inputClass='toggle-primary toggle-sm sm:toggle-md'
        containerClass='mt-3'
        value={defaultUseSugFee}
        onChange={(e) => {setDefaultUseSugFee(e.target.checked); notifySave();}}
      />

      {/* Setting: Use suggested rounds by default */}
      <ToggleField
        name='default_use_sug_rounds'
        label={t('settings.default_use_sug_rounds')}
        labelClass='gap-3'
        inputClass='toggle-primary toggle-sm sm:toggle-md'
        containerClass='mt-3'
        value={defaultUseSugRounds}
        onChange={(e) => {setDefaultUseSugRounds(e.target.checked); notifySave();}}
      />

      {/* Setting: Retrieve asset information */}
      <ToggleField
        name='get_asset_info'
        label={t('settings.get_asset_info')}
        labelClass='gap-3'
        inputClass='toggle-primary toggle-sm sm:toggle-md'
        containerClass='mt-3'
        value={assetInfoGet}
        onChange={(e) => {setAssetInfoGet(e.target.checked); notifySave();}}
      />

      <h3>{t('settings.compose_txn_asset_create_heading')}</h3>

      {/* Setting: Set manager address to the sender address by default */}
      <ToggleField
        name='default_apar_m_use_snd'
        label={t('settings.default_apar_m_use_snd')}
        labelClass='gap-3'
        inputClass='toggle-primary toggle-sm sm:toggle-md'
        containerClass='mt-3'
        value={defaultApar_mUseSnd}
        onChange={(e) => {setDefaultApar_mUseSnd(e.target.checked); notifySave();}}
      />

      {/* Setting: Set freeze address to the sender address by default */}
      <ToggleField
        name='default_apar_f_use_snd'
        label={t('settings.default_apar_f_use_snd')}
        labelClass='gap-3'
        inputClass='toggle-primary toggle-sm sm:toggle-md'
        containerClass='mt-3'
        value={defaultApar_fUseSnd}
        onChange={(e) => {setDefaultApar_fUseSnd(e.target.checked); notifySave();}}
      />

      {/* Setting: Set clawback address to the sender address by default */}
      <ToggleField
        name='default_apar_c_use_snd'
        label={t('settings.default_apar_c_use_snd')}
        labelClass='gap-3'
        inputClass='toggle-primary toggle-sm sm:toggle-md'
        containerClass='mt-3'
        value={defaultApar_cUseSnd}
        onChange={(e) => {setDefaultApar_cUseSnd(e.target.checked); notifySave();}}
      />

      {/* Setting: Set reserve address to the sender address by default */}
      <ToggleField
        name='default_apar_r_use_snd'
        label={t('settings.default_apar_r_use_snd')}
        labelClass='gap-3'
        inputClass='toggle-primary toggle-sm sm:toggle-md'
        containerClass='mt-3'
        value={defaultApar_rUseSnd}
        onChange={(e) => {setDefaultApar_rUseSnd(e.target.checked); notifySave();}}
      />

      <h3>{t('settings.sign_txn_heading')}</h3>

      {/* Setting: Automatically send after signing by default */}
      <ToggleField
        name='default_auto_send'
        label={t('settings.default_auto_send')}
        labelClass='gap-3'
        inputClass='toggle-primary toggle-sm sm:toggle-md'
        containerClass='mt-3'
        value={defaultAutoSend}
        onChange={(e) => {setDefaultAutoSend(e.target.checked); notifySave();}}
      />

      <h3>{t('settings.send_txn_heading')}</h3>

      {/* Setting: Always clear transaction data after sending */}
      <ToggleField
        name='always_clear_after_send'
        label={t('settings.always_clear_after_send')}
        labelClass='gap-3'
        inputClass='toggle-primary toggle-sm sm:toggle-md'
        containerClass='mt-3'
        value={alwaysClearAfterSend}
        onChange={(e) => {setAlwaysClearAfterSend(e.target.checked); notifySave();}}
      />

      {/* Setting: Hide send information details by default */}
      <ToggleField
        name='default_hide_send_info'
        label={t('settings.default_hide_send_info')}
        labelClass='gap-3'
        inputClass='toggle-primary toggle-sm sm:toggle-md'
        containerClass='mt-3'
        value={defaultHideSendInfo}
        onChange={(e) => {setDefaultHideSendInfo(e.target.checked); notifySave();}}
      />

      <NumberField
        name='confirm_wait_rounds'
        label={
          <Trans t={t} i18nKey='settings.confirm_wait_rounds'
            shouldUnescape={true}
            values={{default: Settings.defaults.confirmWaitRounds}}
          />
        }
        labelClass='gap-3'
        inputInsideLabel={true}
        containerClass='mt-3'
        inputClass='w-24'
        min={1}
        value={tempConfirmWaitRounds}
        onChange={(e) => {
          setTempConfirmWaitRounds(e.target.value);
          onChangeConfirmWait(e.target.value === '' ? RESET : parseInt(e.target.value));
        }}
      />

      <h3>{t('settings.clear_reset_heading')}</h3>

      {/* Clear data buttons */}
      <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2'>
        <button type='button'
          className='btn btn-sm btn-neutral h-auto min-h-[2rem] pt-1 pb-1'
          onClick={(e) => {
            e.preventDefault();
            setStoredTxnData(RESET);
            setSignedTxn(RESET);
            notifyTxnDataCleared();
          }}
        >
          {t('settings.clear_txn_data_btn')}
        </button>
        <button type='button'
          className='btn btn-sm btn-outline h-auto min-h-[2rem] pt-1 pb-1'
          onClick={(e) => {
            e.preventDefault();
            resetSettings();
          }}
        >
          {t('settings.reset_button')}
        </button>
      </div>
      {/* Reset button */}
      <div className='mt-9'>
        <button type='button'
          className='btn btn-sm btn-block btn-error h-auto min-h-[2rem] mx-auto'
          onClick={(e) => {
            e.preventDefault();
            localStorage.clear();
            sessionStorage.clear();
            notifyAllDataCleared();
          }}
        >
          <IconExclamationCircle aria-hidden size={20} />
          {t('settings.clear_all_data_btn')}
        </button>
      </div>

      {/* XXX: Add more settings here */}
    </form>

    <ToastNotification
      lng={props.lng}
      message={toastMsg}
      open={toastOpen}
      onOpenChange={setToastOpen}
    />
  </>);
}
