"use client";

import { Box, Tooltip, Typography } from "@mui/material";
import { getReachMedal, getReachMedalImageUrl } from "@/src/constants/reach/reachGameData";

interface ReachMedalIconProps {
  medal: number;
  count?: number;
  size?: number;
}

export function ReachMedalIcon({ medal, count, size = 36 }: ReachMedalIconProps) {
  const definition = getReachMedal(medal);
  const imageUrl = getReachMedalImageUrl(definition.sprite);

  return (
    <Tooltip
      arrow
      title={
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {definition.name}
            {count != null && count > 1 ? ` ×${count}` : ""}
          </Typography>
          {definition.description && (
            <Typography variant="caption" color="text.secondary">
              {definition.description}
            </Typography>
          )}
        </Box>
      }
    >
      <Box sx={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
        {imageUrl ? (
          <Box
            component="img"
            src={imageUrl}
            alt={definition.name}
            sx={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              border: "1px solid",
              borderColor: "divider",
            }}
          />
        )}
        {count != null && count > 1 && (
          <Box
            sx={{
              position: "absolute",
              right: -4,
              bottom: -4,
              minWidth: 18,
              height: 18,
              px: 0.5,
              borderRadius: 9,
              backgroundColor: "rgba(0, 0, 0, 0.85)",
              border: "1px solid",
              borderColor: "divider",
              fontSize: 11,
              fontWeight: 700,
              lineHeight: "16px",
              textAlign: "center",
            }}
          >
            {count}
          </Box>
        )}
      </Box>
    </Tooltip>
  );
}
