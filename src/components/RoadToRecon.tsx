"use client";

import { Stack, Box, Typography, Alert, AlertTitle, Button } from "@mui/material";
import { Session } from "next-auth";
import { getSession, signIn, signOut } from "next-auth/react";
import { NavBar } from "./NavBar";
import axios from "axios";
import {
    QueryClient,
    QueryClientProvider,
    useMutation,
    useQuery,
} from '@tanstack/react-query'
import { api } from "../trpc/client";

export const RoadToRecon = ({session}: {session: Session | null}) => {
    const loggedIn = !!session?.user?.xuid;

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

    if (!loggedIn) return null;



    console.log({isFetching, data});

    const vidmastersUnlocked = data?.annual && data?.brainpan && data?.lightswitch && data?.sevenOnSeven && data?.classic && data?.endure && data?.dejaVu;
    
    return (
        <Box
            sx={{
                backgroundColor: '#222',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                borderBottom: '2px solid white',
            }}
            flexDirection={'column'}
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
                <>
                Road to recon (Coming Soon)
                <Stack direction={'row'} gap={1}>
                <img src="/img/vidmasters/annual.png" width={40} height={40} style={!data || !data.annual ? {filter: 'saturate(0)'} : undefined} />
                <img src="/img/vidmasters/brainpan.png" width={40} height={40} style={!data || !data.brainpan ? {filter: 'saturate(0)'} : undefined} />
                <img src="/img/vidmasters/lightswitch.png" width={40} height={40} style={!data || !data.lightswitch ? {filter: 'saturate(0)'} : undefined} />
                <img src="/img/vidmasters/7on7.png" width={40} height={40} style={!data || !data.sevenOnSeven ? {filter: 'saturate(0)'} : undefined} />
                <img src="/img/vidmasters/classic.png" width={40} height={40} style={!data || !data.classic ? {filter: 'saturate(0)'} : undefined} />
                <img src="/img/vidmasters/endure.png" width={40} height={40} style={!data || !data.endure ? {filter: 'saturate(0)'} : undefined} />
                <img src="/img/vidmasters/deja_vu.png" width={40} height={40} style={!data || !data.dejaVu ? {filter: 'saturate(0)'} : undefined} />
            </Stack>
            </>
            )}

        </Box>
    );
}