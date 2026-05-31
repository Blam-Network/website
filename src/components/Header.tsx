"use client";

import { Stack, Box, Typography, Button, Link as MuiLink } from "@mui/material";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { PendingTransfersIcon } from "./PendingTransfersIcon";
import { fixedsysSize, fixedsysStyle } from "@/src/theme/fonts";

export const Header = ({ session }: { session: Session | null }) => {
    const loggedIn = !!session?.user?.xuid;
    const logoSize = { xs: fixedsysSize(22), md: fixedsysSize(28) };
    const networkSize = { xs: fixedsysSize(17), md: fixedsysSize(20) };

    return (
        <Box
            component="header"
            sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 1100,
                backdropFilter: 'blur(16px)',
                backgroundColor: 'rgba(11, 14, 20, 0.85)',
                borderBottom: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 1px 0 rgba(124, 179, 66, 0.15)',
            }}
        >
            <Stack
                sx={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    maxWidth: 'lg',
                    flexGrow: 1,
                    px: { xs: 2, md: 3 },
                    py: 1.5,
                }}
            >
                <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'baseline',
                            gap: 0,
                            cursor: 'pointer',
                            lineHeight: 1,
                            transition: 'transform 0.2s ease',
                            '&:hover': {
                                transform: 'translateY(-1px)',
                                '& .blam-text': {
                                    filter: 'drop-shadow(0 0 14px rgba(124, 179, 66, 0.55))',
                                },
                                '& .exclamation': {
                                    transform: 'scale(1.1)',
                                },
                            },
                        }}
                    >
                        <Typography
                            className="blam-text"
                            component="span"
                            sx={{
                                ...fixedsysStyle,
                                fontSize: logoSize,
                                background: `linear-gradient(100deg, ${'#A5D65C'} 0%, ${'#7CB342'} 50%, ${'#558B2F'} 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                transition: 'filter 0.2s ease',
                            }}
                        >
                            BLAM
                        </Typography>
                        <Typography
                            className="exclamation"
                            component="span"
                            sx={{
                                ...fixedsysStyle,
                                fontSize: logoSize,
                                color: 'primary.main',
                                transition: 'transform 0.2s ease',
                            }}
                        >
                            !
                        </Typography>
                        <Typography
                            component="span"
                            sx={{
                                ...fixedsysStyle,
                                fontSize: networkSize,
                                ml: 0.75,
                                color: 'text.secondary',
                                textTransform: 'lowercase',
                            }}
                        >
                            network
                        </Typography>
                    </Box>
                </Link>
                <Stack direction="row" spacing={2} alignItems="center">
                    {loggedIn && <PendingTransfersIcon />}
                    {loggedIn ? (
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Typography component="p" variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                                Logged in as{' '}
                                <MuiLink
                                    component={Link}
                                    href="/halo3/profile"
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
                            >
                                Sign Out
                            </Button>
                        </Stack>
                    ) : (
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => signIn('xbl')}
                        >
                            Sign in with Xbox LIVE
                        </Button>
                    )}
                </Stack>
            </Stack>
        </Box>
    );
};
