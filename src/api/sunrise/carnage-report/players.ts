
import { z } from "zod";
import { StatisticsSchema } from "./statistics";

export const MedalsSchema = z.object({
  avenger: z.number(),
  nemesis: z.number(),
  unused3: z.number(),
  bash_kill: z.number(),
  flame_kill: z.number(),
  perfection: z.number(),
  koth_kill_5: z.number(),
  sniper_kill: z.number(),
  human_kill_5: z.number(),
  player_index: z.number(),
  sword_kill_5: z.number(),
  extermination: z.number(),
  human_kill_10: z.number(),
  human_kill_15: z.number(),
  sniper_kill_5: z.number(),
  sword_kill_10: z.number(),
  zombie_kill_5: z.number(),
  shotgun_kill_5: z.number(),
  sniper_kill_10: z.number(),
  vehicle_hijack: z.number(),
  zombie_kill_10: z.number(),
  aircraft_hijack: z.number(),
  bashbehind_kill: z.number(),
  deadplayer_kill: z.number(),
  multiple_kill_2: z.number(),
  multiple_kill_3: z.number(),
  multiple_kill_4: z.number(),
  multiple_kill_5: z.number(),
  multiple_kill_6: z.number(),
  multiple_kill_7: z.number(),
  multiple_kill_8: z.number(),
  multiple_kill_9: z.number(),
  shotgun_kill_10: z.number(),
  collision_kill_5: z.number(),
  kills_in_a_row_5: z.number(),
  multiple_kill_10: z.number(),
  collision_kill_10: z.number(),
  ctf_flag_captured: z.number(),
  infection_survive: z.number(),
  juggernaut_kill_5: z.number(),
  kills_in_a_row_10: z.number(),
  kills_in_a_row_15: z.number(),
  kills_in_a_row_20: z.number(),
  kills_in_a_row_25: z.number(),
  kills_in_a_row_30: z.number(),
  spartanlaser_kill: z.number(),
  juggernaut_kill_10: z.number(),
  shotgun_kill_sword: z.number(),
  stickygrenade_kill: z.number(),
  vehicle_impact_kill: z.number(),
  vip_player_kill_vip: z.number(),
  assault_bomb_planted: z.number(),
  driver_assist_gunner: z.number(),
  player_kill_spreeplayer: z.number(),
  assault_player_kill_carrier: z.number(),
  oddball_carrier_kill_player: z.number(),
  ctf_flag_carrier_kill_player: z.number(),
  ctf_flag_player_kill_carrier: z.number(),
  juggernaut_player_kill_juggernaut: z.number(),
});

export const AchievementsSchema = z.object({
  fog: z.number(),
  mvp: z.number(),
  iron: z.number(),
  tilt: z.number(),
  askar: z.number(),
  catch: z.number(),
  demon: z.number(),
  famine: z.number(),
  mythic: z.number(),
  ranger: z.number(),
  refuge: z.number(),
  _return: z.number(),
  assault: z.number(),
  holdout: z.number(),
  orpheus: z.number(),
  the_key: z.number(),
  cavalier: z.number(),
  graduate: z.number(),
  guerilla: z.number(),
  landfall: z.number(),
  overkill: z.number(),
  the_road: z.number(),
  vanguard: z.number(),
  black_eye: z.number(),
  cleansing: z.number(),
  reclaimer: z.number(),
  last_stand: z.number(),
  tough_luck: z.number(),
  triple_kill: z.number(),
  two_for_one: z.number(),
  exterminator: z.number(),
  marathon_man: z.number(),
  player_index: z.number(),
  thunderstorm: z.number(),
  unsc_spartan: z.number(),
  steppin_razor: z.number(),
  killing_frenzy: z.number(),
  headshot_honcho: z.number(),
  spartan_officer: z.number(),
  mongoose_mowdown: z.number(),
  used_car_salesman: z.number(),
  fear_the_pink_mist: z.number(),
  too_close_to_the_sun: z.number(),
  lee_r_wilson_memorial: z.number(),
  maybe_next_time_buddy: z.number(),
  up_close_and_personal: z.number(),
  we_re_in_for_some_chop: z.number(),
  campaign_complete_heroic: z.number(),
  campaign_complete_normal: z.number(),
  campaign_complete_legendary: z.number(),
});

export const DamageSourceEnum = z.enum([
    'guardians',
    'falling_damage',
    'generic_collision_damage',
    'generic_melee_damage',
    'generic_explosion',
    'magnum_pistol',
    'plasma_pistol',
    'needler',
    'excavator',
    'smg',
    'plasma_rifle',
    'battle_rifle',
    'carbine',
    'shotgun',
    'sniper_rifle',
    'beam_rifle',
    'assault_rifle',
    'spike_rifle',
    'flak_cannon',
    'missile_launcher',
    'rocket_launcher',
    'spartan_laser',
    'brute_shot',
    'flame_thrower',
    'sentinal_gun',
    'energy_sword',
    'gravity_hammer',
    'frag_grenade',
    'plasma_grenade',
    'claymore_grenade',
    'firebomb_grenade',
    'flag_melee_damage',
    'bomb_melee_damage',
    'bomb_explosion_damage',
    'ball_melee_damage',
    'human_turret',
    'plasma_cannon',
    'unknown_37',
    'unknown_38',
    'banshee',
    'ghost',
    'mongoose',
    'unknown_42',
    'scorpion_gunner',
    'unknown_44',
    'unknown_45',
    'warthog_driver',
    'warthog_gunner',
    'warthog_gunner_gauss',
    'wraith',
    'wraith_anti_infantry',
    'scorpion',
    'chopper',
    'hornet',
    'mauler',
    'unknown_56',
    'unknown_57',
    'unknown_58',
    'unknown_59',
    'prox_mine',
    'unknown_61',
]);

export const getDamageSourceCategory = (damageSource: z.infer<typeof DamageSourceEnum>): "WEAPON" | "GRENADE" | "MELEE" | "OTHER" | 'VEHICLE' => {
  switch (damageSource) {
    case 'magnum_pistol':
    case 'plasma_pistol':
    case 'needler':
    case 'excavator':
    case 'smg':
    case 'plasma_rifle':
    case 'battle_rifle':
    case 'carbine':
    case 'shotgun':
    case 'sniper_rifle':
    case 'beam_rifle':
    case 'assault_rifle':
    case 'spike_rifle':
    case 'flak_cannon':
    case 'missile_launcher':
    case 'rocket_launcher':
    case 'spartan_laser':
    case 'brute_shot':
    case 'flame_thrower':
    case 'sentinal_gun':
    case 'energy_sword':
    case 'gravity_hammer':
    case 'human_turret':
    case 'plasma_cannon':
    case 'mauler':
      return 'WEAPON';
    case 'frag_grenade':
    case 'plasma_grenade':
    case 'claymore_grenade':
    case 'firebomb_grenade':
      return 'GRENADE';
    case 'generic_melee_damage':
    case 'flag_melee_damage':
    case 'bomb_melee_damage':
      return 'MELEE';
    case 'bomb_explosion_damage':
    case 'ball_melee_damage':
    case 'bomb_melee_damage':
      return 'OTHER';
    case 'banshee':
    case 'ghost':
    case 'mongoose':
    case 'scorpion_gunner':
    case 'warthog_driver':
    case 'warthog_gunner':
    case 'warthog_gunner_gauss':
    case 'wraith':
    case 'wraith_anti_infantry':
    case 'scorpion':
    case 'chopper':
    case 'hornet':
    case 'prox_mine':
      return 'VEHICLE';
    default:
      return 'OTHER';
  }
};

export const getDamageSourceName = (damageSource: z.infer<typeof DamageSourceEnum>): string => {
  switch (damageSource) {
    case 'guardians':
      return 'Guardians';
    case 'falling_damage':
      return 'Falling Damage';
    case 'generic_collision_damage':
      return 'Collision';
    case 'generic_melee_damage':
      return 'Melee';
    case 'generic_explosion':
      return 'Explosion';
    case 'magnum_pistol':
      return 'Magnum Pistol';
    case 'plasma_pistol':
      return 'Plasma Pistol';
    case 'needler':
      return 'Needler';
    case 'excavator':
      return 'Excavator';
    case 'smg':
      return 'SMG';
    case 'plasma_rifle':
      return 'Plasma Rifle';
    case 'battle_rifle':
      return 'Battle Rifle';
    case 'carbine':
      return 'Carbine';
    case 'shotgun':
      return 'Shotgun';
    case 'sniper_rifle':
      return 'Sniper Rifle';
    case 'beam_rifle':
      return 'Beam Rifle';
    case 'assault_rifle':
      return 'Assault Rifle';
    case 'spike_rifle':
      return 'Spike Rifle';
    case 'flak_cannon':
      return 'Flak Cannon';
    case 'missile_launcher':
      return 'Missile Pod';
    case 'rocket_launcher':
      return 'Rocket Launcher';
    case 'spartan_laser':
      return 'Spartan Laser';
    case 'brute_shot':
      return 'Brute Shot';
    case 'flame_thrower':
      return 'Flame Thrower';
    case 'sentinal_gun':
      return 'Sentinal Gun';
    case 'energy_sword':
      return 'Energy Sword';
    case 'gravity_hammer':
      return 'Gravity Hammer';
    case 'frag_grenade':
      return 'Frag Grenade';
    case 'plasma_grenade':
      return 'Plasma Grenade';
    case 'claymore_grenade':
      return 'Spike Grenade';
    case 'firebomb_grenade':
      return 'Firebomb Grenade';
    case 'flag_melee_damage':
      return 'Flag Melee Damage';
    case 'bomb_melee_damage':
      return 'Bomb Melee Damage';
    case 'ball_melee_damage':
      return 'Ball Melee Damage';
    case 'human_turret':
      return 'Human Turret';
    case 'plasma_cannon':
      return 'Plasma Cannon';
    case 'unknown_37':
      return 'Unknown 37';
    case 'unknown_38':
      return 'Unknown 38';
    case 'banshee':
      return 'Banshee';
    case 'ghost':
      return 'Ghost';
    case 'mongoose':
      return 'Mongoose';
    case 'unknown_42':
      return 'Unknown 42';
    case 'scorpion_gunner':
      return 'Scorpion Gunner';
    case 'unknown_44':
      return 'Unknown 44';
    case 'unknown_45':
      return 'Unknown 45';
    case 'warthog_driver':
      return 'Warthog Driver';
    case 'warthog_gunner':
      return 'Warthog Gunner';
    case 'warthog_gunner_gauss':
      return 'Warthog Gunner Gauss';
    case 'wraith':
      return 'Wraith';
    case 'wraith_anti_infantry':
      return 'Wraith Anti Infantry';
    case 'scorpion':
      return 'Scorpion';
    case 'chopper':
      return 'Chopper';
    case 'hornet':
      return 'Hornet';
    case 'mauler':
      return 'Mauler';
    case 'unknown_56':
      return 'Unknown 56';
    case 'unknown_57':
      return 'Unknown 57';
    case 'unknown_58':
      return 'Unknown 58';
    case 'unknown_59':
      return 'Unknown 59';
    case 'prox_mine':
      return 'Prox Mine';
    case 'unknown_61':
      return 'Unknown 61';
    default:
      return damageSource;
  }
}

export const DamageStatisticSchema = z.object({
    kills: z.number(),
    deaths: z.number(),
    suicides: z.number(),
    betrayals: z.number(),
    headshots: z.number(),
    damage_source: DamageSourceEnum,
});

export const PlayerSchema = z.object({
  score: z.number(),
  result: z.number(),
  standing: z.number().transform((standing) => standing + 1),
  ban_flags: z.number(),
  gamer_zone: z.number(),
  is_griefer: z.number(),
  cheat_flags: z.number(),
  last_played: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  player_name: z.string(),
  player_team: z.number(),
  player_xuid: z.string(),
  service_tag: z.string(),
  desires_veto: z.boolean(),
  emblem_flags: z.number(),
  first_played: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  gamer_region: z.number(),
  player_index: z.number(),
  machine_index: z.number().nullable(),
  session_party_nonce: z.string().nullable(),
  machine_host: z.boolean().nullable(),
  machine_initial_host: z.boolean().nullable(),
  primary_color: z.number(),
  tertiary_color: z.number(),
  desires_rematch: z.boolean(),
  secondary_color: z.number(),
  appearance_flags: z.number(),
  background_emblem: z.number(),
  foreground_emblem: z.number(),
  is_online_enabled: z.boolean(),
  player_identifier: z.string(),
  elite_model_area_0: z.number(),
  elite_model_area_1: z.number(),
  elite_model_area_2: z.number(),
  elite_model_area_3: z.number(),
  hopper_access_flags: z.number(),
  player_model_choice: z.number(),
  bungienet_user_flags: z.number(),
  emblem_primary_color: z.number(),
  hopper_statistics_mu: z.number(),
  player_assigned_team: z.number(),
  spartan_model_area_0: z.number(),
  spartan_model_area_1: z.number(),
  spartan_model_area_2: z.number(),
  spartan_model_area_3: z.number(),
  custom_games_completed: z.number(),
  emblem_secondary_color: z.number(),
  hopper_experience_base: z.number(),
  host_stats_global_rank: z.number(),
  is_controller_attached: z.boolean(),
  is_silver_or_gold_live: z.boolean(),
  emblem_background_color: z.number(),
  global_statistics_valid: z.number(),
  hopper_statistics_sigma: z.number(),
  hopper_statistics_valid: z.number(),
  host_stats_global_grade: z.number(),
  host_stats_global_valid: z.boolean(),
  host_stats_hopper_skill: z.number(),
  host_stats_hopper_valid: z.boolean(),
  experience_growth_banned: z.boolean(),
  user_selected_team_index: z.number(),
  hopper_experience_penalty: z.number(),
  is_free_live_gold_account: z.boolean(),
  repeated_play_coefficient: z.number(),
  matchmade_ranked_games_won: z.number(),
  hopper_statistics_games_won: z.number(),
  hopper_statistics_identifier: z.number(),
  host_stats_global_experience: z.number(),
  campaign_difficulty_completed: z.number(),
  matchmade_ranked_games_played: z.number(),
  hopper_statistics_games_played: z.number(),
  hopper_statistics_hopper_skill: z.number(),
  global_statistics_highest_skill: z.number(),
  host_stats_hopper_skill_display: z.number(),
  is_user_created_content_allowed: z.boolean(),
  matchmade_unranked_games_played: z.number(),
  matchmade_ranked_games_completed: z.number(),
  global_statistics_experience_base: z.number(),
  hopper_statistics_games_completed: z.number(),
  is_friend_created_content_allowed: z.boolean(),
  matchmade_unranked_games_completed: z.number(),
  global_statistics_experience_penalty: z.number(),
  host_stats_hopper_skill_update_weight: z.number(),
  statistics: StatisticsSchema,
  medals: MedalsSchema,
  achievements: AchievementsSchema,
  damage_statistics: z.array(DamageStatisticSchema).nullable().transform((element) => (element === null ? [] : element)),
});


export const PlayerInteractionSchema = z.object({
    killed: z.number(),
    killed_by: z.number(),
    left_player_index: z.number(),
    right_player_index: z.number(),
});