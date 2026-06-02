"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, Button, Modal, Typography } from "@mui/material";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import {
  FileshareFilesResponseSchema,
  type FileshareFile,
} from "@/src/api/reach/fileshareFilesSchema";
import {
  reachAdminFileshareShareId,
  type ReachAdminFileshareTarget,
} from "@/src/constants/reachAdminFileshare";
import { ReachFileshareFilesTypeTable } from "@/src/components/reach/ReachFileshareFilesTypeTable";
import { REACH_FILESHARE_FILE_TYPE_GROUPS } from "@/src/components/reach/reachFileshareTableStyles";

const ADMIN_FILES_PAGE_SIZE = 1000;

async function fetchAdminFileshareFiles(shareIdHex: string): Promise<FileshareFile[]> {
  const baseUrl = process.env.NEXT_PUBLIC_HALO_REACH_API_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_HALO_REACH_API_BASE_URL is not configured");
  }

  const params = new URLSearchParams({
    page: "1",
    pageSize: String(ADMIN_FILES_PAGE_SIZE),
    shareId: shareIdHex,
  });
  const response = await fetch(`${baseUrl}/haloreach/fileshare/files?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to load fileshare files (${response.status})`);
  }

  const parsed = FileshareFilesResponseSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new Error("Invalid fileshare files response");
  }

  return parsed.data.data;
}

async function deleteAdminFileshareFile(
  fileshareTarget: ReachAdminFileshareTarget,
  fileId: string,
): Promise<void> {
  const response = await fetch(
    `/api/reach/admin/fileshare/${fileshareTarget}/files/${encodeURIComponent(fileId)}`,
    { method: "DELETE" },
  );

  if (!response.ok) {
    let details = `Failed to delete file (${response.status})`;
    try {
      const parsed = (await response.json()) as { details?: string; error?: string };
      details = parsed.details ?? parsed.error ?? details;
    } catch {
      // keep default message
    }
    throw new Error(details);
  }
}

type DeleteFileModalProps = {
  open: boolean;
  fileName: string;
  isDeleting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onConfirm: () => void;
};

function DeleteFileModal({
  open,
  fileName,
  isDeleting,
  errorMessage,
  onClose,
  onConfirm,
}: DeleteFileModalProps) {
  return (
    <Modal
      open={open}
      onClose={isDeleting ? undefined : onClose}
      aria-labelledby="delete-file-title"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          mx: 2,
          p: 3,
          bgcolor: "#1A1A1A",
          border: "1px solid #333",
          borderRadius: 1,
          outline: "none",
        }}
      >
        <Typography id="delete-file-title" variant="h6" sx={{ color: "#E0E0E0", mb: 1 }}>
          Delete file?
        </Typography>
        <Typography variant="body2" sx={{ color: "#B0B0B0", mb: 2 }}>
          Are you sure you want to delete{" "}
          <Typography component="span" sx={{ color: "#E0E0E0", fontWeight: 600 }}>
            {fileName || "Untitled"}
          </Typography>
          ? This cannot be undone.
        </Typography>
        {errorMessage ? (
          <Typography variant="body2" sx={{ color: "#e57373", mb: 2 }}>
            {errorMessage}
          </Typography>
        ) : null}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button
            onClick={onClose}
            disabled={isDeleting}
            sx={{ color: "#B0B0B0", "&:hover": { color: "#E0E0E0" } }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export function ReachAdminFileshareFilesTables({
  fileshareTarget,
  refreshKey,
  canDelete = true,
}: {
  fileshareTarget: ReachAdminFileshareTarget;
  refreshKey: number;
  canDelete?: boolean;
}) {
  const shareIdHex = reachAdminFileshareShareId(fileshareTarget);
  const queryClient = useQueryClient();
  const [fileToDelete, setFileToDelete] = useState<FileshareFile | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["reachAdminFileshareFiles", fileshareTarget, refreshKey],
    queryFn: () => fetchAdminFileshareFiles(shareIdHex),
  });

  const deleteMutation = useMutation({
    mutationFn: (fileId: string) => deleteAdminFileshareFile(fileshareTarget, fileId),
    onSuccess: async () => {
      setFileToDelete(null);
      setDeleteError(null);
      await queryClient.invalidateQueries({
        queryKey: ["reachAdminFileshareFiles", fileshareTarget],
      });
    },
    onError: (deleteErr) => {
      setDeleteError(
        deleteErr instanceof Error ? deleteErr.message : "Failed to delete file",
      );
    },
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4, mb: 3 }}>
        <LoadingSpinner size={48} periodSec={6} />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography sx={{ color: "#e57373", mb: 3 }}>
        {error instanceof Error ? error.message : "Failed to load uploaded files"}
      </Typography>
    );
  }

  const files = data ?? [];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Uploaded files
      </Typography>
      {REACH_FILESHARE_FILE_TYPE_GROUPS.map((group) => (
        <ReachFileshareFilesTypeTable
          key={group.id}
          groupId={group.id}
          label={group.label}
          files={files.filter((file) => group.fileTypes.has(file.header.filetype))}
          onDeleteClick={
            canDelete
              ? (file) => {
                  setDeleteError(null);
                  setFileToDelete(file);
                }
              : undefined
          }
          deletingFileId={deleteMutation.isPending ? deleteMutation.variables ?? null : null}
        />
      ))}
      <DeleteFileModal
        open={fileToDelete !== null}
        fileName={fileToDelete?.header.filename ?? ""}
        isDeleting={deleteMutation.isPending}
        errorMessage={deleteError}
        onClose={() => {
          if (deleteMutation.isPending) return;
          setFileToDelete(null);
          setDeleteError(null);
        }}
        onConfirm={() => {
          if (!fileToDelete) return;
          deleteMutation.mutate(fileToDelete.id);
        }}
      />
    </Box>
  );
}
