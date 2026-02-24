'use client';

// NOTE: This code was copied (with a few modifications) from
// https://github.com/i18next/next-13-app-dir-i18next-example-ts/blob/main/app/i18n/client.ts

import { useEffect, useState } from 'react';
import i18next, { type FlatNamespace, type KeyPrefix } from 'i18next';
import {
  initReactI18next,
  useTranslation as useTranslationOrg,
  type FallbackNs,
  type UseTranslationOptions,
  type UseTranslationResponse,
} from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { getOptions, supportedLangs } from './settings';

const runsOnServerSide = typeof window === 'undefined';

// On client side the normal singleton is ok
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend(
    (language: string, namespace: string) => {
      return import(`./locales/.dist/${language}/${namespace}.json`);
    }
  ))
  .init({
    ...getOptions(),
    lng: undefined, // Let detect the language on client side
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
    },
    preload: runsOnServerSide ? Object.keys(supportedLangs) : [],
    showSupportNotice: false,
  });

export default i18next;

// Wrap the original `useTranslation` hook into a client-side hook
export function useTranslation<
  Ns extends FlatNamespace,
  KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined
>(
  lng: string,
  ns?: Ns | Ns[],
  options?: UseTranslationOptions<KPrefix>,
): UseTranslationResponse<FallbackNs<Ns>, KPrefix> {
  const ret = useTranslationOrg(ns, options);
  const { i18n } = ret;

  if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng);
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage);

    /*
     * Set client side's active language according to the resolved language from the server side
     */
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (activeLng === i18n.resolvedLanguage) {
        return;
      }
      setActiveLng(i18n.resolvedLanguage);
    }, [activeLng, i18n.resolvedLanguage]);

    /*
     * If a language is specified when using this hook, change the active language to the language
     * specified
     */
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (!lng || i18n.resolvedLanguage === lng) {
        return;
      }
      i18n.changeLanguage(lng);
    }, [lng, i18n]);
  }

  return ret;
}
