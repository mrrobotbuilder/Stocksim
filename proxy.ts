import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/app/lib/session'

const publicRoutes = ['/', '/login', '/register']

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublic = publicRoutes.includes(path)

  const token = request.cookies.get('stocksim_session')?.value
  const session = token ? await decrypt(token) : null

  if (!session && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (session && (path === '/login' || path === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
