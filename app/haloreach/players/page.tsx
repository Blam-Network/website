"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReachPlayersRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("game", "haloreach");
    router.replace(`/players?${params.toString()}`);
  }, [router]);

  return null;
}
