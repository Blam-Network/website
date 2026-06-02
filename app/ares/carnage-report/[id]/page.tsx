import { api } from "@/src/trpc/server";
import { CarnageReportView } from "@/src/components/carnage-report/CarnageReportView";
import type { Metadata } from "next";
import { buildMultiplayerCarnageReportMetadata } from "@/src/utils/carnageReportMetadata";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  let carnageReport: Awaited<ReturnType<typeof api.ares.getCarnageReport.query>> | undefined;
  try {
    carnageReport = await api.ares.getCarnageReport.query({ id: params.id });
  } catch {
    carnageReport = undefined;
  }

  return buildMultiplayerCarnageReportMetadata(carnageReport, {
    path: `/ares/carnage-report/${params.id}`,
    gameLabel: "Ares",
  });
}

export default async function CarnageReportPage({ params }: { params: { id: string } }) {
  const carnageReport = await api.ares.getCarnageReport.query({ id: params.id });

  return <CarnageReportView game="halo3" report={carnageReport} />;
}
