// NOTE: This code was copied (with a few modifications) from
// https://github.com/i18next/next-13-app-dir-i18next-example-ts/blob/main/middleware.ts

import { NextResponse, NextRequest } from 'next/server';
import acceptLanguage from 'accept-language';
import { fallbackLng, SUPPORTED_LANGS } from './app/i18n/settings';

acceptLanguage.languages(SUPPORTED_LANGS);

export const config = {
  // matcher: '/:lng*'
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|icon.svg|sw.js).*)']
};

const cookieName = 'i18next';

export function middleware(req: NextRequest) {
  // Don't do anything if the request is for a file that is an icon or some other kind of special
  // file
  if (
    req.nextUrl.pathname.indexOf('icon') > -1
    || req.nextUrl.pathname.indexOf('chrome') > -1
    || req.nextUrl.pathname.indexOf('opengraph') > -1
  ) {
    return NextResponse.next();
  }

  let lng: string | null = '';

  // Check stored cookie for saved language
  if (req.cookies.has(cookieName)) {
    lng = acceptLanguage.get(req.cookies.get(cookieName)?.value);
  }

  // Fallback to value in "Accept-Language" header if there is no cookie
  if (!lng) {
    lng = acceptLanguage.get(req.headers.get('Accept-Language'));
  }

  // Fallback to default language if there is no cookie or "Accept-Language" header
  if (!lng) {
    lng = fallbackLng;
  }

  // Redirect if language (lng) in path is not supported
  if (
    !SUPPORTED_LANGS.some(loc => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith('/_next')
  ) {
    return NextResponse.redirect(new URL(`/${lng}${req.nextUrl.pathname}`, req.url));
  }

  // If the user is coming from a page in a specific language that language should override the
  // "Accept-Language" header and be saved as preferred language in the cookie
  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer')!);
    const lngInReferer = SUPPORTED_LANGS.find((l) => refererUrl.pathname.startsWith(`/${l}`));
    const response = NextResponse.next();
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
    return response;
  }

  return NextResponse.next();
}
