import { Box, Paper, Stack, Typography } from "@mui/material";
import { FileshareFile } from "@/src/api/halo3/fileshareFiles";
import { FileshareFiletypeIcon } from "@/src/components/FileshareFiletypeIcon";
import { FileshareDownloadButton } from "@/src/components/FileshareDownloadButton";
import { DateTimeDisplay } from "@/src/components/DateTimeDisplay";
import { GamertagLink } from "@/src/components/Gamertag";

interface Halo3FileshareFileCardProps {
  file: FileshareFile;
}

export function Halo3FileshareFileCard({ file }: Halo3FileshareFileCardProps) {
  const isScreenshot = file.header.filetype === 13;

  return (
    <Paper
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "border-color 0.15s ease",
        "&:hover": {
          borderColor: "primary.main",
        },
      }}
    >
      <Box
        sx={{
          height: 108,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
          backgroundColor: "rgba(0, 0, 0, 0.28)",
        }}
      >
        <Box sx={{ width: "90%", maxWidth: 156 }}>
          <FileshareFiletypeIcon
            fileShareGame="halo3"
            filetype={file.header.filetype}
            gameEngineType={file.header.gameEngineType}
            size="100%"
            shareId={isScreenshot ? file.shareId : undefined}
            slot={isScreenshot ? file.slotNumber : undefined}
            fileId={isScreenshot ? file.id : undefined}
            filename={isScreenshot ? file.header.filename : undefined}
            description={isScreenshot ? file.header.description : undefined}
            author={isScreenshot ? file.header.author : undefined}
            mapId={
              file.header.filetype === 10 ||
              file.header.filetype === 11 ||
              file.header.filetype === 12
                ? file.header.mapId
                : undefined
            }
          />
        </Box>
      </Box>

      <Stack sx={{ flex: 1, p: 1.25, gap: 1, minHeight: 0 }}>
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              lineHeight: 1.25,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {file.header.filename || "Untitled"}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.3,
              mt: 0,
              minHeight: "2.6em",
            }}
          >
            {file.header.description || "\u00A0"}
          </Typography>
        </Box>

        <Stack spacing={0.125} sx={{ pt: 0.75, borderTop: "1px solid", borderColor: "divider" }}>
          <GamertagLink
            gamertag={file.header.author}
            authorXuid={file.header.authorXuid}
          />
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
            <DateTimeDisplay date={file.header.date} />
          </Typography>
          <Box sx={{ pt: 0.5, display: "flex", justifyContent: "flex-end" }}>
            <FileshareDownloadButton fileId={file.id} game="halo3" compact />
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
}
