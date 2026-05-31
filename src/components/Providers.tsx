"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { InvalidSessionGuard } from "./InvalidSessionGuard";
import { ToastProvider } from "@/src/contexts/ToastContext";

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
                <ToastProvider>
                    {children}
                </ToastProvider>
            </QueryClientProvider>
        </SessionProvider>
    );
}