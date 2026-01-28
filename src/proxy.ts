import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { apiRouteMatcher, guestRouteMatcher, handleAuthRedirect, INVALID_SESSION_PARAM, publicRouteMatcher, requestIdService, sessionCookieService } from './features/middleware'

export default async function proxy(request: NextRequest) {
  const requestId = requestIdService.generate()
  const { pathname, search, searchParams } = request.nextUrl
  const fullPath = `${pathname}${search}`

  if (publicRouteMatcher(request)) {
    return NextResponse.next()
  }

  const hasCookie = sessionCookieService.hasSessionCookie(request)
  const hasInvalidSession = searchParams.has(INVALID_SESSION_PARAM)

  if (hasInvalidSession) {
    const cleanUrl = new URL(request.url)
    cleanUrl.searchParams.delete(INVALID_SESSION_PARAM)
    const response = NextResponse.redirect(cleanUrl)

    if (hasCookie) {
      return sessionCookieService.deleteAuthCookies(response)
    }

    return response
  }

  if (apiRouteMatcher(request)) {
    if (!hasCookie) {
      console.warn(`Unauthorized API request ${fullPath} with request ID ${requestId} and user-agent: ${request.headers.get('user-agent')}`)

      return NextResponse.json(
        {
          error: {
            message: 'Unauthorized',
            details: 'You must be authenticated to access this resource',
          },
          requestId,
        },
        { status: 401 },
      )
    }

    return NextResponse.next()
  }

  if (guestRouteMatcher(request)) {
    return NextResponse.next()
  }

  const redirectResponse = handleAuthRedirect(request, hasCookie, {
    returnUrl: fullPath,
  })

  return redirectResponse || NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|.well-known)).*)',
    '/(api|trpc)(.*)',
  ],
}