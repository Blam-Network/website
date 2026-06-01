import { Box } from "@mui/material";
import { getReachRankImagePath } from "@/src/utils/reachRankImage";

interface ReachRankBadgeProps {
  grade: number;
  subGrade: number;
  size?: number;
}

export function ReachRankBadge({
  grade,
  subGrade,
  size = 28,
}: ReachRankBadgeProps) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        component="img"
        src={getReachRankImagePath(grade, subGrade)}
        alt=""
        sx={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          filter: "drop-shadow(0 0 2px rgba(0, 0, 0, 0.6))",
        }}
      />
    </Box>
  );
}
