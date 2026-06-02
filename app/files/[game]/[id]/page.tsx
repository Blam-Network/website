import { notFound, redirect } from "next/navigation";
import {
  getFileshareFileHref,
  isValidFilesGame,
} from "@/src/components/files/filesPageTypes";

interface PageProps {
  params: { game: string; id: string };
}

/** Legacy `/files/:game/:id` → `/:gamePath/file/:id` */
export default function LegacyFileshareFileRedirect({ params }: PageProps) {
  if (!isValidFilesGame(params.game)) {
    notFound();
  }

  redirect(getFileshareFileHref(params.game, params.id));
}
