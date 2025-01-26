"use client";

import { Stack, Box, Typography } from "@mui/material";
import { Session } from "next-auth";
import { getSession, signIn, signOut } from "next-auth/react";
import { NavBar } from "./NavBar";
import axios from "axios";
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from '@tanstack/react-query'
import { api } from "../trpc/client";

export const RoadToRecon = ({session}: {session: Session | null}) => {
    const loggedIn = !!session?.user?.xuid;
    
    // console.log('logged in as', session);

    // console.log('XBL3.0 x=' + session.user.xboxUserHash + ';' + session.tokens.xsts)

    const { isFetching, data } = useQuery({
        queryKey: ['cheevos'],
        queryFn: () =>
          api.xbox.getVidmasters.query(),
        enabled: loggedIn,
      })

    if (!loggedIn) return null;

    console.log({isFetching, data});
    
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
        </Box>
    );
}