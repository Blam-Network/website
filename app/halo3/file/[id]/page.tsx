import {
  FileshareFilePageContent,
  generateFileshareFileMetadata,
} from "@/src/components/files/FileshareFilePageContent";

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps) {
  return generateFileshareFileMetadata("halo3", params.id);
}

export default function Halo3FileshareFilePage({ params }: PageProps) {
  return <FileshareFilePageContent game="halo3" fileId={params.id} />;
}
