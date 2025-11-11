"use client";

import { useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { ScreenshotModal } from "./ScreenshotModal";
import { api } from "../trpc/client";
import { useQuery } from "@tanstack/react-query";

interface FileshareScreenshotThumbProps {
  shareId: string;
  slot: number;
  filename: string;
  description: string;
  author?: string;
}

export const FileshareScreenshotThumb = ({
  shareId,
  slot,
  filename,
  description,
  author,
}: FileshareScreenshotThumbProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [screenshotId, setScreenshotId] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Look up screenshot by share_id and slot
  const { data: screenshot, isLoading } = useQuery({
    queryKey: ['screenshotByFileshare', shareId, slot],
    queryFn: () => api.sunrise2.getScreenshotByFileshare.query({ shareId, slot }),
    enabled: !!shareId && slot !== undefined && slot !== null,
  });

  useEffect(() => {
    if (screenshot?.id) {
      setScreenshotId(screenshot.id);
    }
  }, [screenshot]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 80 }}>
        <CircularProgress size={20} sx={{ color: '#7CB342' }} />
      </Box>
    );
  }

  if (!screenshotId || !screenshot) {
    return null; // No screenshot found, don't show thumbnail
  }

  const screenshotUrl = `/api/screenshot/${screenshotId}`;

  return (
    <>
      <Box
        onClick={() => setModalOpen(true)}
        sx={{
          position: 'relative',
          width: '100%',
          paddingBottom: '56.25%', // 16:9 aspect ratio
          backgroundColor: '#0F0F0F',
          overflow: 'hidden',
          cursor: 'pointer',
          border: '1px solid #333',
          borderRadius: '2px',
          mt: 1,
          '&:hover': {
            borderColor: '#7CB342',
            boxShadow: '0 0 8px rgba(124, 179, 66, 0.3)',
          },
          transition: 'all 0.2s ease',
        }}
      >
        {!imageLoaded && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1,
            }}
          >
            <CircularProgress size={20} sx={{ color: '#7CB342' }} />
          </Box>
        )}
        <img
          src={screenshotUrl}
          alt={description}
          onLoad={() => setImageLoaded(true)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: imageLoaded ? 'block' : 'none',
          }}
        />
      </Box>
      <ScreenshotModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        screenshotUrl={screenshotUrl}
        filename={filename}
        description={description}
        author={author}
      />
    </>
  );
};

