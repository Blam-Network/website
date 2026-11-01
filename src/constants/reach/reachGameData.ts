export const REACH_MAP_NAMES: Record<number, string> = {
  1000: "Sword Base",
  1020: "Countdown",
  1035: "Boardwalk",
  1040: "Zealot",
  1055: "Powerhouse",
  1080: "Boneyard",
  1150: "Reflection",
  1200: "Spire",
  1500: "Condemned",
  1510: "Highlands",
  2001: "Anchor 9",
  2002: "Breakpoint",
  2004: "Tempest",
  3006: "Forge World",
  5005: "NOBLE Actual",
  5010: "Winter Contingency",
  5020: "ONI: Sword Base",
  5030: "Nightfall",
  5035: "Tip of the Spear",
  5045: "Long Night of Solace",
  5050: "Exodus",
  5052: "New Alexandria",
  5060: "The Package",
  5070: "The Pillar of Autumn",
  5075: "Credits",
  5080: "Lone Wolf",
  7000: "Overlook",
  7020: "Courtyard",
  7030: "Outpost",
  7040: "Waterfront",
  7060: "Beachhead",
  7080: "Holdout",
  7110: "Corvette",
  7130: "Glacier",
  7500: "Unearthed",
  10010: "Penance",
  10020: "Battle Canyon",
  10030: "Ridgeline",
  10050: "Breakneck",
  10060: "High Noon",
  10070: "Solitary",
  10080: "Installation 04",
};

export interface ReachMedal {
  name: string;
  description: string;
  sprite: number;
}

export const REACH_MEDALS: Record<number, ReachMedal> = {
  0: { name: "Extermination!", description: "Wipe out an enemy team with at least one overkill.", sprite: 0 },
  1: { name: "Perfection", description: "Win a Slayer game without dying with at least 15 kills.", sprite: 1 },
  2: { name: "Double Kill", description: "Kill 2 opponents within 4 seconds of each other.", sprite: 2 },
  3: { name: "Triple Kill", description: "Kill 3 opponents within 4 seconds of each other.", sprite: 3 },
  4: { name: "Overkill", description: "Kill 4 opponents within 4 seconds of each other.", sprite: 4 },
  5: { name: "Killtacular", description: "Kill 5 opponents within 4 seconds of each other.", sprite: 5 },
  6: { name: "Killtrocity", description: "Kill 6 opponents within 4 seconds of each other.", sprite: 6 },
  7: { name: "Killimanjaro", description: "Kill 7 opponents within 4 seconds of each other.", sprite: 7 },
  8: { name: "Killtastrophe", description: "Kill 8 opponents within 4 seconds of each other.", sprite: 8 },
  9: { name: "Killpocalypse", description: "Kill 9 opponents within 4 seconds of each other.", sprite: 9 },
  10: { name: "Killionaire", description: "Kill 10 opponents within 4 seconds of each other.", sprite: 10 },
  11: { name: "Killing Spree", description: "Kill 5 opponents in a row without dying.", sprite: 11 },
  12: { name: "Killing Frenzy", description: "Kill 10 opponents in a row without dying.", sprite: 12 },
  13: { name: "Running Riot", description: "Kill 15 opponents in a row without dying.", sprite: 13 },
  14: { name: "Rampage", description: "Kill 20 opponents in a row without dying.", sprite: 14 },
  15: { name: "Untouchable", description: "Kill 25 opponents in a row without dying.", sprite: 15 },
  16: { name: "Invincible", description: "Kill 30 opponents in a row without dying.", sprite: 16 },
  17: { name: "Inconceivable", description: "Kill 35 opponents in a row without dying.", sprite: 17 },
  18: { name: "Unfrigginbelievable", description: "Kill 40 opponents in a row without dying.", sprite: 18 },
  20: { name: "Sniper Spree", description: "Kill 5 opponents with a sniper weapon without dying.", sprite: 20 },
  21: { name: "Sharpshooter", description: "Kill 10 opponents with a sniper weapon without dying.", sprite: 21 },
  22: { name: "Be the Bullet", description: "Kill 15 opponents with a sniper weapon without dying.", sprite: 22 },
  23: { name: "Shotgun Spree", description: "Kill 5 opponents with the shotgun without dying.", sprite: 23 },
  24: { name: "Open Season", description: "Kill 10 opponents with the shotgun without dying.", sprite: 24 },
  25: { name: "Buck Wild", description: "Kill 15 opponents with the shotgun without dying.", sprite: 25 },
  26: { name: "Splatter Spree", description: "Splatter 5 opponents using a vehicle without dying.", sprite: 26 },
  27: { name: "Vehicular Manslaughter", description: "Splatter 10 opponents using a vehicle without dying.", sprite: 27 },
  28: { name: "Sunday Driver", description: "Splatter 15 opponents using a vehicle without dying.", sprite: 28 },
  29: { name: "Sword Spree", description: "Kill 5 opponents with the energy sword without dying.", sprite: 29 },
  30: { name: "Slice 'n Dice", description: "Kill 10 opponents with the energy sword without dying.", sprite: 30 },
  31: { name: "Cutting Crew", description: "Kill 15 opponents with the energy sword without dying.", sprite: 31 },
  32: { name: "Juggernaut Spree", description: "Kill 5 opponents as the juggernaut without dying.", sprite: 32 },
  33: { name: "Immovable Object", description: "Kill 10 opponents as the juggernaut without dying.", sprite: 33 },
  34: { name: "Unstoppable Force", description: "Kill 15 opponents as the juggernaut without dying.", sprite: 34 },
  35: { name: "Infection Spree", description: "Kill 5 humans in a row as the zombie without dying.", sprite: 35 },
  36: { name: "Mmmm... Brains", description: "Kill 10 humans in a row as the zombie without dying.", sprite: 36 },
  37: { name: "Thriller", description: "Kill 15 humans in a row as the zombie without dying.", sprite: 37 },
  38: { name: "Zombie Killing Spree", description: "Kill 5 zombies in a row as the human without dying.", sprite: 38 },
  39: { name: "Hell's Janitor", description: "Kill 10 zombies in a row as the human without dying.", sprite: 39 },
  40: { name: "Hell's Jerome", description: "Kill 15 zombies in a row as the human without dying.", sprite: 40 },
  41: { name: "Hail to the King", description: "Kill 5 opponents in a row from inside the hill before it moves.", sprite: 41 },
  44: { name: "Stick Spree", description: "Kill 5 opponents with grenade sticks without dying.", sprite: 44 },
  45: { name: "Sticky Fingers", description: "Kill 10 opponents with grenade sticks without dying.", sprite: 45 },
  46: { name: "Corrected", description: "Kill 15 opponents with grenade sticks without dying.", sprite: 46 },
  47: { name: "Hammer Spree", description: "Kill 5 opponents with the Gravity Hammer without dying.", sprite: 47 },
  48: { name: "Dream Crusher", description: "Kill 10 opponents with the Gravity Hammer without dying.", sprite: 48 },
  49: { name: "Wrecking Crew", description: "Kill 15 opponents with the Gravity Hammer without dying.", sprite: 49 },
  50: { name: "Assist Spree", description: "Assist in killing 5 opponents without dying.", sprite: 50 },
  51: { name: "Sidekick", description: "Assist in killing 10 opponents without dying.", sprite: 51 },
  52: { name: "Second Gunman", description: "Assist in killing 15 opponents without dying.", sprite: 52 },
  53: { name: "Laser Spree", description: "Kill 5 opponents with the Spartan Laser without dying.", sprite: 53 },
  54: { name: "Red Menace", description: "Kill 10 opponents with the Spartan Laser without dying.", sprite: 54 },
  55: { name: "Sunburst", description: "Kill 15 opponents with the Spartan Laser without dying.", sprite: 55 },
  56: { name: "Wheelman Spree", description: "Be the driver of a vehicle when passengers kill 5 opponents.", sprite: 56 },
  57: { name: "Road Hog", description: "Be the driver of a vehicle when passengers kill 10 opponents.", sprite: 57 },
  58: { name: "Road Rage", description: "Be the driver of a vehicle when passengers kill 15 opponents.", sprite: 58 },
  59: { name: "Spawn Spree", description: "Spawn a teammate into the game 5 times without dying.", sprite: 59 },
  60: { name: "Copilot", description: "Spawn a teammate into the game 10 times without dying.", sprite: 60 },
  61: { name: "BFF", description: "Spawn a teammate into the game 15 times without dying.", sprite: 61 },
  62: { name: "Bulltrue", description: "Kill an opponent that is in the act of a sword lunge.", sprite: 62 },
  63: { name: "Splatter", description: "Hit and kill an opponent with your vehicle.", sprite: 63 },
  64: { name: "Hijack", description: "Board a land-based vehicle by forcibly removing the opponent in it.", sprite: 64 },
  65: { name: "Skyjack", description: "Board an aircraft by forcibly removing the opponent in it.", sprite: 65 },
  66: { name: "Kill from the Grave", description: "Kill an opponent after you have died.", sprite: 66 },
  67: { name: "Killjoy", description: "End an opponent's killing spree.", sprite: 67 },
  68: { name: "Laser Kill", description: "Kill an opponent by using the Spartan Laser.", sprite: 68 },
  69: { name: "Grenade Stick", description: "Kill an opponent by sticking them with a plasma grenade.", sprite: 69 },
  70: { name: "Sniper Kill", description: "Get a headshot with a sniper weapon.", sprite: 70 },
  71: { name: "Beat Down", description: "Hit and kill an opponent with a melee attack from behind.", sprite: 71 },
  72: { name: "Melee Kill", description: "Hit and kill an opponent with a melee attack.", sprite: 72 },
  74: { name: "Wheelman", description: "Be the driver of a vehicle when a passenger kills an opponent.", sprite: 74 },
  75: { name: "Bomb Planted", description: "Plant the bomb in an Assault game.", sprite: 75 },
  76: { name: "Flag Captured", description: "Complete a scoring flag capture in a Capture the Flag game.", sprite: 76 },
  77: { name: "Ball Kill", description: "Get a melee kill while swinging the oddball.", sprite: 77 },
  78: { name: "Flag Kill", description: "Kill an opponent with a melee attack using the flag.", sprite: 78 },
  79: { name: "Ball Carrier Kill", description: "Killed the opponent Oddball carrier in Oddball.", sprite: 79 },
  80: { name: "Bomb Carrier Kill", description: "Kill an opponent bomb carrier in an Assault game.", sprite: 80 },
  81: { name: "Flag Carrier Kill", description: "Kill an opponent flag carrier in a Capture the Flag game.", sprite: 81 },
  82: { name: "Killed Juggernaut", description: "Kill the juggernaut in a Juggernaut game.", sprite: 82 },
  83: { name: "Killed VIP", description: "Kill an opponent's VIP in a VIP game.", sprite: 83 },
  84: { name: "Last Man Standing", description: "Be the last human in an Infection game.", sprite: 84 },
  85: { name: "Headshot", description: "Kill an opponent with a headshot.", sprite: 85 },
  86: { name: "Supercombine", description: "Kill an opponent with enough needles to cause a detonation.", sprite: 86 },
  87: { name: "EMP Assist", description: "Remove an opponent's shield with an EMP blast.", sprite: 87 },
  88: { name: "Hero", description: "Complete a wave as the last man standing.", sprite: 88 },
  89: { name: "Assist", description: "Assist a teammate in killing an enemy.", sprite: 89 },
  91: { name: "Revenge", description: "Kill the opponent responsible for your previous death.", sprite: 91 },
  92: { name: "First Strike", description: "Earn the first kill of a match.", sprite: 92 },
  93: { name: "Reload This!", description: "Kill an opponent while they are reloading.", sprite: 93 },
  94: { name: "Close Call", description: "Kill an opponent while you are weakened and without a shield. Survive.", sprite: 94 },
  95: { name: "Headcase", description: "Kill a sprinting opponent with a headshot.", sprite: 95 },
  96: { name: "Pull", description: "Kill a jet-packing opponent.", sprite: 96 },
  97: { name: "Showstopper", description: "Kill an opponent while they are performing an assassination.", sprite: 97 },
  98: { name: "Skullamanjaro", description: "Score 10 skulls at once in Headhunter.", sprite: 98 },
  99: { name: "Yoink", description: "Kill an enemy player while they are being assassinated.", sprite: 99 },
  100: { name: "Denied", description: "Activate Armor Lock and survive massive damage.", sprite: 100 },
  101: { name: "Avenger", description: "Avenge a teammate's death.", sprite: 101 },
  102: { name: "Protector", description: "Save a teammate by killing his foe.", sprite: 102 },
  103: { name: "Firebird", description: "Kill an enemy while you're jet-packing.", sprite: 103 },
  104: { name: "Assassination", description: "Kill an opponent by performing an assassination.", sprite: 104 },
  105: { name: "Killing Spree", description: "Kill 10 enemies in a row without dying.", sprite: 11 },
  106: { name: "Killing Frenzy", description: "Kill 20 enemies in a row without dying.", sprite: 12 },
  107: { name: "Running Riot", description: "Kill 30 enemies in a row without dying.", sprite: 13 },
  108: { name: "Rampage", description: "Kill 40 enemies in a row without dying.", sprite: 14 },
  109: { name: "Untouchable", description: "Kill 50 enemies in a row without dying.", sprite: 15 },
  110: { name: "Invincible", description: "Kill 100 enemies in a row without dying.", sprite: 16 },
  111: { name: "Inconceivable", description: "Kill 500 enemies in a row without dying.", sprite: 17 },
  112: { name: "Unfrigginbelievable", description: "Kill 1000 enemies in a row without dying.", sprite: 18 },
  113: { name: "Incineration", description: "Kill an opponent with a flame-based weapon.", sprite: 90 },
};

export const REACH_DAMAGE_TYPE_NAMES: readonly string[] = [
  "Unknown",
  "Guardians",
  "Scripting",
  "AI Suicide",
  "Magnum",
  "Assault Rifle",
  "DMR",
  "Shotgun",
  "Sniper Rifle",
  "Rocket Launcher",
  "Spartan Laser",
  "Frag Grenade",
  "Grenade Launcher",
  "Plasma Pistol",
  "Needler",
  "Plasma Rifle",
  "Plasma Repeater",
  "Needle Rifle",
  "Spike Rifle",
  "Plasma Launcher",
  "Gravity Hammer",
  "Energy Sword",
  "Plasma Grenade",
  "Plasma Shot",
  "Ghost",
  "Revenant Driver",
  "Revenant Gunner",
  "Wraith",
  "Wraith Anti-Infantry",
  "Banshee",
  "Banshee Bomb",
  "Seraph",
  "Mongoose",
  "Warthog Driver",
  "Warthog Gunner",
  "Warthog Gauss Gunner",
  "Warthog Rocket Gunner",
  "Scorpion",
  "Scorpion Gunner",
  "Falcon Driver",
  "Falcon Gunner",
  "Falling Damage",
  "Collision",
  "Melee",
  "Explosion",
  "Birthday Party",
  "Flag Melee Damage",
  "Bomb Melee Damage",
  "Bomb Explosion Damage",
  "Ball Melee Damage",
  "Teleporter",
  "Transfer Damage",
  "Armor Lock Crush",
  "Airstrike",
  "Human Turret",
  "Plasma Cannon",
  "Plasma Mortar",
  "Plasma Turret",
  "Shade Turret",
  "Excavator",
  "SMG",
  "Battle Rifle",
  "Carbine",
  "Beam Rifle",
  "Flak Cannon",
  "Missile Launcher",
  "Brute Shot",
  "Flamethrower",
  "Sentinel Gun",
  "Claymore Grenade",
  "Firebomb Grenade",
  "Elephant Turret",
  "Spectre Driver",
  "Spectre Gunner",
  "Tank",
  "Chopper",
  "Hornet",
  "Mantis",
  "Mauler",
  "Sentinel Beam",
  "Sentinel RPG",
  "Proximity Mine",
  "Forklift",
  "Sabre",
];
export const REACH_GUI_GAME_MODES = {
  campaign: 1,
  matchmaking: 2,
  custom: 3,
  forge: 4,
  firefight: 6,
} as const;

export type ReachGameModeFilter = keyof typeof REACH_GUI_GAME_MODES;

export const REACH_GAME_ENGINES = {
  sandbox: 1,
  megalogamengine: 2,
  campaign: 3,
  survival: 4,
} as const;

export function getReachGameModeLabel(guiGameMode: number, gameEngine?: number): string {
  switch (guiGameMode) {
    case REACH_GUI_GAME_MODES.campaign:
      return "Campaign";
    case REACH_GUI_GAME_MODES.matchmaking:
      return gameEngine === REACH_GAME_ENGINES.survival ? "Firefight Matchmaking" : "Matchmaking";
    case REACH_GUI_GAME_MODES.custom:
      return "Custom Games";
    case REACH_GUI_GAME_MODES.forge:
      return "Forge";
    case REACH_GUI_GAME_MODES.firefight:
      return "Firefight";
    default:
      return "Unknown";
  }
}

const REACH_DIFFICULTIES = ["Easy", "Normal", "Heroic", "Legendary"];

export function getReachDifficultyName(difficulty: number): string {
  return REACH_DIFFICULTIES[difficulty] ?? "Unknown";
}

export function getReachMapName(mapId: number): string {
  return REACH_MAP_NAMES[mapId] ?? `Map ${mapId}`;
}

export function getReachMedal(index: number): ReachMedal {
  return REACH_MEDALS[index] ?? { name: `Medal ${index}`, description: "", sprite: -1 };
}

export function getReachMedalImageUrl(sprite: number): string | null {
  return sprite >= 0 ? `/img/medals/reach/${sprite}.png` : null;
}

export function getReachDamageTypeName(damageType: number): string {
  return REACH_DAMAGE_TYPE_NAMES[damageType] ?? `Damage type ${damageType}`;
}

export const REACH_STATISTIC_FORMATS = {
  number: 0,
  numberWithSign: 1,
  percentage: 2,
  time: 3,
} as const;

export function formatReachStatistic(value: number, format: number): string {
  switch (format) {
    case REACH_STATISTIC_FORMATS.numberWithSign:
      return value > 0 ? `+${value}` : String(value);
    case REACH_STATISTIC_FORMATS.percentage:
      return `${value}%`;
    case REACH_STATISTIC_FORMATS.time: {
      const minutes = Math.floor(value / 60);
      const seconds = Math.abs(value % 60);
      return `${minutes}:${String(seconds).padStart(2, "0")}`;
    }
    default:
      return String(value);
  }
}

export const REACH_CUSTOM_STATISTIC_FIRST_INDEX = 15;
