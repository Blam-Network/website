import type { FilesGame } from "@/src/components/files/filesPageTypes";
import type { OgImage } from "@/src/utils/metadata";
import { getSiteUrl } from "@/src/utils/siteUrl";
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

/** OG preview that matches the layered file icon on file cards and detail pages. */
export function getFileshareOgImage(game: FilesGame, file: FileshareOgFile): OgImage {
  const filename = file.header.filename || "File Share";
  const base = getSiteUrl();

  return {
    url: `${base}/api/og/fileshare/${game}/${encodeURIComponent(file.id)}`,
    width: FILESHARE_OG_ICON_WIDTH,
    height: FILESHARE_OG_ICON_HEIGHT,
    alt: filename,
  };
}
