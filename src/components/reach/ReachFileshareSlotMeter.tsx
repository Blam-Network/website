import { Box, Typography } from "@mui/material";
import type { ReachFileShare } from "@/src/api/reach/fileShare";

type ReachFileShareSlot = ReachFileShare["slots"][number];
import { REACH_FILESHARE_FILE_TYPE_GROUPS } from "@/src/components/reach/reachFileshareTableStyles";

interface ReachFileshareSlotMeterProps {
  fileShare: ReachFileShare;
  width?: number;
}

export function ReachFileshareSlotMeter({ fileShare, width = 200 }: ReachFileshareSlotMeterProps) {
  const fileQuota = Math.max(fileShare.quotaSlots, 1);
  const slots: ReachFileShareSlot[] = fileShare.slots;
  const filesUsed = slots.length;

  const segments = REACH_FILESHARE_FILE_TYPE_GROUPS.map((group) => {
    const count = slots.filter((slot) =>
      group.fileTypes.has(slot.header.filetype),
    ).length;
    return {
      id: group.id,
      label: group.label,
      count,
      widthPercent: (count / fileQuota) * 100,
      color: group.meterColor,
    };
  }).filter((segment) => segment.count > 0);

  return (
    <Box
      title={REACH_FILESHARE_FILE_TYPE_GROUPS.map((group) => {
        const count = slots.filter((slot) =>
          group.fileTypes.has(slot.header.filetype),
        ).length;
        return `${group.label}: ${count}`;
      }).join(" · ")}
      sx={{
        width,
        height: 22,
        border: "1px solid",
        borderColor: "divider",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "rgba(0, 0, 0, 0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "row",
        }}
      >
        {segments.map((segment) => (
          <Box
            key={segment.id}
            sx={{
              width: `${segment.widthPercent}%`,
              height: "100%",
              bgcolor: segment.color,
              flexShrink: 0,
            }}
          />
        ))}
      </Box>
      <Typography
        variant="caption"
        sx={{
          position: "relative",
          zIndex: 1,
          color: "text.primary",
          fontWeight: 700,
          fontSize: "0.65rem",
          letterSpacing: "0.02em",
          textShadow: "0 0 4px rgba(0,0,0,0.8)",
        }}
      >
        {filesUsed} / {fileShare.quotaSlots} files
      </Typography>
    </Box>
  );
}
