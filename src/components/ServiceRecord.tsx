import { ServiceRecord } from "../api/sunrise/serviceRecord";
import { Stack, Box, Typography, Paper } from "@mui/material";
import { getCssColor, getColor, getColorName } from "../colors";
import { Emblem } from "./Emblem";
import { DateTimeDisplay } from "./DateTimeDisplay";
import { rankStrings, RankBadge, getNextRank } from "./ServiceRecordPlaceholder";
import { getCampaignIconPosition } from "../utils/campaignProgress";

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
              <Typography variant="h3" sx={{ color: primaryColor, fontWeight: 700, fontFamily: 'sans-serif' }}>
                {serviceRecord.playerName}
                {serviceRecord.serviceTag && (
                  <>
                    <Typography component="span" variant="h5" sx={{ color: '#B0B0B0', ml: 1, fontFamily: 'sans-serif' }}>
                      {serviceRecord.serviceTag}
                    </Typography>
                    <Typography component="span" variant="body2" sx={{ color: primaryColor, ml: 1, fontWeight: 600, fontFamily: 'sans-serif' }}>
                      • {serviceRecord.model ? 'ELITE' : 'SPARTAN'}
                    </Typography>
                  </>
                )}
              </Typography>
              <Typography variant="h5" sx={{ color: '#E0E0E0', fontFamily: 'sans-serif' }}>
                {serviceRecord.grade === 0 ? rankName : `${rankName} - Grade ${serviceRecord.grade}`}
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
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
              {nextRank && (
                <Typography variant="body2" sx={{ color: primaryColor, fontStyle: 'italic', fontFamily: 'sans-serif' }}>
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
                  <Typography variant="caption" sx={{ color: primaryColor, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: 'sans-serif' }}>
                    First Played
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#B0B0B0', fontSize: '0.75rem', fontFamily: 'sans-serif' }}>
                    <DateTimeDisplay date={serviceRecord.firstPlayed} formatString="MMM d, yyyy" />
                  </Typography>
                </Box>
              )}
              {serviceRecord.lastPlayed && (
                <Box>
                  <Typography variant="caption" sx={{ color: primaryColor, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: 'sans-serif' }}>
                    Last Played
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#B0B0B0', fontSize: '0.75rem', fontFamily: 'sans-serif' }}>
                    <DateTimeDisplay date={serviceRecord.lastPlayed} formatString="MMM d, yyyy" />
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

