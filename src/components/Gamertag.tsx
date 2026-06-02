import { Typography, TypographyProps } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import Link from "next/link";
import type { FilesGame } from "@/src/components/files/filesPageTypes";
import { isGuestXuid } from "@/src/utils/xuid";
export const BUNGIE_PLACEHOLDER_GAMERTAG = "\u00a6";

export function normalizeGamertag(gamertag: string): string {
  return gamertag.replace(/\0/g, "").trim();
}

export function formatGamertag(gamertag: string): string {
  const normalized = normalizeGamertag(gamertag);
  if (!normalized || normalized === BUNGIE_PLACEHOLDER_GAMERTAG) {
    return "Bungie";
  }
  return normalized;
}

/** System placeholder gamertags (e.g. Bungie fileshare author) should not link to a profile. */
export function isSystemGamertag(gamertag: string): boolean {
  const normalized = normalizeGamertag(gamertag);
  if (!normalized || normalized === BUNGIE_PLACEHOLDER_GAMERTAG) {
    return true;
  }
  return normalized.toLowerCase() === "bungie";
}

export function isLinkableGamertag(
  gamertag: string,
  options?: { authorXuid?: string | null },
): boolean {
  if (isSystemGamertag(gamertag)) {
    return false;
  }
  if (options?.authorXuid && isGuestXuid(options.authorXuid)) {
    return false;
  }
  return true;
}

export function playerProfilePath(gamertag: string, basePath = "/halo3/player"): string {
  return `${basePath}/${encodeURIComponent(normalizeGamertag(gamertag))}`;
}

export function playerProfilePathForGame(gamertag: string, game: FilesGame): string {
  return playerProfilePath(
    gamertag,
    game === "reach" ? "/haloreach/player" : "/halo3/player",
  );
}

export function profileRedirectPath(preferReach: boolean): string {
  return preferReach ? "/haloreach/profile" : "/halo3/profile";
}

function resolvePlayerPathBase(
  profileGame: FilesGame | undefined,
  playerPathBase: string,
): string {
  if (profileGame === "reach") {
    return "/haloreach/player";
  }
  return playerPathBase;
}

type GamertagProps = {
  children: string;
};

export function Gamertag({ children }: GamertagProps) {
  return <>{formatGamertag(children)}</>;
}

type GamertagLinkProps = {
  gamertag: string;
  authorXuid?: string | null;
  /** When set, links to that title's player service record page. */
  profileGame?: FilesGame;
  playerPathBase?: string;
  variant?: TypographyProps["variant"];
  color?: TypographyProps["color"];
  sx?: TypographyProps["sx"];
  linkSx?: TypographyProps["sx"];
  underline?: "hover" | "always" | "none";
  onClick?: React.MouseEventHandler;
};

export function GamertagLink({
  gamertag,
  authorXuid,
  profileGame,
  playerPathBase = "/halo3/player",
  variant = "caption",
  color,
  sx,
  linkSx,
  underline = "hover",
  onClick,
}: GamertagLinkProps) {
  const display = <Gamertag>{gamertag}</Gamertag>;
  const baseSx: SxProps<Theme> = { fontWeight: 600, lineHeight: 1.2 };
  const mutedColor = color ?? "text.secondary";

  if (!isLinkableGamertag(gamertag, { authorXuid })) {
    return (
      <Typography variant={variant} color={mutedColor} sx={[baseSx, sx] as SxProps<Theme>}>
        {display}
      </Typography>
    );
  }

  return (
    <Link
      href={playerProfilePath(gamertag, resolvePlayerPathBase(profileGame, playerPathBase))}
      onClick={onClick}
      style={{ textDecoration: underline === "always" ? "underline" : "none" }}
    >
      <Typography
        variant={variant}
        sx={[
          baseSx,
          { display: "inline", color: "secondary.main" },
          underline === "hover"
            ? { "&:hover": { textDecoration: "underline", color: "secondary.light" } }
            : {},
          linkSx,
          sx,
        ] as SxProps<Theme>}
      >
        {display}
      </Typography>
    </Link>
  );
}
