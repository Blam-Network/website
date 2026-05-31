"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { api } from "../trpc/client";
import { useQuery } from "@tanstack/react-query";

interface FileshareScreenshotThumbProps {
  shareId: string;
  slot: number;
  description: string;
}

export const FileshareScreenshotThumb = ({
  shareId,
  slot,
  description,
}: FileshareScreenshotThumbProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const { data: screenshot, isLoading } = useQuery({
    queryKey: ["screenshotByFileshare", shareId, slot],
    queryFn: () => api.sunrise2.getScreenshotByFileshare.query({ shareId, slot }),
    enabled: !!shareId && slot !== undefined && slot !== null,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 80 }}>
        <LoadingSpinner size={40} />
      </Box>
    );
  }

  if (!screenshot?.id) {
    return null;
  }

  const screenshotUrl = `/api/screenshot/${screenshot.id}`;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        paddingBottom: "56.25%",
        backgroundColor: "#0F0F0F",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "2px",
        mt: 1,
      }}
    >
      {!imageLoaded && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
          }}
        >
          <LoadingSpinner size={40} />
        </Box>
      )}
      <Box
        component="img"
        src={screenshotUrl}
        alt={description}
        onLoad={() => setImageLoaded(true)}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: imageLoaded ? "block" : "none",
        }}
      />
    </Box>
  );
};
