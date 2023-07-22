// NOTE: This code was copied (with a few modifications) from
// https://github.com/i18next/next-13-app-dir-i18next-example-ts/blob/main/app/i18n/index.ts

import { createInstance, FlatNamespace, KeyPrefix, i18n, TFunction } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { FallbackNs } from 'react-i18next';
import { getOptions } from './settings';

/**
 *
 * @param lng Language
 * @param ns Translation namespace
 * @returns i18next instance
 */
const initI18next = async (lng: string, ns: string | string[]) => {
  // on server side we create a new instance for each render, because during compilation everything seems to be executed in parallel
  const i18nInstance = createInstance();

  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
    .init(getOptions(lng, ns));

  return i18nInstance;
};

/**
 * Hook for retrieving translations
 * @param lng Language
 * @param ns Translation Namespace
 * @param options Key prefix option
 * @returns An object containing a translation function and the i18next instance
 */
export async function useTranslation<
  Ns extends FlatNamespace,
  KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined
>(
  lng: string,
  ns?: Ns,
  options: { keyPrefix?: KPrefix } = {}
): Promise<{
  t: TFunction,
  i18n: i18n,
}> {
  const i18nextInstance = await initI18next(lng, Array.isArray(ns) ? ns as string[] : ns as string);

  return {
    t: i18nextInstance.getFixedT(lng, ns, options.keyPrefix),
    i18n: i18nextInstance
  };
}
