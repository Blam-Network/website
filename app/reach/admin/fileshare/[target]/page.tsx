import { notFound, redirect } from "next/navigation";
import { isReachAdminFileshareTarget } from "@/src/constants/reachAdminFileshare";

export default function LegacyReachAdminFilesharePage({
  params,
}: {
  params: { target: string };
}) {
  if (!isReachAdminFileshareTarget(params.target)) {
    notFound();
  }

  redirect(`/admin/fileshare/${params.target}`);
}
