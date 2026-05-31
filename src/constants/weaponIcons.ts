export type WeaponInfo = {
  displayName: string;
  icon?: string;
};

const WEAPON_INFO: Record<string, WeaponInfo> = {
  assault_rifle: { displayName: "Assault Rifle", icon: "assault_rifle.svg" },
  battle_rifle: { displayName: "Battle Rifle", icon: "battle_rifle.svg" },
  magnum_pistol: { displayName: "Magnum", icon: "magnum.svg" },
  smg: { displayName: "SMG", icon: "smg.svg" },
  shotgun: { displayName: "Shotgun", icon: "shotgun.svg" },
  sniper_rifle: { displayName: "Sniper Rifle", icon: "sniper_rifle.svg" },
  rocket_launcher: { displayName: "Rocket Launcher", icon: "rocket_launcher.svg" },
  missile_launcher: { displayName: "Missile Pod", icon: "missile_pod.svg" },
  spartan_laser: { displayName: "Spartan Laser", icon: "spartan_laser.svg" },
  flame_thrower: { displayName: "Flamethrower", icon: "flamethrower.svg" },
  human_turret: { displayName: "Machine Gun Turret", icon: "chaingun.svg" },
  plasma_pistol: { displayName: "Plasma Pistol", icon: "plasma_pistol.svg" },
  plasma_rifle: { displayName: "Plasma Rifle", icon: "plasma_rifle.svg" },
  needler: { displayName: "Needler", icon: "needler.svg" },
  excavator: { displayName: "Mauler", icon: "mauler.svg" },
  mauler: { displayName: "Mauler", icon: "mauler.svg" },
  carbine: { displayName: "Carbine", icon: "carbine.svg" },
  beam_rifle: { displayName: "Beam Rifle", icon: "beam_rifle.svg" },
  sentinal_gun: { displayName: "Sentinel Beam", icon: "sentinel_beam.svg" },
  spike_rifle: { displayName: "Spiker", icon: "spiker.svg" },
  flak_cannon: { displayName: "Fuel Rod Cannon", icon: "fuel_rod.svg" },
  brute_shot: { displayName: "Brute Shot", icon: "brute_shot.svg" },
  energy_sword: { displayName: "Energy Sword", icon: "energy_sword.svg" },
  gravity_hammer: { displayName: "Gravity Hammer", icon: "gravity_hammer.svg" },
  plasma_cannon: { displayName: "Plasma Cannon", icon: "plasma_turret.svg" },
  guardians: { displayName: "Guardians" },
  falling_damage: { displayName: "Falling Damage" },
  generic_collision_damage: { displayName: "Collision" },
  generic_melee_damage: { displayName: "Melee" },
  generic_explosion: { displayName: "Explosion" },
  frag_grenade: { displayName: "Frag Grenade" },
  plasma_grenade: { displayName: "Plasma Grenade" },
  claymore_grenade: { displayName: "Spike Grenade" },
  firebomb_grenade: { displayName: "Firebomb Grenade" },
  flag_melee_damage: { displayName: "Flag" },
  bomb_melee_damage: { displayName: "Bomb" },
  bomb_explosion_damage: { displayName: "Bomb (Explosion)" },
  ball_melee_damage: { displayName: "Ball" },
  banshee: { displayName: "Banshee" },
  ghost: { displayName: "Ghost" },
  mongoose: { displayName: "Mongoose" },
  scorpion_gunner: { displayName: "Scorpion (Turret)" },
  warthog_driver: { displayName: "Warthog" },
  warthog_gunner: { displayName: "Warthog Turret" },
  warthog_gunner_gauss: { displayName: "Warthog Turret (Gauss)" },
  wraith: { displayName: "Wraith" },
  wraith_anti_infantry: { displayName: "Wraith Turret" },
  scorpion: { displayName: "Scorpion" },
  chopper: { displayName: "Chopper" },
  hornet: { displayName: "Hornet" },
};

function formatDamageSource(damageSource: string): string {
  return damageSource
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getWeaponInfo(damageSource: string): WeaponInfo {
  const known = WEAPON_INFO[damageSource];
  if (known) {
    return known;
  }
  return { displayName: formatDamageSource(damageSource) };
}

export function getWeaponIconPath(damageSource: string): string | undefined {
  const icon = getWeaponInfo(damageSource).icon;
  return icon ? `/img/weapons/${icon}` : undefined;
}

export function getWeaponNameFromString(damageSource: string): string {
  return getWeaponInfo(damageSource).displayName;
}
