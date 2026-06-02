import type { FileshareMiniIconKind } from "@/src/constants/fileshareIcons";

export const REACH_FILESHARE_FILE_TYPE_GROUPS = [
  {
    id: "screenshots" as const,
    label: "Screenshots",
    fileTypes: new Set([2]),
    meterColor: "#455B6A",
    miniIconKind: "screenshots" as const satisfies FileshareMiniIconKind,
  },
  {
    id: "films" as const,
    label: "Films",
    fileTypes: new Set([3, 4]),
    meterColor: "#97929A",
    miniIconKind: "films" as const satisfies FileshareMiniIconKind,
  },
  {
    id: "maps" as const,
    label: "Map variants",
    fileTypes: new Set([5]),
    meterColor: "#A3C1D6",
    miniIconKind: "maps" as const satisfies FileshareMiniIconKind,
  },
  {
    id: "gametypes" as const,
    label: "Game variants",
    fileTypes: new Set([6]),
    meterColor: "#AEA08A",
    miniIconKind: "gametypes" as const satisfies FileshareMiniIconKind,
  },
] as const;

export type ReachFileshareFileTypeGroupId =
  (typeof REACH_FILESHARE_FILE_TYPE_GROUPS)[number]["id"];

export const reachFileshareTableCellSx = {
  color: "text.primary",
  borderColor: "divider",
  verticalAlign: "middle" as const,
  py: 1.25,
  px: 2,
  fontSize: "0.8125rem",
  lineHeight: 1.4,
};

export const reachFileshareTableHeadCellSx = {
  color: "text.secondary",
  borderColor: "divider",
  bgcolor: "action.hover",
  py: 1.25,
  px: 2,
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.04em",
  textTransform: "uppercase" as const,
  lineHeight: 1.3,
  whiteSpace: "nowrap" as const,
};

export function formatReachFileshareFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}
