"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { InvalidSessionGuard } from "./InvalidSessionGuard";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})

export const Providers = ({ children }: { children: ReactNode}) => {
    return (
        <SessionProvider>
            <InvalidSessionGuard />
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </SessionProvider>
    );
}