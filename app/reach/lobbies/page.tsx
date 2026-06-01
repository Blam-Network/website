"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { api } from "@/src/trpc/client";
import { SectionHeader } from "@/src/components/SectionHeader";
import { GameIcon } from "@/src/components/GameIcon";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import {
  ReachLobbyPlayerRow,
  sessionUsesTeamColors,
} from "@/src/components/reach/ReachLobbyPlayerRow";
import type { ReachLobby } from "@/src/api/reach/lobbiesSchema";
import { BARLOW_FAMILY, fixedsysSize, fixedsysStyle } from "@/src/theme/fonts";
import { formatReachGuiMode } from "@/src/constants/reachGuiModes";
import { formatReachSessionId } from "@/src/constants/reachSessionId";

/** Reach host roster slots in LSP heartbeat `session_players`. */
const REACH_SESSION_ROSTER_CAPACITY = 16;

/** Party-list width — narrow column, but wide enough for gamertags. */
const LOBBY_LIST_MAX_WIDTH = 28 * 16; // 28rem (448px)

function formatLobbyHeading(lobby: ReachLobby): string {
  const mode =
    lobby.guiGameMode != null
      ? formatReachGuiMode(lobby.guiGameMode)
      : "Unknown";

  if (lobby.hopperName) {
    return `${mode} — ${lobby.hopperName}`;
  }

  const hopperId = lobby.hopperId ?? 0;
  if (hopperId > 0) {
    return `${mode} — Hopper ${hopperId}`;
  }

  return mode;
}

function ReachLobbySection({ lobby }: { lobby: ReachLobby }) {
  const sessionIdLabel = lobby.sessionId
    ? formatReachSessionId(lobby.sessionId)
    : null;
  const useTeamColors = sessionUsesTeamColors(lobby.players);

  const sortedPlayers = [...lobby.players].sort((a, b) => {
    if (useTeamColors) {
      const teamA = a.team ?? Number.MAX_SAFE_INTEGER;
      const teamB = b.team ?? Number.MAX_SAFE_INTEGER;
      if (teamA !== teamB) {
        return teamA - teamB;
      }
    }
    const nameA = a.playerName ?? "";
    const nameB = b.playerName ?? "";
    return nameA.localeCompare(nameB);
  });

  const playerCount = sortedPlayers.length;

  return (
    <Box sx={{ maxWidth: LOBBY_LIST_MAX_WIDTH }}>
      {sessionIdLabel != null && (
        <Typography
          component="div"
          sx={{
            ...fixedsysStyle,
            fontSize: fixedsysSize(11),
            px: 1.5,
            pt: 1,
            pb: 0.5,
            color: "rgba(255, 255, 255, 0.5)",
          }}
        >
          Session {sessionIdLabel}
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          px: 1.5,
          py: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <Typography
          sx={{
            color: "#fff",
            fontWeight: 600,
            fontSize: "0.9375rem",
            fontFamily: BARLOW_FAMILY,
            lineHeight: 1.3,
            minWidth: 0,
            flex: 1,
          }}
        >
          {formatLobbyHeading(lobby)}
        </Typography>
        <Typography
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            fontWeight: 600,
            fontSize: "0.875rem",
            fontFamily: BARLOW_FAMILY,
            flexShrink: 0,
          }}
        >
          {playerCount}/{REACH_SESSION_ROSTER_CAPACITY}
        </Typography>
      </Box>

      <Stack spacing={0}>
        {sortedPlayers.map((player) => (
          <ReachLobbyPlayerRow
            key={player.xuid}
            player={player}
            useTeamColors={useTeamColors}
          />
        ))}
      </Stack>
    </Box>
  );
}

export default function ReachLobbiesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user?.is_admin) {
      router.push("/");
    }
  }, [session, status, router]);

  const { data, isLoading, isError, dataUpdatedAt } = useQuery({
    queryKey: ["reachLobbies"],
    queryFn: () => api.reach.lobbies.query(),
    refetchInterval: 10_000,
    staleTime: 5_000,
    enabled: status === "authenticated" && session?.user?.is_admin === true,
  });

  if (status === "loading" || !session?.user?.is_admin) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "50vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LoadingSpinner size={96} />
      </Box>
    );
  }

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString()
    : null;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <SectionHeader title="Live Lobbies">
        <Stack direction="row" spacing={1.5} alignItems="center">
          <GameIcon game="reach" size={24} aria-hidden />
          {data && (
            <Typography variant="body2" sx={{ color: "text.secondary", fontFamily: BARLOW_FAMILY }}>
              {data.totalPlayers} online
            </Typography>
          )}
          {lastUpdated && (
            <Typography variant="caption" sx={{ color: "text.secondary", fontFamily: BARLOW_FAMILY }}>
              Updated {lastUpdated}
            </Typography>
          )}
        </Stack>
      </SectionHeader>

      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary", fontFamily: BARLOW_FAMILY }}>
        Players grouped by session from LSP presence heartbeats. Names and colors come from stored
        service records when available.
      </Typography>

      {isLoading ? (
        <Typography sx={{ fontFamily: BARLOW_FAMILY }}>Loading lobbies…</Typography>
      ) : isError ? (
        <Paper sx={{ p: 3, textAlign: "center", maxWidth: LOBBY_LIST_MAX_WIDTH }}>
          <Typography sx={{ fontFamily: BARLOW_FAMILY }}>
            Could not load live lobbies. Try again shortly.
          </Typography>
        </Paper>
      ) : !data || data.lobbies.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center", maxWidth: LOBBY_LIST_MAX_WIDTH }}>
          <Typography variant="h6" sx={{ color: "text.secondary", fontFamily: BARLOW_FAMILY }}>
            No players online right now.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2.5} sx={{ maxWidth: LOBBY_LIST_MAX_WIDTH }}>
          {data.lobbies.map((lobby: ReachLobby) => (
            <ReachLobbySection
              key={lobby.sessionId ?? "no-session"}
              lobby={lobby}
            />
          ))}
        </Stack>
      )}
    </Container>
  );
}
