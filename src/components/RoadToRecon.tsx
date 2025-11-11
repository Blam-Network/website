"use client";

import { Stack, Box, Alert, AlertTitle, Button, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import {
    useMutation,
    useQuery,
} from '@tanstack/react-query'
import { api } from "../trpc/client";

export const RoadToRecon = ({profileGamertag}: {profileGamertag?: string}) => {
    const { data: session } = useSession();
    const loggedIn = !!session?.user?.xuid;
    const isOwnProfile = loggedIn && session?.user?.gamertag === profileGamertag;

    const { isFetching, data } = useQuery({
        queryKey: ['cheevos'],
        queryFn: () =>
          api.xbox.getVidmasters.query(),
        enabled: loggedIn,
      })

    const unlockMutation = useMutation({
        mutationFn: () =>
            api.sunrise2.unlockRecon.mutate(),
    })

    if (!loggedIn || !isOwnProfile) return null;



    console.log({isFetching, data});

    const vidmastersUnlocked = data?.annual && data?.brainpan && data?.lightswitch && data?.sevenOnSeven && data?.classic && data?.endure && data?.dejaVu;
    
    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                mt: 2,
            }}
        >
            {vidmastersUnlocked ? (
                <Alert severity="success">
                    <AlertTitle>Recon Available</AlertTitle>
                    <Stack direction={'column'} gap={1}>
                        You&apos;ve unlocked all of the Vidmaster achievements! <br />
                        Click the button below to unlock your Recon armor.
                        <Button size='small' disabled={unlockMutation.isPending} variant='contained' color='success' onClick={() => unlockMutation.mutate()}>Unlock Recon</Button>
                    </Stack>
                </Alert>
            ) : (
                <Stack direction={'column'} gap={2} alignItems='center'>
                    <Typography 
                        variant='h4' 
                        sx={{
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #9CCC65 0%, #7CB342 50%, #558B2F 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            textShadow: '0 0 20px rgba(124, 179, 66, 0.3)',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                        }}
                    >
                        Road to Recon
                    </Typography>
                    <Typography 
                        variant='body2' 
                        sx={{ 
                            color: '#B0B0B0',
                            textAlign: 'center',
                            mb: 2,
                        }}
                    >
                        Unlock the 7 Vidmaster Achievements to earn the Recon armor set!
                    </Typography>
                    <Stack direction={'row'} gap={3} justifyContent='center' flexWrap='wrap'>
                        <Stack direction={'column'} alignItems='center' gap={1}>
                            <Box
                                sx={{
                                    transform: !data || !data.annual ? 'rotate(-15deg)' : 'none',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: !data || !data.annual ? 'rotate(0deg)' : 'none',
                                        '& img': {
                                            filter: !data || !data.annual ? 'saturate(0.3)' : 'none',
                                        },
                                    },
                                }}
                            >
                                <img src="/img/vidmasters/annual.png" width={64} height={64} style={!data || !data.annual ? {filter: 'saturate(0)', transition: 'filter 0.3s ease'} : {filter: 'drop-shadow(0 0 8px rgba(124, 179, 66, 0.6))', transition: 'filter 0.3s ease'}} />
                            </Box>
                            <Typography variant='body2'>Annual</Typography>
                        </Stack>
                        <Stack direction={'column'} alignItems='center' gap={1}>
                            <Box
                                sx={{
                                    transform: !data || !data.brainpan ? 'rotate(-15deg)' : 'none',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: !data || !data.brainpan ? 'rotate(0deg)' : 'none',
                                        '& img': {
                                            filter: !data || !data.brainpan ? 'saturate(0.3)' : 'none',
                                        },
                                    },
                                }}
                            >
                                <img src="/img/vidmasters/brainpan.png" width={64} height={64} style={!data || !data.brainpan ? {filter: 'saturate(0)', transition: 'filter 0.3s ease'} : {filter: 'drop-shadow(0 0 8px rgba(124, 179, 66, 0.6))', transition: 'filter 0.3s ease'}} />
                            </Box>
                            <Typography variant='body2'>Brainpan</Typography>
                        </Stack>
                        <Stack direction={'column'} alignItems='center' gap={1}>
                            <Box
                                sx={{
                                    transform: !data || !data.lightswitch ? 'rotate(-15deg)' : 'none',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: !data || !data.lightswitch ? 'rotate(0deg)' : 'none',
                                        '& img': {
                                            filter: !data || !data.lightswitch ? 'saturate(0.3)' : 'none',
                                        },
                                    },
                                }}
                            >
                                <img src="/img/vidmasters/lightswitch.png" width={64} height={64} style={!data || !data.lightswitch ? {filter: 'saturate(0)', transition: 'filter 0.3s ease'} : {filter: 'drop-shadow(0 0 8px rgba(124, 179, 66, 0.6))', transition: 'filter 0.3s ease'}} />
                            </Box>
                            <Typography variant='body2'>Lightswitch</Typography>
                        </Stack>
                        <Stack direction={'column'} alignItems='center' gap={1}>
                            <Box
                                sx={{
                                    transform: !data || !data.sevenOnSeven ? 'rotate(-15deg)' : 'none',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: !data || !data.sevenOnSeven ? 'rotate(0deg)' : 'none',
                                        '& img': {
                                            filter: !data || !data.sevenOnSeven ? 'saturate(0.3)' : 'none',
                                        },
                                    },
                                }}
                            >
                                <img src="/img/vidmasters/7on7.png" width={64} height={64} style={!data || !data.sevenOnSeven ? {filter: 'saturate(0)', transition: 'filter 0.3s ease'} : {filter: 'drop-shadow(0 0 8px rgba(124, 179, 66, 0.6))', transition: 'filter 0.3s ease'}} />
                            </Box>
                            <Typography variant='body2'>7 on 7</Typography>
                        </Stack>
                        <Stack direction={'column'} alignItems='center' gap={1}>
                            <Box
                                sx={{
                                    transform: !data || !data.classic ? 'rotate(-15deg)' : 'none',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: !data || !data.classic ? 'rotate(0deg)' : 'none',
                                        '& img': {
                                            filter: !data || !data.classic ? 'saturate(0.3)' : 'none',
                                        },
                                    },
                                }}
                            >
                                <img src="/img/vidmasters/classic.png" width={64} height={64} style={!data || !data.classic ? {filter: 'saturate(0)', transition: 'filter 0.3s ease'} : {filter: 'drop-shadow(0 0 8px rgba(124, 179, 66, 0.6))', transition: 'filter 0.3s ease'}} />
                            </Box>
                            <Typography variant='body2'>Classic</Typography>
                        </Stack>
                        <Stack direction={'column'} alignItems='center' gap={1}>
                            <Box
                                sx={{
                                    transform: !data || !data.endure ? 'rotate(-15deg)' : 'none',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: !data || !data.endure ? 'rotate(0deg)' : 'none',
                                        '& img': {
                                            filter: !data || !data.endure ? 'saturate(0.3)' : 'none',
                                        },
                                    },
                                }}
                            >
                                <img src="/img/vidmasters/endure.png" width={64} height={64} style={!data || !data.endure ? {filter: 'saturate(0)', transition: 'filter 0.3s ease'} : {filter: 'drop-shadow(0 0 8px rgba(124, 179, 66, 0.6))', transition: 'filter 0.3s ease'}} />
                            </Box>
                            <Typography variant='body2'>Endure</Typography>
                        </Stack>
                        <Stack direction={'column'} alignItems='center' gap={1}>
                            <Box
                                sx={{
                                    transform: !data || !data.dejaVu ? 'rotate(-15deg)' : 'none',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: !data || !data.dejaVu ? 'rotate(0deg)' : 'none',
                                        '& img': {
                                            filter: !data || !data.dejaVu ? 'saturate(0.3)' : 'none',
                                        },
                                    },
                                }}
                            >
                                <img src="/img/vidmasters/deja_vu.png" width={64} height={64} style={!data || !data.dejaVu ? {filter: 'saturate(0)', transition: 'filter 0.3s ease'} : {filter: 'drop-shadow(0 0 8px rgba(124, 179, 66, 0.6))', transition: 'filter 0.3s ease'}} />
                            </Box>
                            <Typography variant='body2'>Déjà Vu</Typography>
                        </Stack>
                    </Stack>
            </Stack>
            )}

        </Box>
    );
}