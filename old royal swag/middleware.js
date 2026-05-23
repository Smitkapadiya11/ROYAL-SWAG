import { NextResponse } from 'next/server'

export function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip protection for the login page itself
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }
    
    const auth = request.cookies.get('rs_admin_auth');
    const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
    if (!auth || auth.value !== secret) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] }
