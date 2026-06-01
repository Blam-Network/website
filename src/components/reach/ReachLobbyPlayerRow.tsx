import { Box, Stack, Typography } from "@mui/material";
import { getColor, getColorName } from "@/src/colors";
import { getTeamColor } from "@/src/utils/teams";
import { BARLOW_FAMILY } from "@/src/theme/fonts";
import type { ReachLobbyPlayer } from "@/src/api/reach/lobbiesSchema";
import { ReachRankBadge } from "./ReachRankBadge";

/** Reserved for Reach emblem (matches PGCR breakdown). */
export const REACH_LOBBY_EMBLEM_SLOT_WIDTH = 40;

/** Reserved for rank badge + skill (Reach ranks TBD). */
export const REACH_LOBBY_RANK_SLOT_WIDTH = 52;

interface ReachLobbyPlayerRowProps {
  player: ReachLobbyPlayer;
  useTeamColors?: boolean;
}

type RowColor = {
  accentColor: string;
  mainBackgroundColor: string;
  mainHoverBackgroundColor: string;
  sidePanelBackgroundColor: string;
  sidePanelHoverBackgroundColor: string;
};

/** Mix channel toward white (0 = unchanged, 1 = white). */
function lightenChannel(channel: number, amount: number): number {
  return Math.round(channel + (255 - channel) * amount);
}

function lightenRgb(
  color: { r: number; g: number; b: number },
  amount: number,
): { r: number; g: number; b: number } {
  return {
    r: lightenChannel(color.r, amount),
    g: lightenChannel(color.g, amount),
    b: lightenChannel(color.b, amount),
  };
}

function rowColorFromRgb(color: { r: number; g: number; b: number }): RowColor {
  const { r, g, b } = color;
  const side = lightenRgb(color, 0.5);
  const sideHover = lightenRgb(color, 0.62);
  return {
    accentColor: `rgb(${r}, ${g}, ${b})`,
    mainBackgroundColor: `rgba(${r}, ${g}, ${b}, 0.42)`,
    mainHoverBackgroundColor: `rgba(${r}, ${g}, ${b}, 0.52)`,
    sidePanelBackgroundColor: `rgba(${side.r}, ${side.g}, ${side.b}, 0.55)`,
    sidePanelHoverBackgroundColor: `rgba(${sideHover.r}, ${sideHover.g}, ${sideHover.b}, 0.65)`,
  };
}

function getArmorRowColor(primaryColorIndex: number): RowColor {
  return rowColorFromRgb(getColor(getColorName(primaryColorIndex)));
}

function getTeamRowColor(team: number): RowColor {
  return rowColorFromRgb(getTeamColor(team));
}

const NEUTRAL_ROW_COLOR: RowColor = {
  accentColor: "rgb(140, 140, 140)",
  mainBackgroundColor: "rgba(255, 255, 255, 0.07)",
  mainHoverBackgroundColor: "rgba(255, 255, 255, 0.11)",
  sidePanelBackgroundColor: "rgba(255, 255, 255, 0.22)",
  sidePanelHoverBackgroundColor: "rgba(255, 255, 255, 0.28)",
};

function getReachPlayerRowColor(
  player: ReachLobbyPlayer,
  useTeamColors: boolean,
): RowColor {
  if (useTeamColors && player.team != null) {
    return getTeamRowColor(player.team);
  }
  if (player.appearance) {
    return getArmorRowColor(player.appearance.primaryColor);
  }
  return NEUTRAL_ROW_COLOR;
}

const sidePanelSx = (rowColor: RowColor) => ({
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  alignSelf: "stretch",
  backgroundColor: rowColor.sidePanelBackgroundColor,
  transition: "background-color 0.15s ease",
});

export function ReachLobbyPlayerRow({
  player,
  useTeamColors = false,
}: ReachLobbyPlayerRowProps) {
  const appearance = player.appearance;
  const displayName = player.playerName ?? "Unknown Player";
  const onTeamRow = useTeamColors && player.team != null;
  const rowColor = getReachPlayerRowColor(player, useTeamColors);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "stretch",
        boxShadow: `inset 3px 0 0 ${rowColor.accentColor}`,
        transition: "background-color 0.15s ease",
        "&:hover": {
          "& .reach-lobby-row-side": {
            backgroundColor: rowColor.sidePanelHoverBackgroundColor,
          },
          "& .reach-lobby-row-main": {
            backgroundColor: rowColor.mainHoverBackgroundColor,
          },
        },
      }}
    >
      <Box
        className="reach-lobby-row-side"
        aria-hidden
        sx={{
          ...sidePanelSx(rowColor),
          width: REACH_LOBBY_EMBLEM_SLOT_WIDTH,
        }}
      />

      <Box
        className="reach-lobby-row-main"
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          px: 1.25,
          py: 0.75,
          backgroundColor: rowColor.mainBackgroundColor,
          transition: "background-color 0.15s ease",
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="baseline"
          useFlexGap
          flexWrap="wrap"
          sx={{ minWidth: 0 }}
        >
          <Typography
            component="span"
            sx={{
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.9375rem",
              fontFamily: BARLOW_FAMILY,
            }}
          >
            {displayName}
          </Typography>
          {appearance?.serviceTag && (
            <Typography
              component="span"
              sx={{
                color: "rgba(255, 255, 255, 0.55)",
                fontSize: "0.8125rem",
                fontFamily: BARLOW_FAMILY,
              }}
            >
              {appearance.serviceTag}
            </Typography>
          )}
          {appearance && !onTeamRow && (
            <Typography
              component="span"
              sx={{
                color: "rgba(255, 255, 255, 0.45)",
                fontSize: "0.6875rem",
                fontWeight: 600,
                letterSpacing: 0.4,
                fontFamily: BARLOW_FAMILY,
              }}
            >
              {appearance.model ? "ELITE" : "SPARTAN"}
            </Typography>
          )}
        </Stack>
      </Box>

      <Box
        className="reach-lobby-row-side"
        sx={{
          ...sidePanelSx(rowColor),
          width: REACH_LOBBY_RANK_SLOT_WIDTH,
        }}
      >
        {player.rank != null && (
          <ReachRankBadge
            grade={player.rank.grade}
            subGrade={player.rank.subGrade}
            size={28}
          />
        )}
      </Box>
    </Box>
  );
}

/** Team tinting when roster has multiple teams; all-zero means FFA / teams off. */
export function sessionUsesTeamColors(players: ReachLobbyPlayer[]): boolean {
  if (players.length === 0) {
    return false;
  }

  if (players.every((player) => player.team === 0)) {
    return false;
  }

  return players.some((player) => player.team != null && player.team !== 0);
}
