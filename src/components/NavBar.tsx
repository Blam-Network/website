"use client";

import { Stack, Box, Typography, Button } from "@mui/material";
import { Session } from "next-auth";
import { getSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export const NavBar = ({session}: {session: Session | null}) => {    
    const [playerName, setPlayerName] = useState('');
    const loggedIn = !!session?.user.xuid

    return (
        <Box
            sx={{
                backgroundColor: '#224',
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <Box sx={{
                maxWidth: 'md',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                flexGrow: 1,
            }}>
                <Box>
                    {/* <Link href='/screenshots'>
                        <Button>Screenshots</Button>
                    </Link>
                    <Link href='/playlists'>
                        <Button>Playlists</Button>
                    </Link>
                    <Link href='/players'>
                        <Button>Players</Button>
                    </Link>
                    {loggedIn &&
                        <Link href={'/player/' + session.user.gamertag}>
                            <Button>Service Record</Button>
                        </Link>
                    } */}
                </Box>
                <Box>
                    {/* <form>
                        <input type="text" placeholder="Player Name" value={playerName} onChange={e => setPlayerName(e.target.value)} />
                        <Link href={'/player/' + playerName} >
                            <Button>Search</Button>
                        </Link>
                    </form> */}
                </Box>
            </Box>
        </Box>
    );
}