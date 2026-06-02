import type { Metadata } from "next";
import { FileshareFileNotFound } from "@/src/components/files/FileshareFileNotFound";

export const metadata: Metadata = {
  title: "File Not Found - Blam Network",
  description: "The requested file share file could not be found.",
};

export default function ReachFileshareFileNotFoundPage() {
  return <FileshareFileNotFound />;
}
