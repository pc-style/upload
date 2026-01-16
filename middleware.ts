import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

/**
 * WorkOS AuthKit middleware for upload.pcstyle.dev
 * Handles session validation and redirects for protected routes
 *
 * Cross-subdomain cookies are configured via WORKOS_COOKIE_DOMAIN env var
 */
export default authkitMiddleware({
    middlewareAuth: {
        enabled: true,
        unauthenticatedPaths: ['/', '/api/health', '/api/uploadthing'],
    },
});

export const config = {
    matcher: ['/((?!_next|static|favicon.ico|.*\\..*).*)'],
};
