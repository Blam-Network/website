import { ServiceRecord } from "../api/sunrise/serviceRecord";
import { Stack, Box, Typography } from "@mui/material";
import { getCssColor, getColorName } from "../colors";
import { Emblem } from "./Emblem";
import { format } from "date-fns";
import { rankStrings, RankBadge } from "./ServiceRecordPlaceholder";

interface ServiceRecordListItemProps {
  serviceRecord: ServiceRecord;
}

// Campaign progress icon positions in sprite sheet (2 rows, 5 columns)
// Row 1: not started (0), normal completed (4), heroic completed (6), legendary completed (8), easy completed (2)
// Row 2: easy started (1), normal started (3), heroic started (5), legendary started (7)
const getCampaignIconPosition = (progress: number): { x: string; y: string } => {
  const positions: Record<number, { x: string; y: string }> = {
    0: { x: '0%', y: '0%' },      // not started - row 1, col 1
    1: { x: '0%', y: '100%' },     // easy started - row 2, col 1
    2: { x: '100%', y: '0%' },   // easy completed - row 1, col 5
    3: { x: '25%', y: '100%' },    // normal started - row 2, col 2
    4: { x: '25%', y: '0%' },     // normal completed - row 1, col 2
    5: { x: '50%', y: '100%' },    // heroic started - row 2, col 3
    6: { x: '50%', y: '0%' },     // heroic completed - row 1, col 3
    7: { x: '75%', y: '100%' },    // legendary started - row 2, col 4
    8: { x: '75%', y: '0%' },     // legendary completed - row 1, col 4
  };
  return positions[progress] || { x: '0%', y: '0%' };
};

export const ServiceRecordListItem = ({ serviceRecord }: ServiceRecordListItemProps) => {
  const rankName = rankStrings[serviceRecord.rank] || 'Unknown';
  const primaryColor = getCssColor(serviceRecord.primaryColor);
  
  return (
    <Stack 
      direction="row" 
      spacing={2} 
      alignItems="center"
      sx={{
        width: '100%',
      }}
    >
      {/* Emblem */}
      <Box>
        <Emblem
          size={64}
          emblem={{
            primary: serviceRecord.foregroundEmblem,
            secondary: serviceRecord.emblemFlags === 0,
            background: serviceRecord.backgroundEmblem,
            primaryColor: serviceRecord.emblemPrimaryColor,
            secondaryColor: serviceRecord.emblemSecondaryColor,
            backgroundColor: serviceRecord.emblemBackgroundColor,
            armourPrimaryColor: serviceRecord.primaryColor,
          }}
        />
      </Box>

      {/* Player Info */}
      <Stack spacing={0.5} flex={1}>
        <Stack direction="row" spacing={1} alignItems="baseline" flexWrap="wrap">
          <Typography variant="h6" sx={{ color: primaryColor, fontWeight: 700, fontFamily: 'sans-serif' }}>
            {serviceRecord.playerName}
          </Typography>
          {serviceRecord.serviceTag && (
            <>
              <Typography variant="body1" sx={{ color: '#B0B0B0', fontFamily: 'sans-serif' }}>
                {serviceRecord.serviceTag}
              </Typography>
              <Typography variant="body2" sx={{ color: primaryColor, fontWeight: 600, fontFamily: 'sans-serif' }}>
                • {serviceRecord.model ? 'ELITE' : 'SPARTAN'}
              </Typography>
            </>
          )}
        </Stack>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Typography variant="body2" sx={{ color: '#B0B0B0', fontFamily: 'sans-serif' }}>
            {rankName} - Grade {serviceRecord.grade}
          </Typography>
          <Typography variant="body2" sx={{ color: '#B0B0B0', fontFamily: 'sans-serif' }}>
            <strong style={{ color: primaryColor }}>Skill:</strong> {serviceRecord.highestSkill}
          </Typography>
          <Typography variant="body2" sx={{ color: '#B0B0B0', fontFamily: 'sans-serif' }}>
            <strong style={{ color: primaryColor }}>EXP:</strong> {serviceRecord.totalEXP.toLocaleString()}
          </Typography>
          {serviceRecord.gamesCompleted !== undefined && (
            <Typography variant="body2" sx={{ color: '#B0B0B0', fontFamily: 'sans-serif' }}>
              <strong style={{ color: primaryColor }}>Games:</strong> {serviceRecord.gamesCompleted.toLocaleString()}
            </Typography>
          )}
        </Stack>
        {(serviceRecord.firstPlayed || serviceRecord.lastPlayed) && (
          <Stack direction="row" spacing={2} flexWrap="wrap">
            {serviceRecord.firstPlayed && (
              <Typography variant="caption" sx={{ color: '#888', fontFamily: 'sans-serif' }}>
                First: {format(serviceRecord.firstPlayed, "MMM d, yyyy")}
              </Typography>
            )}
            {serviceRecord.lastPlayed && (
              <Typography variant="caption" sx={{ color: '#888', fontFamily: 'sans-serif' }}>
                Last: {format(serviceRecord.lastPlayed, "MMM d, yyyy")}
              </Typography>
            )}
          </Stack>
        )}
      </Stack>

      {/* Rank Badge and Campaign Shield */}
      <Stack direction="row" spacing={1} alignItems="center">
        <RankBadge rank={serviceRecord.rank} grade={serviceRecord.grade} size={64} />
        <Box
          sx={{
            width: 64,
            height: 64,
            backgroundImage: 'url(/img/difficulty_large_ui.png)',
            backgroundSize: '500% 200%',
            backgroundPosition: `${getCampaignIconPosition(serviceRecord.campaignProgress).x} ${getCampaignIconPosition(serviceRecord.campaignProgress).y}`,
            imageRendering: 'pixelated',
          }}
        />
      </Stack>
    </Stack>
  );
};

