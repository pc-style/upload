"use client";

import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { LogIn, LogOut, User } from "lucide-react";

/**
 * Auth button component that shows login/register or user menu
 * Redirects to auth.pcstyle.dev for authentication
 */
export function AuthButton() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="w-8 h-8 rounded-full bg-[#ff00ff]/20 animate-pulse" />
        );
    }

    if (!user) {
        return (
            <div className="flex items-center gap-2">
                <a
                    href="https://auth.pcstyle.dev"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#ff00ff] border border-[#ff00ff]/30 hover:bg-[#ff00ff]/10 hover:border-[#ff00ff] transition-all"
                >
                    <LogIn className="w-4 h-4" />
                    Login
                </a>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                <User className="w-4 h-4 text-[#ff00ff]" />
                <span className="hidden sm:inline">{user.email}</span>
            </div>
            <a
                href="https://auth.pcstyle.dev/signout"
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[#ff00ff] transition-colors"
                title="Sign out"
            >
                <LogOut className="w-4 h-4" />
            </a>
        </div>
    );
}
