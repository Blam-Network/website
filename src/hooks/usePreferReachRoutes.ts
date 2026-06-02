"use client";

import { usePathname, useSearchParams } from "next/navigation";

/** True when the current route is Reach-scoped (service record, profile redirect, etc.). */
export function usePreferReachRoutes(): boolean {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	return pathname.startsWith("/haloreach") || searchParams.get("game") === "reach";
}
