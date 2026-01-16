import { authkit } from '@workos-inc/authkit-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(request: NextRequest) {
    const { session, headers: authkitHeaders } = await authkit(request);

    const { pathname } = new URL(request.url);

    // Only allow callback without auth
    const publicPaths = ['/callback'];
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

    if (isPublicPath) {
        const response = NextResponse.next({
            request: { headers: new Headers(request.headers) },
        });
        for (const [key, value] of authkitHeaders) {
            if (key.toLowerCase() === 'set-cookie') {
                response.headers.append(key, value);
            } else {
                response.headers.set(key, value);
            }
        }
        return response;
    }

    // If no session, redirect to central auth
    if (!session.user) {
        const authUrl = new URL(process.env.NEXT_PUBLIC_AUTH_URL ?? 'https://auth.pcstyle.dev');
        authUrl.searchParams.set('returnTo', request.url);
        const response = NextResponse.redirect(authUrl);
        for (const [key, value] of authkitHeaders) {
            if (key.toLowerCase() === 'set-cookie') {
                response.headers.append(key, value);
            } else {
                response.headers.set(key, value);
            }
        }
        return response;
    }

    // Forward request with AuthKit headers
    const response = NextResponse.next({
        request: { headers: new Headers(request.headers) },
    });
    for (const [key, value] of authkitHeaders) {
        if (key.toLowerCase() === 'set-cookie') {
            response.headers.append(key, value);
        } else {
            response.headers.set(key, value);
        }
    }
    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|pwa-icon.svg).*)',
    ],
};
