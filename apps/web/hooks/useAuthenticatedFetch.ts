"use client";

import { auth } from "@repo/firebase";
import { useCallback } from "react";

/**
 * A hook that provides a fetch wrapper that automatically attaches the Firebase ID token.
 * 
 * @returns {typeof fetch} An authenticated fetch function.
 */
export const useAuthenticatedFetch = () => {
    const authenticatedFetch = useCallback(
        async (input: RequestInfo | URL, init?: RequestInit) => {
            const user = auth.currentUser;

            if (!user) {
                throw new Error("No user authenticated");
            }

            // Force refresh the token to ensure it's valid
            const token = await user.getIdToken(true);

            const headers = new Headers(init?.headers);
            headers.set("Authorization", `Bearer ${token}`);

            return fetch(input, {
                ...init,
                headers,
            });
        },
        []
    );

    return authenticatedFetch;
};
