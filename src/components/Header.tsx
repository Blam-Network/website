"use client";

import { Stack, Box, Typography, Button, Link as MuiLink } from "@mui/material";
import { Session } from "next-auth";
import { getSession, signIn, signOut } from "next-auth/react";
import { NavBar } from "./NavBar";
import Link from "next/link";
import { PendingTransfersIcon } from "./PendingTransfersIcon";

export const Header = ({session}: {session: Session | null}) => {
    const loggedIn = !!session?.user?.xuid;

    if (loggedIn) {
        console.log(session?.user);
    }
    
    return (
        <Box
            sx={{
                background: 'linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                borderBottom: '2px solid #7CB342',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                position: 'sticky',
                top: 0,
                zIndex: 1001,
            }}
        >
            <Stack 
                sx={{
                    flexDirection: 'row',  
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    maxWidth: 'lg', 
                    flexGrow: 1,
                    px: 2,
                    py: 1,
                }}
            >
                <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            cursor: 'pointer',
                            '&:hover': {
                                '& .blam-text': {
                                    textShadow: '0 0 10px rgba(124, 179, 66, 0.6), 0 0 20px rgba(124, 179, 66, 0.4)',
                                    transform: 'scale(1.02)',
                                },
                                '& .exclamation': {
                                    transform: 'scale(1.2) rotate(5deg)',
                                    textShadow: '0 0 25px rgba(124, 179, 66, 1)',
                                },
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <Typography 
                            className="blam-text"
                            variant="h1" 
                            sx={{ 
                                fontSize: { xs: '1.75rem', md: '2.5rem' },
                                m: 0,
                                fontWeight: 900,
                                fontFamily: '"Handel Gothic", sans-serif',
                                background: 'linear-gradient(135deg, #9CCC65 0%, #7CB342 50%, #558B2F 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            Blam
                        </Typography>
                        <Typography 
                            className="exclamation"
                            variant="h1" 
                            sx={{ 
                                fontSize: { xs: '1.75rem', md: '2.5rem' },
                                m: 0,
                                fontWeight: 900,
                                color: '#7CB342',
                                textShadow: '0 0 10px rgba(124, 179, 66, 0.8)',
                                transition: 'all 0.3s ease',
                                display: 'inline-block',
                            }}
                        >
                            !
                        </Typography>
                        <Typography 
                            variant="h1" 
                            sx={{ 
                                fontSize: { xs: '1.25rem', md: '1.75rem' },
                                m: 0,
                                ml: 1,
                                fontWeight: 600,
                                color: '#B0B0B0',
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                            }}
                        >
                            Network
                        </Typography>
                    </Box>
                </Link>
                <Stack direction="row" spacing={3} alignItems="center">
                    {loggedIn && <PendingTransfersIcon />}
                    <Box 
                        sx={{
                            background: 'linear-gradient(180deg, #2A2A2A 0%, #1A1A1A 100%)',
                            border: '1px solid #444',
                            borderRadius: '4px',
                            padding: 1.5,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            minWidth: { xs: 'auto', sm: 300 },
                        }}
                    >
                        {loggedIn 
                            ? <Stack direction="row" justifyContent="space-between" gap={1} spacing={1} alignItems="center">
                                <Typography component='p' variant="body2" sx={{ color: '#B0B0B0' }}>
                                    Logged in as{" "}
                                    <MuiLink 
                                        component={Link}
                                        href={"/profile"} 
                                        underline="always"
                                        sx={{ fontWeight: 600 }}
                                    >
                                        {session?.user?.gamertag}
                                    </MuiLink>
                                </Typography>
                                <Button 
                                    variant="outlined" 
                                    size="small"
                                    onClick={() => signOut()}
                                    sx={{ alignSelf: 'flex-start' }}
                                >
                                    Sign Out
                                </Button>
                            </Stack>
                            : <Button 
                                variant="contained" 
                                size="small"
                                onClick={() => signIn('xbl')}
                                sx={{ width: '100%' }}
                            >
                                Sign in with Xbox LIVE
                            </Button>}
                    </Box>
                </Stack>
            </Stack>
        </Box>
    );
}