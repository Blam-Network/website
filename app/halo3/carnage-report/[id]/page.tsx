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
import { MVPSection } from "@/src/components/MVPSection";
import type { Metadata } from "next";
import { format } from "date-fns";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  const vc = process.env.VERCEL_URL;
  if (vc) return `https://${vc}`;
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
};

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  
  let carnageReport: any | undefined = undefined;
  try {
    carnageReport = await api.sunrise2.getCarnageReport.query({ id: params.id });
  } catch {}

  if (!carnageReport) {
    return {
      title: "Carnage Report - Blam Network",
      description: "View Halo 3 carnage report on Blam Network.",
    };
  }

  const players = carnageReport.players.sort((a: typeof carnageReport.players[0], b: typeof carnageReport.players[0]) => a.standing - b.standing);
  const winner = players[0];
  const winningTeam = carnageReport.team_game && carnageReport.teams.length > 0 
    ? carnageReport.teams.sort((a: typeof carnageReport.teams[0], b: typeof carnageReport.teams[0]) => a.standing - b.standing)[0]
    : null;

  const title = winningTeam 
    ? `${getTeamName(winningTeam.team_index)} Team Wins! - Blam Network`
    : `${winner.player_name} Wins! - Blam Network`;
  
  const startTime = new Date(carnageReport.start_time);
  const formattedStartTime = format(startTime, "MMM d, yyyy 'at' h:mm a");
  const description = `${carnageReport.game_variant.name} on ${carnageReport.map_variant_name}. Started ${formattedStartTime}. View full carnage report on Blam Network.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/halo3/carnage-report/${params.id}`,
      siteName: "Blam Network",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

const getGametypeIconPosition = (gameEngineType: number): { x: number; y: number } | null => {
  // Sprite sheet has 2 columns, 5 rows
  // Left column: forge (10), slayer (2), koth (4), juggernaut (5), assault (7)
  // Right column: ctf (1), oddball (3), vip (8), territories (6), infection (9)
  
  switch (gameEngineType) {
    case 10: // Forge
      return { x: 0, y: 0 }; // Left column, row 0
    case 2: // Slayer
      return { x: 0, y: 1 }; // Left column, row 1
    case 4: // KOTH
      return { x: 0, y: 2 }; // Left column, row 2
    case 5: // Juggernaut
      return { x: 0, y: 3 }; // Left column, row 3
    case 7: // Assault
      return { x: 0, y: 4 }; // Left column, row 4
    case 1: // CTF
      return { x: 1, y: 0 }; // Right column, row 0
    case 3: // Oddball
      return { x: 1, y: 1 }; // Right column, row 1
    case 8: // VIP
      return { x: 1, y: 2 }; // Right column, row 2
    case 6: // Territories
      return { x: 1, y: 3 }; // Right column, row 3
    case 9: // Infection
      return { x: 1, y: 4 }; // Right column, row 4
    default:
      return null;
  }
};

const MapImage = ({mapId, size, gameEngineType}: {mapId: number, size: number, gameEngineType?: number}) => {
    const gametypePosition = gameEngineType ? getGametypeIconPosition(gameEngineType) : null;
    
    return (
        <Box sx={{
            height: size, 
            // width: size,
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            border: '2px solid #7CB342',
            borderRadius: '4px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
            position: 'relative',
        }}>
        <img src={`/img/largemaps/${mapId}.jpg`} style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
            }} />
            {gametypePosition && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: 'url("/img/game_types_lg_ui.png")',
                        backgroundSize: '200% 500%', // 2 columns, 5 rows
                        backgroundPosition: `${gametypePosition.x * 100}% ${gametypePosition.y * 25}%`, // x: 0% or 100%, y: 0%, 25%, 50%, 75%, 100%
                        backgroundRepeat: 'no-repeat',
                        pointerEvents: 'none',
                        zIndex: 1,
                    }}
                />
            )}
    </Box>
    );
}

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
            <MapImage mapId={carnageReport.map_id} size={200} gameEngineType={carnageReport.game_variant.game_engine} />
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

      {/* MVP Section */}
      <Box sx={{ mb: 4 }}>
        <MVPSection player={winner} />
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
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 2, width: '100%' }}>
                {relatedFiles.fileshare.map((file: typeof relatedFiles.fileshare[0]) => (
                  <Paper
                    key={file.id}
                    elevation={4}
                    sx={{
                      border: '1px solid #333',
                      background: 'linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)',
                      p: 1.5,
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        borderColor: '#7CB342',
                        boxShadow: '0 0 10px rgba(124, 179, 66, 0.2)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Box sx={{ width: '100%', mb: 1 }}>
                      <FileshareFiletypeIcon 
                        filetype={file.header.filetype} 
                        gameEngineType={file.header.gameEngineType}
                        size="100%"
                        shareId={file.header.filetype === 13 ? file.shareId : undefined}
                        slot={file.header.filetype === 13 ? file.slotNumber : undefined}
                        fileId={file.header.filetype === 13 ? file.id : undefined}
                        filename={file.header.filetype === 13 ? file.header.filename : undefined}
                        description={file.header.filetype === 13 ? file.header.description : undefined}
                        author={file.header.filetype === 13 ? file.header.author : undefined}
                      />
                    </Box>
                    <Typography variant='body1' sx={{ fontWeight: 600, color: '#9CCC65', mb: 0.5 }}>
                      {file.header.filename}
                    </Typography>
                    <Typography variant='body2' sx={{ fontSize: '0.75rem', color: '#B0B0B0', mb: 1 }}>
                      by{' '}
                      <Link href={"/player/" + file.header.author} style={{ color: '#4A90E2', textDecoration: 'none' }}>
                        {file.header.author}
                      </Link>
                    </Typography>
                    {loggedIn && (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 'auto' }}>
                        <FileshareDownloadButton fileId={file.id} />
                      </Box>
                    )}
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
                    date={screenshot.date}
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
