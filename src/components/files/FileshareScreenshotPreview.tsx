"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";

interface FileshareScreenshotPreviewProps {
  screenshotUrl: string;
  alt: string;
}

export function FileshareScreenshotPreview({
  screenshotUrl,
  alt,
}: FileshareScreenshotPreviewProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        backgroundColor: "#000",
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
      <Box
        component="img"
        src={screenshotUrl}
        alt={alt}
        onLoad={() => setImageLoaded(true)}
        sx={{
          display: imageLoaded ? "block" : "none",
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </Box>
  );
}
