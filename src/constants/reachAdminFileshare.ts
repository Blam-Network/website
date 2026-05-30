export const REACH_ADMIN_FILESHARE_TARGETS = {
    blamnetwork: {
        shareId: "FFFFFFFFFFFFFF10",
        label: "Blam Network",
    },
    bungie: {
        shareId: "FFFFFFFFFFFFFF03",
        label: "Bungie",
    },
} as const;

export type ReachAdminFileshareTarget = keyof typeof REACH_ADMIN_FILESHARE_TARGETS;

export function isReachAdminFileshareTarget(value: string): value is ReachAdminFileshareTarget {
    return value in REACH_ADMIN_FILESHARE_TARGETS;
}

export function reachAdminFileshareShareId(target: ReachAdminFileshareTarget): string {
    return REACH_ADMIN_FILESHARE_TARGETS[target].shareId;
}
