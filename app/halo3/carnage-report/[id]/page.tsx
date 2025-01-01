

import Image from "next/image";
import { getServerSession } from "next-auth";
import { api } from "@/src/trpc/server";
import { RankBadge, ServiceRecordPlaceholder } from "@/src/components/ServiceRecordPlaceholder";
import { Stack, Box, Typography, Divider, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Grid, List, ListItem, ListItemText } from "@mui/material";
import { Screenshots } from "@/src/api/sunrise/screenshots";
import { authOptions } from "@/src/api/auth";
import { FileShare } from "@/src/api/sunrise/fileShare";
import Link from "next/link";
import { Emblem } from "@/src/components/Emblem";
import React from "react";
import { Scoreboard } from "@/src/components/Scoreboard";

export const MapImage = ({mapId, size}: {mapId: number, size: number}) => {
  // return svg from public folder
  return (
      <Box sx={{height: size, display: 'flex', justifyContent: 'center', border: '1px solid white'}}>
          <img src={`/img/maps/film/${mapId}.png`} style={{
              maxWidth: '100%',
              maxHeight: '100%',
          }} />
      </Box>
  );
}

const get_kill_type_name = (kill_type: number) => {
  switch (kill_type) {
    case 0:
      return "Guardians"; // Checked
    case 1:
      return "Falling Damage"; // are you sure
    case 2:
      return "Collision"; // Checked
    case 3:
      return "Melee"; // Checked
    case 4:
      return "Explosion"; // Checked
    case 5:
      return "Magnum"; // Checked
    case 6:
      return "Plasma Pistol"; // Checked
    case 7:
      return "Needler" // Checked
    case 8: 
      return "Mauler"; // Checked
    case 9:
      return "SMG"; // Checked
    case 10:
      return "Plasma Rifle" // Checked
    case 11:
      return "Battle Rifle"; // Checked
    case 12:
      return "Carbine"; // Checked
    case 13:
      return "Shotgun"; // Checked
    case 14:
      return "Sniper Rifle"; // Checked
    case 15:
      return "Beam Rifle"; // Checked
    case 16:
      return "Assault Rifle"; // Checked
    case 17:
      return "Spiker"; // Checked
    case 18:
      return "Fuel Rod Cannon"; // Checked
    case 19:
      return "Missile Pod"; // Checked
    case 20:
      return "Rocket Launcher"; // Checked
    case 21:
      return "Spartan Laser" // Checked
    case 22:
      return "Brute Shot" // Checked
    case 23:
      return "Flamethrower"; // Checked
    case 24:
      return "Sentinel Beam"; // Checked
    case 25:
      return "Energy Sword" // Checked
    case 26:
      return "Gravity Hammer" // Checked
    case 27:
      return "Frag Grenade"; // Checked
    case 28:
      return "Plasma Grenade"; // Checked
    case 29:
      return "Spike Grenade"; // Checked
    case 30:
      return "Firebomb Grenade"; // Checked
    case 31:
      return "Flag";
    case 32:
      return "Bomb";
    case 33:
      return "Bomb (Explosion)";
    case 34:
      return "Ball";
    case 35:
      return "Machine Gun Turret"; // Checked
    case 36:
      return "Plasma Cannon"; // Checked
    case 37:
      return "Unknown 37";
    case 38:
      return "Unknown 38";
    case 39:
      return "Banshee"; // Checked
    case 40:
      return "Ghost"; // Checked
    case 41:
      return "Mongoose"; // Checked
    case 42:
      return "Unknown 42";
    case 43:
      return "Scorpion (Turret)"; // Checked
    case 44:
      return "Unknown 44";
    case 45:
      return "Hornet"; // Checked
    case 46:
      return "Warthog"; // Checked
    case 47:
      return "Warthog Turret"; // Checked
    case 48:
      return "Warthog Turret (Gauss)"; // Checked
    case 49:
      return "Wraith"; // Checked
    case 50:
      return "Wraith Turret"; // Checked
    case 51:
      return "Scorpion"; // Checked
    case 52:
      return "Chopper"; // Checked
    case 53:
      return "Hornet"; // Checked
    case 55:
      return "Prowler"; // Checked
    case 59:
      return "Unknown 59";
    case 60:
      return "Unknown 60";
    default:
      return kill_type;
  }
}

export default async function CarnageReport({params}: {params: { id: string }}) {
  const session = await getServerSession(authOptions);
  const loggedIn = !!session?.user;

  const carnageReport = (await api.sunrise2.getCarnageReport.query({ id: params.id }));
  const players = carnageReport.players.sort((a, b) => a.place - b.place);
  const columns = ["", "Player Name", "", "Place", "Score", "Highest Skill"];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
<Grid container  alignItems="flex-start">
      {/* Map Image Section */}
      <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center' }}>
        <MapImage mapId={carnageReport.map_id} size={210} />
      </Grid>

      {/* Details Section */}
      <Grid item xs={12} sm={8}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h6" component="div" gutterBottom>
            {carnageReport.game_variant_name} on {carnageReport.map_variant_name}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Start Time:</strong> {new Date(carnageReport.start_time).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Finish Time:</strong> {new Date(carnageReport.finish_time).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Hopper Name:</strong> {carnageReport.hopper_name || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Duration:</strong> {carnageReport.duration}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>

    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', backgroundImage: `url("/img/maps/film/${carnageReport.map_id}.png")`, justifyContent: 'center', padding: 5, backgroundSize: 'cover' }}>
      <Box sx={{ maxWidth: '28em', width: '100%' }}>
    <Scoreboard data={{
      teamGame: carnageReport.team_game,
      teams: carnageReport.teams.map((team, idx) => ({
        index: idx,
        score: team.score,
        standing: team.place,
      })),
      players: players.map((player, idx) => ({
        index: idx,
        xuid: 0,
        standing: player.place,
        score: player.score,
        playerName: player.player_name,
        emblemPrimary: player.foreground_emblem,
        emblemSecondary: true, // TODO: FIX
        emblemBackground: player.background_emblem,
        emblemPrimaryColor: player.emblem_primary_color,
        emblemSecondaryColor: player.emblem_secondary_color,
        emblemBackgroundColor: player.emblem_background_color,
        primaryColor: player.primary_color,
        secondaryColor: player.secondary_color,
        tertiaryColor: player.tertiary_color,
        serviceTag: player.service_tag,
        team: player.player_team,
      }))
    }}/>
    </Box>

    </Box>
    
    <TableContainer component={Paper}>
      <Table size="small">
        <colgroup>
          <col style={{ width: '1px', paddingLeft: 0 }} /> {/* First column thinner */}
          <col /> {/* Other columns take the remaining space */}
          <col />
          <col />
          <col />
          <col />
        </colgroup>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell sx={{fontWeight: 'bold'}} key={column}>{column}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((row, index) => (
            <TableRow key={index}>
              <TableCell sx={{paddingLeft: 1, paddingRight: 1}}>
                <Emblem 
                  emblem={{
                    primary: row.foreground_emblem,
                    secondary: true,
                    background: row.background_emblem,
                    primaryColor: row.emblem_primary_color,
                    secondaryColor: row.emblem_secondary_color,
                    backgroundColor: row.emblem_background_color,
                    armourPrimaryColor: row.primary_color,
                  }} 
                  size={25} 
                />
              </TableCell>
              <TableCell sx={{paddingLeft: 0}}>{row.player_name}</TableCell>
              <TableCell><RankBadge rank={row.rank} grade={row.grade} size={25}></RankBadge></TableCell>
              <TableCell>{row.score}</TableCell>
              <TableCell>{row.score}</TableCell>
              <TableCell>{row.highest_skill}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <Paper elevation={3} sx={{ padding: 3 }}>
      <Typography variant="h6" gutterBottom>Kill Feed</Typography>
      <List>
        {carnageReport.kills.sort((a, b) => a.time - b.time).map((kill, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <Box display="flex" width="100%" gap={2}>
                <Box>
                  <Typography variant="body2" fontWeight="bold" color="textPrimary">
                    {kill.time}
                  </Typography>
                </Box>
                <Box>
                <Typography variant="body1"  color="textPrimary">
                    {kill.killer} killed {kill.killed} using a {get_kill_type_name(kill.kill_type)}
                  </Typography>
                  {/* <Typography variant="body2" color="textSecondary">
                    Type: {kill.kill_type}
                  </Typography> */}
                </Box>
              </Box>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Paper>
    </main>
  );
}
