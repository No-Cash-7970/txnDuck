type LanguageData = {
  // The key must be an ISO 639-1 language code
  [lang: string]: {
    /** Full name used to display the currently selected language. */
    name: string,
    /** Name used in list of supported languages. Usually the same as the full name. */
    listName: string,
  }
};

/** Collection of supported languages */
export const supportedLangs: LanguageData = {
  en: {
    name: 'English',
    listName: 'English (US)',
  },
  es: {
    name: 'Español',
    listName: 'Español (Traducción automática)',
  },
  // ADD DATA FOR NEW LANGUAGE HERE
};

/*
 * NOTE: This code was copied (with a few modifications) from
 * https://github.com/i18next/next-13-app-dir-i18next-example-ts/blob/main/app/i18n/settings.ts
 */

export const fallbackLng: string = 'en';
export const defaultNS: string = 'common';

export type i18nOptions = {
  debug?: boolean,
  supportedLngs: string[],
  fallbackLng: string,
  lng: string,
  fallbackNS: string,
  defaultNS: string,
  ns: string | string[],
};

export function getOptions (lng = fallbackLng, ns: string | string[] = defaultNS): i18nOptions {
  return {
    debug: process.env.I18NEXT_DEBUG?.toLowerCase() === 'true',
    supportedLngs: Object.keys(supportedLangs),
    // preload: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
