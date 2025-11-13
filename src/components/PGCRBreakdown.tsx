'use client';

import { Stack, Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, tableCellClasses, Tabs, Tab, Link } from "@mui/material";
import { getColor, getColorName, getCssColor, getTextColor } from "../colors";
import { Fragment, ReactNode, useEffect, useRef, useState } from "react";
import { RankBadge, ServiceRecordPlaceholder } from "./ServiceRecordPlaceholder";
import { Emblem } from "./Emblem";
import { text } from "stream/consumers";
import { getTeamColor, getTeamName, getTeamTextColor } from "../utils/teams";
import { formatSeconds, getGametypeName } from "../utils/gametype";
import type { Medals } from "../api/sunrise/carnage-report/players";
import { getDamageSourceCategory, getDamageSourceName } from "../api/sunrise/carnage-report/players";
import { RouterOutputs } from "../api/router";
import { Medal } from "./Medal";

type CarnageReport = RouterOutputs['sunrise2']['getCarnageReport'];


export const PGCRBreakdown = ({report}: {report: CarnageReport}) => {
    const [value, setValue] = useState("CARNAGE");

    return (
        <Box>
            <Tabs 
                value={value} 
                onChange={(e, v) => setValue(v)} 
                sx={{
                    mb: 3,
                    '& .MuiTab-root': {
                        color: '#B0B0B0',
                        '&.Mui-selected': {
                            color: '#7CB342',
                        },
                    },
                    '& .MuiTabs-indicator': {
                        backgroundColor: '#7CB342',
                    },
                }}
            >
                <Tab label="Carnage" value="CARNAGE" />
                <Tab label="Kill Breakdown" value="KILL_BREAKDOWN" />
                <Tab label="Field Stats" value="FIELD_STATS" />
                <Tab label="Medals" value="MEDALS" />
            </Tabs>
            <Box sx={{ minHeight: '200px' }}>
                {value === "CARNAGE" && <Carnage report={report} />}
                {value === "GAMETYPE" && <KOTH report={report} />}
                {value === "FIELD_STATS" && <FieldStats report={report} />}
                {value === "KILL_BREAKDOWN" && <KillBreakdown report={report} />}
                {value === "MEDALS" && <Medals report={report} />}
            </Box>
        </Box>
    )
}

const BreakdownTable = ({report, headings, players}: {report: CarnageReport, headings: string[], players: Record<number, (string | number | ReactNode)[]>}) => {
    const getPlayerRowColor = (player: CarnageReport['players'][0]) => {
        let color;
        let textColor;
        
        if (report.team_game) {
            color = getTeamColor(player.player_team);
            textColor = getTeamTextColor(player.player_team);
        } else {
            color = getColor(getColorName(player.primary_color));
            textColor = getTextColor(getColorName(player.primary_color));
        }
        
        return {
            backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, 1)`,
            textColor: `rgb(${textColor.r}, ${textColor.g}, ${textColor.b})`,
        };
    };
    
    return (
        <TableContainer>
            <Table size="small" sx={{
                '& .MuiTableCell-root': {
                    borderColor: '#333',
                },
            }}>
              <colgroup>
                <col width="1"/>
                {headings.map((_, index) => <col key={index} />)}
              </colgroup>
              <TableHead>
                <TableRow sx={{
                    '& .MuiTableCell-root': {
                        backgroundColor: '#1A1A1A',
                        color: '#7CB342',
                        fontWeight: 700,
                        borderBottom: '2px solid #7CB342',
                    },
                }}>
                    <TableCell>Player Name</TableCell>
                    {headings.map((headings) => (
                        <TableCell key={headings}>{headings}</TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {report.players.map((player: typeof report.players[0], index: number) => {
                    const rowColor = getPlayerRowColor(player);
                    return (
                        <TableRow 
                            key={index}
                            sx={{
                                backgroundColor: rowColor.backgroundColor,
                                '& .MuiTableCell-root': {
                                    color: rowColor.textColor,
                                    textShadow: '1px 0 0 #000, -1px 0 0 #000, 0 1px 0 #000, 0 -1px 0 #000',
                                },
                                '&:hover': {
                                    backgroundColor: `${rowColor.backgroundColor.replace('0.4', '0.6')}`,
                                },
                            }}
                        >
                            <TableCell>
                                <Box gap={1} sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
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
                                        <Link 
                                            href={`/player/${encodeURIComponent(player.player_name)}`}
                                            style={{
                                                color: rowColor.textColor,
                                                textDecoration: 'none',
                                                fontWeight: 600,
                                                textShadow: '1px 0 0 #000, -1px 0 0 #000, 0 1px 0 #000, 0 -1px 0 #000',
                                            }}
                                        >
                                            {player.player_name}
                                        </Link>
                                    </Box>
                                    <Box sx={{display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', flexDirection: 'row', gap: 1}}>
                                        <Typography variant="body2" sx={{ color: rowColor.textColor, opacity: 0.8 }}>
                                            {player.global_statistics_highest_skill}
                                        </Typography>
                                        <RankBadge rank={player.host_stats_global_rank} grade={player.host_stats_global_grade} size={25}/>
                                    </Box>
                                </Box>
                            </TableCell>
                            {players[player.player_index].map((cell, index) => (
                                <TableCell key={index}>{cell}</TableCell>
                            ))}
                        </TableRow>
                    );
                })}
              </TableBody>
            </Table>
          </TableContainer>
    );
}

const Carnage = ({report}: {report: CarnageReport}) => {
    return (
        <BreakdownTable 
            report={report} 
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

const KillBreakdown = ({report}: {report: CarnageReport}) => {
    return (
        <BreakdownTable 
            report={report} 
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

const FieldStats = ({report}: {report: CarnageReport}) => {
    return (
        <BreakdownTable 
            report={report} 
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

const KOTH = ({report}: {report: CarnageReport}) => {
    return (
        <BreakdownTable 
            report={report} 
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

const getMedals = (player: CarnageReport['players'][0]) => Object.entries(player.medals)
    .flatMap(([type, count]) =>
        Array.from({ length: count as number }, (_: unknown, i: number) => 
            <span key={`${type}-${i}`} style={{position: 'relative', top: 2}}>
                <Medal type={type as keyof Medals} size={32} />
            </span>
        )
    )


const Medals = ({report}: {report: CarnageReport}) => {
    return (
        <BreakdownTable 
            report={report} 
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