"use client";

import { Button, Stack } from "@mui/material";
import { FILES_GAMES, FilesGame, parseFilesGame } from "@/src/components/files/filesPageTypes";
import { GameIcon } from "@/src/components/GameIcon";

interface ScreenshotsPageFiltersProps {
  game: FilesGame;
  onGameChange: (game: FilesGame) => void;
}

export function ScreenshotsPageFilters({ game, onGameChange }: ScreenshotsPageFiltersProps) {
  return (
    <Stack direction="row" sx={{ flexWrap: "wrap", mb: 3 }}>
      {FILES_GAMES.map(({ value, label }, index) => (
        <Button
          key={value}
          variant={game === value ? "contained" : "outlined"}
          size="small"
          onClick={() => onGameChange(parseFilesGame(value))}
          sx={{
            borderRadius: 0,
            ...(index > 0 && { ml: "-1px" }),
          }}
        >
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <GameIcon game={value} size={16} aria-hidden />
            <span>{label}</span>
          </Stack>
        </Button>
      ))}
    </Stack>
  );
}
