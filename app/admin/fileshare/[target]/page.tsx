import { notFound } from "next/navigation";
import { ReachFileshareUploadPage } from "@/src/components/reach/ReachFileshareUploadPage";
import { isReachAdminFileshareTarget } from "@/src/constants/reachAdminFileshare";

export default function AdminFileshareUploadPage({
  params,
}: {
  params: { target: string };
}) {
  if (!isReachAdminFileshareTarget(params.target)) {
    notFound();
  }

  return <ReachFileshareUploadPage fileshareTarget={params.target} />;
}
