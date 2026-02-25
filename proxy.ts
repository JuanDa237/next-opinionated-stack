import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  const { pathname, search } = request.nextUrl

  // Set the pathname for the signin callback URL
  requestHeaders.set('x-pathname', `${pathname}${search}`)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ['/admin/:path*'],
}