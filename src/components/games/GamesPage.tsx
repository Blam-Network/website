"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Box, Button, Container, Pagination, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { api } from "@/src/trpc/client";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { SectionHeader } from "@/src/components/SectionHeader";
import { GameIcon } from "@/src/components/GameIcon";
import { RecentGamesTable } from "@/src/components/RecentGamesTable";
import { ReachGamesTable } from "@/src/components/reach/games/ReachGamesTable";
import type { ReachGameModeFilter } from "@/src/constants/reach/reachGameData";

const GAMES_BASE_PATH = "/games";
const PAGE_SIZE = 48;

const GAMES = [
  { value: "halo3" as const, label: "Halo 3" },
  { value: "reach" as const, label: "Halo: Reach" },
];

type GamesGame = (typeof GAMES)[number]["value"];
type ReachModeTab = ReachGameModeFilter | "all";

const REACH_MODE_TABS: { value: ReachModeTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "matchmaking", label: "Matchmaking" },
  { value: "custom", label: "Custom Games" },
  { value: "firefight", label: "Firefight" },
  { value: "campaign", label: "Campaign" },
  { value: "forge", label: "Forge" },
];

interface GamesQuery {
  game: GamesGame;
  page: number;
  gamertag: string;
  mode: ReachModeTab;
}

function readQuery(): GamesQuery {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");
  return {
    game: params.get("game") === "reach" ? "reach" : "halo3",
    page: Math.max(1, parseInt(params.get("page") ?? "1", 10) || 1),
    gamertag: params.get("gamertag") ?? "",
    mode: REACH_MODE_TABS.some((tab) => tab.value === mode) ? (mode as ReachModeTab) : "all",
  };
}

export function GamesPage() {
  const router = useRouter();
  const [query, setQuery] = useState<GamesQuery | null>(null);
  const [gamertagInput, setGamertagInput] = useState("");

  useEffect(() => {
    const sync = () => {
      const next = readQuery();
      setQuery(next);
      setGamertagInput(next.gamertag);
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const current: GamesQuery = query ?? { game: "halo3", page: 1, gamertag: "", mode: "all" };

  const halo3 = useQuery({
    queryKey: ["games", "halo3", current.page, current.gamertag],
    enabled: query !== null && current.game === "halo3",
    queryFn: () =>
      api.sunrise2.games.query({ page: current.page, pageSize: PAGE_SIZE, gamertag: current.gamertag || undefined }),
  });

  const reach = useQuery({
    queryKey: ["games", "reach", current.page, current.gamertag, current.mode],
    enabled: query !== null && current.game === "reach",
    queryFn: () =>
      api.reach.games.query({
        page: current.page,
        pageSize: PAGE_SIZE,
        gamertag: current.gamertag || undefined,
        mode: current.mode === "all" ? undefined : current.mode,
      }),
  });

  const navigate = (next: GamesQuery) => {
    setQuery(next);
    const params = new URLSearchParams();
    if (next.game !== "halo3") params.set("game", next.game);
    if (next.page > 1) params.set("page", String(next.page));
    if (next.gamertag) params.set("gamertag", next.gamertag);
    if (next.game === "reach" && next.mode !== "all") params.set("mode", next.mode);
    const queryString = params.toString();
    router.push(`${GAMES_BASE_PATH}${queryString ? `?${queryString}` : ""}`);
  };

  const search = () => navigate({ ...current, page: 1, gamertag: gamertagInput.trim() });

  const active = current.game === "reach" ? reach : halo3;
  const total = active.data?.total ?? 0;
  const totalPages = active.data?.totalPages ?? 0;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <SectionHeader title="Games">
        {total > 0 && (
          <Typography variant="caption" color="text.secondary">
            {total.toLocaleString()} games
          </Typography>
        )}
      </SectionHeader>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3, justifyContent: "space-between" }}>
        <Stack direction="row" sx={{ flexWrap: "wrap" }}>
          {GAMES.map(({ value, label }, index) => (
            <Button
              key={value}
              variant={current.game === value ? "contained" : "outlined"}
              size="small"
              onClick={() => navigate({ ...current, game: value, page: 1, mode: "all" })}
              sx={{ borderRadius: 0, ...(index > 0 && { ml: "-1px" }) }}
            >
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <GameIcon game={value} size={16} aria-hidden />
                <span>{label}</span>
              </Stack>
            </Button>
          ))}
        </Stack>
        <Stack direction="row" spacing={1}>
          <TextField
            size="small"
            placeholder="Gamertag"
            value={gamertagInput}
            onChange={(event) => setGamertagInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") search();
            }}
          />
          <Button variant="contained" size="small" onClick={search}>
            Search
          </Button>
        </Stack>
      </Stack>

      {current.game === "reach" && (
        <Tabs
          value={current.mode}
          onChange={(_, mode: ReachModeTab) => navigate({ ...current, page: 1, mode })}
          variant="scrollable"
          allowScrollButtonsMobile
          sx={{ mb: 2 }}
        >
          {REACH_MODE_TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>
      )}

      {active.isLoading || query === null ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <LoadingSpinner size={96} />
        </Box>
      ) : current.game === "reach" && reach.data && reach.data.data.length > 0 ? (
        <ReachGamesTable games={reach.data.data} showPlayerResult={Boolean(current.gamertag)} />
      ) : current.game === "halo3" && halo3.data && halo3.data.data.length > 0 ? (
        <RecentGamesTable games={halo3.data.data} routeBase="/halo3" />
      ) : (
        <Typography variant="body1" color="text.secondary" sx={{ py: 6, textAlign: "center" }}>
          No games found.
        </Typography>
      )}

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={current.page}
            onChange={(_, page) => navigate({ ...current, page })}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
}
