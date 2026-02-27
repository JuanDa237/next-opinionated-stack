import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { HEADER_KEYS } from './features/admin/helpers';

/**
 * Extracts URL parts and set them in the headers.
 *
 * Example:
 *   For the URL:
 *     https://tenant1.local.dev:3000/admin/signin?callbackUrl=/example#testanchor
 *
 *   The returned object will be:
 *   {
 *     protocol:   'https:',
 *     hostname:   'tenant1.local.dev',
 *     port:       '3000',
 *     subdomain:  'tenant1',
 *     mainDomain: 'local.dev:3000',
 *     pathname:   '/admin/signin',
 *     search:     '?callbackUrl=/example',
 *     hash:       '#testanchor',
 *   }
 *
 * @returns An NextResponse with protocol, hostname, port, subdomain, mainDomain, pathname, search, and hash set in headers
 */
export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  // Build a full URL for parsing
  // Use x-forwarded-proto if available, else default to https
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const host = request.headers.get('host') || '';

  // Use request.nextUrl for relative path
  const url = new URL(`${proto}://${host}${request.nextUrl.pathname}${request.nextUrl.search}${request.nextUrl.hash}`);

  // Set protocol
  requestHeaders.set(HEADER_KEYS.PROTOCOL, url.protocol);
  // Set hostname (includes subdomain)
  requestHeaders.set(HEADER_KEYS.HOSTNAME, url.hostname);
  // Set port (may be empty)
  requestHeaders.set(HEADER_KEYS.PORT, url.port);
  // Set pathname
  requestHeaders.set(HEADER_KEYS.PATHNAME, url.pathname);
  // Set search (query string)
  requestHeaders.set(HEADER_KEYS.SEARCH, url.search);
  // Set hash (fragment)
  requestHeaders.set(HEADER_KEYS.HASH, url.hash);

  // Extract subdomain and main domain
  const hostParts = url.hostname.split('.');
  let subdomain = '';
  let mainDomain = url.hostname;
  if (hostParts.length > 2) {
    subdomain = hostParts[0];
    mainDomain = hostParts.slice(1).join('.');
  }
  requestHeaders.set(HEADER_KEYS.SUBDOMAIN, subdomain);
  requestHeaders.set(HEADER_KEYS.MAIN_DOMAIN, mainDomain + (url.port ? ':' + url.port : ''));

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/admin/:path*', '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
}