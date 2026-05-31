'use client';

import { Box, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Tabs, Tab, Link } from "@mui/material";
import { getColor, getColorName } from "../colors";
import { Fragment, ReactNode, useState } from "react";
import { Emblem } from "./Emblem";
import { RankBadge } from "./ServiceRecordPlaceholder";
import { getTeamColor, getTeamName } from "../utils/teams";
import { formatSeconds } from "../utils/gametype";
import type { Medals } from "../api/halo3/carnage-report/players";
import { getDamageSourceCategory, getDamageSourceName } from "../api/halo3/carnage-report/players";
import { RouterOutputs } from "../api/router";
import { Medal } from "./Medal";
import { formatGamertag, isLinkableGamertag } from "./Gamertag";
import { BARLOW_FAMILY } from "@/src/theme/fonts";

type CarnageReport =
  | RouterOutputs["sunrise2"]["getCarnageReport"]
  | RouterOutputs["ares"]["getCarnageReport"];

type CarnageReportPlayer = CarnageReport["players"][number];

function getSortedPlayers(report: CarnageReport): CarnageReportPlayer[] {
  const players = [...report.players];

  if (report.team_game && report.teams.length > 0) {
    const teamOrder = [...report.teams]
      .sort((a, b) => a.standing - b.standing)
      .map((team) => team.team_index);

    const teamSortKey = (teamIndex: number) => {
      const order = teamOrder.indexOf(teamIndex);
      return order === -1 ? teamIndex + 100 : order;
    };

    return players.sort((a, b) => {
      const byTeam = teamSortKey(a.player_team) - teamSortKey(b.player_team);
      if (byTeam !== 0) {
        return byTeam;
      }
      return a.standing - b.standing;
    });
  }

  return players.sort((a, b) => a.standing - b.standing);
}

export const PGCRBreakdown = ({
    report,
    playerRouteBase = "/halo3/player",
}: {
    report: CarnageReport;
    playerRouteBase?: "/halo3/player" | "/ares/player";
}) => {
    const [value, setValue] = useState("CARNAGE");

    return (
        <Box>
            <Tabs 
                value={value} 
                onChange={(e, v) => setValue(v)} 
                sx={{
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '& .MuiTab-root': {
                        minHeight: 44,
                        textTransform: 'none',
                        fontWeight: 600,
                        color: 'text.secondary',
                        '&.Mui-selected': {
                            color: 'primary.main',
                        },
                    },
                    '& .MuiTabs-indicator': {
                        backgroundColor: 'primary.main',
                        height: 3,
                        borderRadius: '3px 3px 0 0',
                    },
                }}
            >
                <Tab label="Carnage" value="CARNAGE" />
                <Tab label="Kill Breakdown" value="KILL_BREAKDOWN" />
                <Tab label="Field Stats" value="FIELD_STATS" />
                <Tab label="Medals" value="MEDALS" />
            </Tabs>
            <Box sx={{ minHeight: '200px' }}>
                {value === "CARNAGE" && <Carnage report={report} playerRouteBase={playerRouteBase} />}
                {value === "GAMETYPE" && <KOTH report={report} playerRouteBase={playerRouteBase} />}
                {value === "FIELD_STATS" && <FieldStats report={report} playerRouteBase={playerRouteBase} />}
                {value === "KILL_BREAKDOWN" && <KillBreakdown report={report} playerRouteBase={playerRouteBase} />}
                {value === "MEDALS" && <Medals report={report} playerRouteBase={playerRouteBase} />}
            </Box>
        </Box>
    )
}

const PLAYER_NAME_COLUMN_SX = {
  minWidth: 150,
  width: "18%",
} as const;

const BreakdownTable = ({
    report,
    headings,
    players,
    playerRouteBase = "/halo3/player",
}: {
    report: CarnageReport;
    headings: string[];
    players: Record<number, (string | number | ReactNode)[]>;
    playerRouteBase?: "/halo3/player" | "/ares/player";
}) => {
    const getPlayerRowColor = (player: CarnageReport['players'][0]) => {
        const color = report.team_game
            ? getTeamColor(player.player_team)
            : getColor(getColorName(player.primary_color));

        return {
            accentColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
            backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, 0.48)`,
            hoverBackgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, 0.58)`,
        };
    };

    const sortedPlayers = getSortedPlayers(report);
    
    return (
        <TableContainer>
            <Table
              size="small"
              sx={{
                '& .MuiTableCell-root': {
                    borderColor: 'divider',
                },
                '& .MuiTableBody-root .MuiTableRow-root .MuiTableCell-root:not(:first-of-type)': {
                    fontFamily: BARLOW_FAMILY,
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    py: 0.5,
                    px: 1.25,
                    textAlign: 'center',
                    verticalAlign: 'middle',
                },
                '& .MuiTableBody-root .MuiTableRow-root .MuiTableCell-root:first-of-type': {
                    py: 0.5,
                    px: 1.25,
                    verticalAlign: 'middle',
                },
              }}
            >
              <colgroup>
                <col style={{ minWidth: 150, width: "18%" }} />
                {headings.map((_, index) => <col key={index} />)}
              </colgroup>
              <TableHead>
                <TableRow sx={{
                    '& .MuiTableCell-root': {
                        fontFamily: BARLOW_FAMILY,
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        letterSpacing: 'normal',
                        textTransform: 'none',
                        WebkitFontSmoothing: 'auto',
                        MozOsxFontSmoothing: 'auto',
                        backgroundColor: 'rgba(0, 0, 0, 0.35)',
                        color: 'primary.main',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    },
                }}>
                    <TableCell sx={PLAYER_NAME_COLUMN_SX}>Player Name</TableCell>
                    {headings.map((headings) => (
                        <TableCell key={headings}>{headings}</TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedPlayers.map((player, index) => {
                    const rowColor = getPlayerRowColor(player);
                    const isFirstOnTeam =
                      report.team_game &&
                      (index === 0 || player.player_team !== sortedPlayers[index - 1].player_team);
                    const showTeamDivider = report.team_game && isFirstOnTeam && index > 0;

                    return (
                        <Fragment key={player.player_index}>
                            {isFirstOnTeam ? (
                              <TableRow>
                                <TableCell
                                  colSpan={headings.length + 1}
                                  sx={{
                                    py: 0.5,
                                    px: 1.25,
                                    borderBottom: "none",
                                    backgroundColor: "rgba(0, 0, 0, 0.35)",
                                    boxShadow: `inset 3px 0 0 ${rowColor.accentColor}`,
                                    ...(showTeamDivider
                                      ? {
                                          borderTop: "2px solid",
                                          borderColor: "divider",
                                        }
                                      : {}),
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      fontWeight: 700,
                                      color: rowColor.accentColor,
                                      textTransform: "uppercase",
                                      letterSpacing: 0.5,
                                    }}
                                  >
                                    {getTeamName(player.player_team)} Team
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ) : null}
                        <TableRow 
                            sx={{
                                backgroundColor: rowColor.backgroundColor,
                                boxShadow: `inset 3px 0 0 ${rowColor.accentColor}`,
                                transition: 'background-color 0.15s ease',
                                '& .MuiTableCell-root': {
                                    color: 'text.primary',
                                },
                                '&:hover': {
                                    backgroundColor: rowColor.hoverBackgroundColor,
                                },
                            }}
                        >
                            <TableCell sx={PLAYER_NAME_COLUMN_SX}>
                                <Box gap={1} sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: 0}}>
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: 1}}>
                                        <Emblem 
                                            emblem={{
                                                primary: player.foreground_emblem,
                                                secondary: player.emblem_flags === 0,
                                                background: player.background_emblem,
                                                primaryColor: player.emblem_primary_color,
                                                secondaryColor: player.emblem_secondary_color,
                                                backgroundColor: player.emblem_background_color,
                                                armourPrimaryColor: player.primary_color,
                                            }} 
                                            size={25} 
                                        />
                                        {isLinkableGamertag(player.player_name, { authorXuid: player.player_xuid }) ? (
                                            <Link 
                                                href={`${playerRouteBase}/${encodeURIComponent(player.player_name)}`}
                                                style={{
                                                    color: 'inherit',
                                                    textDecoration: 'none',
                                                    fontWeight: 600,
                                                    fontSize: '0.9375rem',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {formatGamertag(player.player_name)}
                                            </Link>
                                        ) : (
                                            <Typography
                                                component="span"
                                                sx={{
                                                    color: 'text.primary',
                                                    fontWeight: 600,
                                                    fontSize: '0.9375rem',
                                                    whiteSpace: 'nowrap',
                                                    cursor: 'default',
                                                    opacity: 0.7,
                                                }}
                                            >
                                                {formatGamertag(player.player_name)}
                                            </Typography>
                                        )}
                                    </Box>
                                    <Box sx={{display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', flexDirection: 'row', gap: 1}}>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.9 }}>
                                            {player.global_statistics_highest_skill}
                                        </Typography>
                                        <RankBadge rank={player.host_stats_global_rank} grade={player.host_stats_global_grade} size={25}/>
                                    </Box>
                                </Box>
                            </TableCell>
                            {players[player.player_index].map((cell, cellIndex) => (
                                <TableCell key={cellIndex}>{cell}</TableCell>
                            ))}
                        </TableRow>
                        </Fragment>
                    );
                })}
              </TableBody>
            </Table>
          </TableContainer>
    );
}

const Carnage = ({
    report,
    playerRouteBase,
}: {
    report: CarnageReport;
    playerRouteBase?: "/halo3/player" | "/ares/player";
}) => {
    return (
        <BreakdownTable 
            report={report}
            playerRouteBase={playerRouteBase}
            headings={[
                "Kills", 
                "Assists", 
                "Deaths", 
                "K/D Spread", 
                "Suicides", 
                "Betrayals", 
                "Score"
            ]}
            players={Object.fromEntries(
                report.players.map((player: typeof report.players[0]) => [player.player_index, [
                    player.statistics.kills,
                    player.statistics.assists,
                    player.statistics.deaths,
                    player.statistics.kills - player.statistics.deaths,
                    player.statistics.suicides,
                    player.statistics.betrayals,
                    player.score
                ]])
            )} 
        />
    )
}

const KillBreakdown = ({
    report,
    playerRouteBase,
}: {
    report: CarnageReport;
    playerRouteBase?: "/halo3/player" | "/ares/player";
}) => {
    return (
        <BreakdownTable 
            report={report}
            playerRouteBase={playerRouteBase}
            headings={[
                "Weapon", 
                "Melee", 
                "Grenade", 
                "Vehicle",
                "Other",
                "Tool of Destruction"
            ]}
            players={Object.fromEntries(
                report.players.map((player: typeof report.players[0]) => {
                    let sortedDamageStats = player.damage_statistics.sort((a: typeof player.damage_statistics[0], b: typeof player.damage_statistics[0]) => b.kills - a.kills);
                    let toolOfDestruction = '-';
                    if (sortedDamageStats.length > 0) {
                        toolOfDestruction = getDamageSourceName(sortedDamageStats[0].damage_source);
                    }

                    return [player.player_index, [
                        player.damage_statistics.filter((stat: typeof player.damage_statistics[0]) => getDamageSourceCategory(stat.damage_source) === 'WEAPON').reduce((acc: number, stat: typeof player.damage_statistics[0]) => acc + stat.kills, 0),
                        player.damage_statistics.filter((stat: typeof player.damage_statistics[0]) => getDamageSourceCategory(stat.damage_source) === 'MELEE').reduce((acc: number, stat: typeof player.damage_statistics[0]) => acc + stat.kills, 0),
                        player.damage_statistics.filter((stat: typeof player.damage_statistics[0]) => getDamageSourceCategory(stat.damage_source) === 'GRENADE').reduce((acc: number, stat: typeof player.damage_statistics[0]) => acc + stat.kills, 0),
                        player.damage_statistics.filter((stat: typeof player.damage_statistics[0]) => getDamageSourceCategory(stat.damage_source) === 'VEHICLE').reduce((acc: number, stat: typeof player.damage_statistics[0]) => acc + stat.kills, 0),
                        player.damage_statistics.filter((stat: typeof player.damage_statistics[0]) => getDamageSourceCategory(stat.damage_source) === 'OTHER').reduce((acc: number, stat: typeof player.damage_statistics[0]) => acc + stat.kills, 0),
                        toolOfDestruction
                    ]]
                })
            )} 
        />
    )
}

const FieldStats = ({
    report,
    playerRouteBase,
}: {
    report: CarnageReport;
    playerRouteBase?: "/halo3/player" | "/ares/player";
}) => {
    return (
        <BreakdownTable 
            report={report}
            playerRouteBase={playerRouteBase}
            headings={[
                "Headshots", 
                "Best Spree", 
                "Avg. Life", 
                "Medals",
                "Most Killed",
                "Most Killed By"
            ]}
            players={Object.fromEntries(
                report.players.map((player: typeof report.players[0]) => {
                    const totalMedals = (Object.values(player.medals) as number[]).reduce((acc: number, val: number) => acc + val, 0);
                    let sorted_kills = report.player_interactions
                        .filter((interaction: typeof report.player_interactions[0]) => interaction.left_player_index === player.player_index)
                        .filter((interaction: typeof report.player_interactions[0]) => interaction.killed > 0)
                        .sort((a: typeof report.player_interactions[0], b: typeof report.player_interactions[0]) => b.killed - a.killed);
                    let sorted_killed_by = report.player_interactions
                        .filter((interaction: typeof report.player_interactions[0]) => interaction.left_player_index === player.player_index)
                        .filter((interaction: typeof report.player_interactions[0]) => interaction.killed_by > 0)
                        .sort((a: typeof report.player_interactions[0], b: typeof report.player_interactions[0]) => b.killed_by - a.killed_by);
                    
                    let most_killed = sorted_kills.length > 0 ? report.players.filter((p: typeof report.players[0]) => p.player_index === sorted_kills[0].right_player_index)[0].player_name : '-';
                    let most_killed_by = sorted_killed_by.length > 0 ? report.players.filter((p: typeof report.players[0]) => p.player_index === sorted_killed_by[0].right_player_index)[0].player_name : '-';

                    return [player.player_index, [
                        player.medals.sniper_kill,
                        player.statistics.most_kills_in_a_row,
                        formatSeconds(player.statistics.seconds_alive / (player.statistics.deaths + 1)),
                        totalMedals,
                        most_killed,
                        most_killed_by,
                    ]]
                })
            )} 
        />
    )
}

const KOTH = ({
    report,
    playerRouteBase,
}: {
    report: CarnageReport;
    playerRouteBase?: "/halo3/player" | "/ares/player";
}) => {
    return (
        <BreakdownTable 
            report={report}
            playerRouteBase={playerRouteBase}
            headings={[
                "Time on Hill", 
                "Uncontested Time", 
                "Score"
            ]}
            players={Object.fromEntries(
                report.players.map((player: typeof report.players[0]) => [player.player_index, [
                    formatSeconds(player.statistics.king_time_on_hill), 
                    formatSeconds(player.statistics.king_total_control_time), 
                    player.score
                ]])
            )} 
        />
    )
}

const MEDAL_TAB_ICON_SIZE = 25;

const getMedals = (player: CarnageReport['players'][0]) => (
  <Box
    sx={{
      display: "flex",
      flexWrap: "nowrap",
      gap: "3px",
      alignItems: "center",
      overflowX: "auto",
      maxWidth: "100%",
      scrollbarWidth: "thin",
      "&::-webkit-scrollbar": {
        height: 4,
      },
    }}
  >
    {Object.entries(player.medals).flatMap(([type, count]) =>
      Array.from({ length: count as number }, (_: unknown, i: number) => (
        <Box component="span" key={`${type}-${i}`} sx={{ display: "inline-flex", flexShrink: 0 }}>
          <Medal type={type as keyof Medals} size={MEDAL_TAB_ICON_SIZE} />
        </Box>
      )),
    )}
  </Box>
);


const Medals = ({
    report,
    playerRouteBase,
}: {
    report: CarnageReport;
    playerRouteBase?: "/halo3/player" | "/ares/player";
}) => {
    return (
        <BreakdownTable 
            report={report}
            playerRouteBase={playerRouteBase}
            headings={[
                "Medals", 
            ]}
            players={Object.fromEntries(
                report.players.map((player: typeof report.players[0]) => [player.player_index, [getMedals(player)]], 
                )
            )} 
        />
    )
}