"use client";

import { Stack, Box, Typography } from "@mui/material";
import { Session } from "next-auth";
import { getSession, signIn, signOut } from "next-auth/react";
import { NavBar } from "./NavBar";
import { RoadToRecon } from "./RoadToRecon";

export const Header = ({session}: {session: Session | null}) => {
    const loggedIn = !!session?.user?.xuid;

    if (loggedIn) {
        console.log(session?.user);
    }
    
    return (
        <Box
            sx={{
                backgroundColor: '#222',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                borderBottom: '2px solid white',
            }}
        >
            <Stack sx={{flexDirection: 'row',  justifyContent: 'space-between', maxWidth: 'md', flexGrow: 1}}>
                <h1>Blam Network</h1>
                <Box sx={{backgroundColor: '#333', margin: 1, border: '1px solid white', padding: 1}}>
                    {loggedIn 
                        ? <>
                            <Typography component='p'>Logged in as {session?.user?.gamertag}</Typography>
                            <RoadToRecon session={session} />
                            <button onClick={() => signOut()}>Sign Out</button>
                        </>
                        : <button onClick={() => signIn('xbl')}>Sign in with Xbox LIVE</button>}
                </Box>
            </Stack>
        </Box>
    );
}