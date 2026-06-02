import { Box, Paper, Stack, Typography } from "@mui/material";
import { getCssColor } from "@/src/colors";
import { BARLOW_FAMILY } from "@/src/theme/fonts";
import { ReachRankBadge } from "./ReachRankBadge";
import type { ReachServiceRecord } from "@/src/api/reach/serviceRecord";

interface ReachServiceRecordBannerProps {
  serviceRecord: ReachServiceRecord;
}

const REACH_BASE_RANK_TITLES = [
  "Recruit",
  "Corporal",
  "Sergeant",
  "Warrant Officer",
  "Captain",
  "Major",
  "Lt. Colonel",
  "Commander",
  "Colonel",
  "Brigadier",
  "General",
  "Field Marshall",
  "Hero",
  "Legend",
  "Mythic",
  "Noble",
  "Eclipse",
  "Nova",
  "Forerunner",
  "Reclaimer",
  "Inheritor",
] as const;

export function ReachServiceRecordBanner({ serviceRecord }: ReachServiceRecordBannerProps) {
  const primaryColor = getCssColor(serviceRecord.primaryColor);
  const baseRankTitle = REACH_BASE_RANK_TITLES[serviceRecord.grade];
  const rankTitle = (() => {
    if (!baseRankTitle) {
      return `Rank ${serviceRecord.grade}${serviceRecord.subGrade > 0 ? ` Grade ${serviceRecord.subGrade}` : ""}`;
    }
    if (serviceRecord.grade === 0 && serviceRecord.subGrade === 1) {
      return "Private";
    }
    if (serviceRecord.subGrade > 0) {
      return `${baseRankTitle} Grade ${serviceRecord.subGrade}`;
    }
    return baseRankTitle;
  })();

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
      <Box sx={{ py: 0 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2.5}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
        >
          <Stack spacing={1} minWidth={0}>
            <Typography
              variant="h3"
              sx={{
                color: primaryColor,
                fontWeight: 700,
                fontFamily: BARLOW_FAMILY,
                lineHeight: 1.15,
                wordBreak: "break-word",
              }}
            >
              {serviceRecord.playerName}
              {serviceRecord.serviceTag && (
                <Typography
                  component="span"
                  variant="h5"
                  sx={{ color: "text.secondary", ml: 1, fontFamily: BARLOW_FAMILY }}
                >
                  {serviceRecord.serviceTag}
                </Typography>
              )}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
              <Typography
                component="span"
                variant="h6"
                sx={{ color: "#E8EDF4", fontWeight: 600, fontFamily: BARLOW_FAMILY }}
              >
                {rankTitle}
              </Typography>
              <Typography
                component="span"
                variant="body2"
                sx={{ color: "text.secondary", fontFamily: BARLOW_FAMILY }}
              >
                • {serviceRecord.model ? "ELITE" : "SPARTAN"}
              </Typography>
            </Stack>
          </Stack>

          <ReachRankBadge grade={serviceRecord.grade} subGrade={serviceRecord.subGrade} size={112} />
        </Stack>
      </Box>
    </Paper>
  );
}
