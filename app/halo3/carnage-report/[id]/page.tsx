

import Image from "next/image";
import { getServerSession } from "next-auth";
import { api } from "@/src/trpc/server";
import { RankBadge, ServiceRecordPlaceholder } from "@/src/components/ServiceRecordPlaceholder";
import { Stack, Box, Typography, Divider, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Grid, List, ListItem, ListItemText, Tabs, Tab } from "@mui/material";
import { Screenshots } from "@/src/api/sunrise/screenshots";
import { authOptions } from "@/src/api/auth";
import { FileShare } from "@/src/api/sunrise/fileShare";
import Link from "next/link";
import { Emblem } from "@/src/components/Emblem";
import React from "react";
import { Scoreboard } from "@/src/components/Scoreboard";
import { PGCRBreakdown } from "@/src/components/PGCRBreakdown";

const MapImage = ({mapId, size}: {mapId: number, size: number}) => (
    <Box sx={{height: size, display: 'flex', justifyContent: 'center', border: '1px solid white'}}>
        <img src={`/img/largemaps/${mapId}.jpg`} style={{
            maxWidth: '100%',
            maxHeight: '100%',
        }} />
    </Box>
)

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
      return "Unknown 45"; // Checked
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
    case 56:
      return "Unknown 56";
    case 57:
      return "Unknown 57";
    case 58:
      return "Unknown 58";
    case 59:
      return "Unknown 59";
    case 60:
      return "Sandtrap Mine";
    case 61:
      return "Unknown 61";
    default:
      return kill_type;
  }
}

function formatSeconds(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

  if (hours > 0) {
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  return `${formattedMinutes}:${formattedSeconds}`;
}

export default async function CarnageReport({params}: {params: { id: string }}) {
  const session = await getServerSession(authOptions);
  const loggedIn = !!session?.user;

  const carnageReport = (await api.sunrise2.getCarnageReport.query({ id: params.id }));
  const players = carnageReport.players.sort((a, b) => a.standing - b.standing);
  const columns = ["", "Player Name", "", "Place", "Score", "Kills", "Deaths", "Assists", "Betrayals"];

  const playerNames = players.reduce((acc, player) => {
    acc[player.player_index] = player.player_name;
    return acc;
  }, {} as Record<number, string>);

  const durationInSeconds = (new Date(carnageReport.finish_time).getTime() - new Date(carnageReport.start_time).getTime()) / 1000;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Grid container  alignItems="flex-start">
      {/* Map Image Section */}
      <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'center' }}>
        <MapImage mapId={carnageReport.map_id} size={150} />
      </Grid>

      {/* Details Section */}
      <Grid item xs={12} sm={10}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h6" component="div" gutterBottom>
            {carnageReport.game_variant.name} on {carnageReport.map_variant_name}
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
                {carnageReport.matchmaking_options ? carnageReport.matchmaking_options?.hopper_name : 'Custom Games'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Duration:</strong> {formatSeconds(durationInSeconds)}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>

    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', backgroundImage: `url("/img/largemaps/${carnageReport.map_id}.jpg")`, justifyContent: 'center', padding: 5, backgroundSize: 'cover' }}>
      <Box sx={{ maxWidth: '28em', width: '100%' }}>
    <Scoreboard data={{
      teamGame: carnageReport.team_game,
      teams: carnageReport.teams.map((team, idx) => ({
        index: idx,
        score: team.score,
        standing: team.standing,
      })),
      players: players.map((player, idx) => ({
        index: idx,
        xuid: player.player_xuid,
        standing: player.standing,
        score: player.score,
        playerName: player.player_name,
        emblemPrimary: player.foreground_emblem,
        emblemSecondary: player.emblem_flags === 0,
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
    
    <h2>Carnage Report</h2>

    <PGCRBreakdown report={carnageReport} />

    {/* <h2>Player Breakdown</h2>
    <Tabs orientation="vertical" value={0} sx={{ width: '16em'}}>
      {carnageReport.players.map((player, index) => (<Tab key={index} label={player.player_name} value={index}/>))}
    </Tabs> */}

    <h2>Kill Feed</h2>


    <Paper elevation={3} sx={{ padding: 3 }}>
      <Typography variant="h6" gutterBottom>Kill Feed</Typography>
      <List>
        {carnageReport.events.kill_events.sort((a, b) => a.time - b.time).map((kill, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <Box display="flex" width="100%" gap={2}>
                <Box>
                  <Typography variant="body2" fontWeight="bold" color="textPrimary">
                    {formatSeconds(kill.time)}
                  </Typography>
                </Box>
                <Box>
                <Typography variant="body1"  color="textPrimary">
                    {playerNames[kill.killer_player_index]} killed {playerNames[kill.dead_player_index]} using a {get_kill_type_name(kill.kill_type)}
                  </Typography>
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
