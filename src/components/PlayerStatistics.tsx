"use client";

import React from "react";
import { Box, Typography, Paper, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Link, Tooltip } from "@mui/material";
import { keyframes } from "@mui/system";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from "recharts";
import { api } from "@/src/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { ActivityHeatmap } from "./ActivityHeatmap";
import { Medal } from "./Medal";
import { Emblem } from "./Emblem";
import { getCssColor, getColor, getTextColor, getColorName } from "../colors";
import NextLink from "next/link";

interface PlayerStatisticsProps {
  gamertag: string;
}

const COLORS: Record<string, string> = {
  Campaign: "#7CB342",
  Matchmaking: "#4A90E2",
  "Custom Games": "#9C27B0",
  Forge: "#FF9800",
  Kills: "#4CAF50",
  Deaths: "#F44336",
};

// Damage source enum from backend (killType index -> damage source string)
const damageSourceEnum = [
  'guardians', 'falling_damage', 'generic_collision_damage', 'generic_melee_damage',
  'generic_explosion', 'magnum_pistol', 'plasma_pistol', 'needler', 'excavator',
  'smg', 'plasma_rifle', 'battle_rifle', 'carbine', 'shotgun', 'sniper_rifle',
  'beam_rifle', 'assault_rifle', 'spike_rifle', 'flak_cannon', 'missile_launcher',
  'rocket_launcher', 'spartan_laser', 'brute_shot', 'flame_thrower', 'sentinal_gun',
  'energy_sword', 'gravity_hammer', 'frag_grenade', 'plasma_grenade', 'claymore_grenade',
  'firebomb_grenade', 'flag_melee_damage', 'bomb_melee_damage', 'bomb_explosion_damage',
  'ball_melee_damage', 'human_turret', 'plasma_cannon', 'unknown_37', 'unknown_38',
  'banshee', 'ghost', 'mongoose', 'unknown_42', 'scorpion_gunner', 'unknown_44',
  'unknown_45', 'warthog_driver', 'warthog_gunner', 'warthog_gunner_gauss', 'wraith',
  'wraith_anti_infantry', 'scorpion', 'chopper', 'hornet', 'mauler', 'unknown_56',
  'unknown_57', 'unknown_58', 'tripmine', 'sandtrap_mine', 'unknown_61',
];

// Helper function to get weapon name from damage source string
const getWeaponNameFromString = (damageSource: string): string => {
  const weaponNameMap: Record<string, string> = {
    'guardians': 'Guardians',
    'falling_damage': 'Falling Damage',
    'generic_collision_damage': 'Collision',
    'generic_melee_damage': 'Melee',
    'generic_explosion': 'Explosion',
    'magnum_pistol': 'Magnum',
    'plasma_pistol': 'Plasma Pistol',
    'needler': 'Needler',
    'excavator': 'Mauler',
    'smg': 'SMG',
    'plasma_rifle': 'Plasma Rifle',
    'battle_rifle': 'Battle Rifle',
    'carbine': 'Carbine',
    'shotgun': 'Shotgun',
    'sniper_rifle': 'Sniper Rifle',
    'beam_rifle': 'Beam Rifle',
    'assault_rifle': 'Assault Rifle',
    'spike_rifle': 'Spiker',
    'flak_cannon': 'Fuel Rod Cannon',
    'missile_launcher': 'Missile Pod',
    'rocket_launcher': 'Rocket Launcher',
    'spartan_laser': 'Spartan Laser',
    'brute_shot': 'Brute Shot',
    'flame_thrower': 'Flamethrower',
    'sentinal_gun': 'Sentinel Beam',
    'energy_sword': 'Energy Sword',
    'gravity_hammer': 'Gravity Hammer',
    'frag_grenade': 'Frag Grenade',
    'plasma_grenade': 'Plasma Grenade',
    'claymore_grenade': 'Spike Grenade',
    'firebomb_grenade': 'Firebomb Grenade',
    'flag_melee_damage': 'Flag',
    'bomb_melee_damage': 'Bomb',
    'bomb_explosion_damage': 'Bomb (Explosion)',
    'ball_melee_damage': 'Ball',
    'human_turret': 'Machine Gun Turret',
    'plasma_cannon': 'Plasma Cannon',
    'banshee': 'Banshee',
    'ghost': 'Ghost',
    'mongoose': 'Mongoose',
    'scorpion_gunner': 'Scorpion (Turret)',
    'warthog_driver': 'Warthog',
    'warthog_gunner': 'Warthog Turret',
    'warthog_gunner_gauss': 'Warthog Turret (Gauss)',
    'wraith': 'Wraith',
    'wraith_anti_infantry': 'Wraith Turret',
    'scorpion': 'Scorpion',
    'chopper': 'Chopper',
    'hornet': 'Hornet',
    'mauler': 'Mauler',
  };
  
  // Format the damage source string (replace underscores with spaces, capitalize)
  const formatted = damageSource
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return weaponNameMap[damageSource] || formatted;
};

// Helper function to get weapon name from killType (number)
const getWeaponName = (killType: number): string => {
  const damageSource = damageSourceEnum[killType];
  if (!damageSource) {
    return `Unknown (${killType})`;
  }
  return getWeaponNameFromString(damageSource);
};

// Helper function to format medal type name (fallback)
const formatMedalTypeName = (medalType: string): string => {
  return medalType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Medal display names mapping (proper Halo 3 names)
const MEDAL_NAMES: Record<string, string> = {
  perfection: "Perfection",
  extermination: "Extermination",
  steaktacular: "Steaktacular!",
  linktacular: "Linktacular!",
  kills_in_a_row_5: "Killing Spree",
  kills_in_a_row_10: "Killing Frenzy",
  kills_in_a_row_15: "Running Riot",
  kills_in_a_row_20: "Rampage",
  kills_in_a_row_25: "Untouchable",
  kills_in_a_row_30: "Invincible",
  shotgun_kill_5: "Shotgun Spree",
  shotgun_kill_10: "Shotgun Spree",
  sword_kill_5: "Sword Spree",
  sword_kill_10: "Sword Spree",
  sniper_kill_5: "Sniper Spree",
  sniper_kill_10: "Sniper Spree",
  collision_kill_5: "Vehicle Spree",
  collision_kill_10: "Vehicle Spree",
  multiple_kill_2: "Double Kill",
  multiple_kill_3: "Triple Kill",
  multiple_kill_4: "Overkill",
  multiple_kill_5: "Killtacular",
  multiple_kill_6: "Killtrocity",
  multiple_kill_7: "Killimanjaro",
  multiple_kill_8: "Killtastrophe",
  multiple_kill_9: "Killpocalypse",
  multiple_kill_10: "Killionaire",
  bash_kill: "Melee",
  bashbehind_kill: "Assassination",
  sniper_kill: "Sniper Headshot",
  stickygrenade_kill: "Sticky",
  spartanlaser_kill: "Laser Kill",
  oddball_carrier_kill_player: "Ball Kill",
  ctf_flag_carrier_kill_player: "Flag Kill",
  vehicle_impact_kill: "Splatter",
  flame_kill: "Incineration",
  player_kill_spreeplayer: "Killjoy",
  deadplayer_kill: "Kill from the Grave",
  vehicle_hijack: "Hijack",
  shotgun_kill_sword: "Bulltrue",
  driver_assist_gunner: "Driver Assist",
  aircraft_hijack: "Skyjack",
  ctf_flag_player_kill_carrier: "Kill Flag Carrier",
  ctf_flag_captured: "Flag Capture",
  juggernaut_player_kill_juggernaut: "Kill Juggernaut",
  vip_player_kill_vip: "Kill VIP",
  assault_player_kill_carrier: "Kill Bomb Carrier",
  assault_bomb_planted: "Bomb Planted",
  infection_survive: "Last Man Standing",
  koth_kill_5: "Hill Spree",
  koth_kill_10: "Hill Spree",
  human_kill_5: "Infection Spree",
  human_kill_10: "Infection Spree",
  zombie_kill_5: "Zombie Killing Spree",
  zombie_kill_10: "Zombie Killing Spree",
  juggernaut_kill_5: "Juggernaut Spree",
  juggernaut_kill_10: "Juggernaut Spree",
};

// Medal descriptions mapping
const MEDAL_DESCRIPTIONS: Record<string, string> = {
  perfection: "Score 15 kills without dying in a ranked free-for-all playlist.",
  extermination: "Kill all 4 members of the opposing team in a ranked team playlist.",
  steaktacular: "Play in a matchmade slayer game and win by at least 20 kills.",
  linktacular: "Play in a matchmade game composed entirely of Bungie.net users, including yourself.",
  kills_in_a_row_5: "Get 5 kills in a row without dying.",
  kills_in_a_row_10: "Get 10 kills in a row without dying.",
  kills_in_a_row_15: "Get 15 kills in a row without dying.",
  kills_in_a_row_20: "Get 20 kills in a row without dying.",
  kills_in_a_row_25: "Get 25 kills in a row without dying.",
  kills_in_a_row_30: "Get 30 kills in a row without dying.",
  shotgun_kill_5: "Get 5 kills with the shotgun in a row.",
  shotgun_kill_10: "Get 10 kills with the shotgun in a row.",
  sword_kill_5: "Get 5 kills with the energy sword in a row.",
  sword_kill_10: "Get 10 kills with the energy sword in a row.",
  sniper_kill_5: "Get 5 kills with a sniper rifle in a row.",
  sniper_kill_10: "Get 10 kills with a sniper rifle in a row.",
  collision_kill_5: "Get 5 kills with a vehicle in a row.",
  collision_kill_10: "Get 10 kills with a vehicle in a row.",
  multiple_kill_2: "Kill 2 enemies within 4 seconds of each other.",
  multiple_kill_3: "Kill 3 enemies within 4 seconds of each other.",
  multiple_kill_4: "Kill 4 enemies within 4 seconds of each other.",
  multiple_kill_5: "Kill 5 enemies within 4 seconds of each other.",
  multiple_kill_6: "Kill 6 enemies within 4 seconds of each other.",
  multiple_kill_7: "Kill 7 enemies within 4 seconds of each other.",
  multiple_kill_8: "Kill 8 enemies within 4 seconds of each other.",
  multiple_kill_9: "Kill 9 enemies within 4 seconds of each other.",
  multiple_kill_10: "Kill 10 enemies within 4 seconds of each other.",
  bash_kill: "Kill an enemy with a melee attack.",
  bashbehind_kill: "Kill an enemy with a melee attack from behind.",
  sniper_kill: "Kill an enemy with a headshot from a sniper rifle.",
  stickygrenade_kill: "Kill an enemy by sticking them with a plasma grenade.",
  spartanlaser_kill: "Kill an enemy with the Spartan Laser.",
  oddball_carrier_kill_player: "Kill an enemy while carrying the oddball.",
  ctf_flag_carrier_kill_player: "Kill an enemy while carrying the flag.",
  vehicle_impact_kill: "Kill an enemy by running them over with a vehicle.",
  flame_kill: "Kill an enemy with the flamethrower.",
  player_kill_spreeplayer: "End an enemy's killing spree.",
  deadplayer_kill: "Kill an enemy after you die.",
  vehicle_hijack: "Hijack an enemy vehicle.",
  shotgun_kill_sword: "Kill an enemy who is using an energy sword with a shotgun.",
  driver_assist_gunner: "Assist in a kill while driving a vehicle.",
  aircraft_hijack: "Hijack an enemy aircraft.",
  ctf_flag_player_kill_carrier: "Kill an enemy who is carrying the flag.",
  ctf_flag_captured: "Capture the enemy flag.",
  juggernaut_player_kill_juggernaut: "Kill the juggernaut in Juggernaut gametype.",
  vip_player_kill_vip: "Kill the VIP in VIP gametype.",
  assault_player_kill_carrier: "Kill an enemy who is carrying the bomb.",
  assault_bomb_planted: "Plant the bomb in Assault gametype.",
  infection_survive: "Be the last survivor in Infection gametype.",
  koth_kill_5: "Get 5 kills while controlling a hill in King of the Hill.",
  koth_kill_10: "Get 10 kills while controlling a hill in King of the Hill.",
  human_kill_5: "Get 5 kills as a human in Infection gametype.",
  human_kill_10: "Get 10 kills as a human in Infection gametype.",
  zombie_kill_5: "Get 5 kills as a zombie in Infection gametype.",
  zombie_kill_10: "Get 10 kills as a zombie in Infection gametype.",
  juggernaut_kill_5: "Get 5 kills as the juggernaut in Juggernaut gametype.",
  juggernaut_kill_10: "Get 10 kills as the juggernaut in Juggernaut gametype.",
};

// Medal hover animation keyframes
const medalHoverAnimation = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.3) rotate(180deg);
  }
  66% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
  66.01% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
  83% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
  91.5% {
    opacity: 1;
    transform: scale(1.25) rotate(0deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
`;

export function PlayerStatistics({ gamertag }: PlayerStatisticsProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['playerStatistics', gamertag],
    queryFn: () => api.sunrise2.playerStatistics.query({ gamertag }),
  });

  const gameTypeData = data?.gameTypes ?? [];
  const killsDeathsData = data?.killsDeaths ?? [];
  const mostKilled = [...(data?.mostKilled ?? [])].sort((a, b) => Number(b.count) - Number(a.count));
  const mostKilledBy = [...(data?.mostKilledBy ?? [])].sort((a, b) => Number(b.count) - Number(a.count));
  
  // Convert medalChest array to Record<string, number>
  const medalChestArray = data?.medalChest ?? [];
  const medalChest: Record<string, number> = {};
  medalChestArray.forEach((entry: { medal: string; count: number }) => {
    medalChest[entry.medal] = entry.count;
  });
  
  // Add steaktacular and linktacular from separate fields (they're stored differently in the API)
  // Use the separate count fields if they exist, as they're the authoritative source
  if (data?.steaktacularCount !== undefined) {
    medalChest['steaktacular'] = data.steaktacularCount;
  }
  if (data?.linktacularCount !== undefined) {
    medalChest['linktacular'] = data.linktacularCount;
  }
  
  const weaponKills = data?.weaponKills ?? [];
  const weaponOfChoice = data?.weaponOfChoice;

  const { data: heatmapData } = useQuery({
    queryKey: ['activityHeatmap', gamertag],
    queryFn: () => api.sunrise2.activityHeatmap.query({ gamertag }),
  });

  // Filter medals that have a count > 0 and are valid medal types
  // Valid medal types from Medal component
  const validMedalTypes = [
    'perfection', 'extermination', 'steaktacular', 'linktacular',
    'kills_in_a_row_5', 'kills_in_a_row_10', 'kills_in_a_row_15', 'kills_in_a_row_20', 'kills_in_a_row_25', 'kills_in_a_row_30',
    'shotgun_kill_5', 'sword_kill_5', 'sniper_kill_5', 'collision_kill_5',
    'shotgun_kill_10', 'sword_kill_10', 'sniper_kill_10', 'collision_kill_10',
    'multiple_kill_2', 'multiple_kill_3', 'multiple_kill_4', 'multiple_kill_5', 'multiple_kill_6',
    'multiple_kill_7', 'multiple_kill_8', 'multiple_kill_9', 'multiple_kill_10',
    'bash_kill', 'bashbehind_kill', 'sniper_kill', 'stickygrenade_kill', 'spartanlaser_kill',
    'oddball_carrier_kill_player', 'ctf_flag_carrier_kill_player', 'vehicle_impact_kill', 'flame_kill',
    'player_kill_spreeplayer', 'deadplayer_kill', 'vehicle_hijack', 'shotgun_kill_sword',
    'driver_assist_gunner', 'aircraft_hijack', 'ctf_flag_player_kill_carrier', 'ctf_flag_captured',
    'juggernaut_player_kill_juggernaut', 'vip_player_kill_vip', 'assault_player_kill_carrier', 'assault_bomb_planted',
    'infection_survive', 'koth_kill_5', 'zombie_kill_5', 'juggernaut_kill_5', 'zombie_kill_10', 'juggernaut_kill_10',
    'human_kill_5', 'human_kill_10',
  ] as const;
  
  // Medal organization in rows (as specified by user)
  // Row 8 has some duplicates - using available medals
  const medalRows: Array<Array<typeof validMedalTypes[number]>> = [
    // Row 1: perfection, extermination, invincible (kills_in_a_row_30), killionaire (multiple_kill_10)
    // Note: invincible is the highest spree medal (kills_in_a_row_30)
    // Note: killionaire is the highest multi-kill medal (multiple_kill_10)
    ['perfection', 'extermination', 'kills_in_a_row_30', 'multiple_kill_10'],
    // Row 2: killing spree, killing frenzy, running riot, rampage, untouchable
    ['kills_in_a_row_5', 'kills_in_a_row_10', 'kills_in_a_row_15', 'kills_in_a_row_20', 'kills_in_a_row_25'],
    // Row 3: shotgun spree, sword spree, sniper spree, vehicle spree 5, shotgun spree 10, sword spree 10, sniper spree 10, vehicle spree 10
    ['shotgun_kill_5', 'sword_kill_5', 'sniper_kill_5', 'collision_kill_5', 'shotgun_kill_10', 'sword_kill_10', 'sniper_kill_10', 'collision_kill_10'],
    // Row 4: double kill, triple kill, overkill, killtakular, killtrocity, killimanjaro, killtastrophy, killpocalpyse
    ['multiple_kill_2', 'multiple_kill_3', 'multiple_kill_4', 'multiple_kill_5', 'multiple_kill_6', 'multiple_kill_7', 'multiple_kill_8', 'multiple_kill_9'],
    // Row 5: melee, assination, sniper headshot, sticky kill, laser kill, ball kill, flag kill, inciniration
    ['bash_kill', 'bashbehind_kill', 'sniper_kill', 'stickygrenade_kill', 'spartanlaser_kill', 'oddball_carrier_kill_player', 'ctf_flag_carrier_kill_player', 'flame_kill'],
    // Row 6: killjoy, kill from the grave, splatter kill, hijack, bulltrue, driver assist, skyjack
    ['player_kill_spreeplayer', 'deadplayer_kill', 'vehicle_impact_kill', 'vehicle_hijack', 'shotgun_kill_sword', 'driver_assist_gunner', 'aircraft_hijack'],
    // Row 7: last man standing, kill flag carrieer, flag capture, kill juggernaut, kill vip, kill bomb carrier, bomb planted
    ['infection_survive', 'ctf_flag_player_kill_carrier', 'ctf_flag_captured', 'juggernaut_player_kill_juggernaut', 'vip_player_kill_vip', 'assault_player_kill_carrier', 'assault_bomb_planted'],
    // Row 8: hill spree, infection spree, zombie killing spree, juggerenaut spree, hill spree 10, infection spree 10, zombie killing spree 10, juggernaut spree 10
    // Note: infection spree = human_kill (for humans in infection mode)
    // Note: Some 10-kill versions may not exist (koth_kill_10), using available medals
    ['koth_kill_5', 'human_kill_5', 'zombie_kill_5', 'juggernaut_kill_5', 'human_kill_10', 'zombie_kill_10', 'juggernaut_kill_10'],
    // Row 9: steaktacular, linktacular
    ['steaktacular', 'linktacular'],
  ];
  
  // Create a map for quick lookup - include all medals, defaulting to 0 if not earned
  const medalMap = new Map<typeof validMedalTypes[number], number>();
  
  // Initialize all valid medals with 0
  validMedalTypes.forEach(medalType => {
    medalMap.set(medalType, 0);
  });
  
  // Update with actual counts from medalChest
  Object.entries(medalChest).forEach(([type, count]) => {
    if (typeof count === 'number' && validMedalTypes.includes(type as any)) {
      medalMap.set(type as typeof validMedalTypes[number], count);
    }
  });

  return (
    <Box sx={{ mt: 6 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          pb: 1,
          borderBottom: "2px solid #7CB342",
        }}
      >
        <Typography variant="h4">Statistics</Typography>
      </Box>

      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            py: 8,
          }}
        >
          <CircularProgress />
          <Typography variant="body1" sx={{ color: "#B0B0B0" }}>
            Loading statistics
          </Typography>
        </Box>
      ) : (
        <React.Fragment>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: 4,
              mt: 3,
            }}
          >
          {/* Game History Chart */}
          <Paper
            elevation={4}
            sx={{
              p: 3,
              background: "linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)",
              border: "1px solid #333",
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, color: "#7CB342", textAlign: "center" }}
            >
              Game History
            </Typography>
            {gameTypeData.length > 0 ? (
            <Box sx={{ fontFamily: '"Segoe UI", "Arial", "Helvetica", sans-serif' }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={gameTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => (
                      <text
                        x={entry.x}
                        y={entry.y}
                        fill="#E0E0E0"
                        textAnchor={entry.x > entry.cx ? "start" : "end"}
                        dominantBaseline="central"
                        style={{ fontFamily: '"Segoe UI", "Arial", "Helvetica", sans-serif', fontSize: '12px' }}
                      >
                        {`${entry.name}: ${entry.value}`}
                      </text>
                    )}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {gameTypeData.map((entry: { name: string; value: number }, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[entry.name]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: '#1A1A1A', 
                      border: '1px solid #333',
                      fontFamily: '"Segoe UI", "Arial", "Helvetica", sans-serif',
                    }}
                    itemStyle={{ color: '#E0E0E0', fontFamily: '"Segoe UI", "Arial", "Helvetica", sans-serif' }}
                  />
                  <Legend 
                    wrapperStyle={{ fontFamily: '"Segoe UI", "Arial", "Helvetica", sans-serif' }}
                    formatter={(value) => <span style={{ fontFamily: '"Segoe UI", "Arial", "Helvetica", sans-serif' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 300,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                No game data available
              </Typography>
            </Box>
          )}
        </Paper>

          {/* Kills vs Deaths Chart */}
        <Paper
          elevation={4}
          sx={{
            p: 3,
            background: "linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)",
            border: "1px solid #333",
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 2, color: "#7CB342", textAlign: "center" }}
          >
            Kills vs Deaths
          </Typography>
          {killsDeathsData.length > 0 ? (
            <Box sx={{ fontFamily: '"Segoe UI", "Arial", "Helvetica", sans-serif' }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={killsDeathsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => (
                      <text
                        x={entry.x}
                        y={entry.y}
                        fill="#E0E0E0"
                        textAnchor={entry.x > entry.cx ? "start" : "end"}
                        dominantBaseline="central"
                        style={{ fontFamily: '"Segoe UI", "Arial", "Helvetica", sans-serif', fontSize: '12px' }}
                      >
                        {`${entry.name}: ${entry.value}`}
                      </text>
                    )}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {killsDeathsData.map((entry: { name: string; value: number }, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[entry.name]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: '#1A1A1A', 
                      border: '1px solid #333',
                      fontFamily: '"Segoe UI", "Arial", "Helvetica", sans-serif',
                    }}
                    itemStyle={{ color: '#E0E0E0', fontFamily: '"Segoe UI", "Arial", "Helvetica", sans-serif' }}
                  />
                  <Legend 
                    wrapperStyle={{ fontFamily: '"Segoe UI", "Arial", "Helvetica", sans-serif' }}
                    formatter={(value) => <span style={{ fontFamily: '"Segoe UI", "Arial", "Helvetica", sans-serif' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 300,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                No multiplayer game data available
              </Typography>
            </Box>
          )}
        </Paper>
        </Box>

        {/* Activity Heatmap */}
        {heatmapData && (
          <Box sx={{ mt: 4 }}>
            <ActivityHeatmap data={heatmapData.data} />
          </Box>
        )}

        {/* Most Killed and Most Killed By */}
        {(mostKilled.length > 0 || mostKilledBy.length > 0) && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 4,
            mt: 4,
          }}
        >
          {/* Most Killed */}
          {mostKilled.length > 0 && (
            <Paper
              elevation={4}
              sx={{
                background: "linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)",
                border: "1px solid #333",
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "#7CB342", textAlign: "center" }}
              >
                Most Killed
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: "#7CB342", borderColor: "#333", width: "1px" }}></TableCell>
                      <TableCell sx={{ color: "#7CB342", borderColor: "#333" }}>Player</TableCell>
                      <TableCell sx={{ color: "#7CB342", borderColor: "#333" }} align="right">Kills</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mostKilled.map((entry: any, index: number) => {
                      const primaryColor = entry.primary_color ? getCssColor(entry.primary_color) : undefined;
                      const bgColor = primaryColor ? getColor(getColorName(entry.primary_color)) : undefined;
                      const textColor = bgColor ? getTextColor(getColorName(entry.primary_color)) : undefined;
                      const backgroundColor = bgColor ? `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, 0.3)` : undefined;
                      const cellTextColor = textColor ? `rgb(${textColor.r}, ${textColor.g}, ${textColor.b})` : "#E0E0E0";
                      
                      return (
                        <TableRow 
                          key={index} 
                          sx={{ 
                            backgroundColor: backgroundColor,
                            "&:hover": { backgroundColor: backgroundColor && bgColor ? `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, 0.5)` : "rgba(124, 179, 66, 0.1)" }
                          }}
                        >
                          <TableCell sx={{ borderColor: "#333", width: "1px", py: 0.5, px: 1 }}>
                            <Emblem
                              size={32}
                              emblem={{
                                primary: entry.foreground_emblem,
                                secondary: entry.emblem_flags === 0,
                                background: entry.background_emblem,
                                primaryColor: entry.emblem_primary_color,
                                secondaryColor: entry.emblem_secondary_color,
                                backgroundColor: entry.emblem_background_color,
                                armourPrimaryColor: entry.primary_color,
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: cellTextColor, borderColor: "#333", py: 0.5, px: 1 }}>
                            <Link
                              component={NextLink}
                              href={`/player/${encodeURIComponent(entry.player_name)}`}
                              sx={{ 
                                color: "#FFFFFF", 
                                textDecoration: "none",
                                textShadow: "1px 0 0 #000, -1px 0 0 #000, 0 1px 0 #000, 0 -1px 0 #000",
                                "&:hover": { textDecoration: "underline" } 
                              }}
                            >
                              {entry.player_name}
                            </Link>
                          </TableCell>
                          <TableCell sx={{ color: cellTextColor, borderColor: "#333", py: 0.5, px: 1 }} align="right">
                            {Number(entry.count)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {/* Most Killed By */}
          {mostKilledBy.length > 0 && (
            <Paper
              elevation={4}
              sx={{
                background: "linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)",
                border: "1px solid #333",
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "#7CB342", textAlign: "center" }}
              >
                Most Killed By
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: "#7CB342", borderColor: "#333", width: "1px" }}></TableCell>
                      <TableCell sx={{ color: "#7CB342", borderColor: "#333" }}>Player</TableCell>
                      <TableCell sx={{ color: "#7CB342", borderColor: "#333" }} align="right">Deaths</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mostKilledBy.map((entry: any, index: number) => {
                      const primaryColor = entry.primary_color ? getCssColor(entry.primary_color) : undefined;
                      const bgColor = primaryColor ? getColor(getColorName(entry.primary_color)) : undefined;
                      const textColor = bgColor ? getTextColor(getColorName(entry.primary_color)) : undefined;
                      const backgroundColor = bgColor ? `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, 0.3)` : undefined;
                      const cellTextColor = textColor ? `rgb(${textColor.r}, ${textColor.g}, ${textColor.b})` : "#E0E0E0";
                      
                      return (
                        <TableRow 
                          key={index} 
                          sx={{ 
                            backgroundColor: backgroundColor,
                            "&:hover": { backgroundColor: backgroundColor && bgColor ? `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, 0.5)` : "rgba(124, 179, 66, 0.1)" }
                          }}
                        >
                          <TableCell sx={{ borderColor: "#333", width: "1px", py: 0.5, px: 1 }}>
                            <Emblem
                              size={32}
                              emblem={{
                                primary: entry.foreground_emblem,
                                secondary: entry.emblem_flags === 0,
                                background: entry.background_emblem,
                                primaryColor: entry.emblem_primary_color,
                                secondaryColor: entry.emblem_secondary_color,
                                backgroundColor: entry.emblem_background_color,
                                armourPrimaryColor: entry.primary_color,
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: cellTextColor, borderColor: "#333", py: 0.5, px: 1 }}>
                            <Link
                              component={NextLink}
                              href={`/player/${encodeURIComponent(entry.player_name)}`}
                              sx={{ 
                                color: "#FFFFFF", 
                                textDecoration: "none",
                                textShadow: "1px 0 0 #000, -1px 0 0 #000, 0 1px 0 #000, 0 -1px 0 #000",
                                "&:hover": { textDecoration: "underline" } 
                              }}
                            >
                              {entry.player_name}
                            </Link>
                          </TableCell>
                          <TableCell sx={{ color: cellTextColor, borderColor: "#333", py: 0.5, px: 1 }} align="right">
                            {Number(entry.count)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Box>
        )}

        {/* Medal Chest and Weapon Kills - Side by Side */}
        {(validMedalTypes.length > 0 || weaponKills.length > 0) && (
        <Box
          sx={{
            mt: 4,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 4,
          }}
        >
          {/* Medal Chest */}
          {validMedalTypes.length > 0 && (
            <Paper
              elevation={4}
              sx={{
                p: 3,
                background: "linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)",
                border: "1px solid #333",
                height: 'fit-content'
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "#7CB342", textAlign: "center" }}
              >
                Medal Chest
              </Typography>
              <Box
                sx={{
                  border: "1px solid #444",
                  borderRadius: 1,
                  p: 2,
                  backgroundColor: "#0A0A0A",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  {medalRows.map((row, rowIndex) => {
                    const rowMedals = row.map(medalType => ({
                      type: medalType,
                      count: medalMap.get(medalType) ?? 0,
                    }));
                    
                    return (
                      <Box
                        key={rowIndex}
                        sx={{
                          display: "flex",
                          gap: 1,
                          alignItems: "center",
                        }}
                      >
                        {rowMedals.map((entry) => {
                          const isEarned = entry.count > 0;
                          const medalName = MEDAL_NAMES[entry.type] || formatMedalTypeName(entry.type);
                          const medalDescription = MEDAL_DESCRIPTIONS[entry.type] || "No description available.";
                          return (
                            <Tooltip
                              key={entry.type}
                              title={
                                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", p: 1, maxWidth: "400px" }}>
                                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, flex: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                      {medalName}
                                    </Typography>
                                    <Typography variant="caption" sx={{ lineHeight: 1.4 }}>
                                      {medalDescription}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ flexShrink: 0, animation: `${medalHoverAnimation} 1.2s ease-out forwards` }}>
                                    <Medal type={entry.type} size={64} />
                                  </Box>
                                </Box>
                              }
                              arrow
                              placement="top"
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  position: "relative",
                                  opacity: isEarned ? 1 : 0.3,
                                  filter: isEarned ? 'none' : 'grayscale(100%)',
                                //   cursor: "help",
                                  '& .medal-container': {
                                    transition: 'none',
                                  },
                                  // ...(isEarned && {
                                  //   '&:hover .medal-container': {
                                  //     animation: `${medalHoverAnimation} 1.5s ease-out forwards`,
                                  //   },
                                  // }),
                                }}
                              >
                                <Box className="medal-container">
                                  <Medal type={entry.type} size={48} />
                                </Box>
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    color: isEarned ? "#7CB342" : "#666", 
                                    fontWeight: "bold",
                                    mt: 0.5,
                                    fontSize: "0.7rem",
                                  }}
                                >
                                  {entry.count}
                                </Typography>
                              </Box>
                            </Tooltip>
                          );
                        })}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Paper>
          )}

          {/* Weapon Kills Table and Weapon of Choice */}
          {weaponKills.length > 0 && (
          <Paper
            elevation={4}
            sx={{
              p: 3,
              background: "linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)",
              border: "1px solid #333",
            }}
          >
            {weaponOfChoice && (
              <Box sx={{ mb: 3, textAlign: "center" }}>
                <Typography
                  variant="h6"
                  sx={{ mb: 1, color: "#7CB342" }}
                >
                  Weapon of Choice
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ color: "#E0E0E0", fontWeight: "bold" }}
                >
                  {getWeaponNameFromString(weaponOfChoice.weapon)}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "#B0B0B0", mt: 0.5 }}
                >
                  {weaponOfChoice.kills} kills
                </Typography>
              </Box>
            )}
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "#7CB342", borderColor: "#333" }}>Weapon</TableCell>
                    <TableCell sx={{ color: "#7CB342", borderColor: "#333" }} align="right">Kills</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                          {(() => {
                            // Calculate max kills for proportional bars
                            const maxKills = weaponKills.length > 0 
                              ? Math.max(...weaponKills.map((e: { weapon: string; kills: number }) => e.kills))
                              : 1;
                            
                            return weaponKills.map((entry: { weapon: string; kills: number }, index: number) => {
                              const percentage = (entry.kills / maxKills) * 100;
                              const isWeaponOfChoice = weaponOfChoice && entry.weapon === weaponOfChoice.weapon;
                              
                              return (
                                <TableRow 
                                  key={index} 
                                  sx={{ 
                                    position: "relative",
                                    "&:hover": { 
                                      "&::before": {
                                        backgroundColor: isWeaponOfChoice 
                                          ? "rgba(124, 179, 66, 0.3)" 
                                          : "rgba(124, 179, 66, 0.2)",
                                      }
                                    },
                                    "&::before": {
                                      content: '""',
                                      position: "absolute",
                                      left: 0,
                                      top: 0,
                                      bottom: 0,
                                      width: `${percentage}%`,
                                      backgroundColor: isWeaponOfChoice 
                                        ? "rgba(124, 179, 66, 0.25)" 
                                        : "rgba(124, 179, 66, 0.15)",
                                      zIndex: 0,
                                      transition: "background-color 0.2s ease",
                                    },
                                    "& .MuiTableCell-root": {
                                      position: "relative",
                                      zIndex: 1,
                                    }
                                  }}
                                >
                                  <TableCell sx={{ color: "#E0E0E0", borderColor: "#333" }}>
                                    {getWeaponNameFromString(entry.weapon)}
                                  </TableCell>
                                  <TableCell sx={{ color: "#E0E0E0", borderColor: "#333" }} align="right">
                                    {entry.kills}
                                  </TableCell>
                                </TableRow>
                              );
                            });
                          })()}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          )}
        </Box>
        )}
        </React.Fragment>
      )}
    </Box>
  );
}

