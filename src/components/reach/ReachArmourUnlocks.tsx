"use client";

import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, Stack, Typography, Tooltip, CircularProgress } from "@mui/material";
import { api } from "@/src/trpc/client";
import { useToast } from "@/src/contexts/ToastContext";
import {
  getReachArmourUnlockDefinition,
  REACH_ARMOUR_UNLOCK_GRID_COLUMN_COUNT,
  REACH_ARMOUR_UNLOCK_ROW_LAYOUT,
} from "@/src/constants/reachArmourUnlocks";
import type {
  ReachArmourUnlocksResponse,
  ReachUnlockableHelmetId,
} from "@/src/api/reach/reachArmourUnlockTypes";

interface ReachArmourUnlocksProps {
  profileGamertag?: string;
}

type ArmourTileState = "locked" | "ready" | "unlocked";

function getArmourTileState(
  helmetId: ReachUnlockableHelmetId,
  data: ReachArmourUnlocksResponse,
): ArmourTileState {
  if (data.unlocked[helmetId]) {
    return "unlocked";
  }
  if (data.eligible[helmetId]) {
    return "ready";
  }
  return "locked";
}

interface ArmourUnlockTileProps {
  helmetId: ReachUnlockableHelmetId;
  state: ArmourTileState;
  unlockPending: boolean;
  onUnlock: (id: ReachUnlockableHelmetId) => void;
}

function ArmourUnlockTile({
  helmetId,
  state,
  unlockPending,
  onUnlock,
}: ArmourUnlockTileProps) {
  const helmet = getReachArmourUnlockDefinition(helmetId);
  const isInteractive = state === "ready" && !unlockPending;

  const tooltip =
    state === "unlocked"
      ? helmet.description
      : state === "ready"
        ? helmet.unlockPrompt
        : helmet.unlockHint;

  const statusLabel =
    state === "unlocked" ? "Unlocked" : state === "ready" ? "Unlock" : "Locked";

  return (
    <Tooltip title={tooltip} arrow>
      <Stack
        component={isInteractive ? "button" : "div"}
        type={isInteractive ? "button" : undefined}
        direction="column"
        alignItems="center"
        gap={0.75}
        onClick={() => {
          if (isInteractive) {
            onUnlock(helmetId);
          }
        }}
        disabled={!isInteractive}
        sx={{
          boxSizing: "border-box",
          width: "100%",
          minWidth: 0,
          border: "2px solid",
          borderColor: state === "ready" ? "warning.main" : "transparent",
          background: "transparent",
          cursor: isInteractive ? "pointer" : "default",
          p: 0.5,
          borderRadius: 1,
          opacity: state === "locked" ? 0.55 : 1,
          transition: "border-color 0.15s ease, transform 0.2s ease",
          "&:hover": isInteractive
            ? {
                transform: "translateY(-2px)",
              }
            : undefined,
        }}
      >
        <Box
          sx={{
            transform: state === "locked" ? "rotate(-8deg)" : "none",
            transition: "transform 0.25s ease",
          }}
        >
          <Box
            component="img"
            src={helmet.imageSrc}
            alt={helmet.label}
            sx={{
              display: "block",
              width: "100%",
              maxWidth: 120,
              height: 72,
              objectFit: "contain",
              filter: state === "locked" ? "saturate(0) brightness(0.7)" : "none",
              transition: "filter 0.25s ease",
            }}
          />
        </Box>
        <Typography variant="caption" sx={{ color: "text.secondary", textAlign: "center" }}>
          {helmet.shortLabel}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color:
              state === "unlocked"
                ? "primary.main"
                : state === "ready"
                  ? "warning.main"
                  : "text.disabled",
            fontWeight: 700,
            lineHeight: 1.25,
            minHeight: "1.25em",
          }}
        >
          {unlockPending && state === "ready" ? "Unlocking..." : statusLabel}
        </Typography>
      </Stack>
    </Tooltip>
  );
}

const ARMOUR_ROW_GAP_PX = 12;

function armourSlotFlexBasis() {
  const gaps = (REACH_ARMOUR_UNLOCK_GRID_COLUMN_COUNT - 1) * ARMOUR_ROW_GAP_PX;
  return `calc((100% - ${gaps}px) / ${REACH_ARMOUR_UNLOCK_GRID_COLUMN_COUNT})`;
}

const armourSlotSx = {
  flex: `0 0 ${armourSlotFlexBasis()}`,
  minWidth: 0,
  maxWidth: 120,
};

function ArmourUnlockGrid({
  data,
  unlockPending,
  onUnlock,
}: {
  data: ReachArmourUnlocksResponse;
  unlockPending: boolean;
  onUnlock: (id: ReachUnlockableHelmetId) => void;
}) {
  return (
    <Stack
      direction="row"
      useFlexGap
      gap={1.5}
      justifyContent="center"
      sx={{ width: "100%", maxWidth: 900, mx: "auto", py: 0.5 }}
    >
      {REACH_ARMOUR_UNLOCK_ROW_LAYOUT.map((id) => (
        <Box key={id} sx={armourSlotSx}>
          <ArmourUnlockTile
            helmetId={id}
            state={getArmourTileState(id, data)}
            unlockPending={unlockPending}
            onUnlock={onUnlock}
          />
        </Box>
      ))}
    </Stack>
  );
}

export function ReachArmourUnlocks({ profileGamertag }: ReachArmourUnlocksProps) {
  const { data: session } = useSession();
  const loggedIn = !!session?.user?.xuid;
  const isOwnProfile = loggedIn && session?.user?.gamertag === profileGamertag;
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["reachArmourUnlocks"],
    queryFn: () => api.reach.getArmourUnlocks.query(),
    enabled: loggedIn && isOwnProfile,
  });

  const unlockMutation = useMutation({
    mutationFn: (helmetId: ReachUnlockableHelmetId) =>
      api.reach.unlockReachArmour.mutate({ helmetId }),
    onSuccess: (result) => {
      queryClient.setQueryData(["reachArmourUnlocks"], {
        eligible: result.eligible,
        unlocked: result.unlocked,
      });
      void queryClient.invalidateQueries({ queryKey: ["reachArmourUnlocks"] });
      showSuccess(
        "This helmet will be purchasable the next time you play Halo: Reach on your Xbox 360.",
        "Helmet unlocked",
      );
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error && err.message ? err.message : "Failed to unlock helmet";
      showError(message, "Unlock failed");
    },
  });

  if (!loggedIn || !isOwnProfile) {
    return null;
  }

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Stack direction="column" gap={2} alignItems="center">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Armour Unlocks
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", textAlign: "center", maxWidth: 640, mb: 1 }}
        >
          Meet the achievement requirements, then click a helmet to unlock it. Unlocked helmets
          become purchasable the next time you play Halo: Reach on your Xbox 360.
        </Typography>

        {isLoading ? (
          <CircularProgress size={32} />
        ) : isError ? (
          <Typography variant="body2" color="error">
            Unable to load armour unlocks. Make sure you are signed in with Xbox Live.
          </Typography>
        ) : data ? (
          <ArmourUnlockGrid
            data={data}
            unlockPending={unlockMutation.isPending}
            onUnlock={(id) => unlockMutation.mutate(id)}
          />
        ) : null}
      </Stack>
    </Box>
  );
}
