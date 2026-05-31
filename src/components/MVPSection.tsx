'use client';

import { Box, Paper, Stack, Typography } from '@mui/material';
import { Emblem } from './Emblem';
import Link from 'next/link';
import { formatGamertag, isLinkableGamertag } from './Gamertag';
import { WeaponIcon } from './WeaponIcon';
import { getPlayerToolOfDestruction, getWeaponNameFromString } from '@/src/constants/weaponIcons';

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
    damage_statistics?: ReadonlyArray<{
        kills: number;
        damage_source: string;
    }>;
};

type MVPSectionProps = {
    player: MVPPlayer;
    playerRouteBase?: "/halo3/player" | "/ares/player";
};

function StatBlock({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
    return (
        <Box
            sx={{
                px: 1.5,
                py: 1,
                minWidth: 72,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'rgba(0, 0, 0, 0.22)',
            }}
        >
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mb: 0.25, textTransform: 'uppercase', letterSpacing: 0.4 }}
            >
                {label}
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    fontWeight: 700,
                    color: highlight ? 'primary.main' : 'text.primary',
                }}
            >
                {value}
            </Typography>
        </Box>
    );
}

function ToolOfDestructionDisplay({ damageSource }: { damageSource: string }) {
    return (
        <Stack spacing={1} alignItems="center" sx={{ width: '100%', textAlign: 'center', px: { sm: 2 } }}>
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}
            >
                Tool of Destruction
            </Typography>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <WeaponIcon weapon={damageSource} size="100%" maxHeight={88} highlighted />
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {getWeaponNameFromString(damageSource)}
            </Typography>
        </Stack>
    );
}

export function MVPSection({ player, playerRouteBase = "/halo3/player" }: MVPSectionProps) {
    const score = player.score ?? player.player_final_score ?? 0;
    const kills = player.statistics?.kills ?? player.kills_total ?? 0;
    const deaths = player.statistics?.deaths ?? player.deaths ?? 0;
    const assists = player.statistics?.assists ?? player.assists ?? 0;
    const kdSpread = kills - deaths;
    const kdRatio = deaths > 0 ? (kills / deaths).toFixed(2) : kills > 0 ? '∞' : '0.00';

    const linkable = isLinkableGamertag(player.player_name, { authorXuid: player.player_xuid });
    const toolOfDestruction = getPlayerToolOfDestruction(player.damage_statistics);

    return (
        <Paper sx={{ overflow: 'hidden' }}>
            <Box
                sx={{
                    px: 2,
                    py: 1.25,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    background:
                        'radial-gradient(ellipse at left, rgba(124, 179, 66, 0.12) 0%, transparent 60%)',
                }}
            >
                <Typography
                    variant="overline"
                    sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1.2 }}
                >
                    MVP
                </Typography>
            </Box>

            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2.5}
                sx={{ p: { xs: 2, sm: 3 }, alignItems: { sm: 'center' } }}
            >
                <Box
                    sx={{
                        width: 88,
                        height: 88,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        backgroundColor: 'rgba(0, 0, 0, 0.35)',
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
                        size={72}
                    />
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'stretch', sm: 'center' },
                        gap: { xs: 2, sm: 0 },
                    }}
                >
                    <Box sx={{ minWidth: 0, flexShrink: 0 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {linkable ? (
                                <Link
                                    href={`${playerRouteBase}/${encodeURIComponent(player.player_name)}`}
                                    style={{
                                        color: 'inherit',
                                        textDecoration: 'none',
                                    }}
                                >
                                    {formatGamertag(player.player_name)}
                                </Link>
                            ) : (
                                formatGamertag(player.player_name)
                            )}
                            {player.service_tag ? (
                                <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ ml: 1, fontWeight: 500 }}
                                >
                                    [{player.service_tag}]
                                </Typography>
                            ) : null}
                        </Typography>

                        <Stack
                            direction="row"
                            spacing={1}
                            useFlexGap
                            flexWrap="wrap"
                            sx={{ mt: 1.5 }}
                        >
                            <StatBlock label="Score" value={score.toLocaleString()} highlight />
                            <StatBlock label="Kills" value={kills} />
                            <StatBlock label="Deaths" value={deaths} />
                            <StatBlock label="Assists" value={assists} />
                            <StatBlock label="K/D" value={kdRatio} />
                            <StatBlock
                                label="Spread"
                                value={kdSpread >= 0 ? `+${kdSpread}` : kdSpread}
                                highlight={kdSpread >= 0}
                            />
                        </Stack>
                    </Box>

                    {toolOfDestruction ? (
                        <Box
                            sx={{
                                flex: { sm: 1 },
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                minWidth: 0,
                            }}
                        >
                            <ToolOfDestructionDisplay damageSource={toolOfDestruction} />
                        </Box>
                    ) : null}
                </Box>
            </Stack>
        </Paper>
    );
}
