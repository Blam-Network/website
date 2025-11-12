import Image from "next/image";
import { getServerSession } from "next-auth";
import { api } from "@/src/trpc/server";
import { RankBadge, ServiceRecordPlaceholder } from "@/src/components/ServiceRecordPlaceholder";
import { Stack, Box, Typography, Divider, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Grid, List, ListItem, ListItemText, Tabs, Tab, Container, Chip } from "@mui/material";
import { Screenshots } from "@/src/api/sunrise/screenshots";
import { authOptions } from "@/src/api/auth";
import { FileShare } from "@/src/api/sunrise/fileShare";
import Link from "next/link";
import { Emblem } from "@/src/components/Emblem";
import React from "react";
import { PGCRBreakdown } from "@/src/components/PGCRBreakdown";
import { Medal } from "@/src/components/Medal";
import { DebugMenu } from "@/src/components/DebugMenu/DebugMenu";
import { DateTimeDisplay } from "@/src/components/DateTimeDisplay";
import { getTeamName } from "@/src/utils/teams";
import { ScreenshotCard } from "@/src/components/ScreenshotCard";
import { FileshareDownloadButton } from "@/src/components/FileshareDownloadButton";
import { FileshareScreenshotThumb } from "@/src/components/FileshareScreenshotThumb";
import { FileshareFiletypeIcon } from "@/src/components/FileshareFiletypeIcon";

const MapImage = ({mapId, size}: {mapId: number, size: number}) => (
    <Box sx={{
        height: size, 
        width: size,
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        border: '2px solid #7CB342',
        borderRadius: '4px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
    }}>
        <img src={`/img/largemaps/${mapId}.jpg`} style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
        }} />
    </Box>
)

const get_kill_type_name = (kill_type: number) => {
  switch (kill_type) {
    case 0:
      return "Guardians";
    case 1:
      return "Falling Damage";
    case 2:
      return "Collision";
    case 3:
      return "Melee";
    case 4:
      return "Explosion";
    case 5:
      return "Magnum";
    case 6:
      return "Plasma Pistol";
    case 7:
      return "Needler";
    case 8: 
      return "Mauler";
    case 9:
      return "SMG";
    case 10:
      return "Plasma Rifle";
    case 11:
      return "Battle Rifle";
    case 12:
      return "Carbine";
    case 13:
      return "Shotgun";
    case 14:
      return "Sniper Rifle";
    case 15:
      return "Beam Rifle";
    case 16:
      return "Assault Rifle";
    case 17:
      return "Spiker";
    case 18:
      return "Fuel Rod Cannon";
    case 19:
      return "Missile Pod";
    case 20:
      return "Rocket Launcher";
    case 21:
      return "Spartan Laser";
    case 22:
      return "Brute Shot";
    case 23:
      return "Flamethrower";
    case 24:
      return "Sentinel Beam";
    case 25:
      return "Energy Sword";
    case 26:
      return "Gravity Hammer";
    case 27:
      return "Frag Grenade";
    case 28:
      return "Plasma Grenade";
    case 29:
      return "Spike Grenade";
    case 30:
      return "Firebomb Grenade";
    case 31:
      return "Flag";
    case 32:
      return "Bomb";
    case 33:
      return "Bomb (Explosion)";
    case 34:
      return "Ball";
    case 35:
      return "Machine Gun Turret";
    case 36:
      return "Plasma Cannon";
    case 37:
      return "Unknown 37";
    case 38:
      return "Unknown 38";
    case 39:
      return "Banshee";
    case 40:
      return "Ghost";
    case 41:
      return "Mongoose";
    case 42:
      return "Unknown 42";
    case 43:
      return "Scorpion (Turret)";
    case 44:
      return "Unknown 44";
    case 45:
      return "Unknown 45";
    case 46:
      return "Warthog";
    case 47:
      return "Warthog Turret";
    case 48:
      return "Warthog Turret (Gauss)";
    case 49:
      return "Wraith";
    case 50:
      return "Wraith Turret";
    case 51:
      return "Scorpion";
    case 52:
      return "Chopper";
    case 53:
      return "Hornet";
    case 55:
      return "Prowler";
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
      return `Unknown (${kill_type})`;
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
  const players = carnageReport.players.sort((a: typeof carnageReport.players[0], b: typeof carnageReport.players[0]) => a.standing - b.standing);
  const columns = ["", "Player Name", "", "Place", "Score", "Kills", "Deaths", "Assists", "Betrayals"];

  const playerNames = players.reduce((acc: Record<number, string>, player: typeof players[0]) => {
    acc[player.player_index] = player.player_name;
    return acc;
  }, {} as Record<number, string>);

  const durationInSeconds = (new Date(carnageReport.finish_time).getTime() - new Date(carnageReport.start_time).getTime()) / 1000;
  const winner = players[0];
  const winningTeam = carnageReport.team_game && carnageReport.teams.length > 0 
    ? carnageReport.teams.sort((a: typeof carnageReport.teams[0], b: typeof carnageReport.teams[0]) => a.standing - b.standing)[0]
    : null;

  const relatedFiles = await api.sunrise2.getRelatedFiles.query({ id: params.id });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Paper 
          elevation={8}
          sx={{
            p: 3,
            background: 'linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)',
            border: '1px solid #333',
            borderRadius: '4px',
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start">
            <MapImage mapId={carnageReport.map_id} size={200} />
            <Stack spacing={2} flex={1}>
              <Box>
                <Typography variant="h4" sx={{ color: '#7CB342', fontWeight: 700, mb: 1 }}>
                  {winningTeam 
                    ? `${getTeamName(winningTeam.team_index)} Team Wins!`
                    : `${winner.player_name} Wins!`}
                </Typography>
                <Typography variant="h5" sx={{ color: '#E0E0E0', mb: 2 }}>
                  {carnageReport.game_variant.name} on {carnageReport.map_variant_name}
                </Typography>
              </Box>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Chip 
                  label={carnageReport.matchmaking_options ? carnageReport.matchmaking_options.hopper_name : 'Custom Games'}
                  sx={{ 
                    backgroundColor: '#7CB342',
                    color: '#000',
                    fontWeight: 600,
                  }}
                />
                <Chip 
                  label={`Duration: ${formatSeconds(durationInSeconds)}`}
                  sx={{ 
                    backgroundColor: '#333',
                    color: '#E0E0E0',
                    border: '1px solid #7CB342',
                  }}
                />
                <Chip 
                  label={carnageReport.team_game ? 'Team Game' : 'Free-for-All'}
                  sx={{ 
                    backgroundColor: '#333',
                    color: '#E0E0E0',
                    border: '1px solid #7CB342',
                  }}
                />
              </Stack>
              <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#7CB342', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Start Time
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#B0B0B0' }}>
                    <DateTimeDisplay date={carnageReport.start_time} />
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#7CB342', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Finish Time
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#B0B0B0' }}>
                    <DateTimeDisplay date={carnageReport.finish_time} />
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Stack>
        </Paper>
      </Box>


      {/* Breakdown Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, pb: 1, borderBottom: '2px solid #7CB342', color: '#7CB342', fontWeight: 700 }}>
          Player Breakdown
        </Typography>
        <Paper 
          elevation={4}
          sx={{
            p: 2,
            background: 'linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)',
            border: '1px solid #333',
          }}
        >
          <PGCRBreakdown report={carnageReport} />
        </Paper>
      </Box>

      {/* Related Files Section */}
      {(relatedFiles.fileshare.length > 0 || relatedFiles.screenshots.length > 0) && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 2, pb: 1, borderBottom: '2px solid #7CB342', color: '#7CB342', fontWeight: 700 }}>
            Related Files
          </Typography>
          
          {relatedFiles.fileshare.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 2, color: '#9CCC65', fontWeight: 600 }}>
                File Share
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 2, width: '100%' }}>
                {relatedFiles.fileshare.map((file: typeof relatedFiles.fileshare[0]) => (
                  <Paper
                    key={file.id}
                    elevation={4}
                    sx={{
                      border: '1px solid #333',
                      background: 'linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 0 10px rgba(124, 179, 66, 0.2)',
                        borderColor: '#7CB342',
                      },
                    }}
                  >
                    <Stack direction='column' justifyContent='space-between' sx={{ height: '100%' }}>
                      <Box sx={{ p: 2 }}>
                        <Typography variant='h6' sx={{ fontWeight: 600, color: '#E0E0E0', mb: 1 }}>
                          {file.header.filename}
                        </Typography>
                        <Typography variant='caption' color='text.secondary' sx={{ fontSize: '0.75rem' }}>
                          Created <DateTimeDisplay date={file.header.date} /> by{' '}
                          <Link href={"/player/" + file.header.author} style={{ color: '#4A90E2', textDecoration: 'none' }}>
                            {file.header.author}
                          </Link>
                        </Typography>
                        <Typography variant='body2' color='text.secondary' sx={{ mt: 1, fontSize: '0.75rem' }}>
                          {file.header.description}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, pt: 0 }}>
                        <FileshareFiletypeIcon 
                          filetype={file.header.filetype} 
                          gameEngineType={file.header.gameEngineType}
                          size="30%"
                        />
                        {loggedIn && <FileshareDownloadButton fileId={file.id} />}
                      </Box>
                      {/* Temporarily disabled due to screenshot file errors */}
                      {/* {file.header.filetype === 13 && (
                        <Box sx={{ px: 2, pb: 2 }}>
                          <FileshareScreenshotThumb
                            shareId={file.shareId}
                            slot={file.slotNumber}
                            filename={file.header.filename}
                            description={file.header.description}
                            author={file.header.author}
                          />
                        </Box>
                      )} */}
                    </Stack>
                  </Paper>
                ))}
              </Box>
            </Box>
          )}

          {relatedFiles.screenshots.length > 0 && (
            <Box>
              <Typography variant="h5" sx={{ mb: 2, color: '#9CCC65', fontWeight: 600 }}>
                Screenshots
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 2, width: '100%' }}>
                {relatedFiles.screenshots.map((screenshot: typeof relatedFiles.screenshots[0]) => (
                  <ScreenshotCard
                    key={screenshot.id}
                    screenshotId={screenshot.id}
                    screenshotUrl={`/api/screenshot/${screenshot.id}`}
                    filename={screenshot.header.filename}
                    description={screenshot.header.description}
                    author={screenshot.author}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      )}

    </Container>
  );
}
