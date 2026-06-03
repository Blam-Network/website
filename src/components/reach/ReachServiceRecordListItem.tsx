import { Stack, Typography } from "@mui/material";
import { getCssColor } from "@/src/colors";
import { BARLOW_FAMILY } from "@/src/theme/fonts";
import { ReachRankBadge } from "./ReachRankBadge";
import type { ReachServiceRecord } from "@/src/api/reach/serviceRecord";

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

function getReachRankTitle(serviceRecord: ReachServiceRecord): string {
  const baseRankTitle = REACH_BASE_RANK_TITLES[serviceRecord.grade];
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
}

interface ReachServiceRecordListItemProps {
  serviceRecord: ReachServiceRecord;
}

export function ReachServiceRecordListItem({ serviceRecord }: ReachServiceRecordListItemProps) {
  const primaryColor = getCssColor(serviceRecord.primaryColor);
  const rankTitle = getReachRankTitle(serviceRecord);

  return (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ width: "100%" }}>
      <ReachRankBadge
        grade={serviceRecord.grade}
        subGrade={serviceRecord.subGrade}
        size={64}
      />
      <Stack spacing={0.5} flex={1}>
        <Stack direction="row" spacing={1} alignItems="baseline" flexWrap="wrap">
          <Typography
            variant="h6"
            sx={{ color: primaryColor, fontWeight: 700, fontFamily: BARLOW_FAMILY }}
          >
            {serviceRecord.playerName}
          </Typography>
          {serviceRecord.serviceTag ? (
            <Typography variant="body1" sx={{ color: "#B0B0B0", fontFamily: BARLOW_FAMILY }}>
              {serviceRecord.serviceTag}
            </Typography>
          ) : null}
          <Typography variant="body2" sx={{ color: primaryColor, fontWeight: 600, fontFamily: BARLOW_FAMILY }}>
            • {serviceRecord.model ? "ELITE" : "SPARTAN"}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Typography variant="body2" sx={{ color: "#B0B0B0", fontFamily: BARLOW_FAMILY }}>
            {rankTitle}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
