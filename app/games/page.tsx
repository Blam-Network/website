"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/src/trpc/client";
import { Box, Typography, Container, Paper, Pagination, CircularProgress, Stack, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Link from "next/link";
import { DateTimeDisplay } from "@/src/components/DateTimeDisplay";
import { RecentGame } from "@/src/api/sunrise/recentGames";
import { useState, useEffect } from "react";

export default function GamesPage() {
  const router = useRouter();
  const [query, setQuery] = useState<Record<string, string>>({});
  const page = parseInt(query.page || "1", 10);
  const gamertag = query.gamertag || "";
  const [gamertagInput, setGamertagInput] = useState(gamertag);
  const pageSize = 48;

  // Read query params from URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const queryObj: Record<string, string> = {};
      params.forEach((value, key) => {
        queryObj[key] = value;
      });
      setQuery(queryObj);
      setGamertagInput(queryObj.gamertag || "");
    }
  }, []);

  // Listen for popstate events (back/forward button)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const queryObj: Record<string, string> = {};
      params.forEach((value, key) => {
        queryObj[key] = value;
      });
      setQuery(queryObj);
      setGamertagInput(queryObj.gamertag || "");
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['games', page, pageSize, gamertag],
    queryFn: () => api.sunrise2.games.query({
      page,
      pageSize,
      gamertag: gamertag || undefined,
    }),
  });

  const updateURL = (newPage: number, newGamertag: string) => {
    const newQuery = { ...query };
    if (newPage > 1) {
      newQuery.page = String(newPage);
    } else {
      delete newQuery.page;
    }
    if (newGamertag) {
      newQuery.gamertag = newGamertag;
    } else {
      delete newQuery.gamertag;
    }
    setQuery(newQuery);
    
    const params = new URLSearchParams();
    Object.entries(newQuery).forEach(([key, value]) => {
      params.set(key, value);
    });
    const queryString = params.toString();
    router.push(`/games${queryString ? `?${queryString}` : ""}`);
  };

  const handleSearch = () => {
    updateURL(1, gamertagInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    updateURL(value, gamertag);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, pb: 1, borderBottom: "2px solid #7CB342" }}>
        Games
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress sx={{ color: '#7CB342' }} />
        </Box>
      ) : data && data.data.length > 0 ? (
        <>
          <TableContainer component={Paper} sx={{ background: 'linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)', border: '1px solid #333', overflow: 'hidden', mb: 4 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342' }}>Game</TableCell>
                  <TableCell sx={{ color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342' }}>Type</TableCell>
                  <TableCell sx={{ color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342' }}>Playlist</TableCell>
                  <TableCell sx={{ color: '#7CB342', fontWeight: 700, borderBottom: '2px solid #7CB342' }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.data.map((game) => {
                  const isCampaign = game.type === 'campaign';
                  const gameVariantName = game.game_variant_name ?? null;
                  const mapVariantName = game.map_variant_name ?? null;
                  const hopperName = game.hopper_name ?? null;
                  const gameId = game.id;
                  const reportUrl = isCampaign ? `/halo3/campaign-carnage-report/${gameId}` : `/halo3/carnage-report/${gameId}`;
                  
                  // Determine game type
                  let gameType: string;
                  if (isCampaign) {
                    gameType = 'Campaign';
                  } else {
                    // Game engine 9 = Forge (updated from 5)
                    const isForge = game.game_engine === 9;
                    if (isForge) {
                      gameType = 'Forge';
                    } else if (hopperName) {
                      gameType = 'Matchmaking';
                    } else {
                      gameType = 'Custom Games';
                    }
                  }


                  // Helper functions for campaign display
                  const getMissionName = (mapId: number): string => {
                    switch (mapId) {
                      case 3005: return 'Arrival';
                      case 3010: return 'Sierra 117';
                      case 3020: return 'Crow\'s Nest';
                      case 3030: return 'Tsavo Highway';
                      case 3040: return 'The Storm';
                      case 3050: return 'Floodgate';
                      case 3070: return 'The Ark';
                      case 3100: return 'The Covenant';
                      case 3110: return 'Cortana';
                      case 3120: return 'Halo';
                      case 3130: return 'Epilogue';
                      default: return 'Unknown Mission';
                    }
                  };

                  const getDifficultyName = (difficulty: number | undefined): string => {
                    if (difficulty === undefined) return "Unknown";
                    switch (difficulty) {
                      case 0: return "Easy";
                      case 1: return "Normal";
                      case 2: return "Heroic";
                      case 3: return "Legendary";
                      default: return "Unknown";
                    }
                  };

                  return (
                    <TableRow
                      key={game.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(124, 179, 66, 0.1)',
                        },
                      }}
                    >
                      <TableCell sx={{ color: '#E0E0E0' }}>
                        <Link href={reportUrl} style={{ textDecoration: 'underline', color: '#4A90E2' }}>
                          <Typography variant='body2' sx={{ display: 'inline', fontWeight: 600, color: 'inherit' }}>
                            {isCampaign ? (
                              <>
                                {getMissionName(game.map_id)} on {getDifficultyName(game.campaign_difficulty)}
                              </>
                            ) : (
                              <>
                                {gameVariantName ?? 'Gametype'} on {mapVariantName ?? 'Unknown Map'}
                              </>
                            )}
                          </Typography>
                        </Link>
                      </TableCell>
                      <TableCell sx={{ color: '#B0B0B0' }}>
                        <Typography variant='body2' sx={{ color: 'inherit' }}>
                          {gameType}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: '#B0B0B0' }}>
                        <Typography variant='body2' sx={{ color: 'inherit' }}>
                          {isCampaign ? '-' : (hopperName ?? '-')}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: '#B0B0B0' }}>
                        <DateTimeDisplay date={game.finish_time} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {data.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={data.totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: '#B0B0B0',
                    '&.Mui-selected': {
                      backgroundColor: '#7CB342',
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: '#558B2F',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(124, 179, 66, 0.1)',
                    },
                  },
                }}
              />
            </Box>
          )}
          {data.total > 0 && (
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 2, color: '#B0B0B0' }}>
              Showing {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, data.total)} of {data.total} games
            </Typography>
          )}
        </>
      ) : (
        <Typography variant='body1' color='text.secondary' sx={{ textAlign: 'center', py: 4 }}>
          No games found.
        </Typography>
      )}
    </Container>
  );
}

