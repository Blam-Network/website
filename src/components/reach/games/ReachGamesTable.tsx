import { Box, Link as MuiLink, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import Link from "next/link";
import { DateTimeDisplay } from "@/src/components/DateTimeDisplay";
import { getReachGametypeIconUrl, getReachMapImageUrl } from "@/src/constants/fileshareIcons";
import {
  REACH_GUI_GAME_MODES,
  getReachDifficultyName,
  getReachGameModeLabel,
  getReachMapName,
} from "@/src/constants/reach/reachGameData";
import type { ReachGameListItem } from "@/src/api/reach/games";
import { getTeamColor } from "@/src/utils/teams";

export function reachGameTitle(game: Pick<ReachGameListItem, "gui_game_mode" | "game_variant_name" | "map_id" | "map_variant_name" | "campaign_difficulty">) {
  if (game.gui_game_mode === REACH_GUI_GAME_MODES.campaign) {
    return `${getReachMapName(game.map_id)} on ${getReachDifficultyName(game.campaign_difficulty)}`;
  }
  const variant = game.game_variant_name || "Firefight";
  return `${variant} on ${game.map_variant_name || getReachMapName(game.map_id)}`;
}

export function teamAccentColor(teamIndex: number): string {
  const color = getTeamColor(teamIndex);
  const lighten = (channel: number) => Math.round(channel + (255 - channel) * 0.35);
  return `rgb(${lighten(color.r)}, ${lighten(color.g)}, ${lighten(color.b)})`;
}

function standingLabel(standing: number) {
  const place = standing + 1;
  const suffix = place % 10 === 1 && place !== 11 ? "st" : place % 10 === 2 && place !== 12 ? "nd" : place % 10 === 3 && place !== 13 ? "rd" : "th";
  return `${place}${suffix}`;
}

interface ReachGamesTableProps {
  games: ReachGameListItem[];
  showPlayerResult?: boolean;
  dense?: boolean;
}

const headerSx = { color: "primary.main", fontWeight: 700, borderColor: "divider" } as const;

export function ReachGamesTable({ games, showPlayerResult = false, dense = false }: ReachGamesTableProps) {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ border: "1px solid", borderColor: "divider", backgroundColor: "rgba(0, 0, 0, 0.2)" }}
    >
      <Table size="small" sx={{ "& .MuiTableCell-root": { py: dense ? 0.75 : 1, px: 1.5 } }}>
        <TableHead>
          <TableRow>
            <TableCell sx={headerSx}>Game</TableCell>
            <TableCell sx={headerSx}>Type</TableCell>
            {showPlayerResult && <TableCell sx={headerSx}>Result</TableCell>}
            {!dense && <TableCell sx={headerSx} align="right">Players</TableCell>}
            <TableCell sx={headerSx}>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {games.map((game) => {
            const player = game.player;
            return (
              <TableRow key={game.id} hover>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
                    {!dense && (
                      <Box
                        sx={{
                          position: "relative",
                          width: 64,
                          height: 36,
                          flexShrink: 0,
                          borderRadius: 0.5,
                          overflow: "hidden",
                          backgroundImage: `url(${getReachMapImageUrl(game.map_id)})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                        }}
                      >
                        {game.game_variant_icon_index >= 0 && (
                          <Box
                            component="img"
                            src={getReachGametypeIconUrl(game.game_variant_icon_index)}
                            alt=""
                            sx={{ position: "absolute", right: 2, bottom: 2, width: 18, height: 18 }}
                          />
                        )}
                      </Box>
                    )}
                    <Box sx={{ minWidth: 0 }}>
                      <MuiLink
                        component={Link}
                        href={`/haloreach/carnage-report/${game.id}`}
                        underline="hover"
                        sx={{ fontWeight: 600, fontSize: "0.8125rem" }}
                      >
                        {reachGameTitle(game)}
                      </MuiLink>
                      {game.hopper_name && !dense && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                          {game.hopper_name}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ color: "text.secondary", fontSize: "0.8125rem" }}>
                  {getReachGameModeLabel(game.gui_game_mode, game.game_engine)}
                </TableCell>
                {showPlayerResult && (
                  <TableCell sx={{ fontSize: "0.8125rem", whiteSpace: "nowrap" }}>
                    {player ? (
                      <>
                        <Box
                          component="span"
                          sx={{ fontWeight: 700, color: game.team_game ? teamAccentColor(player.team) : "text.primary" }}
                        >
                          {standingLabel(player.standing)}
                        </Box>
                        <Box component="span" sx={{ color: "text.secondary", ml: 1 }}>
                          {player.kills}/{player.deaths}/{player.assists}
                        </Box>
                      </>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                )}
                {!dense && (
                  <TableCell align="right" sx={{ color: "text.secondary", fontSize: "0.8125rem" }}>
                    {game.player_count}
                  </TableCell>
                )}
                <TableCell sx={{ color: "text.secondary", fontSize: "0.8125rem", whiteSpace: "nowrap" }}>
                  <DateTimeDisplay date={game.finish_time} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
