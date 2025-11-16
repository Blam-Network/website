'use client';

import { Box, Typography, Paper, Stack } from '@mui/material';
import { Emblem } from './Emblem';
import Link from 'next/link';
import { isGuestXuid } from '../utils/xuid';

type MVPPlayer = {
    player_name: string;
    player_xuid: string;
    service_tag: string | null;
    primary_color: number;
    foreground_emblem: number;
    background_emblem: number;
    emblem_flags: number;
    emblem_primary_color: number;
    emblem_secondary_color: number;
    emblem_background_color: number;
    score?: number;
    player_final_score?: number;
    statistics?: {
        kills: number;
        deaths: number;
        assists: number;
    };
    kills_total?: number;
    deaths?: number;
    assists?: number;
};

type MVPSectionProps = {
    player: MVPPlayer;
};

export function MVPSection({ player }: MVPSectionProps) {
    const score = player.score ?? player.player_final_score ?? 0;
    const kills = player.statistics?.kills ?? player.kills_total ?? 0;
    const deaths = player.statistics?.deaths ?? player.deaths ?? 0;
    const assists = player.statistics?.assists ?? player.assists ?? 0;
    const kdSpread = kills - deaths;
    const kdRatio = deaths > 0 ? (kills / deaths).toFixed(2) : kills > 0 ? '∞' : '0.00';

    const isGuest = isGuestXuid(player.player_xuid);

    return (
        <Paper
            elevation={4}
            sx={{
                p: 3,
                mb: 3,
                background: 'linear-gradient(135deg, rgba(124, 179, 66, 0.15) 0%, rgba(26, 26, 26, 0.95) 100%)',
                border: '2px solid #7CB342',
                borderRadius: '8px',
            }}
        >
            <Stack direction="row" spacing={3} alignItems="center">
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography
                        variant="caption"
                        sx={{
                            color: '#7CB342',
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: 1,
                            mb: 1,
                            fontWeight: 600,
                        }}
                    >
                        MVP
                    </Typography>
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid #7CB342',
                            borderRadius: '4px',
                            background: 'rgba(0, 0, 0, 0.3)',
                        }}
                    >
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
                            size={64}
                        />
                    </Box>
                </Box>

                <Box sx={{ flex: 1 }}>
                    <Typography
                        variant="h5"
                        sx={{
                            color: '#7CB342',
                            fontWeight: 700,
                            mb: 1,
                            fontFamily: 'sans-serif',
                        }}
                    >
                        {isGuest ? (
                            player.player_name
                        ) : (
                            <Link
                                href={`/player/${player.player_name}`}
                                style={{
                                    color: '#7CB342',
                                    textDecoration: 'none',
                                }}
                            >
                                {player.player_name}
                            </Link>
                        )}
                        {player.service_tag && (
                            <Typography
                                component="span"
                                variant="body2"
                                sx={{
                                    color: '#9CCC65',
                                    ml: 1,
                                    fontWeight: 400,
                                }}
                            >
                                [{player.service_tag}]
                            </Typography>
                        )}
                    </Typography>

                    <Stack direction="row" spacing={4} sx={{ mt: 2 }}>
                        <Box>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: '#888',
                                    display: 'block',
                                    mb: 0.5,
                                    fontSize: '0.7rem',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Score
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: '#7CB342',
                                    fontWeight: 700,
                                }}
                            >
                                {score.toLocaleString()}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: '#888',
                                    display: 'block',
                                    mb: 0.5,
                                    fontSize: '0.7rem',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Kills
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: '#E0E0E0',
                                    fontWeight: 700,
                                }}
                            >
                                {kills}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: '#888',
                                    display: 'block',
                                    mb: 0.5,
                                    fontSize: '0.7rem',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Deaths
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: '#E0E0E0',
                                    fontWeight: 700,
                                }}
                            >
                                {deaths}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: '#888',
                                    display: 'block',
                                    mb: 0.5,
                                    fontSize: '0.7rem',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Assists
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: '#E0E0E0',
                                    fontWeight: 700,
                                }}
                            >
                                {assists}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: '#888',
                                    display: 'block',
                                    mb: 0.5,
                                    fontSize: '0.7rem',
                                    textTransform: 'uppercase',
                                }}
                            >
                                K/D Ratio
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: '#E0E0E0',
                                    fontWeight: 700,
                                }}
                            >
                                {kdRatio}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: '#888',
                                    display: 'block',
                                    mb: 0.5,
                                    fontSize: '0.7rem',
                                    textTransform: 'uppercase',
                                }}
                            >
                                K/D Spread
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: kdSpread >= 0 ? '#7CB342' : '#E57373',
                                    fontWeight: 700,
                                }}
                            >
                                {kdSpread >= 0 ? `+${kdSpread}` : kdSpread}
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            </Stack>
        </Paper>
    );
}

