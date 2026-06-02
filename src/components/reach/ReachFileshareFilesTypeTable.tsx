"use client";

import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { DateTimeDisplay } from "@/src/components/DateTimeDisplay";
import { Gamertag } from "@/src/components/Gamertag";
import type { FileshareFile } from "@/src/api/reach/fileshareFilesSchema";
import { getFileTypeMiniIconUrl } from "@/src/constants/fileshareIcons";
import { formatFileshareDescription } from "@/src/utils/formatFileshareDescription";
import {
  reachAdminFileshareTableContainerSx,
  reachAdminFileshareTableSx,
} from "@/src/components/reach/reachAdminTableStyles";
import {
  formatReachFileshareFileSize,
  reachFileshareTableCellSx,
  reachFileshareTableHeadCellSx,
  type ReachFileshareFileTypeGroupId,
} from "@/src/components/reach/reachFileshareTableStyles";

interface ReachFileshareFilesTypeTableProps {
  groupId: ReachFileshareFileTypeGroupId;
  label: string;
  files: FileshareFile[];
  onDeleteClick?: (file: FileshareFile) => void;
  deletingFileId?: string | null;
}

export function ReachFileshareFilesTypeTable({
  groupId,
  label,
  files,
  onDeleteClick,
  deletingFileId,
}: ReachFileshareFilesTypeTableProps) {
  const showDelete = onDeleteClick != null;
  const columnCount = 5 + (showDelete ? 1 : 0);

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 1 }}>
        {getFileTypeMiniIconUrl(groupId) && (
          <Box
            component="img"
            src={getFileTypeMiniIconUrl(groupId)!}
            alt=""
            sx={{
              width: 18,
              height: 14,
              display: "block",
              flexShrink: 0,
              objectFit: "contain",
            }}
          />
        )}
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {label}
          <Typography
            component="span"
            variant="body2"
            sx={{ color: "text.secondary", ml: 1, fontWeight: 500 }}
          >
            ({files.length})
          </Typography>
        </Typography>
      </Stack>

      <TableContainer sx={reachAdminFileshareTableContainerSx}>
        <Table size="small" stickyHeader sx={reachAdminFileshareTableSx}>
          <TableHead>
            <TableRow>
              <TableCell sx={reachFileshareTableHeadCellSx}>Name</TableCell>
              <TableCell sx={reachFileshareTableHeadCellSx}>Description</TableCell>
              <TableCell sx={{ ...reachFileshareTableHeadCellSx, width: 120 }}>Author</TableCell>
              <TableCell sx={{ ...reachFileshareTableHeadCellSx, width: 180, minWidth: 180 }}>
                Modified
              </TableCell>
              <TableCell sx={{ ...reachFileshareTableHeadCellSx, width: 72 }}>Size</TableCell>
              {showDelete && <TableCell sx={{ ...reachFileshareTableHeadCellSx, width: 48 }} />}
            </TableRow>
          </TableHead>
          <TableBody>
            {files.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columnCount} sx={{ ...reachFileshareTableCellSx, color: "text.secondary" }}>
                  No files uploaded
                </TableCell>
              </TableRow>
            ) : (
              files.map((file) => {
                const fileName = file.header.filename || "Untitled";
                const description = formatFileshareDescription(file.header.description);

                return (
                  <TableRow key={file.id} hover>
                    <TableCell
                      sx={{
                        ...reachFileshareTableCellSx,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fileName}
                    </TableCell>
                    <TableCell
                      sx={{
                        ...reachFileshareTableCellSx,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={description || undefined}
                    >
                      {description || "—"}
                    </TableCell>
                    <TableCell
                      sx={{
                        ...reachFileshareTableCellSx,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Gamertag>{file.header.author ?? ""}</Gamertag>
                    </TableCell>
                    <TableCell sx={{ ...reachFileshareTableCellSx, whiteSpace: "nowrap", color: "text.secondary" }}>
                      {file.header.date ? (
                        <DateTimeDisplay date={file.header.date} />
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell sx={{ ...reachFileshareTableCellSx, whiteSpace: "nowrap", color: "text.secondary" }}>
                      {formatReachFileshareFileSize(file.header.size)}
                    </TableCell>
                    {showDelete && onDeleteClick && (
                      <TableCell sx={{ ...reachFileshareTableCellSx, px: 0.5, textAlign: "center" }}>
                        <IconButton
                          size="small"
                          aria-label={`Delete ${fileName}`}
                          disabled={deletingFileId === file.id}
                          onClick={() => onDeleteClick(file)}
                          sx={{
                            color: "#888",
                            "&:hover": { color: "#e57373" },
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
