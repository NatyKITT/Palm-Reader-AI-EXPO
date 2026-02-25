import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (request.nextUrl.pathname.startsWith('/api')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  return response;
}

export const config = {
  matcher: ['/api/:path*'],
};
