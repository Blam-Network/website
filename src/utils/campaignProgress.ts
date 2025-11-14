// Campaign progress icon positions in sprite sheet (2 rows, 5 columns)
// Row 1: not started (0), normal completed (1), heroic completed (2), legendary completed (3), easy completed (6)
// Row 2: normal started (7), heroic started (8), legendary started (9)
export const getCampaignIconPosition = (progress: number): { x: string; y: string } => {
  const positions: Record<number, { x: string; y: string }> = {
    0: { x: '100%', y: '0%' },     // easy completed - row 1, col 5
    1: { x: '25%', y: '0%' },     // normal completed - row 1, col 2
    2: { x: '50%', y: '0%' },     // heroic completed - row 1, col 3
    3: { x: '75%', y: '0%' },     // legendary completed - row 1, col 4
    4: { x: '0%', y: '0%' },      // not started - row 1, col 1 // probablt good
    5: { x: '0%', y: '100%' },    // easy started - row 2, col 2
    6: { x: '25%', y: '100%' },    // normal started - row 2, col 2
    7: { x: '50%', y: '100%' },    // heroic started - row 2, col 3
    8: { x: '75%', y: '100%' },    // legendary started - row 2, col 4 // right
  };
  return positions[progress] || { x: '0%', y: '0%' };
};

