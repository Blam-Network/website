"use client";

import {
  Button,
  IconButton,
  Popover,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Paper,
} from "@mui/material";
import Image from "next/image";
import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/src/trpc/client";
import { DateTimeDisplay } from "./DateTimeDisplay";
import Link from "next/link";
import { FileshareFiletypeIcon } from "./FileshareFiletypeIcon";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import type { PendingTransfer } from "@/src/api/halo3/pendingTransfers";
import type { ReachPendingTransfer } from "@/src/api/reach/pendingTransfers";
import { useSession } from "next-auth/react";

type TransferRow =
  | ({ game: "halo3" } & PendingTransfer)
  | ({ game: "reach" } & ReachPendingTransfer);

export const PendingTransfersIcon = () => {
  const { data: session } = useSession();
  const loggedIn = !!session?.user?.xuid;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();

  const h3Query = useQuery({
    queryKey: ["pendingTransfers"],
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

  const h3Transfers = h3Query.data?.transfers ?? [];
  const reachTransfers = reachQuery.data?.transfers ?? [];
  const h3Max = h3Query.data?.maxTransfers ?? 8;
  const reachMax = reachQuery.data?.maxTransfers ?? 8;

  const rows: TransferRow[] = [
    ...h3Transfers.map((t) => ({ ...t, game: "halo3" as const })),
    ...reachTransfers.map((t) => ({ ...t, game: "reach" as const })),
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

  function invalidateTransferQueries() {
    queryClient.invalidateQueries({ queryKey: ["pendingTransfers"] });
    queryClient.invalidateQueries({ queryKey: ["reachPendingTransfers"] });
    queryClient.invalidateQueries({
      predicate: (query) => {
        const key = JSON.stringify(query.queryKey);
        return key.includes("pendingTransfers") || key.includes("fileShare");
      },
    });
  }

  const isLoading = h3Query.isLoading || reachQuery.isLoading;
  const hasPendingTransfers = rows.length > 0;

  const handleDelete = async (row: TransferRow) => {
    const confirmed = window.confirm(`Cancel transfer for "${row.fileName || "Untitled"}"?`);
    if (!confirmed) return;

    const isLast = rows.length === 1;
    try {
      if (row.game === "reach") {
        await deleteReach.mutateAsync(row.fileId);
      } else {
        await deleteH3.mutateAsync(row.fileId);
      }
      const [h3Refetch, reachRefetch] = await Promise.all([h3Query.refetch(), reachQuery.refetch()]);
      const nextTotal = (h3Refetch.data?.transfers.length ?? 0) + (reachRefetch.data?.transfers.length ?? 0);
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

  if (!loggedIn) {
    return null;
  }

  if (!hasPendingTransfers) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "fit-content" }}>
      <Button
        ref={buttonRef}
        onClick={handleClick}
        startIcon={<Image src="/img/download_icon.png" alt="Active Transfers" width={20} height={20} />}
        sx={{
          color: "#4A90E2",
          textTransform: "none",
          background: "linear-gradient(180deg, #2A2A2A 0%, #1A1A1A 100%)",
          border: "1px solid #4A90E2",
          "&:hover": {
            background: "linear-gradient(180deg, #3A3A3A 0%, #2A2A2A 100%)",
            borderColor: "#6BA3E8",
          },
        }}
      >
        Active Transfers
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Paper
          sx={{
            background: "linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)",
            border: "1px solid #333",
            minWidth: 300,
            maxWidth: 400,
            maxHeight: 400,
            overflow: "auto",
          }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid #333",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ color: "#7CB342", fontWeight: 700 }}>
                Active Transfers ({rows.length})
              </Typography>
              <Typography variant="caption" sx={{ color: "#888", display: "block" }}>
                Halo 3: {h3Transfers.length}/{h3Max} · Reach: {reachTransfers.length}/{reachMax}
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={handleClose}
              sx={{
                color: "#888",
                "&:hover": {
                  color: "#fff",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          {isLoading ? (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="body2" sx={{ color: "#B0B0B0" }}>
                Loading...
              </Typography>
            </Box>
          ) : rows.length > 0 ? (
            <List sx={{ p: 0 }}>
              {rows.map((transfer) => {
                const ft = transfer.fileType ?? 0;
                const isReach = transfer.game === "reach";
                const fileDate =
                  transfer.fileDate instanceof Date
                    ? transfer.fileDate
                    : transfer.fileDate
                      ? new Date(transfer.fileDate)
                      : null;

                const primaryLink =
                  isReach || !transfer.fileAuthor ? (
                    <Typography variant="body2" sx={{ color: "#E0E0E0", fontWeight: 600 }}>
                      {transfer.fileName || "Untitled"}
                    </Typography>
                  ) : (
                    <Link
                      href={`/halo3/player/${encodeURIComponent(transfer.fileAuthor)}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                      onClick={handleClose}
                    >
                      <Typography variant="body2" sx={{ color: "#E0E0E0", fontWeight: 600 }}>
                        {transfer.fileName || "Untitled"}
                      </Typography>
                    </Link>
                  );

                return (
                  <ListItem
                    key={`${transfer.game}-${transfer.fileId}`}
                    sx={{
                      borderBottom: "1px solid #333",
                      "&:hover": {
                        backgroundColor: "rgba(124, 179, 66, 0.1)",
                      },
                    }}
                  >
                    <ListItemAvatar sx={{ minWidth: 96, mr: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 80,
                          height: "100%",
                          minHeight: 80,
                        }}
                      >
                        <FileshareFiletypeIcon
                          fileShareGame={isReach ? "reach" : "halo3"}
                          filetype={ft}
                          size={80}
                          shareId={transfer.shareId}
                          slot={!isReach ? transfer.slot : undefined}
                          fileId={transfer.fileId}
                          filename={
                            (isReach && ft === 2) || (!isReach && ft === 13)
                              ? transfer.fileName || undefined
                              : undefined
                          }
                          description={
                            (isReach && ft === 2) || (!isReach && ft === 13)
                              ? transfer.fileDescription || undefined
                              : undefined
                          }
                          author={
                            (isReach && ft === 2) || (!isReach && ft === 13)
                              ? transfer.fileAuthor || undefined
                              : undefined
                          }
                          mapId={
                            isReach && (ft === 3 || ft === 4)
                              ? (transfer as Extract<TransferRow, { game: "reach" }>).mapId ?? undefined
                              : undefined
                          }
                          gameEngineType={transfer.gameEngineType ?? undefined}
                        />
                      </Box>
                    </ListItemAvatar>
                    <ListItemText
                      sx={{ flex: 1 }}
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          {primaryLink}
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{
                              color: isReach ? "#9CCC65" : "#64B5F6",
                              fontWeight: 600,
                              textTransform: "uppercase",
                            }}
                          >
                            {isReach ? "Reach" : "H3"}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" sx={{ color: "#B0B0B0", display: "block" }}>
                            by {transfer.fileAuthor || "Unknown"}
                          </Typography>
                          {fileDate && !Number.isNaN(fileDate.getTime()) && (
                            <Typography variant="caption" sx={{ color: "#888", display: "block" }}>
                              <DateTimeDisplay date={fileDate} formatString="MMM d, yyyy" />
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    <IconButton
                      size="small"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        void handleDelete(transfer);
                      }}
                      disabled={deleteH3.isPending || deleteReach.isPending}
                      sx={{
                        color: "#888",
                        "&:hover": {
                          color: "#ff4444",
                          backgroundColor: "rgba(255, 68, 68, 0.1)",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="body2" sx={{ color: "#B0B0B0" }}>
                No active transfers
              </Typography>
            </Box>
          )}
        </Paper>
      </Popover>
    </Box>
  );
};
