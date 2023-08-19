export const SUPPORTED_LANGS: string[] = [
  'en', // English
  'es', // Spanish (Español)
  // ADD NEW LANGUAGE HERE
];

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
    supportedLngs: SUPPORTED_LANGS,
    // preload: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
