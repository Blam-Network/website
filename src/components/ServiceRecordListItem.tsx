import { ServiceRecord } from "../api/sunrise/serviceRecord";
import { Stack, Box, Typography } from "@mui/material";
import { getCssColor, getColorName } from "../colors";
import { Emblem } from "./Emblem";
import { DateTimeDisplay } from "./DateTimeDisplay";
import { rankStrings, RankBadge } from "./ServiceRecordPlaceholder";
import { getCampaignIconPosition } from "../utils/campaignProgress";

interface ServiceRecordListItemProps {
  serviceRecord: ServiceRecord;
}

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
            {serviceRecord.grade === 0 ? rankName : `${rankName} - Grade ${serviceRecord.grade}`}
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
                First: <DateTimeDisplay date={serviceRecord.firstPlayed} formatString="MMM d, yyyy" />
              </Typography>
            )}
            {serviceRecord.lastPlayed && (
              <Typography variant="caption" sx={{ color: '#888', fontFamily: 'sans-serif' }}>
                Last: <DateTimeDisplay date={serviceRecord.lastPlayed} formatString="MMM d, yyyy" />
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

