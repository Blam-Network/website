import { ServiceRecord } from "../api/halo3/serviceRecord";
import { Stack, Box, Typography, Paper } from "@mui/material";
import { getCssColor } from "../colors";
import { Emblem } from "./Emblem";
import { DateTimeDisplay } from "./DateTimeDisplay";
import { rankStrings, RankBadge, getNextRank } from "./ServiceRecordPlaceholder";
import { getCampaignIconPosition } from "../utils/campaignProgress";
import { BARLOW_FAMILY } from "../theme/fonts";

interface ServiceRecordProps {
  serviceRecord: ServiceRecord;
}

export const ServiceRecordComponent = ({ serviceRecord }: ServiceRecordProps) => {
  const nextRank = getNextRank(serviceRecord.rank, serviceRecord.grade, serviceRecord.highestSkill);
  const rankName = rankStrings[serviceRecord.rank] || "Unknown";
  const primaryColor = getCssColor(serviceRecord.primaryColor);

  return (
    <Paper
      elevation={0}
      sx={{
        fontFamily: BARLOW_FAMILY,
        background: "transparent",
        border: "none",
        borderRadius: 0,
        overflow: "hidden",
        boxShadow: "none",
      }}
    >
      <Box sx={{ pt: 0, pb: { xs: 1, md: 2 } }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems={{ md: "center" }}>
          <Stack direction="row" spacing={2.5} flex={1} alignItems="center">
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
            <Stack spacing={1.25} flex={1} minWidth={0}>
              <Typography variant="h3" sx={{ color: primaryColor, fontWeight: 700, fontFamily: BARLOW_FAMILY, lineHeight: 1.15 }}>
                {serviceRecord.playerName}
                {serviceRecord.serviceTag && (
                  <>
                    <Typography component="span" variant="h5" sx={{ color: "text.secondary", ml: 1, fontFamily: BARLOW_FAMILY }}>
                      {serviceRecord.serviceTag}
                    </Typography>
                    <Typography component="span" variant="body2" sx={{ color: primaryColor, ml: 1, fontWeight: 700, fontFamily: BARLOW_FAMILY, letterSpacing: "0.06em" }}>
                      • {serviceRecord.model ? "ELITE" : "SPARTAN"}
                    </Typography>
                  </>
                )}
              </Typography>
              <Typography variant="h5" sx={{ color: "#E8EDF4", fontFamily: BARLOW_FAMILY, fontWeight: 600 }}>
                {serviceRecord.grade === 0 ? rankName : `${rankName} — Grade ${serviceRecord.grade}`}
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                <Typography variant="body2" sx={{ color: "text.secondary", fontFamily: BARLOW_FAMILY }}>
                  <Box component="span" sx={{ color: primaryColor, fontWeight: 700 }}>Skill:</Box> {serviceRecord.highestSkill}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", fontFamily: BARLOW_FAMILY }}>
                  <Box component="span" sx={{ color: primaryColor, fontWeight: 700 }}>EXP:</Box> {serviceRecord.totalEXP.toLocaleString()}
                </Typography>
                {serviceRecord.gamesCompleted !== undefined && (
                  <Typography variant="body2" sx={{ color: "text.secondary", fontFamily: BARLOW_FAMILY }}>
                    <Box component="span" sx={{ color: primaryColor, fontWeight: 700 }}>Games:</Box> {serviceRecord.gamesCompleted.toLocaleString()}
                  </Typography>
                )}
              </Stack>
              {nextRank && (
                <Typography variant="body2" sx={{ color: primaryColor, fontStyle: "italic", fontFamily: BARLOW_FAMILY }}>
                  Next rank: {nextRank}
                </Typography>
              )}
            </Stack>
          </Stack>

          {(serviceRecord.firstPlayed || serviceRecord.lastPlayed) && (
            <Stack spacing={1.25} sx={{ minWidth: { xs: "100%", md: 160 }, justifyContent: "center" }}>
              {serviceRecord.firstPlayed && (
                <Box>
                  <Typography variant="caption" sx={{ color: primaryColor, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 0.5, fontFamily: BARLOW_FAMILY }}>
                    First Played
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.75rem", fontFamily: BARLOW_FAMILY }}>
                    <DateTimeDisplay date={serviceRecord.firstPlayed} formatString="MMM d, yyyy" />
                  </Typography>
                </Box>
              )}
              {serviceRecord.lastPlayed && (
                <Box>
                  <Typography variant="caption" sx={{ color: primaryColor, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: 0.5, fontFamily: BARLOW_FAMILY }}>
                    Last Played
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.75rem", fontFamily: BARLOW_FAMILY }}>
                    <DateTimeDisplay date={serviceRecord.lastPlayed} formatString="MMM d, yyyy" />
                  </Typography>
                </Box>
              )}
            </Stack>
          )}

          <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
            <RankBadge rank={serviceRecord.rank} grade={serviceRecord.grade} size={112} />
            <Box
              sx={{
                width: 112,
                height: 112,
                backgroundImage: "url(/img/difficulty_large_ui.png)",
                backgroundSize: "500% 200%",
                backgroundPosition: `${getCampaignIconPosition(serviceRecord.campaignProgress).x} ${getCampaignIconPosition(serviceRecord.campaignProgress).y}`,
                imageRendering: "pixelated",
              }}
            />
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
};
