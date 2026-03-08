import { NextRequest, NextResponse } from 'next/server';
import { checkServerSession } from './lib/api/serverApi';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isPublicRoute = pathname === '/sign-in' || pathname === '/sign-up';
  const isPrivateRoute = pathname.startsWith('/profile') || pathname.startsWith('/notes');

  let isAuthenticated = !!accessToken;
  let newCookies: string[] | undefined;

  if (!accessToken && refreshToken) {
    const session = await checkServerSession();
    if (session && session.data) {
      isAuthenticated = true;
      newCookies = session.setCookie; 
    }
  }

  let response = NextResponse.next();

  if (isPrivateRoute && !isAuthenticated) {
    response = NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isPublicRoute && isAuthenticated) {
    response = NextResponse.redirect(new URL('/', request.url));
  }

  if (newCookies && response) {
    newCookies.forEach(cookieStr => {
      const [nameValue] = cookieStr.split(';');
      const [name, value] = nameValue.split('=');
      response.cookies.set(name.trim(), value.trim());
    });
  }

  return response;
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
