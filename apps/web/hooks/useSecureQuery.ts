"use client";

import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useAuthenticatedFetch } from "./useAuthenticatedFetch";
import { useAuth } from "../app/providers/FirebaseAuthProvider";

/**
 * A wrapper around useQuery that automatically uses the authenticated fetcher.
 * It also waits for the user to be authenticated before running the query.
 * 
 * @param queryKey The query key
 * @param url The URL to fetch
 * @param options Additional React Query options
 */
export function useSecureQuery<TData = any, TError = Error>(
    queryKey: any[],
    url: string,
    options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">
): UseQueryResult<TData, TError> {
    const authenticatedFetch = useAuthenticatedFetch();
    const { user, loading } = useAuth();

    return useQuery<TData, TError>({
        queryKey,
        queryFn: async () => {
            const response = await authenticatedFetch(url);
            if (!response.ok) {
                throw new Error(`Auth request failed: ${response.statusText}`);
            }
            return response.json();
        },
        enabled: !loading && !!user && (options?.enabled !== false),
        ...options,
    });
}
