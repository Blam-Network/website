"use client";

import { Stack, Box, Typography, Button } from "@mui/material";
import { Session } from "next-auth";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useQuery } from '@tanstack/react-query';
import { api } from "../trpc/client";
import { playerProfilePath } from "@/src/components/Gamertag";
import { GameIcon } from "./GameIcon";
import type { FilesGame } from "./files/filesPageTypes";

function usePreferReachServiceRecord(): boolean {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    return pathname.startsWith("/haloreach") || searchParams.get("game") === "reach";
}

function OnlinePopulationBadge({
    game,
    label,
    pulseSeconds = 2,
}: {
    game: FilesGame;
    label: string;
    /** Green dot pulse cycle duration (Reach uses a faster pulse than Halo 3). */
    pulseSeconds?: number;
}) {
    const pulseName = `population-pulse-${pulseSeconds}`;

    return (
        <Stack
            direction="row"
            alignItems="center"
            spacing={0.75}
            sx={{ color: 'text.secondary', flexShrink: 0 }}
        >
            <Box
                sx={{
                    width: 6,
                    height: 6,
                    flexShrink: 0,
                    backgroundColor: 'primary.main',
                    boxShadow: '0 0 6px rgba(124, 179, 66, 0.8)',
                    animation: `${pulseName} ${pulseSeconds}s ease-in-out infinite`,
                    [`@keyframes ${pulseName}`]: {
                        '0%, 100%': { opacity: 1 },
                        '50%': { opacity: 0.4 },
                    },
                }}
            />
            <GameIcon game={game} size={18} aria-hidden />
            <Typography
                variant="caption"
                component="span"
                sx={{
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.03em',
                }}
            >
                {label}
            </Typography>
        </Stack>
    );
}

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/screenshots', label: 'Screenshots' },
    { href: '/files', label: 'Files' },
    { href: '/halo3/players', label: 'Players' },
];

export const NavBar = ({ session }: { session: Session | null }) => {
    const pathname = usePathname();
    const preferReachServiceRecord = usePreferReachServiceRecord();
    const loggedIn = !!session?.user?.xuid;
    const { data: onlinePlayers } = useQuery({
        queryKey: ['onlinePlayers'],
        queryFn: () => api.sunrise2.onlinePlayers.query(),
        refetchInterval: 30000,
        staleTime: 60000,
    });

    const { data: reachOnlinePlayers } = useQuery({
        queryKey: ['reachOnlinePlayers'],
        queryFn: () => api.reach.onlinePlayers.query(),
        refetchInterval: 5_000,
        staleTime: 5_000,
    });

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    const serviceRecordHref =
        loggedIn && session?.user?.gamertag
            ? playerProfilePath(
                  session.user.gamertag,
                  preferReachServiceRecord ? "/haloreach/player" : "/halo3/player",
              )
            : null;

    const links = [
        ...navLinks,
        ...(serviceRecordHref
            ? [{ href: serviceRecordHref, label: "Service Record" }]
            : []),
        ...(session?.user?.is_admin ? [{ href: "/admin", label: "Admin" }] : []),
        ...(session?.user?.is_uploader && !session?.user?.is_admin
            ? [{ href: "/admin/fileshare/blamnetwork", label: "Upload" }]
            : []),
    ];

    const halo3PlayerCount = onlinePlayers
        ? `${onlinePlayers.count} players online`
        : null;

    const reachPlayerCount = reachOnlinePlayers
        ? `${reachOnlinePlayers.count} players online`
        : null;

    const showPopulation = halo3PlayerCount || reachPlayerCount;

    return (
        <Box
            component="nav"
            sx={{
                position: 'sticky',
                top: 57,
                zIndex: 1000,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                backdropFilter: 'blur(12px)',
                backgroundColor: 'rgba(18, 22, 31, 0.75)',
                borderBottom: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Stack
                direction="row"
                spacing={1}
                justifyContent="space-between"
                alignItems="center"
                sx={{
                    maxWidth: 'lg',
                    flexGrow: 1,
                    px: { xs: 1.5, md: 3 },
                    py: 0.75,
                }}
            >
                <Stack direction="row" spacing={0.5} sx={{ overflowX: 'auto', flexWrap: 'nowrap' }}>
                    {links.map(({ href, label }) => (
                        <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                            <Button
                                variant="text"
                                size="small"
                                sx={{
                                    color: isActive(href) ? 'primary.light' : 'text.secondary',
                                    fontWeight: isActive(href) ? 700 : 500,
                                    backgroundColor: isActive(href) ? 'rgba(124, 179, 66, 0.1)' : 'transparent',
                                    border: isActive(href) ? '1px solid' : '1px solid transparent',
                                    borderColor: isActive(href) ? 'primary.main' : 'transparent',
                                    borderRadius: 0,
                                    px: 1.5,
                                    whiteSpace: 'nowrap',
                                    '&:hover': {
                                        color: 'primary.light',
                                        backgroundColor: 'rgba(124, 179, 66, 0.08)',
                                    },
                                }}
                            >
                                {label}
                            </Button>
                        </Link>
                    ))}
                </Stack>
                {showPopulation && (
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            flexShrink: 0,
                        }}
                    >
                        {halo3PlayerCount && (
                            <OnlinePopulationBadge
                                game="halo3"
                                label={halo3PlayerCount}
                                pulseSeconds={2}
                            />
                        )}
                        {reachPlayerCount && (
                            <OnlinePopulationBadge
                                game="reach"
                                label={reachPlayerCount}
                                pulseSeconds={2}
                            />
                        )}
                    </Stack>
                )}
            </Stack>
        </Box>
    );
};
