import {
  FileshareFilePageContent,
  generateFileshareFileMetadata,
} from "@/src/components/files/FileshareFilePageContent";

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps) {
  return generateFileshareFileMetadata("odst", params.id);
}

export default function OdstFileshareFilePage({ params }: PageProps) {
  return <FileshareFilePageContent game="odst" fileId={params.id} />;
}
