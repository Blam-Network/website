"use client";

import { Stack, Box, Typography, Button, Link as MuiLink } from "@mui/material";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { profileRedirectPath } from "@/src/components/Gamertag";
import { usePreferReachRoutes } from "@/src/hooks/usePreferReachRoutes";
import { PendingTransfersIcon } from "./PendingTransfersIcon";
import { BARLOW_FAMILY } from "@/src/theme/fonts";

export const Header = ({ session }: { session: Session | null }) => {
    const loggedIn = !!session?.user?.xuid;
    const preferReach = usePreferReachRoutes();
    const profileHref = profileRedirectPath(preferReach);
    const logoSize = { xs: 26, md: 32 };

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
                boxShadow: '0 1px 0 rgba(130, 198, 3, 0.15)',
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
                <Link href="/" aria-label="blam.network" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'baseline',
                            cursor: 'pointer',
                            fontFamily: BARLOW_FAMILY,
                            fontWeight: 600,
                            fontSize: logoSize,
                            letterSpacing: '-0.02em',
                            lineHeight: 1,
                            color: '#FFFFFF',
                        }}
                    >
                        blam
                        <Box
                            component="span"
                            sx={{
                                position: 'relative',
                                display: 'inline-block',
                                width: '0.72em',
                                height: '0.72em',
                                mx: '0.03em',
                            }}
                        >
                            <Image src="/img/blam_logo_icon.png" alt="" fill sizes="24px" priority />
                        </Box>
                        network
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
                                    href={profileHref}
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
