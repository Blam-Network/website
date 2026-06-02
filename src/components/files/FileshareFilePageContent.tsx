import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container, Stack } from "@mui/material";
import { api } from "@/src/trpc/server";
import { FileshareFileDetail } from "@/src/components/files/FileshareFileDetail";
import { FileshareRelatedFiles } from "@/src/components/files/FileshareRelatedFiles";
import { FileshareSourceGameSection } from "@/src/components/files/FileshareSourceGameSection";
import { FileshareBackButton } from "@/src/components/files/FileshareBackButton";
import {
  getFileshareFileHref,
  getFilesGameLabel,
  type FilesGame,
} from "@/src/components/files/filesPageTypes";
import { formatFileshareDescription } from "@/src/utils/formatFileshareDescription";
import { buildRequestPageMetadata } from "@/src/utils/metadata";
import { getFileshareOgImage } from "@/src/utils/fileshareOgImage";
import { getFileshareScreenshotViewUrl } from "@/src/utils/fileshareScreenshotUrl";
import { FileshareScreenshotPreview } from "@/src/components/files/FileshareScreenshotPreview";
import { isFileshareSourceGameCandidate } from "@/src/utils/fileshareSourceGame";
import type { FileshareSourceGame } from "@/src/api/files/fileshareSourceGameSchema";

async function loadFile(game: FilesGame, fileId: string) {
  try {
    return await api.files.fileshareFile.query({ game, fileId });
  } catch {
    return null;
  }
}

async function loadRelatedFiles(game: FilesGame, fileId: string) {
  try {
    const result = await api.files.fileshareRelatedFiles.query({
      game,
      fileId,
    });
    return result.data;
  } catch {
    return [];
  }
}

async function loadSourceGame(
  game: FilesGame,
  fileId: string,
  filetype: number,
): Promise<FileshareSourceGame | null> {
  if (!isFileshareSourceGameCandidate(game, filetype)) {
    return null;
  }

  try {
    const result = await api.files.fileshareSourceGame.query({ game, fileId });
    return result.sourceGame;
  } catch {
    return null;
  }
}

export async function generateFileshareFileMetadata(
  game: FilesGame,
  fileId: string,
): Promise<Metadata> {
  const file = await loadFile(game, fileId);
  if (!file) {
    return buildRequestPageMetadata({
      title: "File Not Found",
      description: "This file share item could not be found on Blam Network.",
    });
  }

  const gameLabel = getFilesGameLabel(game);
  const filename = file.header.filename || "Untitled";
  const author = file.header.author || "Unknown";
  const description =
    formatFileshareDescription(file.header.description) ||
    `${filename} by ${author} on ${gameLabel} File Share`;

  return buildRequestPageMetadata({
    title: `${filename} · ${gameLabel}`,
    description,
    path: getFileshareFileHref(game, fileId),
    images: [getFileshareOgImage(game, file)],
    twitterCard: "summary",
  });
}

export async function FileshareFilePageContent({
  game,
  fileId,
}: {
  game: FilesGame;
  fileId: string;
}) {
  const file = await loadFile(game, fileId);
  if (!file) {
    notFound();
  }

  const relatedFiles = await loadRelatedFiles(game, file.id);
  const sourceGame = await loadSourceGame(game, file.id, file.header.filetype);
  const screenshotViewUrl = getFileshareScreenshotViewUrl(game, file.shareId, {
    filetype: file.header.filetype,
    slotNumber: file.slotNumber,
    fileId: file.id,
  });

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <FileshareBackButton />

        <FileshareFileDetail game={game} file={file} />

        {screenshotViewUrl ? (
          <FileshareScreenshotPreview
            screenshotUrl={screenshotViewUrl}
            alt={file.header.filename || "Screenshot"}
          />
        ) : null}

        {sourceGame ? (
          <FileshareSourceGameSection game={game} sourceGame={sourceGame} />
        ) : null}

        <FileshareRelatedFiles game={game} files={relatedFiles} />
      </Stack>
    </Container>
  );
}
