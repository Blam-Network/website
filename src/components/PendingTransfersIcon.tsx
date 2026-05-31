"use client";

import {
  Badge,
  Button,
  IconButton,
  Popover,
  Typography,
  Box,
  Stack,
  Divider,
} from "@mui/material";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/src/trpc/client";
import { DateTimeDisplay } from "./DateTimeDisplay";
import { GamertagLink, isLinkableGamertag } from "./Gamertag";
import Link from "next/link";
import { FileshareFiletypeIcon } from "./FileshareFiletypeIcon";
import { GameIcon } from "./GameIcon";
import { LoadingSpinner } from "./LoadingSpinner";
import {
  halo3FiletypeShowsMapImage,
  reachFiletypeShowsMapImage,
} from "@/src/constants/fileshareIcons";
import type { PendingTransfer } from "@/src/api/halo3/pendingTransfers";
import type { OdstPendingTransfer } from "@/src/api/odst/pendingTransfers";
import type { ReachPendingTransfer } from "@/src/api/reach/pendingTransfers";
import { useSession } from "next-auth/react";

type TransferGame = "halo3" | "odst" | "reach";

type TransferRow =
  | ({ game: "halo3" } & PendingTransfer)
  | ({ game: "odst" } & OdstPendingTransfer)
  | ({ game: "reach" } & ReachPendingTransfer);

function isScreenshotTransfer(game: TransferGame, fileType: number): boolean {
  if (game === "reach") return fileType === 2;
  return fileType === 13;
}

export const PendingTransfersIcon = () => {
  const { data: session } = useSession();
  const loggedIn = !!session?.user?.xuid;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const queryClient = useQueryClient();

  const h3Query = useQuery({
    queryKey: ["halo3PendingTransfers"],
    queryFn: () => api.sunrise2.pendingTransfers.query(),
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
    enabled: loggedIn,
  });

  const reachQuery = useQuery({
    queryKey: ["reachPendingTransfers"],
    queryFn: () => api.reach.pendingTransfers.query(),
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
    enabled: loggedIn,
  });

  const odstQuery = useQuery({
    queryKey: ["odstPendingTransfers"],
    queryFn: () => api.odst.pendingTransfers.query(),
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
    enabled: loggedIn,
  });

  const h3Transfers = h3Query.data?.transfers ?? [];
  const reachTransfers = reachQuery.data?.transfers ?? [];
  const odstTransfers = odstQuery.data?.transfers ?? [];
  const rows: TransferRow[] = [
    ...h3Transfers.map((t: PendingTransfer) => ({ ...t, game: "halo3" as const })),
    ...odstTransfers.map((t: OdstPendingTransfer) => ({ ...t, game: "odst" as const })),
    ...reachTransfers.map((t: ReachPendingTransfer) => ({ ...t, game: "reach" as const })),
  ];

  const deleteH3 = useMutation({
    mutationFn: (fileId: string) => api.sunrise2.deleteFileshareTransfer.mutate({ fileId }),
    onSuccess: () => invalidateTransferQueries(),
    onError: (error: unknown) => {
      console.error("Failed to delete transfer:", error);
      alert(`Failed to cancel transfer: ${error instanceof Error ? error.message : "Unknown error"}`);
    },
  });

  const deleteReach = useMutation({
    mutationFn: (fileId: string) => api.reach.deleteFileshareTransfer.mutate({ fileId }),
    onSuccess: () => invalidateTransferQueries(),
    onError: (error: unknown) => {
      console.error("Failed to delete Reach transfer:", error);
      alert(`Failed to cancel transfer: ${error instanceof Error ? error.message : "Unknown error"}`);
    },
  });

  const deleteOdst = useMutation({
    mutationFn: (fileId: string) => api.odst.deleteFileshareTransfer.mutate({ fileId }),
    onSuccess: () => invalidateTransferQueries(),
    onError: (error: unknown) => {
      console.error("Failed to delete ODST transfer:", error);
      alert(`Failed to cancel transfer: ${error instanceof Error ? error.message : "Unknown error"}`);
    },
  });

  function invalidateTransferQueries() {
    queryClient.invalidateQueries({ queryKey: ["halo3PendingTransfers"] });
    queryClient.invalidateQueries({ queryKey: ["pendingTransfers"] });
    queryClient.invalidateQueries({ queryKey: ["reachPendingTransfers"] });
    queryClient.invalidateQueries({ queryKey: ["odstPendingTransfers"] });
    queryClient.invalidateQueries({
      predicate: (query) => {
        const key = JSON.stringify(query.queryKey);
        return key.includes("pendingTransfers") || key.includes("fileShare");
      },
    });
  }

  const isLoading = h3Query.isLoading || reachQuery.isLoading || odstQuery.isLoading;
  const hasPendingTransfers = rows.length > 0;
  const isDeleting = deleteH3.isPending || deleteReach.isPending || deleteOdst.isPending;

  const handleDelete = async (row: TransferRow) => {
    const confirmed = window.confirm(`Cancel transfer for "${row.fileName || "Untitled"}"?`);
    if (!confirmed) return;

    const isLast = rows.length === 1;
    try {
      if (row.game === "reach") {
        await deleteReach.mutateAsync(row.fileId);
      } else if (row.game === "odst") {
        await deleteOdst.mutateAsync(row.fileId);
      } else {
        await deleteH3.mutateAsync(row.fileId);
      }
      const [h3Refetch, odstRefetch, reachRefetch] = await Promise.all([
        h3Query.refetch(),
        odstQuery.refetch(),
        reachQuery.refetch(),
      ]);
      const nextTotal =
        (h3Refetch.data?.transfers.length ?? 0) +
        (odstRefetch.data?.transfers.length ?? 0) +
        (reachRefetch.data?.transfers.length ?? 0);
      if (isLast || nextTotal === 0) {
        handleClose();
      }
    } catch {
      /* onError handles alert */
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  if (!loggedIn || !hasPendingTransfers) {
    return null;
  }

  return (
    <>
      <Badge
        badgeContent={rows.length}
        color="primary"
        overlap="rectangular"
        sx={{
          "& .MuiBadge-badge": {
            borderRadius: 0,
            fontWeight: 700,
            minWidth: 18,
            height: 18,
            fontSize: "0.65rem",
          },
        }}
      >
        <Button
          variant="outlined"
          size="small"
          onClick={handleClick}
          startIcon={<Image src="/img/download_icon.png" alt="" width={20} height={20} />}
          sx={{ whiteSpace: "nowrap" }}
        >
          Active Transfers
        </Button>
      </Badge>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: { xs: "min(100vw - 32px, 380px)", sm: 380 },
              maxHeight: 440,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            },
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: "1px solid",
            borderColor: "divider",
            position: "relative",
            flexShrink: 0,
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -1,
              left: 16,
              width: 40,
              height: 2,
              backgroundColor: "primary.main",
            },
          }}
        >
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
            <Typography variant="h6" sx={{ color: "text.primary", lineHeight: 1.2 }}>
              Active transfers
            </Typography>
            <IconButton size="small" onClick={handleClose} aria-label="Close transfers">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, lineHeight: 1.4, pr: 1 }}>
            These files will be transferred to your Xbox 360 console next time you play Halo
          </Typography>
        </Box>

        <Box sx={{ overflow: "auto", flex: 1 }}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <LoadingSpinner size={48} />
            </Box>
          ) : rows.length > 0 ? (
            rows.map((transfer, index) => {
              const ft = transfer.fileType ?? 0;
              const game = transfer.game;
              const isReach = game === "reach";
              const isScreenshot = isScreenshotTransfer(game, ft);
              const fileDate =
                transfer.fileDate instanceof Date
                  ? transfer.fileDate
                  : transfer.fileDate
                    ? new Date(transfer.fileDate)
                    : null;

              const title = transfer.fileName || "Untitled";
              const titleNode =
                isReach || !transfer.fileAuthor || !isLinkableGamertag(transfer.fileAuthor) ? (
                  <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.25 }}>
                    {title}
                  </Typography>
                ) : (
                  <Link
                    href={`/halo3/player/${encodeURIComponent(transfer.fileAuthor)}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                    onClick={handleClose}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        lineHeight: 1.25,
                        "&:hover": { color: "secondary.main" },
                      }}
                    >
                      {title}
                    </Typography>
                  </Link>
                );

              const fileShareGame = game === "reach" ? "reach" : game === "odst" ? "odst" : "halo3";
              const mapId =
                isReach && reachFiletypeShowsMapImage(ft)
                  ? (transfer as Extract<TransferRow, { game: "reach" }>).mapId ?? undefined
                  : !isReach && halo3FiletypeShowsMapImage(ft)
                    ? transfer.mapId ?? undefined
                    : undefined;

              return (
                <Box key={`${transfer.game}-${transfer.fileId}`}>
                  {index > 0 && <Divider />}
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{
                      px: 2,
                      py: 1.25,
                      transition: "background-color 0.15s ease",
                      "&:hover": { backgroundColor: "rgba(124, 179, 66, 0.06)" },
                    }}
                  >
                    <GameIcon game={fileShareGame} size={18} />
                    <Box
                      sx={{
                        flexShrink: 0,
                        width: 96,
                        height: 54,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box sx={{ width: "90%", maxWidth: 88 }}>
                        <FileshareFiletypeIcon
                          fileShareGame={fileShareGame}
                          filetype={ft}
                          size="100%"
                          shareId={isScreenshot ? transfer.shareId : undefined}
                          slot={!isReach && isScreenshot ? transfer.slot : undefined}
                          fileId={isScreenshot ? transfer.fileId : undefined}
                          filename={isScreenshot ? transfer.fileName || undefined : undefined}
                          description={isScreenshot ? transfer.fileDescription || undefined : undefined}
                          author={isScreenshot ? transfer.fileAuthor || undefined : undefined}
                          mapId={mapId}
                          iconIndex={
                            isReach
                              ? (transfer as Extract<TransferRow, { game: "reach" }>).iconIndex ?? undefined
                              : undefined
                          }
                          gameEngineType={transfer.gameEngineType ?? undefined}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      {titleNode}
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.3 }}>
                        {transfer.fileAuthor ? (
                          <>
                            by{" "}
                            <GamertagLink
                              gamertag={transfer.fileAuthor}
                              variant="caption"
                              underline="hover"
                              sx={{ display: "inline" }}
                            />
                          </>
                        ) : (
                          "Unknown author"
                        )}
                      </Typography>
                      {fileDate && !Number.isNaN(fileDate.getTime()) && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.3 }}>
                          <DateTimeDisplay date={fileDate} formatString="MMM d, yyyy" />
                        </Typography>
                      )}
                    </Box>

                    <IconButton
                      size="small"
                      aria-label={`Cancel transfer for ${title}`}
                      onClick={() => void handleDelete(transfer)}
                      disabled={isDeleting}
                      sx={{
                        flexShrink: 0,
                        color: "text.secondary",
                        "&:hover": {
                          color: "error.main",
                          backgroundColor: "rgba(239, 83, 80, 0.1)",
                        },
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Box>
              );
            })
          ) : (
            <Box sx={{ px: 2, py: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                No active transfers
              </Typography>
            </Box>
          )}
        </Box>
      </Popover>
    </>
  );
};
