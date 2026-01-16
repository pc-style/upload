import { useState, useEffect, useCallback } from 'react';

/**
 * User data returned from auth.pcstyle.dev
 */
export interface AuthUser {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    profilePictureUrl?: string;
}

/**
 * Response from /api/me endpoint
 */
interface MeResponse {
    status: 'success' | 'error';
    user?: AuthUser;
    code?: string;
    message?: string;
}

/**
 * Hook state for useUser
 */
interface UseUserState {
    user: AuthUser | null;
    isLoading: boolean;
    error: string | null;
}

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? 'https://auth.pcstyle.dev';

/**
 * React hook to get the current authenticated user.
 * Fetches from auth.pcstyle.dev/api/me with credentials included.
 */
export function useUser(): UseUserState & { refresh: () => Promise<void>; login: (returnTo?: string) => void; logout: (returnTo?: string) => void } {
    const [state, setState] = useState<UseUserState>({
        user: null,
        isLoading: true,
        error: null,
    });

    const fetchUser = useCallback(async () => {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await fetch(`${AUTH_URL}/api/me`, {
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                setState({ user: null, isLoading: false, error: null });
                return;
            }

            const data: MeResponse = await response.json();

            if (data.status === 'success' && data.user) {
                setState({ user: data.user, isLoading: false, error: null });
            } else {
                setState({ user: null, isLoading: false, error: null });
            }
        } catch (err) {
            setState({
                user: null,
                isLoading: false,
                error: err instanceof Error ? err.message : 'Failed to fetch user',
            });
        }
    }, []);

    const login = useCallback((returnTo?: string) => {
        const url = new URL(AUTH_URL);
        if (returnTo) {
            url.searchParams.set('returnTo', returnTo);
        } else if (typeof window !== 'undefined') {
            url.searchParams.set('returnTo', window.location.href);
        }
        window.location.href = url.toString();
    }, []);

    const logout = useCallback((returnTo?: string) => {
        const url = new URL(`${AUTH_URL}/api/auth/signout`);
        if (returnTo) {
            url.searchParams.set('returnTo', returnTo);
        } else if (typeof window !== 'undefined') {
            url.searchParams.set('returnTo', window.location.origin);
        }
        window.location.href = url.toString();
    }, []);

    useEffect(() => {
        let isMounted = true;

        const performFetch = async () => {
            if (!isMounted) return;
            await fetchUser();
        };

        performFetch();

        return () => {
            isMounted = false;
        };
    }, [fetchUser]);

    return { ...state, refresh: fetchUser, login, logout };
}
