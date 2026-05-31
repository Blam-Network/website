"use client";

import { useState } from "react";
import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";

interface ScreenshotPolaroidProps {
  screenshotUrl: string;
  filename: string;
  description: string;
  author?: string;
  imageMaxHeight?: string | number;
  tilt?: boolean;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
}

export function ScreenshotPolaroid({
  screenshotUrl,
  filename,
  description,
  author,
  imageMaxHeight = "65vh",
  tilt = true,
  fullWidth = false,
  sx,
}: ScreenshotPolaroidProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: fullWidth ? "stretch" : "center",
        width: "100%",
        overflow: tilt ? "visible" : undefined,
        py: fullWidth && tilt ? 1 : 0,
        ...sx,
      }}
    >
      <Box
        sx={{
          background: "#fff",
          padding: "30px",
          borderRadius: "2px",
          boxShadow:
            "inset 0 0 15px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1), 0 10px 40px rgba(0, 0, 0, 0.6)",
          transform: tilt ? "rotate(-1deg)" : "none",
          ...(tilt && {
            "&:hover": {
              transform: "rotate(0deg)",
            },
          }),
          transition: "transform 0.3s ease",
          maxWidth: fullWidth ? "none" : "1200px",
          minWidth: 0,
          width: fullWidth ? "100%" : "fit-content",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 5px,
                rgba(0, 0, 0, 0.02) 5px,
                rgba(0, 0, 0, 0.02) 6px
              ),
              repeating-linear-gradient(
                135deg,
                transparent,
                transparent 5px,
                rgba(0, 0, 0, 0.02) 5px,
                rgba(0, 0, 0, 0.02) 6px
              )
            `,
            pointerEvents: "none",
            borderRadius: "2px",
            zIndex: 0,
          },
          "& > *": {
            position: "relative",
            zIndex: 1,
          },
        }}
      >
        <Box
          sx={{
            mb: 3,
            position: "relative",
            display: fullWidth ? "block" : "inline-block",
            overflow: "hidden",
            width: "100%",
            maxWidth: "100%",
            minWidth: fullWidth ? 0 : 280,
            backgroundColor: "#000",
            ...(!imageLoaded && { aspectRatio: "16 / 9" }),
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              boxShadow: "inset 0px 0px 15px 0px rgba(0, 0, 0, 0.5)",
              pointerEvents: "none",
              zIndex: 2,
            },
          }}
        >
          {!imageLoaded && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#000",
                zIndex: 1,
              }}
            >
              <LoadingSpinner size={64} />
            </Box>
          )}
          <img
            src={screenshotUrl}
            alt={description || filename}
            onLoad={() => setImageLoaded(true)}
            style={{
              width: "100%",
              height: "auto",
              display: imageLoaded ? "block" : "none",
              ...(fullWidth
                ? { aspectRatio: "16 / 9", objectFit: "cover" }
                : {
                    maxHeight:
                      typeof imageMaxHeight === "number" ? `${imageMaxHeight}px` : imageMaxHeight,
                    objectFit: "contain",
                  }),
            }}
          />
        </Box>
        <Box>
          <Typography
            sx={{
              fontFamily: '"Permanent Marker", "Comic Sans MS", cursive',
              fontSize: "1.8rem",
              color: "#222",
              mb: 1,
              lineHeight: 1.2,
            }}
          >
            {filename}
          </Typography>
          {description ? (
            <Typography
              sx={{
                fontFamily: '"Permanent Marker", "Comic Sans MS", cursive',
                fontSize: "1.2rem",
                color: "#555",
                lineHeight: 1.3,
                whiteSpace: "pre-wrap",
              }}
            >
              {description}
            </Typography>
          ) : null}
          {author ? (
            <Typography
              sx={{
                fontFamily: '"Permanent Marker", "Comic Sans MS", cursive',
                fontSize: "1rem",
                color: "#888",
                mt: 1.5,
              }}
            >
              by {author}
            </Typography>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}
