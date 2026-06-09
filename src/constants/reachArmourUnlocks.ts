import type { ReachUnlockableHelmetId } from "@/src/api/reach/reachArmourUnlockTypes";

export interface ReachArmourUnlockDefinition {
  id: ReachUnlockableHelmetId;
  label: string;
  shortLabel: string;
  imageSrc: string;
  description: string;
  unlockHint: string;
  unlockPrompt: string;
}

const ARMOUR_IMAGE_BASE = "/img/service_record/reach/armour";

export const REACH_ARMOUR_UNLOCK_DEFINITIONS_BY_ID: Record<
  ReachUnlockableHelmetId,
  ReachArmourUnlockDefinition
> = {
  militarypolice_base: {
    id: "militarypolice_base",
    label: "Military Police",
    shortLabel: "Military Police",
    imageSrc: `${ARMOUR_IMAGE_BASE}/reach_helmet_piece_58_00.png`,
    description:
      "Unlock The Soldier We Need You To Be achievement for Halo: Reach to make this helmet purchasable in-game.",
    unlockHint: "Unlock The Soldier We Need You To Be in Halo: Reach.",
    unlockPrompt: "Requirements met. Click to unlock this helmet.",
  },
  militarypolice_cbrnhurs: {
    id: "militarypolice_cbrnhurs",
    label: "Military Police - CBRN/HU/RS",
    shortLabel: "MP CBRN/HU/RS",
    imageSrc: `${ARMOUR_IMAGE_BASE}/reach_helmet_piece_59_00.png`,
    description:
      "Unlock the Military Police helmet and the Pink and Deadly achievement for Halo 3: ODST.",
    unlockHint: "Unlock Military Police and Pink and Deadly in Halo 3: ODST.",
    unlockPrompt: "Requirements met. Click to unlock this helmet.",
  },
  militarypolice_hurscnm: {
    id: "militarypolice_hurscnm",
    label: "Military Police - HU/RS/CNM",
    shortLabel: "MP HU/RS/CNM",
    imageSrc: `${ARMOUR_IMAGE_BASE}/reach_helmet_piece_60_00.png`,
    description:
      "Unlock the Military Police - CBRN/HU/RS helmet and the Fear the Pink Mist achievement for Halo 3.",
    unlockHint: "Unlock Military Police - CBRN/HU/RS and Fear the Pink Mist in Halo 3.",
    unlockPrompt: "Requirements met. Click to unlock this helmet.",
  },
  cqb_base: {
    id: "cqb_base",
    label: "CQB",
    shortLabel: "CQB",
    imageSrc: `${ARMOUR_IMAGE_BASE}/reach_helmet_piece_61_00.png`,
    description:
      "Unlock the Folks Need Heroes... achievement for Halo: Reach to make this helmet purchasable in-game.",
    unlockHint: "Unlock Folks Need Heroes... in Halo: Reach.",
    unlockPrompt: "Requirements met. Click to unlock this helmet.",
  },
  cqb_hurscnm: {
    id: "cqb_hurscnm",
    label: "CQB - HU/RS/CNM",
    shortLabel: "CQB HU/RS/CNM",
    imageSrc: `${ARMOUR_IMAGE_BASE}/reach_helmet_piece_62_00.png`,
    description:
      "Unlock CQB and the Campaign Complete: Heroic achievement for Halo 3: ODST.",
    unlockHint: "Unlock CQB and Campaign Complete: Heroic in Halo 3: ODST.",
    unlockPrompt: "Requirements met. Click to unlock this helmet.",
  },
  cqb_uahul: {
    id: "cqb_uahul",
    label: "CQB - UA/HUL",
    shortLabel: "CQB UA/HUL",
    imageSrc: `${ARMOUR_IMAGE_BASE}/reach_helmet_piece_63_00.png`,
    description:
      "Unlock CQB - HU/RS/CNM and the Campaign Complete: Legendary achievement for Halo 3.",
    unlockHint: "Unlock CQB - HU/RS/CNM and Campaign Complete: Legendary in Halo 3.",
    unlockPrompt: "Requirements met. Click to unlock this helmet.",
  },
  chest_uabasesecurity: {
    id: "chest_uabasesecurity",
    label: "UA/Base Security [W]",
    shortLabel: "UA/Base Security [W]",
    imageSrc: `${ARMOUR_IMAGE_BASE}/reach_chest_piece_18_00.png`,
    description:
      "Unlock the Yes, Sensei achievement for Halo: Reach to make this chest piece purchasable in-game.",
    unlockHint: "Unlock Yes, Sensei in Halo: Reach.",
    unlockPrompt: "Requirements met. Click to unlock this chest piece.",
  },
};

export const REACH_ARMOUR_UNLOCK_ROW_LAYOUT: ReachUnlockableHelmetId[] = [
  "militarypolice_base",
  "militarypolice_cbrnhurs",
  "militarypolice_hurscnm",
  "cqb_base",
  "cqb_hurscnm",
  "cqb_uahul",
  "chest_uabasesecurity",
];

export const REACH_ARMOUR_UNLOCK_GRID_COLUMN_COUNT = REACH_ARMOUR_UNLOCK_ROW_LAYOUT.length;

export function getReachArmourUnlockDefinition(
  id: ReachUnlockableHelmetId,
): ReachArmourUnlockDefinition {
  return REACH_ARMOUR_UNLOCK_DEFINITIONS_BY_ID[id];
}
