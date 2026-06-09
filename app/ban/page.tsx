import type { Metadata } from "next";
import { BanPage } from "@/src/components/ban/BanPage";
import { api } from "@/src/trpc/server";
import { buildPageMetadata } from "@/src/utils/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Banhammer Details",
  description:
    "Information about Blam Network matchmaking bans — what triggers the banhammer, what does not, and what to do if you receive an in-game ban message.",
  path: "/ban",
});

export default async function BanRoutePage() {
  return (
    <BanPage />
  );
}
