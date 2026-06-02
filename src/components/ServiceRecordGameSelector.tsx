import { Button, Stack } from "@mui/material";
import Link from "next/link";
import { playerProfilePath } from "@/src/components/Gamertag";
import { GameIcon } from "@/src/components/GameIcon";
import { BARLOW_FAMILY } from "@/src/theme/fonts";

export type ServiceRecordGame = "halo3" | "reach";

const SERVICE_RECORD_GAMES: { game: ServiceRecordGame; label: string }[] = [
  { game: "halo3", label: "Halo 3" },
  { game: "reach", label: "Halo Reach" },
];

function getServiceRecordHref(game: ServiceRecordGame, gamertag: string): string {
  return game === "halo3"
    ? playerProfilePath(gamertag)
    : playerProfilePath(gamertag, "/haloreach/player");
}

interface ServiceRecordGameSelectorProps {
  gamertag: string;
  currentGame: ServiceRecordGame;
  primaryColor: string;
}

function getButtonSx(primaryColor: string, isActive: boolean, index: number) {
  const compact = {
    py: 0.25,
    px: 0.75,
    minHeight: 24,
    fontSize: "0.7rem",
    lineHeight: 1.2,
    fontFamily: BARLOW_FAMILY,
    fontWeight: 600,
    borderRadius: 0,
    borderWidth: 1,
    borderStyle: "solid",
    ...(index > 0 && { ml: "-1px" }),
  };

  if (isActive) {
    return {
      ...compact,
      pointerEvents: "none",
      cursor: "default",
      bgcolor: primaryColor,
      borderColor: primaryColor,
      color: "rgba(0, 0, 0, 0.87)",
    };
  }

  return {
    ...compact,
    bgcolor: "background.default",
    borderColor: primaryColor,
    color: primaryColor,
    "&:hover": {
      bgcolor: "background.default",
      borderColor: primaryColor,
      backgroundColor: "rgba(255, 255, 255, 0.06)",
    },
  };
}

export function ServiceRecordGameSelector({
  gamertag,
  currentGame,
  primaryColor,
}: ServiceRecordGameSelectorProps) {
  return (
    <Stack direction="row" sx={{ flexWrap: "wrap" }}>
      {SERVICE_RECORD_GAMES.map(({ game, label }, index) => {
        const isActive = game === currentGame;
        const content = (
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <GameIcon game={game} size={14} aria-hidden />
            <span>{label}</span>
          </Stack>
        );
        const sx = getButtonSx(primaryColor, isActive, index);

        if (isActive) {
          return (
            <Button
              key={game}
              variant="contained"
              size="small"
              disableElevation
              aria-current="page"
              tabIndex={-1}
              sx={sx}
            >
              {content}
            </Button>
          );
        }

        return (
          <Button
            key={game}
            component={Link}
            href={getServiceRecordHref(game, gamertag)}
            variant="outlined"
            size="small"
            sx={sx}
          >
            {content}
          </Button>
        );
      })}
    </Stack>
  );
}
