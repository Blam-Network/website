"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/src/trpc/client";
import { Box, Typography, Container, Paper, Pagination, CircularProgress, Stack, TextField, Button } from "@mui/material";
import Link from "next/link";
import { format } from "date-fns";
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
          <Stack gap={1.5} sx={{ width: '100%', mb: 4 }}>
            {data.data.map((game: RecentGame) => (
              <Paper
                key={game.id}
                elevation={4}
                sx={{
                  p: 2,
                  background: 'linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)',
                  border: '1px solid #333',
                  '&:hover': {
                    borderColor: '#7CB342',
                    boxShadow: '0 0 10px rgba(124, 179, 66, 0.2)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Stack direction='row' justifyContent='space-between' alignItems='center' gap={2}>
                  <Link href={`/halo3/carnage-report/${game.id}`} style={{ textDecoration: 'none', color: 'unset', flex: 1 }}>
                    <Typography variant='body1' sx={{ display: 'inline', fontWeight: 600, color: '#9CCC65' }}>
                      {game.map_variant_name}
                    </Typography>
                    <Typography variant='body2' color='text.secondary' sx={{ display: 'inline', ml: 1 }}>
                      • {game.hopper_name ?? 'Custom Games'} • {format(game.finish_time, "MMM d, yyyy 'at' h:mm a")}
                    </Typography>
                  </Link>
                  <Link href={`/halo3/carnage-report/${game.id}`}>
                    <Typography 
                      variant='body2' 
                      sx={{ 
                        textDecoration: 'underline',
                        color: '#4A90E2',
                        '&:hover': { color: '#6BA3E8' },
                      }}
                    >
                      View Report
                    </Typography>
                  </Link>
                </Stack>
              </Paper>
            ))}
          </Stack>
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

