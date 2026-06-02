import { FileshareFileNotFound } from "@/src/components/files/FileshareFileNotFound";
import { buildPageMetadata } from "@/src/utils/metadata";

export const metadata = buildPageMetadata({
  title: "File Not Found",
  description: "The requested file share file could not be found.",
});

export default function Halo3FileshareFileNotFoundPage() {
  return <FileshareFileNotFound />;
}
