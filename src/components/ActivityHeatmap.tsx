"use client";

import { Box, Paper, Typography, Tooltip } from "@mui/material";
import { useMemo } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

interface ActivityHeatmapProps {
  data: Record<string, number>;
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  // Convert data to format expected by react-calendar-heatmap
  const heatmapValues = useMemo(() => {
    return Object.entries(data).map(([date, count]) => ({
      date,
      count,
    }));
  }, [data]);

  // Calculate date range (last year)
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  // Set to start of day
  oneYearAgo.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);

  // Find max count for color scaling
  const maxCount = useMemo(() => {
    return Math.max(...Object.values(data), 1);
  }, [data]);

  // Class function for color scaling
  const classForValue = (value: { date: string; count: number } | null) => {
    if (!value || value.count === 0) {
      return "color-empty";
    }
    const intensity = value.count / maxCount;
    if (intensity < 0.25) return "color-scale-1";
    if (intensity < 0.5) return "color-scale-2";
    if (intensity < 0.75) return "color-scale-3";
    return "color-scale-4";
  };

  // Format date for tooltip
  const formatDateForTooltip = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Transform day element to wrap with MUI Tooltip
  const transformDayElement = (rect: React.ReactElement, value: { date: string; count: number } | null, index: number) => {
    if (!value || value.count === 0) {
      return (
        <Tooltip
          key={index}
          title={
            <Box sx={{ fontFamily: '"Segoe UI", "Arial", "Helvetica", sans-serif' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"Segoe UI", "Arial", "Helvetica", sans-serif' }}>
                No games
              </Typography>
              <Typography variant="caption" sx={{ color: "#B0B0B0", fontFamily: '"Segoe UI", "Arial", "Helvetica", sans-serif' }}>
                {value ? formatDateForTooltip(value.date) : ""}
              </Typography>
            </Box>
          }
          arrow
        >
          {rect}
        </Tooltip>
      );
    }

    return (
      <Tooltip
        key={index}
        title={
          <Box sx={{ fontFamily: '"Segoe UI", "Arial", "Helvetica", sans-serif' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: '"Segoe UI", "Arial", "Helvetica", sans-serif' }}>
              {value.count} {value.count === 1 ? "game" : "games"}
            </Typography>
            <Typography variant="caption" sx={{ color: "#B0B0B0", fontFamily: '"Segoe UI", "Arial", "Helvetica", sans-serif' }}>
              {formatDateForTooltip(value.date)}
            </Typography>
          </Box>
        }
        arrow
      >
        {rect}
      </Tooltip>
    );
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        background: "linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)",
        border: "1px solid #333",
        fontFamily: '"Segoe UI", "Arial", "Helvetica", sans-serif',
        "& .react-calendar-heatmap": {
          fontFamily: '"Segoe UI", "Arial", "Helvetica", sans-serif',
        },
        "& .react-calendar-heatmap text": {
          fontSize: "10px",
          fill: "#B0B0B0",
          fontFamily: '"Segoe UI", "Arial", "Helvetica", sans-serif',
        },
        "& .react-calendar-heatmap .react-calendar-heatmap-small-text": {
          fontSize: "10px",
          fontFamily: '"Segoe UI", "Arial", "Helvetica", sans-serif',
        },
        "& .react-calendar-heatmap rect:hover": {
          stroke: "#7CB342",
          strokeWidth: 1,
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 2, color: "#7CB342", textAlign: "center", fontFamily: '"Segoe UI", "Arial", "Helvetica", sans-serif' }}
      >
        Games Played
      </Typography>

      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
          display: "flex",
          gap: 1,
          "& .react-calendar-heatmap": {
            flex: 1,
            minWidth: "800px",
          },
        }}
      >
        {/* Day of week legend */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-end",
            pr: 1,
            minWidth: "20px",
            mt: 3.5,
            "& .day-label": {
              fontSize: "10px",
              color: "#B0B0B0",
              fontFamily: '"Segoe UI", "Arial", "Helvetica", sans-serif',
              lineHeight: "8px",
              mb: "2px",
            },
          }}
        >
          <Typography className="day-label" component="span">S</Typography>
          <Typography className="day-label" component="span">M</Typography>
          <Typography className="day-label" component="span">T</Typography>
          <Typography className="day-label" component="span">W</Typography>
          <Typography className="day-label" component="span">T</Typography>
          <Typography className="day-label" component="span">F</Typography>
          <Typography className="day-label" component="span">S</Typography>
        </Box>

        <CalendarHeatmap
          startDate={oneYearAgo}
          endDate={today}
          values={heatmapValues}
          classForValue={classForValue}
          transformDayElement={transformDayElement}
        />
      </Box>

      {/* Legend */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 1, mt: 2 }}>
        <Typography variant="caption" sx={{ color: "#B0B0B0", mr: 1, fontFamily: '"Segoe UI", "Arial", "Helvetica", sans-serif' }}>
          Less
        </Typography>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Box sx={{ width: 12, height: 12, backgroundColor: "#161b22", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "2px" }} />
          <Box sx={{ width: 12, height: 12, backgroundColor: "#0e4429", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "2px" }} />
          <Box sx={{ width: 12, height: 12, backgroundColor: "#006d32", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "2px" }} />
          <Box sx={{ width: 12, height: 12, backgroundColor: "#26a641", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "2px" }} />
          <Box sx={{ width: 12, height: 12, backgroundColor: "#39d353", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "2px" }} />
        </Box>
        <Typography variant="caption" sx={{ color: "#B0B0B0", ml: 1, fontFamily: '"Segoe UI", "Arial", "Helvetica", sans-serif' }}>
          More
        </Typography>
      </Box>

      {/* Custom CSS for colors */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .react-calendar-heatmap .color-empty {
            fill: #161b22;
          }
          .react-calendar-heatmap .color-scale-1 {
            fill: #0e4429;
          }
          .react-calendar-heatmap .color-scale-2 {
            fill: #006d32;
          }
          .react-calendar-heatmap .color-scale-3 {
            fill: #26a641;
          }
          .react-calendar-heatmap .color-scale-4 {
            fill: #39d353;
          }
          .react-calendar-heatmap rect {
            rx: 2;
            ry: 2;
          }
        `
      }} />
    </Paper>
  );
}

