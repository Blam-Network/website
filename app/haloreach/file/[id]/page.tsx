import {
  FileshareFilePageContent,
  generateFileshareFileMetadata,
} from "@/src/components/files/FileshareFilePageContent";

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps) {
  return generateFileshareFileMetadata("reach", params.id);
}

export default function ReachFileshareFilePage({ params }: PageProps) {
  return <FileshareFilePageContent game="reach" fileId={params.id} />;
}
