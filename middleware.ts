import { createAuthMiddleware } from '@pcstyle/auth/middleware';

/**
 * WorkOS AuthKit middleware for upload.pcstyle.dev
 * Handles session validation and redirects for protected routes
 *
 * Cross-subdomain cookies are configured via WORKOS_COOKIE_DOMAIN env var
 */
export default createAuthMiddleware({
    publicPaths: ['/', '/api/health', '/api/uploadthing'],
});

export const config = {
    matcher: ['/((?!_next|static|favicon.ico|.*\\..*).*)'],
};
