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


const CELL_SPACING_SIZE = 2.5;
const EMBLEM_SIZE = 24;

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
                textShadow: '1px 0 0 #0009, 0 -1px 0 #0009, 0 1px 0 #0009, -1px 0 0 #0009',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                fontSize: '1.1em',
              }
        }}>
          <colgroup>
            <col style={{ width: '1px', padding: 0 }} /> {/* First column thinner */}
            <col /> {/* Other columns take the remaining space */}
            <col style={{ width: '3em', padding: 0 }} /> {/* Other columns take the remaining space */}
            <col style={{ width: '5em', padding: 0 }} /> {/* First column thinner */}
          </colgroup>
          <TableHead>
            <TableRow sx={{
                [`& .${tableCellClasses.root}`]: {
                    textAlign: 'left',
                    padding: 0.5,
                }
            }}>
                <TableCell sx={{width: 38}}>{/*Standing*/}</TableCell>
                <TableCell colSpan={3}>{winner.playerName} wins!</TableCell>
            </TableRow>
          </TableHead>
          <TableHead>
            <TableRow sx={{
                    [`& .${tableCellClasses.root}`]: {
                        padding: 0,
                        backgroundColor: `black`, 
                        border: `${CELL_SPACING_SIZE}px solid black`,
                    },
                }}
            >
                <TableCell style={{borderLeftColor: 'transparent'}}></TableCell>
                <TableCell colSpan={2} style={{
                    borderRightWidth: 0,
                }}>
                    <Box flexDirection="row" display="flex" gap={1} alignItems="center" sx={{padding: 0.5}}>
                    Players
                    <Box sx={{width: EMBLEM_SIZE, height: EMBLEM_SIZE}}/>
                    </Box>
                </TableCell>
                <TableCell sx={{
                    borderRightColor: 'transparent',
                }}>Score</TableCell>
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
                        border: `${CELL_SPACING_SIZE}px solid transparent`,
                    },
                    "&:hover": {
                        [`& .${tableCellClasses.root}`]: {
                            boxShadow: 'inset 0px 11px 2px -10px white, inset 0px -11px 2px -10px white',
                        },
                        boxShadow: 'inset 0px 13px 2px -10px white, inset 0px -13px 2px -10px white',
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
                        size={EMBLEM_SIZE} 
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
                        paddingRight={1}
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