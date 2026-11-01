import { Box } from "@mui/material";
import { env } from "@/src/env";

export interface ReachEmblemAppearance {
  foreground_emblem: number;
  background_emblem: number;
  emblem_flags: number;
  emblem_primary_color: number;
  emblem_secondary_color: number;
  emblem_background_color: number;
}

export function getReachEmblemUrl(emblem: ReachEmblemAppearance, size: number): string {
  const params = new URLSearchParams({
    size: String(size),
    foreground: String(emblem.foreground_emblem),
    background: String(emblem.background_emblem),
    flags: String(emblem.emblem_flags),
    primary_color: String(emblem.emblem_primary_color),
    secondary_color: String(emblem.emblem_secondary_color),
    background_color: String(emblem.emblem_background_color),
  });
  return `${env.NEXT_PUBLIC_HALO_REACH_API_BASE_URL}/haloreach/emblem?${params.toString()}`;
}

export function ReachEmblem({ emblem, size = 32 }: { emblem: ReachEmblemAppearance; size?: number }) {
  return (
    <Box
      component="img"
      src={getReachEmblemUrl(emblem, size * 2)}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      sx={{ width: size, height: size, flexShrink: 0 }}
    />
  );
}
