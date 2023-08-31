/*
 * This layout is a workaround for the issue of `generateMetadata()` inside of a `page.tsx` file
 * breaking the unit tests in CI. For some reason, this is not an issue when running the unit tests
 * in development. If this issue is fixed in Next.js or Jest, then `generateMetadata()` can be moved
 * back into `page.tsx` and this file can removed.
 *
 * See this GitHub issue for more information: https://github.com/vercel/next.js/issues/47299
 */

import { type Metadata } from 'next';
import { generateLangAltsMetadata, useTranslation } from '@/app/i18n';

export async function generateMetadata(
  { params }: { params: { lang: string } },
): Promise<Metadata> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(params.lang, 'send_txn');

  return {
    title: t('title'),
    alternates: generateLangAltsMetadata('/txn/send'),
  };
}

export default function SendTxnLayout(
  {
    children,
    params: { lang }
  }: {
    children: React.ReactNode,
    params: { lang?: string }
  }
) {
  return children;
}
