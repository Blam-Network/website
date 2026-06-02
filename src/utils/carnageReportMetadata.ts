import type { Metadata } from "next";
import { format } from "date-fns";
import { buildMapOgImage, buildPageMetadata } from "@/src/utils/metadata";
import { getTeamName } from "@/src/utils/teams";

type CarnageReportForMetadata = {
  start_time: string | Date;
  map_id?: number;
  map_variant_name: string;
  game_variant: { name: string };
  team_game: boolean;
  players: { standing: number; player_name: string }[];
  teams: { standing: number; team_index: number }[];
};

export function buildMultiplayerCarnageReportMetadata(
  carnageReport: CarnageReportForMetadata | undefined,
  options: { path: string; gameLabel: string },
): Metadata {
  if (!carnageReport) {
    return buildPageMetadata({
      title: "Carnage Report",
      description: `View ${options.gameLabel} carnage report on Blam Network.`,
      path: options.path,
    });
  }

  const players = [...carnageReport.players].sort((a, b) => a.standing - b.standing);
  const winner = players[0];
  const winningTeam =
    carnageReport.team_game && carnageReport.teams.length > 0
      ? [...carnageReport.teams].sort((a, b) => a.standing - b.standing)[0]
      : null;

  const headline = winningTeam
    ? `${getTeamName(winningTeam.team_index)} Team Wins!`
    : `${winner.player_name} Wins!`;

  const startTime = new Date(carnageReport.start_time);
  const formattedStartTime = format(startTime, "MMM d, yyyy 'at' h:mm a");
  const description = `${carnageReport.game_variant.name} on ${carnageReport.map_variant_name}. Started ${formattedStartTime}. Full stats on Blam Network.`;

  const mapId = carnageReport.map_id;
  const images =
    mapId != null ? [buildMapOgImage(mapId, carnageReport.map_variant_name)] : undefined;

  return buildPageMetadata({
    title: headline,
    description,
    path: options.path,
    images,
    twitterCard: images ? "summary_large_image" : "summary",
  });
}
