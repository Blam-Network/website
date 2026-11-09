"use client";

import { useMemo } from "react";
import {
  Box,
  Chip,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import type { ReachGame, ReachGamePlayer } from "@/src/api/reach/games";
import { DateTimeDisplay } from "@/src/components/DateTimeDisplay";
import { GamertagLink } from "@/src/components/Gamertag";
import { GameIcon } from "@/src/components/GameIcon";
import { SectionHeader } from "@/src/components/SectionHeader";
import { ReachRankBadge } from "@/src/components/reach/ReachRankBadge";
import { ReachEmblem } from "@/src/components/reach/ReachEmblem";
import { getReachGametypeIconUrl, getReachMapImageUrl } from "@/src/constants/fileshareIcons";
import {
  REACH_CUSTOM_STATISTIC_FIRST_INDEX,
  REACH_GAME_ENGINES,
  REACH_GUI_GAME_MODES,
  formatReachStatistic,
  getReachDamageTypeName,
  getReachDifficultyName,
  getReachGameModeLabel,
  getReachMapName,
} from "@/src/constants/reach/reachGameData";
import { formatSeconds } from "@/src/utils/gametype";
import { getTeamColor, getTeamName } from "@/src/utils/teams";
import { BARLOW_FAMILY } from "@/src/theme/fonts";
import { ReachMedalIcon } from "./ReachMedalIcon";
import { teamAccentColor } from "./ReachGamesTable";

const PLAYER_PATH = "/haloreach/player";

const headerCellSx = { color: "primary.main", fontWeight: 700, borderColor: "divider", whiteSpace: "nowrap" } as const;

function cssColor(color: { r: number; g: number; b: number }, alpha = 1) {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
}

function aiKills(player: ReachGamePlayer) {
  return player.ai_kills.reduce((total, bucket) => total + bucket.kills, 0);
}

function isPvE(report: ReachGame) {
  return report.game_engine === REACH_GAME_ENGINES.campaign || report.game_engine === REACH_GAME_ENGINES.survival;
}

function headline(report: ReachGame) {
  if (report.gui_game_mode === REACH_GUI_GAME_MODES.campaign) {
    return getReachMapName(report.map_id);
  }
  if (report.game_engine === REACH_GAME_ENGINES.survival) {
    return `${report.survival_waves_completed} ${report.survival_waves_completed === 1 ? "Wave" : "Waves"} Survived`;
  }
  if (report.team_game && report.teams.length > 0) {
    const winners = report.teams.filter((team) => team.standing === 0);
    return winners.length === 1 ? `${getTeamName(winners[0].team_index)} Team Wins` : "Tie Game";
  }
  const winners = report.players.filter((player) => player.standing === 0);
  if (winners.length === 1) {
    return `${winners[0].player_name} Wins`;
  }
  return winners.length > 1 ? "Tie Game" : "Game Over";
}

function subtitle(report: ReachGame) {
  if (report.gui_game_mode === REACH_GUI_GAME_MODES.campaign) {
    return `Campaign on ${getReachDifficultyName(report.campaign_difficulty)}`;
  }
  const variant = report.game_variant_name || (report.game_engine === REACH_GAME_ENGINES.survival ? "Firefight" : "Gametype");
  return `${variant} on ${report.map_variant_name || getReachMapName(report.map_id)}`;
}

function ReportHeader({ report }: { report: ReachGame }) {
  const duration = Math.max(0, (new Date(report.finish_time).getTime() - new Date(report.start_time).getTime()) / 1000);
  const chips = [
    report.hopper_name ?? getReachGameModeLabel(report.gui_game_mode, report.game_engine),
    formatSeconds(duration),
    ...(isPvE(report) ? [] : [report.team_game ? "Team Game" : "Free-for-All"]),
    ...(report.hopper_ranked ? ["Ranked"] : []),
    ...(report.gui_game_mode === REACH_GUI_GAME_MODES.campaign ? [getReachDifficultyName(report.campaign_difficulty)] : []),
  ];

  return (
    <Paper sx={{ overflow: "hidden" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
        <GameIcon game="reach" size={28} aria-hidden />
        <Typography variant="body2" color="text.secondary">
          Halo: Reach Carnage Report
        </Typography>
      </Box>
      <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 2.5, md: 3 }} sx={{ p: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            position: "relative",
            width: { xs: "100%", md: 320 },
            aspectRatio: "16 / 9",
            flexShrink: 0,
            borderRadius: 1,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            backgroundImage: `url(${getReachMapImageUrl(report.map_id)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "rgba(255, 255, 255, 0.04)",
          }}
        >
          {report.game_variant_icon_index >= 0 && (
            <Box
              component="img"
              src={getReachGametypeIconUrl(report.game_variant_icon_index)}
              alt=""
              sx={{ position: "absolute", right: 8, bottom: 8, width: 56, height: 56, filter: "drop-shadow(0 0 4px rgba(0,0,0,0.8))" }}
            />
          )}
        </Box>
        <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: BARLOW_FAMILY,
                fontWeight: 800,
                lineHeight: 1.15,
                mb: 0.75,
                background: "linear-gradient(180deg, #A1D442 0%, #82C603 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {headline(report)}
            </Typography>
            <Typography variant="h6" sx={{ fontFamily: BARLOW_FAMILY, fontWeight: 600 }}>
              {subtitle(report)}
            </Typography>
            {report.game_variant_description && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {report.game_variant_description}
              </Typography>
            )}
          </Box>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {chips.map((chip, index) => (
              <Chip
                key={chip}
                label={chip}
                size="small"
                color={index === 0 ? "primary" : "default"}
                variant={index === 0 ? "filled" : "outlined"}
                sx={{ fontWeight: index === 0 ? 600 : 400, borderColor: "divider" }}
              />
            ))}
          </Stack>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" }, gap: 1.5 }}>
            {[
              { label: "Started", value: <DateTimeDisplay date={report.start_time} /> },
              { label: "Finished", value: <DateTimeDisplay date={report.finish_time} /> },
              report.game_engine === REACH_GAME_ENGINES.survival
                ? { label: "Sets / Rounds", value: `${report.survival_sets_completed} / ${report.survival_full_rounds_completed}` }
                : { label: "Duration", value: formatSeconds(duration) },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{ px: 1.5, py: 1.25, borderRadius: 1, border: "1px solid", borderColor: "divider", backgroundColor: "rgba(0, 0, 0, 0.22)" }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.25, textTransform: "uppercase", letterSpacing: 0.4 }}>
                  {item.label}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
}

function PlayerCell({ player, teamGame }: { player: ReachGamePlayer; teamGame: boolean }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
      <ReachEmblem emblem={player} size={30} />
      <ReachRankBadge grade={player.grade} subGrade={player.sub_grade} size={22} />
      <Box sx={{ minWidth: 0 }}>
        <GamertagLink
          gamertag={player.player_name}
          playerPathBase={PLAYER_PATH}
          variant="body2"
          color={teamGame ? teamAccentColor(player.team) : "text.primary"}
        />
        {player.service_tag && (
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.1 }}>
            {player.service_tag}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

function Scoreboard({ report }: { report: ReachGame }) {
  const pve = isPvE(report);
  const customStatistics = report.custom_statistic_names
    .map((name, index) => ({ name, format: report.custom_statistic_formats[index] ?? 0, index }))
    .filter((statistic) => statistic.name);

  const groups = report.team_game && !pve
    ? report.teams.map((team) => ({
        key: `team-${team.team_index}`,
        team,
        players: report.players.filter((player) => player.team === team.team_index),
      }))
    : [{ key: "all", team: null, players: report.players }];

  const columns = pve
    ? ["Score", "Kills", "Deaths", "Betrayals", "Best Spree"]
    : ["Score", "Kills", "Assists", "Deaths", "+/-", "Best Spree", ...customStatistics.map((statistic) => statistic.name)];

  const values = (player: ReachGamePlayer): (string | number)[] =>
    pve
      ? [player.score, aiKills(player) + player.kills, player.deaths, player.betrayals, player.most_kills_in_a_row]
      : [
          player.score,
          player.kills,
          player.assists,
          player.deaths,
          formatReachStatistic(player.kills - player.deaths, 1),
          player.most_kills_in_a_row,
          ...customStatistics.map((statistic) =>
            formatReachStatistic(player.statistics[REACH_CUSTOM_STATISTIC_FIRST_INDEX + statistic.index] ?? 0, statistic.format),
          ),
        ];

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider", backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
      <Table size="small" sx={{ "& .MuiTableCell-root": { py: 0.75, px: 1.5 } }}>
        <TableHead>
          <TableRow>
            <TableCell sx={headerCellSx}>Player</TableCell>
            {columns.map((column) => (
              <TableCell key={column} sx={headerCellSx} align="right">
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {groups.map((group) => (
            <GroupRows key={group.key} group={group} columns={columns.length} values={values} teamGame={report.team_game && !pve} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function GroupRows({
  group,
  columns,
  values,
  teamGame,
}: {
  group: { team: ReachGame["teams"][number] | null; players: ReachGamePlayer[] };
  columns: number;
  values: (player: ReachGamePlayer) => (string | number)[];
  teamGame: boolean;
}) {
  const teamColor = group.team ? getTeamColor(group.team.team_index) : null;
  return (
    <>
      {group.team && teamColor && (
        <TableRow sx={{ backgroundColor: cssColor(teamColor, 0.18) }}>
          <TableCell sx={{ fontWeight: 700, color: teamAccentColor(group.team.team_index), borderLeft: `4px solid ${cssColor(teamColor)}` }}>
            {getTeamName(group.team.team_index)} Team
          </TableCell>
          <TableCell align="right" sx={{ fontWeight: 700 }}>
            {group.team.score}
          </TableCell>
          <TableCell colSpan={columns - 1} />
        </TableRow>
      )}
      {group.players.map((player) => (
        <TableRow
          key={player.player_index}
          hover
          sx={teamColor ? { "& td:first-of-type": { borderLeft: `4px solid ${cssColor(teamColor, 0.6)}` } } : undefined}
        >
          <TableCell>
            <PlayerCell player={player} teamGame={teamGame} />
          </TableCell>
          {values(player).map((value, index) => (
            <TableCell key={index} align="right" sx={{ fontWeight: index === 0 ? 700 : 400, fontVariantNumeric: "tabular-nums" }}>
              {value}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function Medals({ report }: { report: ReachGame }) {
  const players = report.players.filter((player) => player.medals.length > 0);
  if (players.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No medals were earned in this game.
      </Typography>
    );
  }
  return (
    <Stack spacing={1}>
      {players.map((player) => {
        const total = player.medals.reduce((sum, medal) => sum + medal.count, 0);
        return (
          <Paper
            key={player.player_index}
            elevation={0}
            sx={{ p: 1.5, border: "1px solid", borderColor: "divider", backgroundColor: "rgba(0, 0, 0, 0.2)" }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1, gap: 1 }}>
              <PlayerCell player={player} teamGame={report.team_game && !isPvE(report)} />
              <Typography variant="caption" color="text.secondary">
                {total} {total === 1 ? "medal" : "medals"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.25 }}>
              {[...player.medals]
                .sort((a, b) => b.count - a.count || a.medal - b.medal)
                .map((medal) => (
                  <ReachMedalIcon key={medal.medal} medal={medal.medal} count={medal.count} />
                ))}
            </Box>
          </Paper>
        );
      })}
    </Stack>
  );
}

function Weapons({ report }: { report: ReachGame }) {
  const weapons = useMemo(() => {
    const totals = new Map<number, { damage_type: number; kills: number; headshots: number; deaths: number; topPlayer: string; topKills: number }>();
    for (const player of report.players) {
      for (const weapon of player.weapons) {
        const total = totals.get(weapon.damage_type) ?? { damage_type: weapon.damage_type, kills: 0, headshots: 0, deaths: 0, topPlayer: "", topKills: 0 };
        total.kills += weapon.kills;
        total.headshots += weapon.headshots;
        total.deaths += weapon.deaths;
        if (weapon.kills > total.topKills) {
          total.topKills = weapon.kills;
          total.topPlayer = player.player_name;
        }
        totals.set(weapon.damage_type, total);
      }
    }
    return [...totals.values()].filter((weapon) => weapon.kills > 0 || weapon.deaths > 0).sort((a, b) => b.kills - a.kills || b.deaths - a.deaths);
  }, [report]);

  if (weapons.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No weapon statistics were recorded.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider", backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
      <Table size="small" sx={{ "& .MuiTableCell-root": { py: 0.75, px: 1.5 } }}>
        <TableHead>
          <TableRow>
            <TableCell sx={headerCellSx}>Weapon</TableCell>
            <TableCell sx={headerCellSx} align="right">Kills</TableCell>
            <TableCell sx={headerCellSx} align="right">Headshots</TableCell>
            <TableCell sx={headerCellSx} align="right">Deaths</TableCell>
            <TableCell sx={headerCellSx}>Most Kills</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {weapons.map((weapon) => (
            <TableRow key={weapon.damage_type} hover>
              <TableCell sx={{ fontWeight: 600 }}>{getReachDamageTypeName(weapon.damage_type)}</TableCell>
              <TableCell align="right">{weapon.kills}</TableCell>
              <TableCell align="right">{weapon.headshots}</TableCell>
              <TableCell align="right">{weapon.deaths}</TableCell>
              <TableCell sx={{ color: "text.secondary" }}>
                {weapon.topKills > 0 ? `${weapon.topPlayer} (${weapon.topKills})` : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function Versus({ report }: { report: ReachGame }) {
  const players = report.players;
  const kills = (killer: ReachGamePlayer, victim: ReachGamePlayer) =>
    killer.versus.find((opponent) => opponent.opponent_index === victim.player_index)?.kills ?? 0;
  const max = Math.max(1, ...players.flatMap((killer) => players.map((victim) => kills(killer, victim))));

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider", backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
      <Table size="small" sx={{ "& .MuiTableCell-root": { py: 0.5, px: 1 } }}>
        <TableHead>
          <TableRow>
            <TableCell sx={headerCellSx}>Killer ↓ / Victim →</TableCell>
            {players.map((victim) => (
              <TableCell key={victim.player_index} align="center" sx={{ ...headerCellSx, maxWidth: 72, overflow: "hidden", textOverflow: "ellipsis" }}>
                <Tooltip title={victim.player_name}>
                  <Box component="span" sx={{ color: report.team_game ? teamAccentColor(victim.team) : undefined }}>
                    {victim.player_name.slice(0, 6)}
                  </Box>
                </Tooltip>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((killer) => (
            <TableRow key={killer.player_index}>
              <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap", color: report.team_game ? teamAccentColor(killer.team) : undefined }}>
                {killer.player_name}
              </TableCell>
              {players.map((victim) => {
                const count = kills(killer, victim);
                return (
                  <TableCell
                    key={victim.player_index}
                    align="center"
                    sx={{
                      fontVariantNumeric: "tabular-nums",
                      color: count ? "text.primary" : "text.disabled",
                      backgroundColor: count ? `rgba(130, 198, 3, ${0.08 + (0.45 * count) / max})` : undefined,
                    }}
                  >
                    {killer.player_index === victim.player_index ? "—" : count}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ReachCarnageReportView({ report }: { report: ReachGame }) {
  const pve = isPvE(report);
  const showVersus = !pve && report.players.length > 1;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
      <Stack spacing={4}>
        <ReportHeader report={report} />
        <Box>
          <SectionHeader title="Scoreboard" sx={{ mb: 2 }} />
          <Scoreboard report={report} />
        </Box>
        <Box>
          <SectionHeader title="Medals" sx={{ mb: 2 }} />
          <Medals report={report} />
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: showVersus ? "minmax(0, 1fr) minmax(0, 1fr)" : "1fr" },
            gap: 4,
            alignItems: "start",
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <SectionHeader title="Weapons" sx={{ mb: 2 }} />
            <Weapons report={report} />
          </Box>
          {showVersus && (
            <Box sx={{ minWidth: 0 }}>
              <SectionHeader title="Kills Versus" sx={{ mb: 2 }} />
              <Versus report={report} />
            </Box>
          )}
        </Box>
      </Stack>
    </Container>
  );
}
