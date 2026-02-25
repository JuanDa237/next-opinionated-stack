import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // Extract org slug from subdomain and add it to headers
  const requestHeaders = new Headers(request.headers)
  const host = request.headers.get('host') || ''
  const cleanHost = host.split(':')[0]
  const parts = cleanHost.split('.')
  let orgSlug = ''
  // Only set orgSlug if it's not the root domain (e.g. newexample.app)
  if (parts.length > 2) {
    orgSlug = parts[0]
    requestHeaders.set('x-org-slug', orgSlug)
  }

  // add the original pathname for later use in redirects after auth
  const { pathname, search } = request.nextUrl
  requestHeaders.set('x-pathname', `${pathname}${search}`)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ['/admin/:path*', '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
}