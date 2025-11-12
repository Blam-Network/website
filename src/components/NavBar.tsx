"use client";

import { Stack, Box, Typography, Button } from "@mui/material";
import { Session } from "next-auth";
import { getSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { api } from "../trpc/client";
import { useNightmap } from "../contexts/NightmapContext";

export const NavBar = ({session}: {session: Session | null}) => {    
    const [playerName, setPlayerName] = useState('');
    const loggedIn = !!session?.user.xuid;
    const { show24h } = useNightmap();

    const { data: onlinePlayers } = useQuery({
        queryKey: ['onlinePlayers'],
        queryFn: () => api.sunrise2.onlinePlayers.query(),
        refetchInterval: 30000, // Refetch every 30 seconds
        staleTime: 60000, // Consider data stale after 1 minute
    });

    const { data: onlinePlayers24h } = useQuery({
        queryKey: ['onlinePlayers24h'],
        queryFn: () => api.sunrise2.onlinePlayers24h.query(),
        refetchInterval: 30000, // Refetch every 30 seconds
        staleTime: 60000, // Consider data stale after 1 minute
    });

    return (
        <Box
            sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                background: 'linear-gradient(180deg, #0F0F0F 0%, #1A1A1A 100%)',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                borderBottom: '1px solid #333',
                py: 1,
            }}
        >
            <Stack 
                direction="row" 
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
                sx={{
                    maxWidth: 'lg',
                    flexGrow: 1,
                    px: 2,
                }}
            >
                <Stack direction="row" spacing={2}>
                    <Link href='/' style={{ textDecoration: 'none' }}>
                        <Button variant="text" sx={{ color: '#B0B0B0', '&:hover': { color: '#7CB342' } }}>
                            Home
                        </Button>
                    </Link>
                    <Link href='/screenshots' style={{ textDecoration: 'none' }}>
                        <Button variant="text" sx={{ color: '#B0B0B0', '&:hover': { color: '#7CB342' } }}>
                            Screenshots
                        </Button>
                    </Link>
                    {/* <Link href='/playlists' style={{ textDecoration: 'none' }}>
                        <Button variant="text" sx={{ color: '#B0B0B0', '&:hover': { color: '#7CB342' } }}>
                            Playlists
                        </Button>
                    </Link> */}
                    <Link href='/players' style={{ textDecoration: 'none' }}>
                        <Button variant="text" sx={{ color: '#B0B0B0', '&:hover': { color: '#7CB342' } }}>
                            Players
                        </Button>
                    </Link>
                    {loggedIn && (
                        <Link href={'/player/' + session.user.gamertag} style={{ textDecoration: 'none' }}>
                            <Button variant="text" sx={{ color: '#B0B0B0', '&:hover': { color: '#7CB342' } }}>
                                Service Record
                            </Button>
                        </Link>
                    )}
                </Stack>
                {((show24h && onlinePlayers24h) || (!show24h && onlinePlayers)) && (
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            color: '#E0E0E0',
                            fontWeight: 600,
                        }}
                    >
                        {show24h && onlinePlayers24h
                            ? `${onlinePlayers24h.count} Players Online in Halo 3 (Last 24 Hours)`
                            : onlinePlayers
                            ? `${onlinePlayers.count} Players Online in Halo 3`
                            : '0 Players Online in Halo 3'}
                    </Typography>
                )}
            </Stack>
        </Box>
    );
}