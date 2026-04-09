import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import type { AuthPayload } from '@/lib/types';

const ADMIN_ROUTES = ['/dashboard', '/users', '/audit-logs'];
const USER_ROUTES = ['/my-tasks'];
const PROTECTED_ROUTES = [...ADMIN_ROUTES, ...USER_ROUTES];
const PUBLIC_ROUTES = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('access_token')?.value;

  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  );
  const isPublicRoute = PUBLIC_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  // No token + protected route → login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Has token + login page → redirect based on role
  if (isPublicRoute && token) {
    try {
      const payload = jwtDecode<AuthPayload>(token);
      const redirectTo =
        payload.role === 'ADMIN' ? '/dashboard' : '/my-tasks';
      return NextResponse.redirect(new URL(redirectTo, request.url));
    } catch {
      const response = NextResponse.next();
      response.cookies.delete('access_token');
      return response;
    }
  }

  // Has token + wrong role for route → redirect to correct home
  if (isProtectedRoute && token) {
    try {
      const payload = jwtDecode<AuthPayload>(token);

      const isAdminRoute = ADMIN_ROUTES.some(route =>
        pathname.startsWith(route)
      );
      const isUserRoute = USER_ROUTES.some(route =>
        pathname.startsWith(route)
      );

      if (isAdminRoute && payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/my-tasks', request.url));
      }

      if (isUserRoute && payload.role !== 'USER') {
        return NextResponse.redirect(
          new URL('/dashboard', request.url)
        );
      }
    } catch {
      const response = NextResponse.redirect(
        new URL('/login', request.url)
      );
      response.cookies.delete('access_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
