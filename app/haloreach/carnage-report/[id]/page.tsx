import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { api } from "@/src/trpc/server";
import { ReachCarnageReportView } from "@/src/components/reach/games/ReachCarnageReportView";
import { reachGameTitle } from "@/src/components/reach/games/ReachGamesTable";
import { buildPageMetadata } from "@/src/utils/metadata";

const isUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const report = isUuid(params.id) ? await api.reach.game.query({ id: params.id }).catch(() => null) : null;
  return buildPageMetadata({
    title: report ? reachGameTitle(report) : "Halo: Reach Carnage Report",
    description: report
      ? `Halo: Reach carnage report: ${reachGameTitle(report)} with ${report.players.map((player) => player.player_name).join(", ")}.`
      : "Halo: Reach carnage report on Blam Network.",
    path: `/haloreach/carnage-report/${params.id}`,
  });
}

export default async function HaloReachCarnageReportPage({ params }: { params: { id: string } }) {
  if (!isUuid(params.id)) {
    notFound();
  }
  const report = await api.reach.game.query({ id: params.id });
  if (!report) {
    notFound();
  }
  return <ReachCarnageReportView report={report} />;
}
