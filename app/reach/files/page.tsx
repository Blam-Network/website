"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReachFilesRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("game", "reach");
    router.replace(`/files?${params.toString()}`);
  }, [router]);

  return null;
}
