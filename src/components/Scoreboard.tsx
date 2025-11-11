'use client';

import { Stack, Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, tableCellClasses } from "@mui/material";
import { getColor, getColorName, getCssColor, getTextColor } from "../colors";
import { Fragment, useEffect, useRef, useState } from "react";
import { RankBadge, ServiceRecordPlaceholder } from "./ServiceRecordPlaceholder";
import { Emblem } from "./Emblem";
import { text } from "stream/consumers";
import { getTeamColor, getTeamName, getTeamTextColor } from "../utils/teams";


export type Scoreboard = {
    teamGame: boolean;
    teams: {
        index: number;
        standing: number;
        score: number;
    }[];
    players: {
        index: number;
        xuid: string;
        standing: number;
        score: number;
        team: number;
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
const EMBLEM_SIZE = 25;
const OPACITY = 0.9;
const FONT_SIZE = 1.5;
const FONT_FAMILY = 'Arial, sans-serif';
const LINE_HEIGHT = 1.1;
const DARKEN_FACTOR = 0.65;

export const Scoreboard = ({data}: {data: Scoreboard}) => {
    if (data.teamGame) {
        return <TeamScoreboard data={data} />
    }
    else {
        return <FFAScoreboard data={data} />
    }
}

const ColGroup = () => {
    return (
        <colgroup>
            <col style={{ width: '2.75em', padding: 0 }} />
            <col style={{ padding: 0 }}/> 
            <col style={{ width: '3.5em', padding: 0 }} />
            <col style={{ width: '5em', padding: 0 }} /> 
        </colgroup>
    );
}

const ScoreboardStatus = ({text}: {text: string}) => {
    return (
        <TableHead>
        <TableRow sx={{
            [`& .${tableCellClasses.root}`]: {
                textAlign: 'left',
                padding: 0,
                paddingLeft: 0.5,
            }
        }}>
            <TableCell>{/*Loading Spinner?*/}</TableCell>
            <TableCell colSpan={3}>{text}</TableCell>
        </TableRow>
      </TableHead>
    );
}

const ScoreboardHeader = () => {
    return <TableHead>
    <TableRow sx={{
            [`& .${tableCellClasses.root}`]: {
                padding: 0,
                backgroundColor: `black`, 
            },
            border: `${CELL_SPACING_SIZE}px solid transparent`,
        }}
    >
        <TableCell style={{borderLeftColor: 'transparent'}}></TableCell>
        <TableCell colSpan={2} sx={{
            borderLeftWidth: 0,
        }}>
            <Box flexDirection="row" display="flex" alignItems="center" paddingLeft={0.5}>
                Players
                <Box padding={0.5}>
                    <Box sx={{width: EMBLEM_SIZE, height: EMBLEM_SIZE}}/>
                </Box>
            </Box>
        </TableCell>
        <TableCell sx={{
            borderRightColor: 'transparent',
        }}>Score</TableCell>
    </TableRow>
  </TableHead>
}

const TeamRow = ({team}: {team: Scoreboard['teams'][0]}) => {
    const color = getTeamColor(team.index);
    const textColor = getTeamTextColor(team.index);
    const darkenedColor = {
        r: color.r * DARKEN_FACTOR,
        g: color.g * DARKEN_FACTOR,
        b: color.b * DARKEN_FACTOR,
    }
    const teamName = getTeamName(team.index);

    return (
        <TableRow key={"team" + team.index} sx={{
            [`& .${tableCellClasses.root}`]: {
                padding: 0,
                backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`, 
                border: `${CELL_SPACING_SIZE}px solid transparent`,
                color: `rgb(${textColor.r}, ${textColor.g}, ${textColor.b})`,
            },
        }}>
            <TableCell>{team.standing}</TableCell>
            <TableCell colSpan={2}>
                <Box flexDirection="row" display="flex" alignItems="center" paddingLeft={0.5}>
                    {teamName} Team
                    <Box sx={{width: EMBLEM_SIZE, height: EMBLEM_SIZE, margin: 0.5}}/>
                </Box>
            </TableCell>
            <TableCell style={{
                backgroundColor: `rgb(${darkenedColor.r}, ${darkenedColor.g}, ${darkenedColor.b})`,
            }}>{team.score}</TableCell>
        </TableRow>
    )
}

const PlayerRow = ({player, teamGame}: {player: Scoreboard['players'][0], teamGame: Scoreboard['teamGame']}) => {
    let color = getColor(getColorName(player.primaryColor));
    let textColor = getTextColor(getColorName(player.primaryColor));
    if (teamGame) {
        color = getTeamColor(player.team);
        textColor = getTeamTextColor(player.team);
    }
    let darkenedColor = {
        r: color.r * DARKEN_FACTOR,
        g: color.g * DARKEN_FACTOR,
        b: color.b * DARKEN_FACTOR,
    }

    return (
        <TableRow sx={{
                [`& .${tableCellClasses.root}`]: {
                    padding: 0,
                    backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`, 
                    border: `${CELL_SPACING_SIZE}px solid transparent`,
                    color: `rgb(${textColor.r}, ${textColor.g}, ${textColor.b})`,
                },
                "&:hover": {
                    [`& .${tableCellClasses.root}`]: {
                        boxShadow: 'inset 0px 11px 2px -10px white, inset 0px -11px 2px -10px white',
                    },
                    boxShadow: 'inset 0px 13px 2px -10px white, inset 0px -13px 2px -10px white',
                },
        }}>
            <TableCell>
                {!teamGame && player.standing}
            </TableCell>
            <TableCell style={{
                borderRightWidth: 0,
            }}>
                <Box flexDirection="row" display="flex" alignItems="center" >
                <Box sx={{padding: 0.5}}>
                    <Emblem 
                        emblem={{
                            primary: player.emblemPrimary,
                            secondary: player.emblemSecondary,
                            background: player.emblemBackground,
                            primaryColor: player.emblemPrimaryColor,
                            secondaryColor: player.emblemSecondaryColor,
                            backgroundColor: player.emblemBackgroundColor,
                        }} 
                        size={EMBLEM_SIZE} 
                    />
                </Box>
                {player.playerName}
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
                    {player.serviceTag}
                </Box>
            </TableCell>
            <TableCell style={{
                backgroundColor: `rgb(${darkenedColor.r}, ${darkenedColor.g}, ${darkenedColor.b})`,
            }}>{player.score}</TableCell>
        </TableRow>
    )
}

const FFAScoreboard = ({data}: {data: Scoreboard}) => {
    let winner = data.players.sort((a, b) => a.standing - b.standing)[0];
    let [selectedPlayer, setSelectedPlayer] = useState<Scoreboard['players'][0] | null>(null);
    return (
        <TableContainer>
        <Table size="small" sx={{
            opacity: OPACITY,
            overflow: 'hidden',
            [`& .${tableCellClasses.root}`]: {
                borderBottom: "none",
                borderTop: "none",
                textShadow: '1px 0 0 #0009, 0 -1px 0 #0009, 0 1px 0 #0009, -1px 0 0 #0009',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                fontSize: `${FONT_SIZE}em`,
                fontFamily: FONT_FAMILY,
                lineHeight: LINE_HEIGHT,
            }
        }}>
          <ColGroup/>
          <ScoreboardStatus text={`${winner.playerName} wins!`}/>
          <ScoreboardHeader/>
          <TableBody>
            {data.players.map((row, index) => <PlayerRow key={'player'+ row.index} player={row} teamGame={data.teamGame} />)}
          </TableBody>
        </Table>

      </TableContainer>
    );
}

export const TeamScoreboard = ({data}: {data: Scoreboard}) => {
    let winner = data.teams.sort((a, b) => a.standing - b.standing)[0];
    let [selectedPlayer, setSelectedPlayer] = useState<Scoreboard['players'][0] | null>(null);
    return (
        <TableContainer>
        <Table size="small" sx={{
            opacity: OPACITY,
            overflow: 'hidden',
            [`& .${tableCellClasses.root}`]: {
                borderBottom: "none",
                borderTop: "none",
                textShadow: '1px 0 0 #0009, 0 -1px 0 #0009, 0 1px 0 #0009, -1px 0 0 #0009',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                fontSize: `${FONT_SIZE}em`,
                fontFamily: FONT_FAMILY,
                lineHeight: LINE_HEIGHT,
              }
        }}>
          <ColGroup />
          <ScoreboardStatus text={`${getTeamName(winner.index)} Team wins!`}/>
          <ScoreboardHeader />
          <TableBody>
            {data.teams.sort((a, b) => a.standing - b.standing).map((team) => {
                return <Fragment key={'team'+ team.index}>
                    <TeamRow team={team}/>
                    {data.players.filter(player => player.team == team.index).sort((a, b) => a.standing - b.standing).map((row) => 
                        <PlayerRow player={row} key={'player'+ row.index} teamGame={data.teamGame} />
                    )}
                </Fragment>
            })}
          </TableBody>
        </Table>

      </TableContainer>
    );
}