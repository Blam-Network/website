"use client";

import Link from "next/link";
import { Box, Paper, Stack, Typography } from "@mui/material";
import type { FileshareFile } from "@/src/api/reach/fileshareFilesSchema";
import { FileshareFiletypeIcon } from "@/src/components/FileshareFiletypeIcon";
import { FileshareDownloadButton } from "@/src/components/FileshareDownloadButton";
import { DateTimeDisplay } from "@/src/components/DateTimeDisplay";
import { GamertagLink } from "@/src/components/Gamertag";
import { getFileshareFileHref } from "@/src/components/files/filesPageTypes";
import { formatReachFileshareFileSize } from "@/src/components/reach/reachFileshareTableStyles";
import { formatFileshareDescription } from "@/src/utils/formatFileshareDescription";

function getReachFileMapId(filetype: number, mapId: number): number | undefined {
  if (filetype === 3 || filetype === 4 || filetype === 5) {
    return mapId;
  }
  return undefined;
}

interface ReachPlayerFileshareFileRowProps {
  file: FileshareFile;
}

export function ReachPlayerFileshareFileRow({ file }: ReachPlayerFileshareFileRowProps) {
  const isScreenshot = file.header.filetype === 2;
  const fileName = file.header.filename || "Untitled";
  const description = formatFileshareDescription(file.header.description);
  const fileHref = getFileshareFileHref("reach", file.id);

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
        gap: { xs: 0.75, sm: 0.75 },
        pl: { xs: 0.75, sm: 0.875 },
        pr: { xs: 1, sm: 1.25 },
        py: { xs: 0.75, sm: 0.875 },
        bgcolor: "rgba(0, 0, 0, 0.42)",
        overflow: "hidden",
        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: "0 0 0 1px rgba(124, 179, 66, 0.15)",
        },
      }}
    >
      <Link
        href={fileHref}
        style={{
          textDecoration: "none",
          color: "inherit",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          alignSelf: "center",
          margin: 0,
          padding: 0,
          lineHeight: 0,
        }}
      >
        <FileshareFiletypeIcon
          fileShareGame="reach"
          filetype={file.header.filetype}
          iconIndex={file.header.iconIndex}
          size={72}
          shareId={isScreenshot ? file.shareId : undefined}
          fileId={isScreenshot ? file.id : undefined}
          mapId={getReachFileMapId(file.header.filetype, file.header.mapId)}
        />
      </Link>

      <Stack sx={{ flex: 1, minWidth: 0, gap: 0.5 }}>
        <Link href={fileHref} style={{ textDecoration: "none", color: "inherit" }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              lineHeight: 1.25,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              "&:hover": { color: "primary.main" },
            }}
          >
            {fileName}
          </Typography>
        </Link>

        {description ? (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.35,
              whiteSpace: "pre-wrap",
            }}
          >
            {description}
          </Typography>
        ) : null}

        <Stack
          direction="row"
          spacing={1.5}
          flexWrap="wrap"
          useFlexGap
          sx={{ color: "text.secondary", typography: "caption" }}
        >
          {file.header.author?.trim() ? (
            <GamertagLink
              gamertag={file.header.author}
              authorXuid={file.header.authorXuid}
              profileGame="reach"
              variant="caption"
            />
          ) : null}
          {file.header.date ? (
            <Typography component="span" variant="caption" color="text.secondary">
              <DateTimeDisplay date={file.header.date} formatString="MMM d, yyyy" />
            </Typography>
          ) : null}
          <Typography component="span" variant="caption" color="text.secondary">
            {formatReachFileshareFileSize(file.header.size)}
          </Typography>
        </Stack>
      </Stack>

      <Box
        sx={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "flex-end", sm: "center" },
          alignSelf: { xs: "flex-end", sm: "center" },
        }}
      >
        <FileshareDownloadButton fileId={file.id} game="reach" compact />
      </Box>
    </Paper>
  );
}
