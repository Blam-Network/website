import type {
  ReachNameplateEquipId,
  ReachNameplateId,
} from "@/src/api/reach/reachNameplateTypes";

export interface ReachNameplateDefinition {
  id: ReachNameplateEquipId;
  label: string;
  shortLabel: string;
  imageSrc: string;
  description: string;
  /** Shown when locked (achievement hint or manual grant). */
  unlockHint: string;
}

const NAMEPLATE_IMAGE_BASE = "/img/service_record/reach";

const REACH_NAMEPLATE_DEFINITIONS_BY_ID: Record<ReachNameplateId, ReachNameplateDefinition> = {
  marathon: {
    id: "marathon",
    label: "Marathon Durandal",
    shortLabel: "Marathon",
    imageSrc: `${NAMEPLATE_IMAGE_BASE}/nameplate_marathon.png`,
    description:
      "Unlock an achievement for Marathon Durandal on the Xbox LIVE Arcade to receive this nameplate.",
    unlockHint: "Unlock any Marathon Durandal achievement on the Xbox LIVE Arcade.",
  },
  halo1: {
    id: "halo1",
    label: "Halo: Combat Evolved",
    shortLabel: "Halo CE",
    imageSrc: `${NAMEPLATE_IMAGE_BASE}/nameplate_halo1.png`,
    description:
      "Unlock an achievement for Halo: Combat Evolved Anniversary on Xbox 360 to receive this nameplate.",
    unlockHint: "Unlock any Halo: Combat Evolved Anniversary achievement on Xbox 360.",
  },
  halo2: {
    id: "halo2",
    label: "Halo 2",
    shortLabel: "Halo 2",
    imageSrc: `${NAMEPLATE_IMAGE_BASE}/nameplate_halo2.png`,
    description: "Unlock an achievement for Halo 2 on PC to receive this nameplate.",
    unlockHint: "Unlock any Halo 2 achievement on PC.",
  },
  halo3: {
    id: "halo3",
    label: "Halo 3",
    shortLabel: "Halo 3",
    imageSrc: `${NAMEPLATE_IMAGE_BASE}/nameplate_halo3.png`,
    description: "Unlock an achievement for Halo 3 on Xbox 360 to receive this nameplate.",
    unlockHint: "Unlock any Halo 3 achievement on Xbox 360.",
  },
  odst: {
    id: "odst",
    label: "Halo 3: ODST",
    shortLabel: "ODST",
    imageSrc: `${NAMEPLATE_IMAGE_BASE}/nameplate_odst.png`,
    description: "Unlock an achievement for Halo 3: ODST on Xbox 360 to receive this nameplate.",
    unlockHint: "Unlock any Halo 3: ODST achievement on Xbox 360.",
  },
  halo: {
    id: "halo",
    label: "Halo",
    shortLabel: "Halo",
    imageSrc: `${NAMEPLATE_IMAGE_BASE}/nameplate_halo.png`,
    description: "Unlock the Halo 1, 2, 3 and ODST nameplates to receive this nameplate.",
    unlockHint: "Unlock the Halo CE, Halo 2, Halo 3, and ODST nameplates.",
  },
  column: {
    id: "column",
    label: "Seventh Column",
    shortLabel: "7th Column",
    imageSrc: `${NAMEPLATE_IMAGE_BASE}/nameplate_column.png`,
    description: "Available to all players.",
    unlockHint: "Always available.",
  },
  ar: {
    id: "ar",
    label: "Assault Rifle",
    shortLabel: "Assault Rifle",
    imageSrc: `${NAMEPLATE_IMAGE_BASE}/nameplate_ar.png`,
    description: "Given to players who have performed testing for Blam Network projects.",
    unlockHint: "Awarded to Blam Network testers.",
  },
  dmr: {
    id: "dmr",
    label: "DMR",
    shortLabel: "DMR",
    imageSrc: `${NAMEPLATE_IMAGE_BASE}/nameplate_dmr.png`,
    description: "Locked",
    unlockHint: "Locked",
  },
  helmet: {
    id: "helmet",
    label: "Mark VI",
    shortLabel: "Helmet",
    imageSrc: `${NAMEPLATE_IMAGE_BASE}/nameplate_helmet.png`,
    description: "Locked",
    unlockHint: "Locked",
  },
  star: {
    id: "star",
    label: "Allstar",
    shortLabel: "Allstar",
    imageSrc: `${NAMEPLATE_IMAGE_BASE}/nameplate_star.png`,
    description: "Locked",
    unlockHint: "Locked",
  },
  bungie: {
    id: "bungie",
    label: "Bungie",
    shortLabel: "Bungie",
    imageSrc: `${NAMEPLATE_IMAGE_BASE}/nameplate_bungie.png`,
    description: "Given to the Blam Network team.",
    unlockHint: "Blam Network team members only.",
  },
};

export const REACH_NAMEPLATE_NONE: ReachNameplateDefinition = {
  id: "none",
  label: "None",
  shortLabel: "None",
  imageSrc: `${NAMEPLATE_IMAGE_BASE}/nameplate_none.png`,
  description: "Clear your equipped nameplate.",
  unlockHint: "Always available.",
};

export const REACH_NAMEPLATE_ROW_LAYOUT: {
  top: ReachNameplateId[];
  bottom: ReachNameplateEquipId[];
} = {
  top: ["marathon", "halo1", "halo2", "halo3", "odst", "halo"],
  bottom: ["column", "ar", "dmr", "helmet", "star", "bungie"],
};

/** Hidden in the picker until unlocked (omitted from the row until then). */
export const REACH_NAMEPLATES_HIDDEN_WHEN_LOCKED: ReachNameplateId[] = [
  "dmr",
  "helmet",
  "star",
  "bungie",
];

export function isReachNameplateVisibleInPicker(
  id: ReachNameplateEquipId,
  unlocks: Record<ReachNameplateId, boolean>,
): boolean {
  if (id === "none") {
    return false;
  }
  if (!REACH_NAMEPLATES_HIDDEN_WHEN_LOCKED.includes(id)) {
    return true;
  }
  return unlocks[id] ?? false;
}

/** Fixed column count so both rows share the same tile spacing (bottom row defines width). */
export const REACH_NAMEPLATE_GRID_COLUMN_COUNT = REACH_NAMEPLATE_ROW_LAYOUT.bottom.length;

export const REACH_NAMEPLATE_DEFINITIONS: ReachNameplateDefinition[] = [
  ...REACH_NAMEPLATE_ROW_LAYOUT.top.map((id) => REACH_NAMEPLATE_DEFINITIONS_BY_ID[id]),
  ...REACH_NAMEPLATE_ROW_LAYOUT.bottom
    .filter((id): id is ReachNameplateId => id !== "none")
    .map((id) => REACH_NAMEPLATE_DEFINITIONS_BY_ID[id]),
  REACH_NAMEPLATE_NONE,
];

export function getReachNameplateDefinition(id: ReachNameplateEquipId): ReachNameplateDefinition {
  if (id === "none") {
    return REACH_NAMEPLATE_NONE;
  }
  return REACH_NAMEPLATE_DEFINITIONS_BY_ID[id];
}
