import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { DateTimeDisplay } from "@/src/components/DateTimeDisplay";
import { GameIcon } from "@/src/components/GameIcon";
import { getTeamName } from "@/src/utils/teams";
import { formatSeconds } from "@/src/utils/gametype";
import { CarnageReportMapImage } from "./CarnageReportMapImage";
import { BARLOW_FAMILY } from "@/src/theme/fonts";
import type { RouterOutputs } from "@/src/api/router";

type CarnageReport =
  | RouterOutputs["sunrise2"]["getCarnageReport"]
  | RouterOutputs["ares"]["getCarnageReport"];

interface CarnageReportHeaderProps {
  game: "halo3" | "ares";
  report: CarnageReport;
}

function getGameModeLabel(report: CarnageReport): string {
  if (report.matchmaking_options?.hopper_name) {
    return "Matchmaking";
  }

  const isForgeMap = report.map_id === 700 || report.map_id === 701;
  return isForgeMap ? "Forge" : "Custom Games";
}

export function CarnageReportHeader({ game, report }: CarnageReportHeaderProps) {
  const players = [...report.players].sort((a, b) => a.standing - b.standing);
  const winner = players[0];
  const winningTeam =
    report.team_game && report.teams.length > 0
      ? [...report.teams].sort((a, b) => a.standing - b.standing)[0]
      : null;

  const durationInSeconds =
    (new Date(report.finish_time).getTime() - new Date(report.start_time).getTime()) / 1000;

  const headline = winningTeam
    ? `${getTeamName(winningTeam.team_index)} Team Wins`
    : `${winner.player_name} Wins`;

  const gameLabel = game === "ares" ? "Ares" : "Halo 3";
  const hopperLabel = report.matchmaking_options?.hopper_name ?? getGameModeLabel(report);

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
        {game === "halo3" ? <GameIcon game="halo3" size={28} aria-hidden /> : null}
        <Typography variant="body2" color="text.secondary">
          {gameLabel} Carnage Report
        </Typography>
      </Box>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 2.5, md: 3 }}
        sx={{ p: { xs: 2, sm: 3 }, alignItems: { md: "flex-start" } }}
      >
        <CarnageReportMapImage
          mapId={report.map_id}
          gameEngineType={report.game_variant.game_engine}
        />

        <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: BARLOW_FAMILY,
                fontWeight: 800,
                lineHeight: 1.15,
                mb: 0.75,
                background: "linear-gradient(180deg, #A5D65C 0%, #7CB342 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {headline}
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontFamily: BARLOW_FAMILY, fontWeight: 600, color: "text.primary" }}
            >
              {report.game_variant.name} on {report.map_variant_name}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip label={hopperLabel} color="primary" size="small" sx={{ fontWeight: 600 }} />
            <Chip
              label={formatSeconds(durationInSeconds)}
              size="small"
              variant="outlined"
              sx={{ borderColor: "divider" }}
            />
            <Chip
              label={report.team_game ? "Team Game" : "Free-for-All"}
              size="small"
              variant="outlined"
              sx={{ borderColor: "divider" }}
            />
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
              gap: 1.5,
            }}
          >
            {[
              { label: "Started", value: report.start_time },
              { label: "Finished", value: report.finish_time },
              { label: "Duration", value: formatSeconds(durationInSeconds), raw: true },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{
                  px: 1.5,
                  py: 1.25,
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "rgba(0, 0, 0, 0.22)",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mb: 0.25, textTransform: "uppercase", letterSpacing: 0.4 }}
                >
                  {item.label}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {"raw" in item && item.raw ? (
                    item.value
                  ) : (
                    <DateTimeDisplay date={item.value as string | Date} />
                  )}
                </Typography>
              </Box>
            ))}
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
}
