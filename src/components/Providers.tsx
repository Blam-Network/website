"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { getSession, SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

const queryClient = new QueryClient()

export const Providers = ({ children }: { children: ReactNode}) => {
    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </SessionProvider>
    );
}