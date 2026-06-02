import { Box, Typography } from "@mui/material";
import type { ReachFileShare, ReachFileShareSlot } from "@/src/api/reach/fileShare";
import type { FileshareFile } from "@/src/api/reach/fileshareFilesSchema";
import { ReachPlayerFileshareTypeSection } from "@/src/components/reach/ReachPlayerFileshareTypeSection";
import { REACH_FILESHARE_FILE_TYPE_GROUPS } from "@/src/components/reach/reachFileshareTableStyles";

function fileshareSlotsToFiles(fileShare: ReachFileShare): FileshareFile[] {
  return fileShare.slots.map((slot: ReachFileShareSlot) => ({
    ...slot,
    shareId: fileShare.id,
  }));
}

interface ReachPlayerFileshareTablesProps {
  fileShare: ReachFileShare;
}

export function ReachPlayerFileshareTables({ fileShare }: ReachPlayerFileshareTablesProps) {
  const files = fileshareSlotsToFiles(fileShare);

  if (files.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No files in this player&apos;s file share yet.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      {REACH_FILESHARE_FILE_TYPE_GROUPS.map((group) => (
        <ReachPlayerFileshareTypeSection
          key={group.id}
          groupId={group.id}
          label={group.label}
          accentColor={group.meterColor}
          files={files.filter((file) => group.fileTypes.has(file.header.filetype))}
        />
      ))}
    </Box>
  );
}
