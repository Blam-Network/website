"use client";

import { Stack, Box, Typography, Button } from "@mui/material";
import { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from '@tanstack/react-query';
import { api } from "../trpc/client";
import { useNightmap } from "../contexts/NightmapContext";

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/screenshots', label: 'Screenshots' },
    { href: '/files', label: 'Files' },
    { href: '/halo3/players', label: 'Players' },
];

export const NavBar = ({ session }: { session: Session | null }) => {
    const pathname = usePathname();
    const loggedIn = !!session?.user?.xuid;
    const { show24h } = useNightmap();

    const { data: onlinePlayers } = useQuery({
        queryKey: ['onlinePlayers'],
        queryFn: () => api.sunrise2.onlinePlayers.query(),
        refetchInterval: 30000,
        staleTime: 60000,
    });

    const { data: onlinePlayers24h } = useQuery({
        queryKey: ['onlinePlayers24h'],
        queryFn: () => api.sunrise2.onlinePlayers24h.query(),
        refetchInterval: 30000,
        staleTime: 60000,
    });

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    const links = [
        ...navLinks,
        ...(loggedIn && session?.user?.gamertag
            ? [{ href: `/halo3/player/${session.user.gamertag}`, label: 'Service Record' }]
            : []),
        ...(session?.user?.is_admin ? [{ href: '/reach/admin', label: 'Admin' }] : []),
    ];

    const playerCount = show24h && onlinePlayers24h
        ? `${onlinePlayers24h.count} players online (24h)`
        : onlinePlayers
            ? `${onlinePlayers.count} players online`
            : null;

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
                {playerCount && (
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'text.secondary',
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            display: { xs: 'none', md: 'block' },
                            letterSpacing: '0.03em',
                            '&::before': {
                                content: '""',
                                display: 'inline-block',
                                width: 6,
                                height: 6,
                                borderRadius: 0,
                                backgroundColor: 'primary.main',
                                mr: 1,
                                boxShadow: '0 0 6px rgba(124, 179, 66, 0.8)',
                                animation: 'pulse 2s ease-in-out infinite',
                                '@keyframes pulse': {
                                    '0%, 100%': { opacity: 1 },
                                    '50%': { opacity: 0.4 },
                                },
                            },
                        }}
                    >
                        {playerCount}
                    </Typography>
                )}
            </Stack>
        </Box>
    );
};
