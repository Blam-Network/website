import { Box } from "@mui/material";
import { getGameIconUrl, getFilesGameLabel, type FilesGame } from "./files/filesPageTypes";

interface GameIconProps {
  game: FilesGame;
  size?: number;
  "aria-label"?: string;
  "aria-hidden"?: boolean;
}

export function GameIcon({
  game,
  size = 16,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
}: GameIconProps) {
  return (
    <Box
      component="span"
      role={ariaHidden ? undefined : "img"}
      aria-label={ariaHidden ? undefined : (ariaLabel ?? getFilesGameLabel(game))}
      aria-hidden={ariaHidden}
      sx={{
        display: "inline-block",
        width: size,
        height: size,
        flexShrink: 0,
        bgcolor: "currentColor",
        WebkitMaskImage: `url(${getGameIconUrl(game)})`,
        maskImage: `url(${getGameIconUrl(game)})`,
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
