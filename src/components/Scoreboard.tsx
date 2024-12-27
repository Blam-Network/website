'use client';

import { Stack, Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, tableCellClasses } from "@mui/material";
import { getColor, getColorName, getCssColor } from "../colors";
import { useEffect, useRef, useState } from "react";
import { RankBadge, ServiceRecordPlaceholder } from "./ServiceRecordPlaceholder";
import { Emblem } from "./Emblem";
import { text } from "stream/consumers";


export type Scoreboard = {
    teams?: {
        standing: number;
        score: number;
    }
    players: {
        index: number;
        xuid: number;
        standing: number;
        score: number;
        team?: number;
        playerName: string;
        serviceTag: string;
        emblemPrimary: number;
        emblemSecondary: boolean;
        emblemBackground: number;
        emblemPrimaryColor: number;
        emblemSecondaryColor: number;
        emblemBackgroundColor: number;
        primaryColor: number;
        secondaryColor: number;
        tertiaryColor: number;
    }[];
}


export const Scoreboard = ({data}: {data: Scoreboard}) => {
    let winner = data.players.sort((a, b) => a.standing - b.standing)[0];
    let [selectedPlayer, setSelectedPlayer] = useState<Scoreboard['players'][0] | null>(null);
    return (
        <TableContainer>
        <Table size="small" sx={{
            opacity: 0.9,
            overflow: 'hidden',
            [`& .${tableCellClasses.root}`]: {
                borderBottom: "none",
                borderTop: "none",
                textShadow: '1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                fontSize: '1em',
              }
        }}>
          <colgroup>
            <col style={{ width: '1px', padding: 0 }} /> {/* First column thinner */}
            <col /> {/* Other columns take the remaining space */}
            <col style={{ width: '4em', padding: 0 }} /> {/* First column thinner */}
            <col style={{ width: '1px', padding: 0 }} /> {/* First column thinner */}
          </colgroup>
          <TableHead>
            <TableRow sx={{
                [`& .${tableCellClasses.root}`]: {
                    textAlign: 'left',
                    fontWeight: 'bold', 
                    padding: 0.5,
                }
            }}>
                <TableCell sx={{width: 38}}>{/*Standing*/}</TableCell>
                <TableCell colSpan={3}>{winner.playerName} wins!</TableCell>
            </TableRow>
          </TableHead>
          <TableHead>
            <TableRow sx={{
                [`& .${tableCellClasses.head}`]: {
                    backgroundColor: '#000',
                    textAlign: 'left',
                    fontWeight: 'bold', 
                    padding: 0.5,
                    borderSpacing: 0,
                    border: '0px 0px 2px 2px solid transparent',
                }
            }}>
                <TableCell style={{borderLeftColor: 'transparent'}}>{/*Standing*/}</TableCell>
                <TableCell>Players</TableCell>
                <TableCell>{/*Tag*/}</TableCell>
                <TableCell style={{borderRightColor: 'transparent'}}>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.players.map((row, index) => {
                let color = getColor(getColorName(row.primaryColor));
                let darkenFactor = 0.65;
                let darkenedColor = {
                    r: color.r * darkenFactor,
                    g: color.g * darkenFactor,
                    b: color.b * darkenFactor,
                }
                return (
              <TableRow onMouseEnter={() => {
                console.log(row.playerName);
                setSelectedPlayer(row);
              }} key={index} sx={{
                    [`& .${tableCellClasses.root}`]: {
                        padding: 0,
                        backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`, 
                        border: '2px solid transparent',
                    },
                    "&:hover": {
                        [`& .${tableCellClasses.root}`]: {
                            boxShadow: 'inset 0px 12px 3px -10px white, inset 0px -12px 3px -10px white',
                        },
                        boxShadow: 'inset 0px 12px 3px -10px white, inset 0px -12px 3px -10px white',
                    }
              }}>
                <TableCell>{row.standing}</TableCell>
                <TableCell style={{
                    borderRightWidth: 0,
                }}>
                    <Box flexDirection="row" display="flex" gap={1} alignItems="center" sx={{padding: 0.5}}>
                    <Emblem 
                        emblem={{
                            primary: row.emblemPrimary,
                            secondary: row.emblemSecondary,
                            background: row.emblemBackground,
                            primaryColor: row.emblemPrimaryColor,
                            secondaryColor: row.emblemSecondaryColor,
                            backgroundColor: row.emblemBackgroundColor,
                            armourPrimaryColor: row.primaryColor,
                        }} 
                        size={25} 
                    />
                    {row.playerName}
                  </Box>
                </TableCell>
                <TableCell
                    style={{
                        background: `linear-gradient(90deg, rgba(0,0,0, 0.75) 0%, rgb(${darkenedColor.r},${darkenedColor.g},${darkenedColor.b}) 15%)`,
                        borderLeftWidth: 0,
                    }}
                >
                    <Box 
                        textAlign='right'
                        paddingRight={2}
                    >
                    {row.serviceTag}
                    </Box>
                </TableCell>
                <TableCell style={{
                    backgroundColor: `rgb(${darkenedColor.r}, ${darkenedColor.g}, ${darkenedColor.b})`,
                }}>{row.score}</TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>

      </TableContainer>
    );
}