import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const token = request.cookies.get('token')?.value;

  const isPublicRoute = pathname === '/sign-in' || pathname === '/sign-up';
  const isPrivateRoute = pathname.startsWith('/profile') || pathname.startsWith('/notes');

  if (isPrivateRoute && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
