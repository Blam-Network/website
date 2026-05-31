import Link from "next/link";
import { Box, Link as MuiLink, Paper, Stack, Typography } from "@mui/material";
import type { FileshareSourceGame } from "@/src/api/files/fileshareSourceGameSchema";
import { DateTimeDisplay } from "@/src/components/DateTimeDisplay";
import type { FilesGame } from "@/src/components/files/filesPageTypes";
import {
  getHalo3DifficultyName,
  getHalo3MissionName,
} from "@/src/utils/halo3CampaignDisplay";

interface FileshareSourceGameSectionProps {
  game: FilesGame;
  sourceGame: FileshareSourceGame;
}

function getReportUrl(game: FilesGame, sourceGame: FileshareSourceGame): string {
  const base = game === "odst" ? "/odst" : game === "reach" ? "/reach" : "/halo3";
  const path =
    sourceGame.reportType === "campaign" ? "campaign-carnage-report" : "carnage-report";

  return `${base}/${path}/${sourceGame.reportId}`;
}

function getGameModeLabel(sourceGame: FileshareSourceGame): string {
  if (sourceGame.reportType === "campaign") {
    return "Campaign";
  }

  if (sourceGame.hopperName) {
    return "Matchmaking";
  }

  const isForgeMap = sourceGame.mapId === 700 || sourceGame.mapId === 701;
  return isForgeMap ? "Forge" : "Custom Games";
}

function getGameTitle(game: FilesGame, sourceGame: FileshareSourceGame): string {
  if (sourceGame.reportType === "campaign") {
    if (game === "halo3") {
      return `${getHalo3MissionName(sourceGame.mapId)} on ${getHalo3DifficultyName(sourceGame.campaignDifficulty)}`;
    }

    return "Campaign Game";
  }

  return `${sourceGame.gameVariantName ?? "Gametype"} on ${sourceGame.mapVariantName ?? "Unknown Map"}`;
}

export function FileshareSourceGameSection({ game, sourceGame }: FileshareSourceGameSectionProps) {
  const reportUrl = getReportUrl(game, sourceGame);
  const gameTitle = getGameTitle(game, sourceGame);
  const gameMode = getGameModeLabel(sourceGame);

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>
        From Game
      </Typography>

      <Stack spacing={1}>
        <Typography variant="body1">
          <MuiLink
            component={Link}
            href={reportUrl}
            underline="hover"
            sx={{ fontWeight: 600 }}
          >
            {gameTitle}
          </MuiLink>
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {gameMode}
          </Typography>
          {sourceGame.hopperName ? (
            <Typography variant="body2" color="text.secondary">
              {sourceGame.hopperName}
            </Typography>
          ) : null}
          <Typography variant="body2" color="text.secondary">
            Played <DateTimeDisplay date={sourceGame.finishTime} />
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
