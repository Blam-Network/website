"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

/** Clears NextAuth state when the JWT cookie is present but not a valid Sunrise session. */
export function InvalidSessionGuard() {
    const { data: session, status } = useSession();
    const signingOut = useRef(false);

    useEffect(() => {
        if (status === "loading" || signingOut.current) {
            return;
        }

        const sessionExpired = session?.error === "SessionExpired";
        const authenticatedWithoutUser =
            status === "authenticated" && !session?.user;

        if (sessionExpired || authenticatedWithoutUser) {
            signingOut.current = true;
            void signOut({ callbackUrl: "/" });
        }
    }, [session, status]);

    return null;
}
