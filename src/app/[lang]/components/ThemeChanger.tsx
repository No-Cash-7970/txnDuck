'use client';

import { useAtom } from "jotai";
import { RESET } from "jotai/utils";
import { RadioButtonGroupField } from "@/app/[lang]/components/form";
import { useTranslation } from "@/app/i18n/client";
import { themeAtom, Themes } from "@/app/lib/app-settings";
import { applyTheme } from "@/app/lib/utils";

type Props = {
  /** Language */
  lng?: string,
  /** Function for notifying the user. If undefined, the user is not notified.  */
  notify?: () => void,
  /** Classes to add to the container */
  containerClass?: string,
  /** Classes to add to the label */
  labelClass?: string,
  /** Classes to add to the element for the text content of the label */
  labelTextClass?: string,
};

export default function ThemeChanger(props: Props) {
  const { t } = useTranslation(props.lng || '', ['app', 'common']);
  const [theme, setTheme] = useAtom(themeAtom);
  return (
    <RadioButtonGroupField
      name='theme'
      label={t('settings.theme_switcher.label')}
      containerClass={props.containerClass}
      labelClass={props.labelClass}
      labelTextClass={props.labelTextClass}
      optionClass='btn-sm disabled:checked:opacity-20 theme-controller'
      options={[
        { value: Themes.light, text: t('settings.theme_switcher.light') },
        { value: Themes.dark, text: t('settings.theme_switcher.dark') },
        { value: Themes.auto, text: t('settings.theme_switcher.auto') },
      ]}
      value={theme}
      onChange={(e) => applyTheme(
        e.target.value as Themes,
        theme => setTheme(theme === '' ? RESET : theme),
        props.notify
      )}
    />
  );
}
