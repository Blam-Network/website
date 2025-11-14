const ROW_COUNT = 8;
const COLUMN_COUNT = 9;

type MedalType = 'perfection'
    | 'extermination'
    | 'steaktacular'
    | 'linktacular'
    | 'kills_in_a_row_5'
    | 'kills_in_a_row_10'
    | 'kills_in_a_row_15'
    | 'kills_in_a_row_20'
    | 'kills_in_a_row_25'
    | 'kills_in_a_row_30'
    | 'shotgun_kill_5'
    | 'sword_kill_5'
    | 'sniper_kill_5'
    | 'collision_kill_5'
    | 'shotgun_kill_10'
    | 'sword_kill_10'
    | 'sniper_kill_10'
    | 'collision_kill_10'
    | 'multiple_kill_2'
    | 'multiple_kill_3'
    | 'multiple_kill_4'
    | 'multiple_kill_5'
    | 'multiple_kill_6'
    | 'multiple_kill_7'
    | 'multiple_kill_8'
    | 'multiple_kill_9'
    | 'multiple_kill_10'
    | 'bash_kill'
    | 'bashbehind_kill'
    | 'sniper_kill'
    | 'stickygrenade_kill'
    | 'spartanlaser_kill'
    | 'oddball_carrier_kill_player'
    | 'ctf_flag_carrier_kill_player'
    | 'vehicle_impact_kill'
    | 'flame_kill'
    | 'player_kill_spreeplayer'
    | 'deadplayer_kill'
    | 'vehicle_hijack'
    | 'shotgun_kill_sword'
    | 'driver_assist_gunner'
    | 'aircraft_hijack'
    | 'ctf_flag_player_kill_carrier'
    | 'ctf_flag_captured'
    | 'juggernaut_player_kill_juggernaut'
    | 'vip_player_kill_vip'
    | 'assault_player_kill_carrier'
    | 'assault_bomb_planted'
    | 'infection_survive'
    | 'koth_kill_5'
    |     'zombie_kill_5'
    | 'juggernaut_kill_5'
    | 'zombie_kill_10'
    | 'juggernaut_kill_10'
    | 'human_kill_5'
    | 'human_kill_10'

const MEDAL_OFFSETS: { [type in MedalType]: [number, number]} = {
    'perfection': [0, 0],
    'extermination': [1, 0],
    'steaktacular': [7, 0],
    'linktacular': [8, 0],

    'kills_in_a_row_5': [0, 1],
    'kills_in_a_row_10': [1, 1],
    'kills_in_a_row_15': [2, 1],
    'kills_in_a_row_20': [3, 1],
    'kills_in_a_row_25': [4, 1],
    'kills_in_a_row_30': [5, 1],

    'shotgun_kill_5': [0, 2],
    'sword_kill_5': [1, 2],
    'sniper_kill_5': [2, 2],
    'collision_kill_5': [3, 2],
    'shotgun_kill_10': [4, 2],
    'sword_kill_10': [5, 2],
    'sniper_kill_10': [6, 2],
    'collision_kill_10': [7, 2],

    'multiple_kill_2': [0, 3],
    'multiple_kill_3': [1, 3],
    'multiple_kill_4': [2, 3],
    'multiple_kill_5': [3, 3],
    'multiple_kill_6': [4, 3],
    'multiple_kill_7': [5, 3],
    'multiple_kill_8': [6, 3],
    'multiple_kill_9': [7, 3],
    'multiple_kill_10': [8, 3],

    'bash_kill': [0, 4],
    'bashbehind_kill': [1, 4],
    'sniper_kill': [2, 4],
    'stickygrenade_kill': [3, 4],
    'spartanlaser_kill': [4, 4],
    'oddball_carrier_kill_player': [5, 4],
    'ctf_flag_carrier_kill_player': [6, 4],
    'vehicle_impact_kill': [7, 4],
    'flame_kill': [8, 4],

    'player_kill_spreeplayer': [0, 5],
    'deadplayer_kill': [1, 5],
    'vehicle_hijack': [2, 5],
    'shotgun_kill_sword': [3, 5],
    'driver_assist_gunner': [4, 5],
    'aircraft_hijack': [5, 5],

    'ctf_flag_player_kill_carrier': [0, 6],
    'ctf_flag_captured': [1, 6],
    'juggernaut_player_kill_juggernaut': [2, 6],
    'vip_player_kill_vip': [3, 6],
    'assault_player_kill_carrier': [4, 6],
    'assault_bomb_planted': [5, 6],

    'infection_survive': [0, 7],
    'koth_kill_5': [1, 7],
    'human_kill_5': [2, 7],
    'zombie_kill_5': [3, 7],
    'juggernaut_kill_5': [4, 7],
    'human_kill_10': [5, 7],
    'zombie_kill_10': [6, 7],
    'juggernaut_kill_10': [7, 7],

}

export const Medal = ({size, type}: {size: number, type: MedalType}) => {
   return  <div style={{
            display: 'inline-block',
            width: size, 
            height: size, 
            backgroundImage: 'url("/img/medals/halo_3_medals_organised_and_aligned_draft_1.svg")',
            backgroundSize: `${size * (COLUMN_COUNT)}px ${size * (ROW_COUNT)}px`,
            backgroundPositionX: `-${(size * MEDAL_OFFSETS[type][0])}px`,
            backgroundPositionY: `-${size * MEDAL_OFFSETS[type][1]}px`
        }} 
    />
}

