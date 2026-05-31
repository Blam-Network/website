"use client";

import { Box, Typography, Tooltip } from "@mui/material";
import { useMemo } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { BARLOW_FAMILY } from "@/src/theme/fonts";

interface ActivityHeatmapProps {
  data: Record<string, number>;
}

const HEAT_COLORS = {
  empty: "rgba(255, 255, 255, 0.05)",
  scale1: "rgba(124, 179, 66, 0.22)",
  scale2: "rgba(124, 179, 66, 0.42)",
  scale3: "rgba(124, 179, 66, 0.68)",
  scale4: "#7CB342",
} as const;

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const heatmapValues = useMemo(
    () => Object.entries(data).map(([date, count]) => ({ date, count })),
    [data],
  );

  const totalGames = useMemo(
    () => Object.values(data).reduce((sum, count) => sum + count, 0),
    [data],
  );

  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  oneYearAgo.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);

  const maxCount = useMemo(() => Math.max(...Object.values(data), 1), [data]);

  const classForValue = (value: { date: string; count: number } | null) => {
    if (!value || value.count === 0) return "color-empty";
    const intensity = value.count / maxCount;
    if (intensity < 0.25) return "color-scale-1";
    if (intensity < 0.5) return "color-scale-2";
    if (intensity < 0.75) return "color-scale-3";
    return "color-scale-4";
  };

  const formatDateForTooltip = (dateStr: string): string =>
    new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const transformDayElement = (
    rect: React.ReactElement,
    value: { date: string; count: number } | null,
    index: number,
  ) => {
    const tooltipContent = (
      <Box sx={{ fontFamily: BARLOW_FAMILY }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {!value || value.count === 0
            ? "No games"
            : `${value.count} ${value.count === 1 ? "game" : "games"}`}
        </Typography>
        {value && (
          <Typography variant="caption" color="text.secondary">
            {formatDateForTooltip(value.date)}
          </Typography>
        )}
      </Box>
    );

    return (
      <Tooltip key={index} title={tooltipContent} arrow>
        {rect}
      </Tooltip>
    );
  };

  return (
    <Box
      sx={{
        fontFamily: BARLOW_FAMILY,
        "& .react-calendar-heatmap": {
          fontFamily: BARLOW_FAMILY,
        },
        "& .react-calendar-heatmap text": {
          fontSize: "10px",
          fill: "#8B9BB4",
          fontFamily: BARLOW_FAMILY,
        },
        "& .react-calendar-heatmap .react-calendar-heatmap-small-text": {
          fontSize: "10px",
          fontFamily: BARLOW_FAMILY,
        },
        "& .react-calendar-heatmap rect": {
          rx: 3,
          ry: 3,
          stroke: "transparent",
          strokeWidth: 1,
          transition: "stroke 0.15s ease, filter 0.15s ease",
        },
        "& .react-calendar-heatmap rect:hover": {
          stroke: "#7CB342",
          filter: "brightness(1.12)",
        },
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {totalGames.toLocaleString()} {totalGames === 1 ? "game" : "games"} in the last 12 months
      </Typography>

      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
          display: "flex",
          gap: 1,
          pb: 0.5,
          "& .react-calendar-heatmap": {
            flex: 1,
            minWidth: 720,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-end",
            pr: 0.75,
            minWidth: 16,
            mt: 3.5,
            color: "text.secondary",
            fontSize: "10px",
            fontFamily: BARLOW_FAMILY,
            lineHeight: "11px",
            userSelect: "none",
          }}
        >
          {["S", "M", "T", "W", "T", "F", "S"].map((label, i) => (
            <Typography
              key={i}
              component="span"
              sx={{ fontSize: "inherit", fontFamily: "inherit", color: "inherit", lineHeight: "inherit" }}
            >
              {label}
            </Typography>
          ))}
        </Box>

        <CalendarHeatmap
          startDate={oneYearAgo}
          endDate={today}
          values={heatmapValues}
          classForValue={classForValue}
          transformDayElement={transformDayElement}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 1,
          mt: 2,
          pt: 1.5,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
          Less
        </Typography>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {[
            HEAT_COLORS.empty,
            HEAT_COLORS.scale1,
            HEAT_COLORS.scale2,
            HEAT_COLORS.scale3,
            HEAT_COLORS.scale4,
          ].map((color, i) => (
            <Box
              key={i}
              sx={{
                width: 13,
                height: 13,
                backgroundColor: color,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "3px",
              }}
            />
          ))}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
          More
        </Typography>
      </Box>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .react-calendar-heatmap .color-empty { fill: ${HEAT_COLORS.empty}; }
            .react-calendar-heatmap .color-scale-1 { fill: ${HEAT_COLORS.scale1}; }
            .react-calendar-heatmap .color-scale-2 { fill: ${HEAT_COLORS.scale2}; }
            .react-calendar-heatmap .color-scale-3 { fill: ${HEAT_COLORS.scale3}; }
            .react-calendar-heatmap .color-scale-4 { fill: ${HEAT_COLORS.scale4}; }
          `,
        }}
      />
    </Box>
  );
}
