"use client";

import { Box, Stack, Typography } from "@mui/material";
import { getFileTypeMiniIconUrl } from "@/src/constants/fileshareIcons";
import type { FileshareTypeTotals } from "@/src/api/halo3/fileshareFilesSchema";
import {
  FileTypeFilter,
  FilesGame,
  getFileTypeFiltersForGame,
} from "./filesPageTypes";

function MiniTypeIcon({ src }: { src: string }) {
  return (
    <Box
      component="span"
      aria-hidden
      sx={{
        display: "inline-block",
        width: 16,
        height: 12,
        flexShrink: 0,
        bgcolor: "currentColor",
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

interface FilesPageTypeTotalsProps {
  game: FilesGame;
  total: number;
  fileType: FileTypeFilter;
  totalsByType?: FileshareTypeTotals;
}

export function FilesPageTypeTotals({ game, total, fileType, totalsByType }: FilesPageTypeTotalsProps) {
  if (total <= 0) {
    return null;
  }

  const typeFilters = getFileTypeFiltersForGame(game).filter(
    (filter): filter is { value: Exclude<FileTypeFilter, "">; label: string } =>
      filter.value !== "",
  );

  const activeFilter = typeFilters.find((filter) => filter.value === fileType);

  if (fileType && activeFilter) {
    const iconUrl = getFileTypeMiniIconUrl(fileType);
    return (
      <Stack direction="row" alignItems="center" spacing={0.75} sx={{ color: "text.secondary" }}>
        {iconUrl && <MiniTypeIcon src={iconUrl} />}
        <Typography variant="caption" sx={{ fontVariantNumeric: "tabular-nums" }}>
          {total.toLocaleString()} {activeFilter.label.toLowerCase()}
        </Typography>
      </Stack>
    );
  }

  const breakdownItems = totalsByType
    ? typeFilters
        .map(({ value, label }) => ({
          value,
          label,
          count: totalsByType[value],
          iconUrl: getFileTypeMiniIconUrl(value),
        }))
        .filter((item) => item.iconUrl && item.count > 0)
    : [];

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{ flexWrap: "wrap", justifyContent: "flex-end", rowGap: 0.75 }}
    >
      {breakdownItems.map(({ value, label, count, iconUrl }) => (
        <Stack
          key={value}
          direction="row"
          alignItems="center"
          spacing={0.5}
          sx={{ color: "text.secondary" }}
        >
          <MiniTypeIcon src={iconUrl!} />
          <Typography variant="caption" component="span" sx={{ fontVariantNumeric: "tabular-nums" }}>
            {count.toLocaleString()}
          </Typography>
          <Typography variant="caption" component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            {label.toLowerCase()}
          </Typography>
        </Stack>
      ))}

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          fontVariantNumeric: "tabular-nums",
          ...(breakdownItems.length > 0 && { pl: 0.5, borderLeft: "1px solid", borderColor: "divider" }),
        }}
      >
        {total.toLocaleString()} files
      </Typography>
    </Stack>
  );
}
