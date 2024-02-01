/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';
import { useTranslation } from '@/app/i18n';
import { supportedLangs } from '@/app/i18n/settings';

/** Make Next JS generate at static version of the image */
export function generateStaticParams(): { lang: string }[] {
  // Output should look something like [ { lng: 'en' }, { lng: 'es' } ]
  return Object.keys(supportedLangs).map((lang) => ({ lang }));
}

/*
 * This is a workaround for statically generating opengraph images because generating opengraph
 * images statically does not work using the usual method of creating an `opengraph-image.tsx`
 * file does not work at the moment. This workaround (with modification) was borrowed from:
 * https://github.com/vercel/next.js/issues/51147#issuecomment-1842197049
 */
export async function GET(req: Request, {params}: {params: {lang?: string}}) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(params.lang || '', 'app');
  return new ImageResponse((
    <div tw='flex flex-col w-full h-full items-center justify-center bg-[#332d2d] text-white'>
      {/* Duck (/assets/duck.svg) */}
      <img
        // eslint-disable-next-line max-len
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128' style='enable-background:new 0 0 128 128' xml:space='preserve'%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='47.489' y1='11.504' x2='51.02' y2='45.102'%3E%3Cstop offset='.171' style='stop-color:%2301ab46'/%3E%3Cstop offset='.345' style='stop-color:%23089e42'/%3E%3Cstop offset='.671' style='stop-color:%231a7a37'/%3E%3Cstop offset='1' style='stop-color:%232f502a'/%3E%3C/linearGradient%3E%3Cpath style='fill:url(%23a)' d='M35.84 48.65s5.84-8.38 5.42-11.61c-.42-3.24-1.55-3.94-4.79-5.07-3.24-1.13-5.14-2.89-5.14-2.89s-2.35-11.03-2.11-12.39c.28-1.62 6.12-12.53 19.99-12.53 13.37 0 18.86 11.22 18.16 19.85-.63 7.81-3.52 10-5.56 16.47-2.04 6.48-3.03 10.35-3.03 10.35l-12.04 2.46-10.07-2.18-.83-2.46z'/%3E%3Cpath style='fill:%23ff5d10' d='M53.25 96.51s.75 7.64-.02 8.57c-.78.93-12.44 3.63-13.76 4.62-1.43 1.07-.82 3.47 2.22 6.24s5.59 3.25 7.34 2.53c2.06-.84 5.63-3.57 7.23-4.79 1.28-.98 3.2-3.06 3.46-4.73.27-1.67-.56-11.48-.56-11.48l-5.91-.96zM68.45 99.19s1.1 8.92.56 10c-1.41 2.82-9.47 9.16-10 11.26-.42 1.69 3.8 5.07 8.02 5.16 5.64.13 9.17-2.1 9.57-3.33.56-1.74-1.55-11.97-1.83-12.53s.14-15.06.14-15.06l-6.46 4.5z'/%3E%3Cpath style='fill:%235e6367' d='M98.66 54.49s4.8-.94 4.82-4.2c.01-3.26-1.74-1.84-1.76-4.21-.02-2.37 4.24-2.93 7.04-.94 2.21 1.57 7.26 6.68 6.98 17.29-.38 14.41-7.92 24.95-19.79 31.47-9.68 5.31-23.96 4.68-23.96 4.68l26.67-44.09z'/%3E%3Cpath style='fill:%23b0b0b1' d='M85.67 55.69c2.35-.28 12.66-3.54 16.33-2.6 4.43 1.13 8.85 4.25 7.95 14.15-1.16 12.85-10.29 20.68-14.22 22.83C88.7 93.91 81.94 94 81.94 94s1.39-38.03 3.73-38.31z'/%3E%3Cpath style='fill:%23ffbf18' d='M7.12 25.07c0 1.2 7.46 4.72 14.5 5.56s11.4-.28 11.4-.28-1.2-3.03-1.2-5.28 1.16-7.9-.63-9.22c-1.62-1.2-2.96 1.27-3.94 1.97-.99.7-3.8 2.67-8.17 2.82s-8.17-.56-9.71.28-2.25 2.88-2.25 4.15z'/%3E%3Cpath style='fill:%232d2b33' d='M50.2 20.77c-.42 1.75-1.61 3.12-3.94 2.75-2.18-.35-3.24-2.6-2.6-4.79.5-1.73 1.79-2.9 3.97-2.53 2.5.42 2.97 2.88 2.57 4.57z'/%3E%3Cpath style='fill:%2373df86' d='M50.92 25.57c2.47-.78 4.3-.79 4.04-2.47-.3-1.93-3.51-1.38-5.55-.3-2.17 1.15-4.99 3.11-3.74 4.7 1.33 1.69 3.83-1.48 5.25-1.93z'/%3E%3Cpath style='fill:%23fff' d='M33.16 51.6s2.16 9.43 12.95 7.84c7.71-1.14 13.42-4.97 13.42-4.97l.09-6.29s-5.12 3-11.26 2.91c-6.38-.09-11.92-3.38-11.92-3.38l-3.28 3.89z'/%3E%3Cpath style='fill:%2384574e' d='M26.03 69.11C25.28 89.56 40.7 99.28 65.17 99.7c27.12.47 37.61-15.44 39.23-25.43 1.69-10.45-5.07-12.67-5.07-12.67s6.76-2.82 3.73-9.5c-1.41-.28-8.35 1.57-21.54.21-13.1-1.35-22.08.94-22.08.94s-3.28 3.57-12.67 3.1c-11.25-.56-13.42-4.97-13.42-4.97s-6.85 5.01-7.32 17.73z'/%3E%3Cpath style='fill:%23b79277' d='M52.03 73.14c2.28 7.9 10.42 12.67 22.52 12.11 10.98-.51 18.96-8.17 20.27-14.92 1.43-7.34-1.55-10.14-1.55-10.14s6.34-2.3 6.34-6.76c-3.57-2.16-14.92-3.66-27.5-4.13-8.16-.3-12.76 2.72-12.76 2.72S47.8 58.5 52.03 73.14z'/%3E%3C/svg%3E"
        height={200}
        width={200}
      />
      <h1 tw='text-9xl'>
        {t('site_name_pt1')}<span tw='text-[#0ebd9d]'>{t('site_name_pt2')}</span>
      </h1>
      <p tw='text-5xl px-12'>{t('description.short')}</p>
    </div>
  ));
}
