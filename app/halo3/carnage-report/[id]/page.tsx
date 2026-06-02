import { api } from "@/src/trpc/server";
import { CarnageReportView } from "@/src/components/carnage-report/CarnageReportView";
import type { Metadata } from "next";
import { buildMultiplayerCarnageReportMetadata } from "@/src/utils/carnageReportMetadata";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  let carnageReport: Awaited<ReturnType<typeof api.sunrise2.getCarnageReport.query>> | undefined;
  try {
    carnageReport = await api.sunrise2.getCarnageReport.query({ id: params.id });
  } catch {
    carnageReport = undefined;
  }

  return buildMultiplayerCarnageReportMetadata(carnageReport, {
    path: `/halo3/carnage-report/${params.id}`,
    gameLabel: "Halo 3",
  });
}

export default async function CarnageReportPage({ params }: { params: { id: string } }) {
  const [carnageReport, relatedFiles] = await Promise.all([
    api.sunrise2.getCarnageReport.query({ id: params.id }),
    api.sunrise2.getRelatedFiles.query({ id: params.id }),
  ]);

  return (
    <CarnageReportView game="halo3" report={carnageReport} relatedFiles={relatedFiles} />
  );
}
