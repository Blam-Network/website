"use client";

import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { keyframes } from "@mui/system";

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LAYERS = {
  middle: "/img/loading/loading_spinner_large_middle.svg",
  outer: "/img/loading/loading_spinner_large_outer.svg",
  inner: "/img/loading/loading_spinner_large_inner.svg",
  // center: "/img/loading/loading_spinner.svg",
} as const;

/** Neutral grey look for light-blue SVG art (#becfe3). */
const GREY_FILTER = "grayscale(1) brightness(0.30) contrast(1.02)";

const imgSx = {
  width: "100%",
  height: "100%",
  objectFit: "contain" as const,
  pointerEvents: "none" as const,
  userSelect: "none" as const,
};

export type LoadingSpinnerProps = {
  /** Edge length in pixels; the spinner is always square. */
  size: number;
  /** Seconds for one full rotation of the outer ring. */
  periodSec?: number;
  sx?: SxProps<Theme>;
  className?: string;
};

export function LoadingSpinner({
  size,
  periodSec = 10,
  sx,
  className,
}: LoadingSpinnerProps) {
  const [outerClockwise, setOuterClockwise] = useState(true);

  useEffect(() => {
    setOuterClockwise(Math.random() < 0.5);
  }, []);

  const outerDirection: "normal" | "reverse" = outerClockwise ? "normal" : "reverse";
  const innerDirection: "normal" | "reverse" = outerClockwise ? "reverse" : "normal";

  const stack = {
    position: "absolute" as const,
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const rotating = (direction: "normal" | "reverse") => ({
    ...stack,
    transformOrigin: "center",
    animation: `${spin} ${periodSec}s linear infinite`,
    animationDirection: direction,
  });

  return (
    <Box
      className={className}
      sx={{
        position: "relative",
        width: size,
        height: size,
        flexShrink: 0,
        filter: GREY_FILTER,
        ...sx,
      }}
    >
      <Box sx={stack}>
        <Box component="img" src={LAYERS.middle} alt="" draggable={false} sx={{...imgSx, width: "75%", height: "75%"}} />
      </Box>
      <Box sx={rotating(outerDirection)}>
        <Box component="img" src={LAYERS.outer} alt="" draggable={false} sx={imgSx} />
      </Box>
      <Box sx={rotating(innerDirection)}>
        <Box
          component="img"
          src={LAYERS.inner}
          alt=""
          draggable={false}
          sx={{ ...imgSx, width: "50%", height: "50%" }}
        />
      </Box>
      {/* <Box sx={stack}>
        <Box component="img" src={LAYERS.center} alt="" draggable={false} sx={imgSx} />
      </Box> */}
    </Box>
  );
}
