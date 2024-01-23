// NOTE: This code was copied (with a few modifications) from
// https://github.com/i18next/next-13-app-dir-i18next-example-ts/blob/main/middleware.ts

import { NextResponse, NextRequest } from 'next/server';
import acceptLanguage from 'accept-language';
import { fallbackLng, supportedLangs } from './app/i18n/settings';

const SUPPORTED_LANGS = Object.keys(supportedLangs);

acceptLanguage.languages(SUPPORTED_LANGS);

export const config = {
  // This matcher contains a list of files to exclude from redirection to /[lang]/*
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - assets
     * - sw.js (service worker script)
     * - etc.
     */
    // eslint-disable-next-line max-len
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|icon.svg|opengraph-image.png|apple-icon.png|sw.js|workbox-|worker-|assets|browserconfig.xml).*)'
  ]
};

const cookieName = 'i18next';

export function middleware(req: NextRequest) {
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

  // Remove slash if at base URL. This prevents an unnecessary redirect because URLs with ending
  // slashes are redirected to the version without a slash (a Next.js default).
  const urlPath = req.nextUrl.pathname === '/' ? '' : req.nextUrl.pathname;

  // Redirect if language (lng) in path is not supported
  if (
    !SUPPORTED_LANGS.some(loc => urlPath.startsWith(`/${loc}`)) &&
    !urlPath.startsWith('/_next')
  ) {
    return NextResponse.redirect(new URL(`/${lng}${urlPath}`, req.url));
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
