"use client";

import { Button, Stack } from "@mui/material";
import { GameIcon } from "@/src/components/GameIcon";
import {
  PLAYERS_GAMES,
  playersGameToFilesGame,
  PlayersGame,
} from "./playersPageTypes";

interface PlayersPageFiltersProps {
  game: PlayersGame;
  onGameChange: (game: PlayersGame) => void;
}

export function PlayersPageFilters({ game, onGameChange }: PlayersPageFiltersProps) {
  return (
    <Stack direction="row" sx={{ flexWrap: "wrap", mb: 3 }}>
      {PLAYERS_GAMES.map(({ value, label }, index) => (
        <Button
          key={value}
          variant={game === value ? "contained" : "outlined"}
          size="small"
          onClick={() => {
            if (value !== game) {
              onGameChange(value);
            }
          }}
          sx={{
            borderRadius: 0,
            ...(index > 0 && { ml: "-1px" }),
          }}
        >
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <GameIcon game={playersGameToFilesGame(value)} size={16} aria-hidden />
            <span>{label}</span>
          </Stack>
        </Button>
      ))}
    </Stack>
  );
}
