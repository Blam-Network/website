import type { FilesGame } from "@/src/components/files/filesPageTypes";
import type { OgImage } from "@/src/utils/metadata";
import {
  FILESHARE_OG_ICON_HEIGHT,
  FILESHARE_OG_ICON_WIDTH,
} from "@/src/utils/fileshareIconComposite";

type FileshareOgFile = {
  id: string;
  header: {
    filename: string;
  };
};

/** Relative path; resolved to absolute og:image via metadataBase / buildRequestPageMetadata. */
export function getFileshareOgImagePath(game: FilesGame, fileId: string): string {
  return `/api/og/fileshare/${game}/${encodeURIComponent(fileId)}`;
}

/** OG preview that matches the layered file icon on file cards and detail pages. */
export function getFileshareOgImage(game: FilesGame, file: FileshareOgFile): OgImage {
  const filename = file.header.filename || "File Share";

  return {
    url: getFileshareOgImagePath(game, file.id),
    width: FILESHARE_OG_ICON_WIDTH,
    height: FILESHARE_OG_ICON_HEIGHT,
    alt: filename,
  };
}
