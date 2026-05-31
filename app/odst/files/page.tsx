"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OdstFilesRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("game", "odst");
    router.replace(`/files?${params.toString()}`);
  }, [router]);

  return null;
}
