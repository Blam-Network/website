import { ServiceRecord } from "../api/sunrise/serviceRecord";
import { Stack, Box, Typography, Paper } from "@mui/material";
import { getCssColor, getColor, getColorName } from "../colors";
import { Emblem } from "./Emblem";
import { format } from "date-fns";
import { rankStrings, RankBadge, getNextRank } from "./ServiceRecordPlaceholder";

interface ServiceRecordProps {
  serviceRecord: ServiceRecord;
}

// Helper function to darken a color for background use
const darkenColor = (colorIndex: number, factor: number = 0.15): string => {
  const color = getColor(getColorName(colorIndex));
  const r = Math.round(color.r * factor);
  const g = Math.round(color.g * factor);
  const b = Math.round(color.b * factor);
  return `rgb(${r},${g},${b})`;
};

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

export const ServiceRecordComponent = ({ serviceRecord }: ServiceRecordProps) => {
  const nextRank = getNextRank(serviceRecord.rank, serviceRecord.grade, serviceRecord.highestSkill);
  const rankName = rankStrings[serviceRecord.rank] || 'Unknown';
  const primaryColor = getCssColor(serviceRecord.primaryColor);
  const darkPrimaryColor = darkenColor(serviceRecord.primaryColor, 0.15);
  
  return (
    <Paper
      elevation={8}
      sx={{
        background: 'transparent',
        border: 'none',
        borderRadius: 0,
        overflow: 'hidden',
        boxShadow: 'none',
      }}
    >
      <Box sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start">
          {/* Left side - Emblem and Player Info */}
          <Stack direction="row" spacing={3} flex={1}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Emblem
                size={120}
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
            <Stack spacing={1} flex={1}>
              <Typography variant="h3" sx={{ color: primaryColor, fontWeight: 700, fontFamily: '"Conduit ITC", sans-serif' }}>
                {serviceRecord.playerName}
                {serviceRecord.serviceTag && (
                  <>
                    <Typography component="span" variant="h5" sx={{ color: '#B0B0B0', ml: 1, fontFamily: '"Conduit ITC", sans-serif' }}>
                      {serviceRecord.serviceTag}
                    </Typography>
                    <Typography component="span" variant="body2" sx={{ color: primaryColor, ml: 1, fontWeight: 600, fontFamily: '"Conduit ITC", sans-serif' }}>
                      • {serviceRecord.model ? 'ELITE' : 'SPARTAN'}
                    </Typography>
                  </>
                )}
              </Typography>
              <Typography variant="h5" sx={{ color: '#E0E0E0', fontFamily: '"Conduit ITC", sans-serif' }}>
                {rankName} - Grade {serviceRecord.grade}
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Typography variant="body2" sx={{ color: '#B0B0B0', fontFamily: '"Conduit ITC", sans-serif' }}>
                  <strong style={{ color: primaryColor }}>Skill:</strong> {serviceRecord.highestSkill}
                </Typography>
                <Typography variant="body2" sx={{ color: '#B0B0B0', fontFamily: '"Conduit ITC", sans-serif' }}>
                  <strong style={{ color: primaryColor }}>EXP:</strong> {serviceRecord.totalEXP.toLocaleString()}
                </Typography>
                {serviceRecord.gamesCompleted !== undefined && (
                  <Typography variant="body2" sx={{ color: '#B0B0B0', fontFamily: '"Conduit ITC", sans-serif' }}>
                    <strong style={{ color: primaryColor }}>Games:</strong> {serviceRecord.gamesCompleted.toLocaleString()}
                  </Typography>
                )}
              </Stack>
              {nextRank && (
                <Typography variant="body2" sx={{ color: primaryColor, fontStyle: 'italic', fontFamily: '"Conduit ITC", sans-serif' }}>
                  Next Rank: {nextRank}
                </Typography>
              )}
            </Stack>
          </Stack>

          {/* Middle - First/Last Played */}
          {(serviceRecord.firstPlayed || serviceRecord.lastPlayed) && (
            <Stack spacing={1} sx={{ minWidth: { xs: '100%', md: 180 }, justifyContent: 'center' }}>
              {serviceRecord.firstPlayed && (
                <Box>
                  <Typography variant="caption" sx={{ color: primaryColor, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: '"Conduit ITC", sans-serif' }}>
                    First Played
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#B0B0B0', fontSize: '0.75rem', fontFamily: '"Conduit ITC", sans-serif' }}>
                    {format(serviceRecord.firstPlayed, "MMM d, yyyy")}
                  </Typography>
                </Box>
              )}
              {serviceRecord.lastPlayed && (
                <Box>
                  <Typography variant="caption" sx={{ color: primaryColor, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: '"Conduit ITC", sans-serif' }}>
                    Last Played
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#B0B0B0', fontSize: '0.75rem', fontFamily: '"Conduit ITC", sans-serif' }}>
                    {format(serviceRecord.lastPlayed, "MMM d, yyyy")}
                  </Typography>
                </Box>
              )}
            </Stack>
          )}

          {/* Right side - Rank Badge, Insignia, Campaign Shield, and Grunt */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 120,
              gap: 2,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
              <RankBadge rank={serviceRecord.rank} grade={serviceRecord.grade} size={120} />
              {/* <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 120,
                  height: 120,
                }}
              >
                <img 
                  src="/img/spartanpin.gif" 
                  alt="Spartan Pin"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Box> */}
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  backgroundImage: 'url(/img/difficulty_large_ui.png)',
                  backgroundSize: '500% 200%',
                  backgroundPosition: `${getCampaignIconPosition(serviceRecord.campaignProgress).x} ${getCampaignIconPosition(serviceRecord.campaignProgress).y}`,
                  imageRendering: 'pixelated',
                }}
              />
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};

