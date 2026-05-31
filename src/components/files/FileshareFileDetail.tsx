import { Box, Paper, Stack, Typography } from "@mui/material";
import type { FileshareFile as Halo3FileshareFile } from "@/src/api/halo3/fileshareFilesSchema";
import type { FileshareFile as ReachFileshareFile } from "@/src/api/reach/fileshareFilesSchema";
import { FileshareFiletypeIcon } from "@/src/components/FileshareFiletypeIcon";
import { FileshareDownloadButton } from "@/src/components/FileshareDownloadButton";
import { DateTimeDisplay } from "@/src/components/DateTimeDisplay";
import { GamertagLink } from "@/src/components/Gamertag";
import { GameIcon } from "@/src/components/GameIcon";
import { FilesGame, getFilesGameLabel } from "@/src/components/files/filesPageTypes";
import { formatFileshareDescription } from "@/src/utils/formatFileshareDescription";

type FileshareFile = Halo3FileshareFile | ReachFileshareFile;

interface FileshareFileDetailProps {
  game: FilesGame;
  file: FileshareFile;
}

function getScreenshotInfo(game: FilesGame, file: FileshareFile) {
  const isScreenshot =
    game === "reach" ? file.header.filetype === 2 : file.header.filetype === 13;

  let mapId: number | undefined;
  if (game === "reach") {
    if (file.header.filetype === 3 || file.header.filetype === 4 || file.header.filetype === 5) {
      mapId = file.header.mapId;
    }
  } else if (
    file.header.filetype === 10 ||
    file.header.filetype === 11 ||
    file.header.filetype === 12
  ) {
    mapId = file.header.mapId;
  }

  const iconIndex =
    game === "reach" && "iconIndex" in file.header ? file.header.iconIndex : undefined;

  return { isScreenshot, mapId, iconIndex };
}

export function FileshareFileDetail({ game, file }: FileshareFileDetailProps) {
  const { isScreenshot, mapId, iconIndex } = getScreenshotInfo(game, file);
  const gameLabel = getFilesGameLabel(game);
  const fileShareGame = game === "reach" ? "reach" : game;

  const formattedDescription = formatFileshareDescription(file.header.description);

  return (
    <Paper sx={{ overflow: "hidden" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 2,
          py: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <GameIcon game={game} size={28} />
        <Typography variant="body2" color="text.secondary">
          {gameLabel} File Share
        </Typography>
      </Box>

      <Stack
        direction={{ xs: "column", sm: isScreenshot ? "column" : "row" }}
        sx={{ alignItems: { sm: "stretch" } }}
      >
        {!isScreenshot && (
        <Box
          sx={{
            flexShrink: 0,
            width: { xs: "100%", sm: 280 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
            borderRight: { sm: "1px solid" },
            borderBottom: { xs: "1px solid", sm: "none" },
            borderColor: "divider",
            backgroundColor: "rgba(0, 0, 0, 0.28)",
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 220 }}>
            <FileshareFiletypeIcon
              fileShareGame={fileShareGame}
              filetype={file.header.filetype}
              gameEngineType={file.header.gameEngineType}
              iconIndex={iconIndex}
              size="100%"
              mapId={mapId}
            />
          </Box>
        </Box>
        )}

        <Stack sx={{ flex: 1, p: { xs: 2, sm: 3 }, gap: 2, minWidth: 0 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2, mb: 1 }}>
              {file.header.filename || "Untitled"}
            </Typography>
            {formattedDescription ? (
              <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
                {formattedDescription}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                No description
              </Typography>
            )}
          </Box>

          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              {file.header.author?.trim() ? (
                <>
                  Created by{" "}
                  <GamertagLink
                    gamertag={file.header.author}
                    authorXuid={file.header.authorXuid}
                    sx={{ display: "inline" }}
                  />{" "}
                  on <DateTimeDisplay date={file.header.date} />
                </>
              ) : (
                <>
                  Created on <DateTimeDisplay date={file.header.date} />
                </>
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {file.uploader?.trim() ? (
                <>
                  Uploaded by{" "}
                  <GamertagLink
                    gamertag={file.uploader}
                    authorXuid={file.uploaderXuid}
                    sx={{ display: "inline" }}
                  />{" "}
                  on <DateTimeDisplay date={file.header.date} />
                </>
              ) : (
                <>
                  Uploaded on <DateTimeDisplay date={file.header.date} />
                </>
              )}
            </Typography>
          </Stack>

          <Box sx={{ pt: 1 }}>
            <FileshareDownloadButton fileId={file.id} game={game} />
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
}
