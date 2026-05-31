import { api } from "@/src/trpc/server";
import { CarnageReportView } from "@/src/components/carnage-report/CarnageReportView";
import type { Metadata } from "next";
import { format } from "date-fns";
import { getSiteUrl } from "@/src/utils/siteUrl";
import { getTeamName } from "@/src/utils/teams";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const baseUrl = getSiteUrl();

  let carnageReport: Awaited<ReturnType<typeof api.ares.getCarnageReport.query>> | undefined;
  try {
    carnageReport = await api.ares.getCarnageReport.query({ id: params.id });
  } catch {
    carnageReport = undefined;
  }

  if (!carnageReport) {
    return {
      title: "Carnage Report - Blam Network",
      description: "View Ares carnage report on Blam Network.",
    };
  }

  const players = [...carnageReport.players].sort((a, b) => a.standing - b.standing);
  const winner = players[0];
  const winningTeam =
    carnageReport.team_game && carnageReport.teams.length > 0
      ? [...carnageReport.teams].sort((a, b) => a.standing - b.standing)[0]
      : null;

  const title = winningTeam
    ? `${getTeamName(winningTeam.team_index)} Team Wins! - Blam Network`
    : `${winner.player_name} Wins! - Blam Network`;

  const startTime = new Date(carnageReport.start_time);
  const formattedStartTime = format(startTime, "MMM d, yyyy 'at' h:mm a");
  const description = `${carnageReport.game_variant.name} on ${carnageReport.map_variant_name}. Started ${formattedStartTime}. View full carnage report on Blam Network.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/ares/carnage-report/${params.id}`,
      siteName: "Blam Network",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function CarnageReportPage({ params }: { params: { id: string } }) {
  const carnageReport = await api.ares.getCarnageReport.query({ id: params.id });

  return <CarnageReportView game="ares" report={carnageReport} />;
}
