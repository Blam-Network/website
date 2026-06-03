"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Stack,
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Paper,
  Pagination,
} from "@mui/material";
import { api } from "@/src/trpc/client";
import { ServiceRecordListItem } from "@/src/components/ServiceRecordListItem";
import { ReachServiceRecordListItem } from "@/src/components/reach/ReachServiceRecordListItem";
import { SectionHeader } from "@/src/components/SectionHeader";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { PlayersPageFilters } from "@/src/components/players/PlayersPageFilters";
import {
  getPlayersGameLabel,
  isReachPlayersGame,
  parsePlayersGame,
  PLAYERS_BASE_PATH,
  playersGameToFilesGame,
  type PlayersGame,
} from "@/src/components/players/playersPageTypes";
import { playerProfilePathForGame } from "@/src/components/Gamertag";
import type { ServiceRecord } from "@/src/api/halo3/serviceRecord";
import type { ReachServiceRecord } from "@/src/api/reach/serviceRecord";

interface PlayersPageProps {
  defaultGame?: PlayersGame;
}

export function PlayersPage({ defaultGame = "halo3" }: PlayersPageProps) {
  const router = useRouter();
  const [query, setQuery] = useState<Record<string, string>>({});
  const page = parseInt(query.page || "1", 10);
  const game = parsePlayersGame(query.game || defaultGame);
  const search = query.search || "";
  const [searchInput, setSearchInput] = useState(search);
  const pageSize = 20;
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    if (!params.has("game")) {
      params.set("game", defaultGame);
      const queryObj: Record<string, string> = {};
      params.forEach((value, key) => {
        queryObj[key] = value;
      });
      setQuery(queryObj);
      router.replace(`${PLAYERS_BASE_PATH}?${params.toString()}`);
      return;
    }

    const queryObj: Record<string, string> = {};
    params.forEach((value, key) => {
      queryObj[key] = value;
    });
    setQuery(queryObj);
    setSearchInput(queryObj.search || "");
  }, [defaultGame, router]);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const queryObj: Record<string, string> = {};
      params.forEach((value, key) => {
        queryObj[key] = value;
      });
      setQuery(queryObj);
      setSearchInput(queryObj.search || "");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["serviceRecords", game, page, pageSize, search],
    queryFn: () => {
      const input = {
        page,
        pageSize,
        search: search || undefined,
      };
      return isReachPlayersGame(game)
        ? api.reach.serviceRecords.query(input)
        : api.sunrise.serviceRecords.query(input);
    },
  });

  const updateURL = (newPage: number, newSearch: string, newGame: PlayersGame) => {
    const newQuery: Record<string, string> = { game: newGame };
    if (newPage > 1) newQuery.page = String(newPage);
    if (newSearch) newQuery.search = newSearch;
    setQuery(newQuery);

    const params = new URLSearchParams();
    Object.entries(newQuery).forEach(([key, value]) => {
      params.set(key, value);
    });
    router.push(`${PLAYERS_BASE_PATH}?${params.toString()}`);
  };

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      updateURL(1, value, game);
    }, 500);
  };

  const handleSearch = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    updateURL(1, searchInput, game);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      updateURL(1, searchInput, game);
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    updateURL(value, search, game);
  };

  const handleGameChange = (newGame: PlayersGame) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setSearchInput("");
    updateURL(1, "", newGame);
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const gameLabel = getPlayersGameLabel(game);
  const profileGame = playersGameToFilesGame(game);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <SectionHeader title={`${gameLabel} Players`}>
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          <TextField
            label="Search by name"
            variant="outlined"
            value={searchInput}
            onChange={(e) => handleSearchInputChange(e.target.value)}
            onKeyDown={handleKeyPress}
            size="small"
            sx={{ width: 250 }}
          />
          <Button variant="contained" onClick={handleSearch} size="small">
            Search
          </Button>
          {search ? (
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setSearchInput("");
                updateURL(1, "", game);
              }}
            >
              Clear
            </Button>
          ) : null}
        </Box>
      </SectionHeader>

      <PlayersPageFilters game={game} onGameChange={handleGameChange} />

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <LoadingSpinner size={96} />
        </Box>
      ) : data && data.players.length > 0 ? (
        <>
          <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
            Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, data.total)} of{" "}
            {data.total} players
          </Typography>
          <Stack spacing={2}>
            {data.players.map((serviceRecord: ServiceRecord | ReachServiceRecord) => (
              <Link
                key={serviceRecord.id}
                href={playerProfilePathForGame(serviceRecord.playerName, profileGame)}
                style={{
                  textDecoration: "none",
                  color: "unset",
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 0 10px rgba(124, 179, 66, 0.2)",
                      borderColor: "primary.main",
                    },
                    border: "1px solid transparent",
                  }}
                >
                  {isReachPlayersGame(game) ? (
                    <ReachServiceRecordListItem
                      serviceRecord={serviceRecord as ReachServiceRecord}
                    />
                  ) : (
                    <ServiceRecordListItem serviceRecord={serviceRecord as ServiceRecord} />
                  )}
                </Paper>
              </Link>
            ))}
          </Stack>
          {data.totalPages > 1 ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={data.totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          ) : null}
        </>
      ) : (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            {search ? "No players found matching your search." : "No players found."}
          </Typography>
        </Paper>
      )}
    </Container>
  );
}
