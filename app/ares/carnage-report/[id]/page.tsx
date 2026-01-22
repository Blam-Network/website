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
    carnageReport = await api.ares.getCarnageReport.query({ id: params.id });
  } catch {}

  if (!carnageReport) {
    return {
      title: "Carnage Report - Blam Network",
      description: "View Ares carnage report on Blam Network.",
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
      url: `${baseUrl}/ares/carnage-report/${params.id}`,
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

  const carnageReport = (await api.ares.getCarnageReport.query({ id: params.id }));
  const players = carnageReport.players.sort((a: typeof carnageReport.players[0], b: typeof carnageReport.players[0]) => a.standing - b.standing);

  const durationInSeconds = (new Date(carnageReport.finish_time).getTime() - new Date(carnageReport.start_time).getTime()) / 1000;
  const winner = players[0];
  const winningTeam = carnageReport.team_game && carnageReport.teams.length > 0 
    ? carnageReport.teams.sort((a: typeof carnageReport.teams[0], b: typeof carnageReport.teams[0]) => a.standing - b.standing)[0]
    : null;

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

    </Container>
  );
}
