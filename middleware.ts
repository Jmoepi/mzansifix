import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/firebase-admin';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/issues')) {
    const cookie = request.cookies.get('token')?.value;

    if (!cookie) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const decodedToken = await auth.verifyIdToken(cookie);
      if (decodedToken.role !== 'admin') {
         return NextResponse.redirect(new URL('/', request.url))
      }
    } catch (error) {
       return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/issues/:path*'],
}
