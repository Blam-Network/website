import { Box, Stack, Typography } from "@mui/material";
import type { FileshareFile } from "@/src/api/reach/fileshareFilesSchema";
import { getFileTypeMiniIconUrl } from "@/src/constants/fileshareIcons";
import { ReachPlayerFileshareFileRow } from "@/src/components/reach/ReachPlayerFileshareFileRow";
import type { ReachFileshareFileTypeGroupId } from "@/src/components/reach/reachFileshareTableStyles";

interface ReachPlayerFileshareTypeSectionProps {
  groupId: ReachFileshareFileTypeGroupId;
  label: string;
  accentColor: string;
  files: FileshareFile[];
}

export function ReachPlayerFileshareTypeSection({
  groupId,
  label,
  accentColor,
  files,
}: ReachPlayerFileshareTypeSectionProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.75}
        sx={{
          mb: 1.25,
          pl: 1.25,
          borderLeft: `3px solid ${accentColor}`,
        }}
      >
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
        <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: "0.02em" }}>
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

      {files.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ pl: 0.5 }}>
          No files uploaded
        </Typography>
      ) : (
        <Stack spacing={1.25}>
          {files.map((file) => (
            <ReachPlayerFileshareFileRow key={file.id} file={file} />
          ))}
        </Stack>
      )}
    </Box>
  );
}
