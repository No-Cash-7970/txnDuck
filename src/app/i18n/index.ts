// NOTE: This code was copied (with a few modifications) from
// https://github.com/i18next/next-13-app-dir-i18next-example-ts/blob/main/app/i18n/index.ts

import {
  createInstance,
  i18n,
  type FlatNamespace,
  type KeyPrefix,
  type TFunction
} from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { type FallbackNs } from 'react-i18next';
import { supportedLangs, getOptions } from './settings';

/** Initialize i18Next and load relevant local files
 * @param lng Language
 * @param ns Translation namespace
 * @returns i18next instance
 */
const initI18next = async (lng: string, ns: string | string[]) => {
  // on server side we create a new instance for each render, because during compilation everything
  // seems to be executed in parallel
  const i18nInstance = createInstance();

  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend(
      (language: string, namespace: string) => {
        return import(`./locales/.dist/${language}/${namespace}.json`);
      }
    ))
    .init(getOptions(lng, ns));

  return i18nInstance;
};

/** Hook for retrieving translations
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
  ns?: Ns | Ns[],
  options: { keyPrefix?: KPrefix } = {}
): Promise<{ t: TFunction, i18n: i18n }> {
  const i18nextInstance = await initI18next(lng, Array.isArray(ns) ? ns as string[] : ns as string);
  return {
    t: i18nextInstance.getFixedT(lng, ns, options.keyPrefix),
    i18n: i18nextInstance
  };
}

/** Generate the language alternate URLs for the given path. The URLs generated are meant to be used
 * generate the `alternates` metadata.
 * @param path The path for which to generate the URLs. The path is relative to the site's base URL
 *             and must have a leading slash ("/"), unless it is the home page.
 *             (Example: `/path/to/somewhere`)
 * @returns Collection of language alternate URLs
 */
export function generateLangAltsMetadata(path: string = '/'): { [lng: string]: string } {
  const langUrls: {[lang: string]: string} = {};
  Object.keys(supportedLangs).forEach(
    // By default, Next.js redirects a URL with a trailing slash to one without a trailing slash.
    // We want to avoid setting a language alternate URL to one that is redirected, so avoid putting
    // a trailing slash for the home URL.
    (lng: string) => langUrls[lng] = lng + (path === '/' ? '': path)
  );

  return { ...langUrls, 'x-default': path };
}
