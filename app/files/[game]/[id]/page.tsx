import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container, Stack } from "@mui/material";
import { api } from "@/src/trpc/server";
import { FileshareFileDetail } from "@/src/components/files/FileshareFileDetail";
import { FileshareRelatedFiles } from "@/src/components/files/FileshareRelatedFiles";
import { FileshareSourceGameSection } from "@/src/components/files/FileshareSourceGameSection";
import { FileshareBackButton } from "@/src/components/files/FileshareBackButton";
import {
  getFilesGameLabel,
  isValidFilesGame,
  type FilesGame,
} from "@/src/components/files/filesPageTypes";
import { getSiteUrl } from "@/src/utils/siteUrl";
import { formatFileshareDescription } from "@/src/utils/formatFileshareDescription";
import { getFileshareScreenshotViewUrl } from "@/src/utils/fileshareScreenshotUrl";
import { FileshareScreenshotPreview } from "@/src/components/files/FileshareScreenshotPreview";
import { isFileshareSourceGameCandidate } from "@/src/utils/fileshareSourceGame";
import type { FileshareSourceGame } from "@/src/api/files/fileshareSourceGameSchema";

interface PageProps {
  params: { game: string; id: string };
}

async function loadFile(game: FilesGame, fileId: string) {
  try {
    return await api.files.fileshareFile.query({ game, fileId });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  if (!isValidFilesGame(params.game)) {
    return { title: "File Not Found - Blam Network" };
  }

  const file = await loadFile(params.game, params.id);
  if (!file) {
    return { title: "File Not Found - Blam Network" };
  }

  const gameLabel = getFilesGameLabel(params.game);
  const filename = file.header.filename || "Untitled";
  const description =
    formatFileshareDescription(file.header.description) ||
    `${filename} by ${file.header.author || "Unknown"} on ${gameLabel} File Share`;

  return {
    title: `${filename} - ${gameLabel} - Blam Network`,
    description,
    openGraph: {
      title: `${filename} - ${gameLabel}`,
      description,
      url: `${getSiteUrl()}/files/${params.game}/${params.id}`,
    },
  };
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

export default async function FileshareFilePage({ params }: PageProps) {
  if (!isValidFilesGame(params.game)) {
    notFound();
  }

  const file = await loadFile(params.game, params.id);
  if (!file) {
    notFound();
  }

  const relatedFiles = await loadRelatedFiles(params.game, file.id);
  const sourceGame = await loadSourceGame(params.game, file.id, file.header.filetype);
  const screenshotViewUrl = getFileshareScreenshotViewUrl(params.game, file.shareId, {
    filetype: file.header.filetype,
    slotNumber: file.slotNumber,
    fileId: file.id,
  });

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <FileshareBackButton />

        <FileshareFileDetail game={params.game} file={file} />

        {screenshotViewUrl ? (
          <FileshareScreenshotPreview
            screenshotUrl={screenshotViewUrl}
            alt={file.header.filename || "Screenshot"}
          />
        ) : null}

        {sourceGame ? (
          <FileshareSourceGameSection game={params.game} sourceGame={sourceGame} />
        ) : null}

        <FileshareRelatedFiles game={params.game} files={relatedFiles} />
      </Stack>
    </Container>
  );
}
