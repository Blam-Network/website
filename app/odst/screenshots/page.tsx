"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OdstScreenshotsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("game", "odst");
    router.replace(`/screenshots?${params.toString()}`);
  }, [router]);

  return null;
}
