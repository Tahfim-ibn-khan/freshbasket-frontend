import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  const authPages = [''];
  const protectedPages = [''];

  if (authPages.includes(req.nextUrl.pathname) && token) {
    return NextResponse.redirect(new URL('/products', req.url));
  }

  if (protectedPages.includes(req.nextUrl.pathname) && !token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/:path*', '/products', '/dashboard'],
};