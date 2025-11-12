"use client";

import { Button, IconButton, Popover, Typography, Box, List, ListItem, ListItemText, ListItemAvatar, Paper } from "@mui/material";
import Image from "next/image";
import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/src/trpc/client";
import { format } from "date-fns";
import Link from "next/link";
import { FileshareFiletypeIcon } from "./FileshareFiletypeIcon";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import type { PendingTransfer } from "@/src/api/sunrise/pendingTransfers";

export const PendingTransfersIcon = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const queryClient = useQueryClient();

    const { data: pendingTransfersData, isLoading, refetch: refetchPendingTransfers } = useQuery({
        queryKey: ['pendingTransfers'],
        queryFn: () => api.sunrise2.pendingTransfers.query(),
        refetchInterval: 30000, // Refetch every 30 seconds
        refetchOnWindowFocus: true, // Refetch when window regains focus
    });

    const pendingTransfers = pendingTransfersData?.transfers ?? [];
    const maxTransfers = pendingTransfersData?.maxTransfers ?? 8;

    const deleteMutation = useMutation({
        mutationFn: (fileId: string) => api.sunrise2.deleteFileshareTransfer.mutate({ fileId }),
        onSuccess: () => {
            // Invalidate pending transfers query (used by FileshareDownloadButton)
            queryClient.invalidateQueries({ queryKey: ['pendingTransfers'] });
            // Also invalidate any queries that might contain fileshare data
            // This ensures the download button state updates correctly across all pages
            queryClient.invalidateQueries({ 
                predicate: (query) => {
                    const key = JSON.stringify(query.queryKey);
                    return key.includes('pendingTransfers') || key.includes('fileShare');
                }
            });
        },
        onError: (error: any) => {
            console.error('Failed to delete transfer:', error);
            alert(`Failed to cancel transfer: ${error.message || 'Unknown error'}`);
        },
    });

    const hasPendingTransfers = pendingTransfers.length > 0;

    const handleDelete = async (fileId: string, fileName: string | null) => {
            const confirmed = window.confirm(`Cancel transfer for "${fileName || 'Untitled'}"?`);
        if (confirmed) {
            // Check if this is the last transfer before deletion
            const isLastTransfer = pendingTransfers.length === 1;
            
            try {
                await deleteMutation.mutateAsync(fileId);
                
                // Refetch pending transfers to get updated count
                const result = await refetchPendingTransfers();
                const updatedTransfers = result.data?.transfers ?? [];
                
                // Close popover if this was the last transfer or if there are no more transfers
                if (isLastTransfer || updatedTransfers.length === 0) {
                    handleClose();
                }
            } catch (error) {
                // Error handling is done in the mutation's onError
            }
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    if (!hasPendingTransfers) {
        return null;
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: 'fit-content' }}>
            <Button
                ref={buttonRef}
                onClick={handleClick}
                startIcon={
                    <Image 
                        src="/img/download_icon.png" 
                        alt="Active Transfers" 
                        width={20} 
                        height={20}
                    />
                }
                sx={{
                    color: '#4A90E2',
                    textTransform: 'none',
                    background: 'linear-gradient(180deg, #2A2A2A 0%, #1A1A1A 100%)',
                    border: '1px solid #4A90E2',
                    '&:hover': {
                        background: 'linear-gradient(180deg, #3A3A3A 0%, #2A2A2A 100%)',
                        borderColor: '#6BA3E8',
                    },
                }}
            >
                Active Transfers
            </Button>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Paper
                    sx={{
                        background: 'linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)',
                        border: '1px solid #333',
                        minWidth: 300,
                        maxWidth: 400,
                        maxHeight: 400,
                        overflow: 'auto',
                    }}
                >
                    <Box sx={{ p: 2, borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ color: '#7CB342', fontWeight: 700 }}>
                            Active Transfers ({pendingTransfers.length}/{maxTransfers})
                        </Typography>
                        <IconButton
                            size="small"
                            onClick={handleClose}
                            sx={{
                                color: '#888',
                                '&:hover': {
                                    color: '#fff',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                            }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                    {isLoading ? (
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#B0B0B0' }}>
                                Loading...
                            </Typography>
                        </Box>
                    ) : pendingTransfers && pendingTransfers.length > 0 ? (
                        <List sx={{ p: 0 }}>
                            {pendingTransfers.map((transfer: PendingTransfer) => (
                                <ListItem
                                    key={transfer.fileId}
                                    sx={{
                                        borderBottom: '1px solid #333',
                                        '&:hover': {
                                            backgroundColor: 'rgba(124, 179, 66, 0.1)',
                                        },
                                    }}
                                >
                                    <ListItemAvatar sx={{ minWidth: 96, mr: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 80, height: '100%', minHeight: 80 }}>
                                            <FileshareFiletypeIcon
                                                filetype={transfer.fileType}
                                                size={80}
                                                shareId={transfer.shareId}
                                                slot={transfer.slot}
                                                fileId={transfer.fileId}
                                                filename={transfer.fileName || undefined}
                                                description={transfer.fileDescription || undefined}
                                                author={transfer.fileAuthor || undefined}
                                                gameEngineType={transfer.gameEngineType || undefined}
                                            />
                                        </Box>
                                    </ListItemAvatar>
                                    <ListItemText
                                        sx={{ flex: 1 }}
                                        primary={
                                            <Link
                                                href={`/player/${encodeURIComponent(transfer.fileAuthor || '')}`}
                                                style={{ textDecoration: 'none', color: 'inherit' }}
                                                onClick={handleClose}
                                            >
                                                <Typography variant="body2" sx={{ color: '#E0E0E0', fontWeight: 600 }}>
                                                    {transfer.fileName || 'Untitled'}
                                                </Typography>
                                            </Link>
                                        }
                                        secondary={
                                            <Box>
                                                <Typography variant="caption" sx={{ color: '#B0B0B0', display: 'block' }}>
                                                    by {transfer.fileAuthor || 'Unknown'}
                                                </Typography>
                                                {transfer.fileDate && (
                                                    <Typography variant="caption" sx={{ color: '#888', display: 'block' }}>
                                                        {format(transfer.fileDate, "MMM d, yyyy")}
                                                    </Typography>
                                                )}
                                            </Box>
                                        }
                                    />
                                    <IconButton
                                        size="small"
                                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                            e.stopPropagation();
                                            handleDelete(transfer.fileId, transfer.fileName);
                                        }}
                                        disabled={deleteMutation.isPending}
                                        sx={{
                                            color: '#888',
                                            '&:hover': {
                                                color: '#ff4444',
                                                backgroundColor: 'rgba(255, 68, 68, 0.1)',
                                            },
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#B0B0B0' }}>
                                No active transfers
                            </Typography>
                        </Box>
                    )}
                </Paper>
            </Popover>
        </Box>
    );
};

