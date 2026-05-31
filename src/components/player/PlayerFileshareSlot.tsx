import { Box, Paper, Stack, Typography } from "@mui/material";
import type { FileShare } from "@/src/api/halo3/fileShare";
import { FileshareFiletypeIcon } from "@/src/components/FileshareFiletypeIcon";
import { FileshareDownloadButton } from "@/src/components/FileshareDownloadButton";
import { GamertagLink } from "@/src/components/Gamertag";

type Slot = FileShare["slots"][number];

export function PlayerFileshareSlot({
  slot,
  slotNumber,
  shareId,
  loggedIn,
}: {
  slot?: Slot;
  slotNumber: number;
  shareId: string;
  loggedIn: boolean;
}) {
  if (!slot) {
    return (
      <Paper
        sx={{
          minHeight: 176,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderStyle: "dashed",
          borderColor: "divider",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography variant="h4" color="text.disabled" sx={{ fontWeight: 700, opacity: 0.5 }}>
          {slotNumber}
        </Typography>
      </Paper>
    );
  }

  const isScreenshot = slot.header.filetype === 13;
  const fileShareGame = slot.isOdst ? "odst" as const : "halo3" as const;
  const mapId =
    slot.header.filetype === 10 ||
    slot.header.filetype === 11 ||
    slot.header.filetype === 12
      ? slot.header.mapId
      : undefined;

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
            filetype={slot.header.filetype}
            gameEngineType={slot.header.gameEngineType}
            fileShareGame={fileShareGame}
            size="100%"
            shareId={isScreenshot ? shareId : undefined}
            slot={isScreenshot ? slot.slotNumber : undefined}
            mapId={mapId}
          />
        </Box>
      </Box>

      <Stack sx={{ flex: 1, p: 1.25, gap: 0.75, minHeight: 0 }}>
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
          {slot.header.filename || "Untitled"}
        </Typography>
        <GamertagLink
          gamertag={slot.header.author ?? ""}
          variant="caption"
          underline="hover"
          linkSx={{ color: "#4A90E2" }}
        />
        {loggedIn && (
          <Box sx={{ pt: 0.5, mt: "auto", display: "flex", justifyContent: "flex-end" }}>
            <FileshareDownloadButton fileId={slot.id} game={fileShareGame} compact />
          </Box>
        )}
      </Stack>
    </Paper>
  );
}
