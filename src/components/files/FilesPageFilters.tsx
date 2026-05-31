"use client";

import { Box, Button, Divider, Stack, TextField } from "@mui/material";
import { getFileTypeMiniIconUrl } from "@/src/constants/fileshareIcons";
import { getFileTypeFiltersForGame, FILES_GAMES, FileTypeFilter, FilesGame, parseFilesGame } from "./filesPageTypes";

function MiniFilterIcon({ src }: { src: string }) {
  return (
    <Box
      component="span"
      aria-hidden
      sx={{
        display: "inline-block",
        width: 18,
        height: 14,
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

function FilterGroup({
  options,
  value,
  onChange,
}: {
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Stack direction="row" sx={{ flexWrap: "wrap" }}>
      {options.map(({ value: optionValue, label: optionLabel }, index) => (
        <Button
          key={optionValue || "__all__"}
          variant={value === optionValue ? "contained" : "outlined"}
          size="small"
          onClick={() => onChange(optionValue)}
          sx={{
            borderRadius: 0,
            ...(index > 0 && { ml: "-1px" }),
          }}
        >
          {optionLabel}
        </Button>
      ))}
    </Stack>
  );
}

function FileTypeFilterGroup({
  options,
  value,
  onChange,
}: {
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Stack direction="row" sx={{ flexWrap: "wrap" }}>
      {options.map(({ value: optionValue, label: optionLabel }, index) => {
        const iconUrl = getFileTypeMiniIconUrl(optionValue);

        return (
          <Button
            key={optionValue || "__all__"}
            variant={value === optionValue ? "contained" : "outlined"}
            size="small"
            onClick={() => onChange(optionValue)}
            sx={{
              borderRadius: 0,
              ...(index > 0 && { ml: "-1px" }),
            }}
          >
            <Stack direction="row" alignItems="center" spacing={0.75}>
              {iconUrl && <MiniFilterIcon src={iconUrl} />}
              <span>{optionLabel}</span>
            </Stack>
          </Button>
        );
      })}
    </Stack>
  );
}

interface FilesPageFiltersProps {
  game: FilesGame;
  fileType: FileTypeFilter;
  search: string;
  onGameChange: (game: FilesGame) => void;
  onFileTypeChange: (fileType: FileTypeFilter) => void;
  onSearchChange: (search: string) => void;
}

export function FilesPageFilters({
  game,
  fileType,
  search,
  onGameChange,
  onFileTypeChange,
  onSearchChange,
}: FilesPageFiltersProps) {
  return (
    <Stack spacing={2} sx={{ mb: 3 }}>
      <Stack
        direction="row"
        alignItems="center"
        divider={<Divider orientation="vertical" flexItem sx={{ mx: 1.5 }} />}
        sx={{ flexWrap: "wrap", rowGap: 1.5 }}
      >
        <FilterGroup
          options={FILES_GAMES}
          value={game}
          onChange={(value) => onGameChange(parseFilesGame(value))}
        />
        <FileTypeFilterGroup
          options={getFileTypeFiltersForGame(game)}
          value={fileType}
          onChange={(value) => onFileTypeChange(value as FileTypeFilter)}
        />
      </Stack>
      <TextField
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search by name, description, or author"
        size="small"
        fullWidth
        sx={{ maxWidth: 480 }}
      />
    </Stack>
  );
}
