import type { ReachAdminFileshareTarget } from "@/src/constants/reachAdminFileshare";

export type ReachFileshareSessionUser = {
  is_admin?: boolean;
  is_uploader?: boolean;
};

export function canAccessAdminHub(user: ReachFileshareSessionUser | undefined): boolean {
  return user?.is_admin === true;
}

export function canAccessBlamnetworkFileshareUpload(
  user: ReachFileshareSessionUser | undefined,
): boolean {
  return user?.is_admin === true || user?.is_uploader === true;
}

export function canUploadToAdminFileshareTarget(
  user: ReachFileshareSessionUser | undefined,
  target: ReachAdminFileshareTarget,
): boolean {
  if (!user) return false;
  if (user.is_admin) return true;
  if (user.is_uploader && target === "blamnetwork") return true;
  return false;
}

export function canDeleteFromAdminFileshare(user: ReachFileshareSessionUser | undefined): boolean {
  return user?.is_admin === true;
}

export const BLAMNETWORK_FILESHARE_UPLOAD_PATH = "/admin/fileshare/blamnetwork";

export function isBlamnetworkFileshareUploadPath(pathname: string): boolean {
  return (
    pathname === BLAMNETWORK_FILESHARE_UPLOAD_PATH ||
    pathname.startsWith(`${BLAMNETWORK_FILESHARE_UPLOAD_PATH}/`)
  );
}
