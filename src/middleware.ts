import { NextRequest, NextResponse } from 'next/server'

const PROTECTED = ['/family', '/caregiver', '/patient', '/admin']

export function middleware(req: NextRequest) {
  const token = req.cookies.get('session')?.value
  const path = req.nextUrl.pathname

  const isProtected = PROTECTED.some(p => path.startsWith(p))
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/', req.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/family/:path*', '/caregiver/:path*', '/patient/:path*', '/admin/:path*'] }
