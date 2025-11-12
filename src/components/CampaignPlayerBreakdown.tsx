'use client';

import { useState } from 'react';
import { Box, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Tabs, Tab, Stack } from '@mui/material';
import Link from 'next/link';
import { Emblem } from '@/src/components/Emblem';
import { getColor, getColorName } from '@/src/colors';

type Player = {
    player_xuid: string;
    player_name: string;
    service_tag: string | null;
    primary_color: number;
    foreground_emblem: number;
    emblem_flags: number;
    background_emblem: number;
    emblem_primary_color: number;
    emblem_secondary_color: number;
    emblem_background_color: number;
    player_final_score: number;
    kills_total: number;
    deaths: number;
    assists: number;
    headshot_kills: number;
    assassination_kills: number;
    splatter_kills: number;
    multi_kills: number;
    grenade_sticky_kills: number;
    infantry_kills: number;
    leader_kills: number;
    hero_kills: number;
    specialist_kills: number;
    light_vehicle_kills: number;
    heavy_vehicle_kills: number;
    giant_vehicle_kills: number;
    standard_vehicle_kills: number;
    medal_points: number;
    style_total_count: number;
};

type CampaignPlayerBreakdownProps = {
    players: Player[];
    metagameEnabled: boolean;
};

type TabPanelProps = {
    children?: React.ReactNode;
    index: number;
    value: number;
};

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`player-breakdown-tabpanel-${index}`}
            aria-labelledby={`player-breakdown-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
}

export function CampaignPlayerBreakdown({ players, metagameEnabled }: CampaignPlayerBreakdownProps) {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    if (!metagameEnabled) {
        return (
            <Box>
                <Typography variant="body2" sx={{ color: '#B0B0B0', mb: 2, fontStyle: 'italic' }}>
                    Statistics are not available for campaign when scoring is not enabled.
                </Typography>
                <TableContainer sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: '#1A1A1A', color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342' }}>Player</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {players.map((player) => {
                                const primaryColor = getColor(getColorName(player.primary_color));
                                return (
                                    <TableRow
                                        key={player.player_xuid}
                                        sx={{
                                            backgroundColor: `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0.4)`,
                                            '&:hover': {
                                                backgroundColor: `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0.6)`,
                                            },
                                        }}
                                    >
                                        <TableCell>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Emblem
                                                    size={40}
                                                    emblem={{
                                                        primary: player.foreground_emblem,
                                                        secondary: player.emblem_flags === 0,
                                                        background: player.background_emblem,
                                                        primaryColor: player.emblem_primary_color,
                                                        secondaryColor: player.emblem_secondary_color,
                                                        backgroundColor: player.emblem_background_color,
                                                        armourPrimaryColor: player.primary_color,
                                                    }}
                                                />
                                                <Box>
                                                    <Link href={`/player/${encodeURIComponent(player.player_name)}`} style={{ textDecoration: 'none' }}>
                                                        <Typography sx={{ color: '#E0E0E0', fontWeight: 600, textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
                                                            {player.player_name}
                                                        </Typography>
                                                    </Link>
                                                    {player.service_tag && (
                                                        <Typography variant="caption" sx={{ color: '#B0B0B0', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
                                                            {player.service_tag}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        );
    }

    const renderPlayerCell = (player: Player) => {
        const primaryColor = getColor(getColorName(player.primary_color));
        return (
            <TableCell sx={{ position: 'sticky', left: 0, zIndex: 5, backgroundColor: `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0.4)` }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Emblem
                        size={40}
                        emblem={{
                            primary: player.foreground_emblem,
                            secondary: player.emblem_flags === 0,
                            background: player.background_emblem,
                            primaryColor: player.emblem_primary_color,
                            secondaryColor: player.emblem_secondary_color,
                            backgroundColor: player.emblem_background_color,
                            armourPrimaryColor: player.primary_color,
                        }}
                    />
                    <Box>
                        <Link href={`/player/${encodeURIComponent(player.player_name)}`} style={{ textDecoration: 'none' }}>
                            <Typography sx={{ color: '#E0E0E0', fontWeight: 600, textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
                                {player.player_name}
                            </Typography>
                        </Link>
                        {player.service_tag && (
                            <Typography variant="caption" sx={{ color: '#B0B0B0', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
                                {player.service_tag}
                            </Typography>
                        )}
                    </Box>
                </Stack>
            </TableCell>
        );
    };

    const renderTableRow = (player: Player, cells: React.ReactNode[]) => {
        const primaryColor = getColor(getColorName(player.primary_color));
        return (
            <TableRow
                key={player.player_xuid}
                sx={{
                    backgroundColor: `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0.4)`,
                    '&:hover': {
                        backgroundColor: `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0.6)`,
                    },
                }}
            >
                {renderPlayerCell(player)}
                {cells}
            </TableRow>
        );
    };

    return (
        <Box>
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                    borderBottom: '1px solid #333',
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
                <Tab label="Overview" />
                <Tab label="Combat" />
                <Tab label="Enemy Kills" />
                <Tab label="Enemy Vehicle Kills" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
                <TableContainer sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: '#1A1A1A', color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342', position: 'sticky', left: 0, zIndex: 10 }}>Player</TableCell>
                                <TableCell align="right" sx={{ backgroundColor: '#1A1A1A', color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342', whiteSpace: 'nowrap' }}>Score</TableCell>
                                <TableCell align="right" sx={{ backgroundColor: '#1A1A1A', color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342', whiteSpace: 'nowrap' }}>Kills</TableCell>
                                <TableCell align="right" sx={{ backgroundColor: '#1A1A1A', color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342', whiteSpace: 'nowrap' }}>Deaths</TableCell>
                                <TableCell align="right" sx={{ backgroundColor: '#1A1A1A', color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342', whiteSpace: 'nowrap' }}>Assists</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {players.map((player) => renderTableRow(player, [
                                <TableCell key="score" align="right" sx={{ color: '#E0E0E0', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)', whiteSpace: 'nowrap' }}>
                                    {player.player_final_score.toLocaleString()}
                                </TableCell>,
                                <TableCell key="kills" align="right" sx={{ color: '#E0E0E0', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)', whiteSpace: 'nowrap' }}>
                                    {player.kills_total}
                                </TableCell>,
                                <TableCell key="deaths" align="right" sx={{ color: '#E0E0E0', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)', whiteSpace: 'nowrap' }}>
                                    {player.deaths}
                                </TableCell>,
                                <TableCell key="assists" align="right" sx={{ color: '#E0E0E0', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)', whiteSpace: 'nowrap' }}>
                                    {player.assists}
                                </TableCell>,
                            ]))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <TableContainer sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: '#1A1A1A', color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342', position: 'sticky', left: 0, zIndex: 10 }}>Player</TableCell>
                                <TableCell align="right" sx={{ backgroundColor: '#1A1A1A', color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342', whiteSpace: 'nowrap' }}>Headshots</TableCell>
                                <TableCell align="right" sx={{ backgroundColor: '#1A1A1A', color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342', whiteSpace: 'nowrap' }}>Assass.</TableCell>
                                <TableCell align="right" sx={{ backgroundColor: '#1A1A1A', color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342', whiteSpace: 'nowrap' }}>Splatters</TableCell>
                                <TableCell align="right" sx={{ backgroundColor: '#1A1A1A', color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342', whiteSpace: 'nowrap' }}>Multi-kills</TableCell>
                                <TableCell align="right" sx={{ backgroundColor: '#1A1A1A', color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342', whiteSpace: 'nowrap' }}>Sticky</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {players.map((player) => renderTableRow(player, [
                                <TableCell key="headshots" align="right" sx={{ color: '#E0E0E0', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)', whiteSpace: 'nowrap' }}>
                                    {player.headshot_kills}
                                </TableCell>,
                                <TableCell key="assass" align="right" sx={{ color: '#E0E0E0', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)', whiteSpace: 'nowrap' }}>
                                    {player.assassination_kills}
                                </TableCell>,
                                <TableCell key="splatters" align="right" sx={{ color: '#E0E0E0', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)', whiteSpace: 'nowrap' }}>
                                    {player.splatter_kills}
                                </TableCell>,
                                <TableCell key="multi" align="right" sx={{ color: '#E0E0E0', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)', whiteSpace: 'nowrap' }}>
                                    {player.multi_kills}
                                </TableCell>,
                                <TableCell key="sticky" align="right" sx={{ color: '#E0E0E0', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)', whiteSpace: 'nowrap' }}>
                                    {player.grenade_sticky_kills}
                                </TableCell>,
                            ]))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                <TableContainer sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: '#1A1A1A', color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342', position: 'sticky', left: 0, zIndex: 10 }}>Player</TableCell>
                                <TableCell align="right" sx={{ backgroundColor: '#1A1A1A', color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342', whiteSpace: 'nowrap' }}>Infantry</TableCell>
                                <TableCell align="right" sx={{ backgroundColor: '#1A1A1A', color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342', whiteSpace: 'nowrap' }}>Leader</TableCell>
                                <TableCell align="right" sx={{ backgroundColor: '#1A1A1A', color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342', whiteSpace: 'nowrap' }}>Hero</TableCell>
                                <TableCell align="right" sx={{ backgroundColor: '#1A1A1A', color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342', whiteSpace: 'nowrap' }}>Specialist</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {players.map((player) => renderTableRow(player, [
                                <TableCell key="infantry" align="right" sx={{ color: '#E0E0E0', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)', whiteSpace: 'nowrap' }}>
                                    {player.infantry_kills}
                                </TableCell>,
                                <TableCell key="leader" align="right" sx={{ color: '#E0E0E0', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)', whiteSpace: 'nowrap' }}>
                                    {player.leader_kills}
                                </TableCell>,
                                <TableCell key="hero" align="right" sx={{ color: '#E0E0E0', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)', whiteSpace: 'nowrap' }}>
                                    {player.hero_kills}
                                </TableCell>,
                                <TableCell key="specialist" align="right" sx={{ color: '#E0E0E0', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)', whiteSpace: 'nowrap' }}>
                                    {player.specialist_kills}
                                </TableCell>,
                            ]))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
                <TableContainer sx={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: '#1A1A1A', color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342', position: 'sticky', left: 0, zIndex: 10 }}>Player</TableCell>
                                <TableCell align="right" sx={{ backgroundColor: '#1A1A1A', color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342', whiteSpace: 'nowrap' }}>Light Veh.</TableCell>
                                <TableCell align="right" sx={{ backgroundColor: '#1A1A1A', color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342', whiteSpace: 'nowrap' }}>Heavy Veh.</TableCell>
                                <TableCell align="right" sx={{ backgroundColor: '#1A1A1A', color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342', whiteSpace: 'nowrap' }}>Giant Veh.</TableCell>
                                <TableCell align="right" sx={{ backgroundColor: '#1A1A1A', color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342', whiteSpace: 'nowrap' }}>Std. Veh.</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {players.map((player) => renderTableRow(player, [
                                <TableCell key="light" align="right" sx={{ color: '#E0E0E0', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)', whiteSpace: 'nowrap' }}>
                                    {player.light_vehicle_kills}
                                </TableCell>,
                                <TableCell key="heavy" align="right" sx={{ color: '#E0E0E0', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)', whiteSpace: 'nowrap' }}>
                                    {player.heavy_vehicle_kills}
                                </TableCell>,
                                <TableCell key="giant" align="right" sx={{ color: '#E0E0E0', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)', whiteSpace: 'nowrap' }}>
                                    {player.giant_vehicle_kills}
                                </TableCell>,
                                <TableCell key="std" align="right" sx={{ color: '#E0E0E0', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)', whiteSpace: 'nowrap' }}>
                                    {player.standard_vehicle_kills}
                                </TableCell>,
                            ]))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel>
        </Box>
    );
}

