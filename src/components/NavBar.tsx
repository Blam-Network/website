"use client";

import { Stack, Box, Typography, Button, Tooltip } from "@mui/material";
import { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from '@tanstack/react-query';
import { api } from "../trpc/client";
import { playerProfilePath } from "@/src/components/Gamertag";
import { usePreferReachRoutes } from "@/src/hooks/usePreferReachRoutes";
import { GameIcon } from "./GameIcon";
import type { FilesGame } from "./files/filesPageTypes";

type PopulationStatusDotVariant = "online" | "degraded" | "offline";

function PopulationStatusDot({
    variant,
    pulseSeconds = 2,
}: {
    variant: PopulationStatusDotVariant;
    pulseSeconds?: number;
}) {
    const pulseName = `population-pulse-${variant}-${pulseSeconds}`;
    const dotStyles: Record<
        PopulationStatusDotVariant,
        { backgroundColor: string; boxShadow: string; pulseOpacity: number }
    > = {
        online: {
            backgroundColor: "primary.main",
            boxShadow: "0 0 6px rgba(124, 179, 66, 0.8)",
            pulseOpacity: 0.4,
        },
        degraded: {
            backgroundColor: "warning.main",
            boxShadow: "0 0 6px rgba(255, 193, 7, 0.85)",
            pulseOpacity: 0.25,
        },
        offline: {
            backgroundColor: "error.main",
            boxShadow: "0 0 6px rgba(244, 67, 54, 0.85)",
            pulseOpacity: 0.25,
        },
    };
    const style = dotStyles[variant];

    return (
        <Box
            sx={{
                width: 6,
                height: 6,
                flexShrink: 0,
                backgroundColor: style.backgroundColor,
                boxShadow: style.boxShadow,
                animation: `${pulseName} ${pulseSeconds}s ease-in-out infinite`,
                [`@keyframes ${pulseName}`]: {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: style.pulseOpacity },
                },
            }}
        />
    );
}

function OnlinePopulationBadge({
    game,
    label,
    pulseSeconds = 2,
}: {
    game: FilesGame;
    label: string;
    pulseSeconds?: number;
}) {
    return (
        <Stack
            direction="row"
            alignItems="center"
            spacing={0.75}
            sx={{ color: "text.secondary", flexShrink: 0 }}
        >
            <PopulationStatusDot variant="online" pulseSeconds={pulseSeconds} />
            <GameIcon game={game} size={18} aria-hidden />
            <Typography
                variant="caption"
                component="span"
                sx={{
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    letterSpacing: "0.03em",
                }}
            >
                {label}
            </Typography>
        </Stack>
    );
}

const NETWORK_STATUS_TOOLTIPS = {
    offline:
        "The Blam Network server is offline, this may be due to a server issue or maintenance",
    degraded:
        "Blam Network services are partly offline or degraded, some features may be unavailable.",
} as const;

function NetworkStatusBadge({
    label,
    tooltip,
    severity,
}: {
    label: string;
    tooltip: string;
    severity: "offline" | "degraded";
}) {
    const textColor = severity === "offline" ? "error.light" : "warning.light";

    return (
        <Tooltip title={tooltip} arrow placement="bottom">
            <Stack
                direction="row"
                alignItems="center"
                spacing={0.75}
                sx={{
                    color: "text.secondary",
                    flexShrink: 0,
                    cursor: "help",
                }}
                aria-label={`${label}. ${tooltip}`}
            >
                <PopulationStatusDot variant={severity} pulseSeconds={1.2} />
                <Typography
                    variant="caption"
                    component="span"
                    sx={{
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        letterSpacing: "0.03em",
                        color: textColor,
                    }}
                >
                    {label}
                </Typography>
            </Stack>
        </Tooltip>
    );
}

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/screenshots', label: 'Screenshots' },
    { href: '/files', label: 'Files' },
    { href: '/players', label: 'Players' },
];

export const NavBar = ({ session }: { session: Session | null }) => {
    const pathname = usePathname();
    const preferReachServiceRecord = usePreferReachRoutes();
    const loggedIn = !!session?.user?.xuid;

    const healthQuery = useQuery({
        queryKey: ["serviceHealth"],
        queryFn: () => api.home.serviceHealth.query(),
        refetchInterval: 30_000,
        staleTime: 15_000,
    });

    const serviceLevel = healthQuery.data?.service;

    const networkOffline =
        healthQuery.isFetched
        && (healthQuery.isError || serviceLevel === "none");

    const networkDegraded =
        healthQuery.isFetched
        && !networkOffline
        && serviceLevel === "partial";

    const populationQueriesEnabled =
        healthQuery.isFetched && serviceLevel === "full";

    const halo3PopulationQuery = useQuery({
        queryKey: ["onlinePlayers"],
        queryFn: () => api.sunrise2.onlinePlayers.query(),
        refetchInterval: 30_000,
        staleTime: 60_000,
        enabled: populationQueriesEnabled,
    });

    const reachPopulationQuery = useQuery({
        queryKey: ["reachOnlinePlayers"],
        queryFn: () => api.reach.onlinePlayers.query(),
        refetchInterval: 5_000,
        staleTime: 5_000,
        enabled: populationQueriesEnabled,
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

    const halo3PlayerCount = halo3PopulationQuery.data
        ? `${halo3PopulationQuery.data.count} players online`
        : null;

    const reachPlayerCount = reachPopulationQuery.data
        ? `${reachPopulationQuery.data.count} players online`
        : null;

    const populationsReady =
        populationQueriesEnabled
        && halo3PopulationQuery.isFetched
        && reachPopulationQuery.isFetched;

    const halo3PopulationOk = !!halo3PopulationQuery.data;
    const reachPopulationOk = !!reachPopulationQuery.data;

    const somePopulationUnavailable =
        populationsReady && (!halo3PopulationOk || !reachPopulationOk);

    const showOfflineBadge = networkOffline;
    const showDegradedBadge =
        networkDegraded
        || (populationsReady && somePopulationUnavailable);
    const showPopulationCounts =
        populationsReady && halo3PopulationOk && reachPopulationOk;

    const showPopulation =
        healthQuery.isFetched
        && (showOfflineBadge || showDegradedBadge || showPopulationCounts);

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
                        {showOfflineBadge ? (
                            <NetworkStatusBadge
                                label="Server is Offline"
                                tooltip={NETWORK_STATUS_TOOLTIPS.offline}
                                severity="offline"
                            />
                        ) : showDegradedBadge ? (
                            <NetworkStatusBadge
                                label="Some services are unavailable"
                                tooltip={NETWORK_STATUS_TOOLTIPS.degraded}
                                severity="degraded"
                            />
                        ) : (
                            <>
                                {halo3PlayerCount ? (
                                    <OnlinePopulationBadge
                                        game="halo3"
                                        label={halo3PlayerCount}
                                        pulseSeconds={2}
                                    />
                                ) : null}
                                {reachPlayerCount ? (
                                    <OnlinePopulationBadge
                                        game="reach"
                                        label={reachPlayerCount}
                                        pulseSeconds={2}
                                    />
                                ) : null}
                            </>
                        )}
                    </Stack>
                )}
            </Stack>
        </Box>
    );
};
