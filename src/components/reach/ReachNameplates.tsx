"use client";

import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, Stack, Typography, Tooltip, CircularProgress } from "@mui/material";
import { api } from "@/src/trpc/client";
import { useToast } from "@/src/contexts/ToastContext";
import {
  getReachNameplateDefinition,
  isReachNameplateVisibleInPicker,
  REACH_NAMEPLATE_GRID_COLUMN_COUNT,
  REACH_NAMEPLATE_ROW_LAYOUT,
} from "@/src/constants/reachNameplates";
import type {
  ReachNameplateEquipId,
  ReachNameplatesResponse,
} from "@/src/api/reach/reachNameplateTypes";

interface ReachNameplatesProps {
  profileGamertag?: string;
}

interface NameplateTileProps {
  nameplateId: ReachNameplateEquipId;
  unlocked: boolean;
  selected: boolean;
  equipPending: boolean;
  onEquip: (id: ReachNameplateEquipId) => void;
}

function NameplateTile({
  nameplateId,
  unlocked,
  selected,
  equipPending,
  onEquip,
}: NameplateTileProps) {
  const nameplate = getReachNameplateDefinition(nameplateId);

  return (
    <Tooltip
      title={unlocked ? nameplate.description : nameplate.unlockHint}
      arrow
    >
      <Stack
        component="button"
        type="button"
        direction="column"
        alignItems="center"
        gap={0.75}
        onClick={() => {
          if (unlocked && !equipPending) {
            onEquip(nameplateId);
          }
        }}
        disabled={!unlocked || equipPending}
        sx={{
          boxSizing: "border-box",
          width: "100%",
          minWidth: 0,
          border: "2px solid",
          borderColor: selected ? "primary.main" : "transparent",
          background: "transparent",
          cursor: unlocked ? "pointer" : "default",
          p: 0.5,
          borderRadius: 1,
          opacity: unlocked ? 1 : 0.55,
          transition: "border-color 0.15s ease, transform 0.2s ease",
          "&:hover": unlocked
            ? {
                ...(!selected && { transform: "translateY(-2px)" }),
                "& img": {
                  filter: "drop-shadow(0 0 8px rgba(124, 179, 66, 0.55)) saturate(1)",
                },
              }
            : {
                "& img": { filter: "saturate(0)" },
              },
        }}
      >
        <Box
          sx={{
            transform: !unlocked ? "rotate(-8deg)" : "none",
            transition: "transform 0.25s ease",
          }}
        >
          <Box
            component="img"
            src={nameplate.imageSrc}
            alt={nameplate.label}
            sx={{
              display: "block",
              width: "100%",
              maxWidth: 120,
              height: 32,
              objectFit: "contain",
              filter: unlocked
                ? "drop-shadow(0 0 6px rgba(124, 179, 66, 0.35))"
                : "saturate(0) brightness(0.7)",
              transition: "filter 0.25s ease",
            }}
          />
        </Box>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {nameplate.shortLabel}
        </Typography>
        <Typography
          variant="caption"
          aria-hidden={!selected}
          sx={{
            color: "primary.main",
            fontWeight: 700,
            lineHeight: 1.25,
            minHeight: "1.25em",
            visibility: selected ? "visible" : "hidden",
          }}
        >
          Equipped
        </Typography>
      </Stack>
    </Tooltip>
  );
}

/** MUI spacing 1.5 → 12px; keep in sync with row `gap`. */
const NAMEPLATE_ROW_GAP_PX = 12;

function nameplateSlotFlexBasis() {
  const gaps = (REACH_NAMEPLATE_GRID_COLUMN_COUNT - 1) * NAMEPLATE_ROW_GAP_PX;
  return `calc((100% - ${gaps}px) / ${REACH_NAMEPLATE_GRID_COLUMN_COUNT})`;
}

const nameplateSlotSx = {
  flex: `0 0 ${nameplateSlotFlexBasis()}`,
  minWidth: 0,
  maxWidth: 120,
};

function NameplateFlexRow({
  nameplateIds,
  data,
  equipPending,
  onEquip,
}: {
  nameplateIds: ReachNameplateEquipId[];
  data: ReachNameplatesResponse;
  equipPending: boolean;
  onEquip: (id: ReachNameplateEquipId) => void;
}) {
  const visibleIds = nameplateIds.filter((id) =>
    isReachNameplateVisibleInPicker(id, data.unlocks),
  );

  if (visibleIds.length === 0) {
    return null;
  }

  return (
    <Stack
      direction="row"
      useFlexGap
      gap={1.5}
      justifyContent="center"
      sx={{ width: "100%", maxWidth: 900, mx: "auto" }}
    >
      {visibleIds.map((id) => (
        <Box key={id} sx={nameplateSlotSx}>
          <NameplateTile
            nameplateId={id}
            unlocked={id !== "none" && (data.unlocks[id] ?? false)}
            selected={data.selectedNameplate === id}
            equipPending={equipPending}
            onEquip={onEquip}
          />
        </Box>
      ))}
    </Stack>
  );
}

function NameplateGrid({
  data,
  equipPending,
  onEquip,
}: {
  data: ReachNameplatesResponse;
  equipPending: boolean;
  onEquip: (id: ReachNameplateEquipId) => void;
}) {
  return (
    <Stack direction="column" gap={2} sx={{ width: "100%", py: 0.5 }}>
      <NameplateFlexRow
        nameplateIds={REACH_NAMEPLATE_ROW_LAYOUT.top}
        data={data}
        equipPending={equipPending}
        onEquip={onEquip}
      />
      <NameplateFlexRow
        nameplateIds={REACH_NAMEPLATE_ROW_LAYOUT.bottom}
        data={data}
        equipPending={equipPending}
        onEquip={onEquip}
      />
    </Stack>
  );
}

export function ReachNameplates({ profileGamertag }: ReachNameplatesProps) {
  const { data: session } = useSession();
  const loggedIn = !!session?.user?.xuid;
  const isOwnProfile = loggedIn && session?.user?.gamertag === profileGamertag;
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["reachNameplates"],
    queryFn: () => api.reach.getNameplates.query(),
    enabled: loggedIn && isOwnProfile,
  });

  const equipMutation = useMutation({
    mutationFn: (nameplateId: ReachNameplateEquipId) =>
      api.reach.setReachNameplate.mutate({ nameplateId }),
    onSuccess: (_data, nameplateId) => {
      queryClient.setQueryData(
        ["reachNameplates"],
        (prev: typeof data) =>
          prev ? { ...prev, selectedNameplate: nameplateId } : prev,
      );
      void queryClient.invalidateQueries({ queryKey: ["reachNameplates"] });
      showSuccess(
        "Your nameplate will appear next time you play Halo: Reach on your Xbox 360.",
        "Nameplate equipped",
      );
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error && err.message ? err.message : "Failed to equip nameplate";
      showError(message, "Equip failed");
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
          Nameplates
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", textAlign: "center", maxWidth: 560, mb: 1 }}
        >
          Unlock and equip Halo: Reach nameplates.
        </Typography>

        {isLoading ? (
          <CircularProgress size={32} />
        ) : isError ? (
          <Typography variant="body2" color="error">
            Unable to load nameplates. Make sure you are signed in with Xbox Live.
          </Typography>
        ) : data ? (
          <NameplateGrid
            data={data}
            equipPending={equipMutation.isPending}
            onEquip={(id) => equipMutation.mutate(id)}
          />
        ) : null}
      </Stack>
    </Box>
  );
}
