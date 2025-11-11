"use client";

import { Box } from "@mui/material";

interface CampaignSkullsProps {
    primarySkulls: number;
    secondarySkulls: number;
}

// Bitfield values for skull flags
const SKULL_FLAGS = {
    iron: 1 << 0,
    black_eye: 1 << 1,
    tough_luck: 1 << 2,
    catch: 1 << 3,
    fog: 1 << 4,
    famine: 1 << 5,
    thunderstorm: 1 << 6,
    tilt: 1 << 7,
    mythic: 1 << 8,
    assasin: 1 << 9,
    blind: 1 << 10,
    superman: 1 << 11,
    grunt_birthday_party: 1 << 12,
    iwhbyd: 1 << 13,
} as const;

// Primary skulls from skulls_lg_ui.png (5 columns, 2 rows)
// Row 1: fog, iron, black_eye, tough_luck, catch
// Row 2: famine, thunderstorm, tilt, mythic, (inactive)
const PRIMARY_SKULLS = [
    { name: 'fog', flag: SKULL_FLAGS.fog, row: 0, col: 0 },
    { name: 'iron', flag: SKULL_FLAGS.iron, row: 0, col: 1 },
    { name: 'black_eye', flag: SKULL_FLAGS.black_eye, row: 0, col: 2 },
    { name: 'tough_luck', flag: SKULL_FLAGS.tough_luck, row: 0, col: 3 },
    { name: 'catch', flag: SKULL_FLAGS.catch, row: 0, col: 4 },
    { name: 'famine', flag: SKULL_FLAGS.famine, row: 1, col: 0 },
    { name: 'thunderstorm', flag: SKULL_FLAGS.thunderstorm, row: 1, col: 1 },
    { name: 'tilt', flag: SKULL_FLAGS.tilt, row: 1, col: 2 },
    { name: 'mythic', flag: SKULL_FLAGS.mythic, row: 1, col: 3 },
] as const;

// Secondary skulls from secondary_skulls_lg_ui.png (2x2 grid)
// Row 1: blind, cowbell (superman?)
// Row 2: grunt_birthday_party, iwhbyd
const SECONDARY_SKULLS = [
    { name: 'blind', flag: SKULL_FLAGS.blind, row: 0, col: 0 },
    { name: 'superman', flag: SKULL_FLAGS.superman, row: 0, col: 1 },
    { name: 'grunt_birthday_party', flag: SKULL_FLAGS.grunt_birthday_party, row: 1, col: 0 },
    { name: 'iwhbyd', flag: SKULL_FLAGS.iwhbyd, row: 1, col: 1 },
] as const;

export function CampaignSkulls({ primarySkulls, secondarySkulls }: CampaignSkullsProps) {
    const activePrimary = PRIMARY_SKULLS.filter(skull => (primarySkulls & skull.flag) !== 0);
    const activeSecondary = SECONDARY_SKULLS.filter(skull => (secondarySkulls & skull.flag) !== 0);

    if (activePrimary.length === 0 && activeSecondary.length === 0) {
        return null;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {activePrimary.length > 0 && (
                <Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {activePrimary.map((skull) => (
                            <Box
                                key={skull.name}
                                sx={{
                                    width: 48,
                                    height: 48,
                                    backgroundImage: 'url(/img/skulls_lg_ui.png)',
                                    backgroundSize: '500% 200%',
                                    backgroundPosition: `${skull.col * 25}% ${skull.row * 100}%`,
                                    imageRendering: 'pixelated',
                                }}
                                title={skull.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            />
                        ))}
                    </Box>
                </Box>
            )}
            {activeSecondary.length > 0 && (
                <Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {activeSecondary.map((skull) => (
                            <Box
                                key={skull.name}
                                sx={{
                                    width: 48,
                                    height: 48,
                                    backgroundImage: 'url(/img/secondary_skulls_lg_ui.png)',
                                    backgroundSize: '200% 200%',
                                    backgroundPosition: `${skull.col * 100}% ${skull.row * 100}%`,
                                    imageRendering: 'pixelated',
                                }}
                                title={skull.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            />
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
}

