"use client";

import { Typography, Box, Stack } from "@mui/material";
import Image from "next/image";
import { api } from "../trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useSession } from "next-auth/react";
import type { PendingTransfer } from "@/src/api/halo3/pendingTransfers";
import type { OdstPendingTransfer } from "@/src/api/odst/pendingTransfers";
import type { ReachPendingTransfer } from "@/src/api/reach/pendingTransfers";

export type FileshareDownloadGame = "halo3" | "reach" | "odst";

export const FileshareDownloadButton = ({
  fileId,
  game = "halo3",
  compact = false,
}: {
  fileId: string;
  game?: FileshareDownloadGame;
  /** Shorter label for tight layouts (e.g. file grid cards). */
  compact?: boolean;
}) => {
  const { data: session } = useSession();
  const loggedIn = !!session?.user?.xuid;
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const pendingKey =
    game === "reach"
      ? (["reachPendingTransfers"] as const)
      : game === "odst"
        ? (["odstPendingTransfers"] as const)
        : (["pendingTransfers"] as const);

  const { data: pendingTransfersData } = useQuery({
    queryKey: pendingKey,
    queryFn: () =>
      game === "reach"
        ? api.reach.pendingTransfers.query()
        : game === "odst"
          ? api.odst.pendingTransfers.query()
          : api.sunrise2.pendingTransfers.query(),
    refetchOnWindowFocus: true,
    enabled: loggedIn,
  });

  const pendingTransfers = pendingTransfersData?.transfers ?? [];
  const maxTransfers = pendingTransfersData?.maxTransfers ?? 8;

  const isPending = pendingTransfers.some((t: PendingTransfer | ReachPendingTransfer | OdstPendingTransfer) => t.fileId === fileId);
  const isAtCapacity = pendingTransfers.length >= maxTransfers;

  const mutation = useMutation({
    mutationFn: async () => {
      if (game === "reach") {
        await api.reach.createFileshareTransfer.mutate({ fileId });
      } else if (game === "odst") {
        await api.odst.createFileshareTransfer.mutate({ fileId });
      } else {
        await api.sunrise2.createFileshareTransfer.mutate({ fileId });
      }
    },
    onSuccess: () => {
      setSuccess(true);
      setError(null);
      setTimeout(() => setSuccess(false), 3000);
      queryClient.invalidateQueries({ queryKey: ["pendingTransfers"] });
      queryClient.invalidateQueries({ queryKey: ["reachPendingTransfers"] });
      queryClient.invalidateQueries({ queryKey: ["odstPendingTransfers"] });
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = JSON.stringify(query.queryKey);
          return key.includes("pendingTransfers") || key.includes("fileShare");
        },
      });
    },
    onError: (err: unknown) => {
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: string }).message)
          : "Failed to create transfer";
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    },
  });

  const gameTitle = game === "reach" ? "Halo: Reach" : game === "odst" ? "Halo 3: ODST" : "Halo 3";
  const downloadLabel = compact
    ? "Download"
    : game === "reach"
      ? "Download to Halo: Reach"
      : game === "odst"
        ? "Download to Halo 3: ODST"
        : "Download to Halo 3";
  const downloadTitle = compact ? downloadLabel.replace(/^Download$/, `Download to ${gameTitle}`) : undefined;

  if (error) {
    return (
      <Box>
        <Typography variant="body2" color="error.main" sx={{ mb: 0.5 }}>
          {error}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Please complete or cancel existing transfers in-game before adding new ones.
        </Typography>
      </Box>
    );
  }

  if (success) {
    return <Typography variant="body2" color="success.main">Transfer created!</Typography>;
  }

  if (isPending) {
    return (
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.5}
        sx={{
          opacity: 0.5,
          cursor: "not-allowed",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Pending…
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Image src="/img/download_icon.png" alt="" width={14} height={14} style={{ opacity: 0.5 }} />
        </Box>
      </Stack>
    );
  }

  if (!loggedIn) {
    return null;
  }

  const handleClick = () => {
    if (isAtCapacity && !isPending) {
      alert(
        `Maximum transfers reached (${pendingTransfers.length}/${maxTransfers})\n\nPlease complete Active Transfers by playing ${gameTitle} on your Xbox 360 Console or cancel existing transfers before adding new ones.`,
      );
      return;
    }
    mutation.mutate();
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.5}
      title={downloadTitle}
      sx={{
        cursor: isAtCapacity && !isPending ? "not-allowed" : "pointer",
        opacity: isAtCapacity && !isPending ? 0.6 : 1,
        whiteSpace: "nowrap",
        flexShrink: 0,
        "&:hover .download-text": { color: isAtCapacity && !isPending ? "inherit" : "primary.main" },
      }}
      onClick={handleClick}
    >
      <Typography
        variant="caption"
        className="download-text"
        sx={{ textDecoration: "underline", fontWeight: 600 }}
      >
        {mutation.isPending ? "Sending…" : downloadLabel}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        <Image src="/img/download_icon.png" alt="" width={14} height={14} />
      </Box>
    </Stack>
  );
};
