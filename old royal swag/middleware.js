import { NextResponse } from 'next/server'

export function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip protection for the login page itself
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }
    
    const auth = request.cookies.get('rs_admin_auth');
    if (!auth || auth.value !== process.env.ADMIN_SECRET) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] }
