"use client";

import { Box } from "@mui/material";
import { useState } from "react";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { env } from "@/src/env";
import {
  getFileshareOverlayUrl,
  getReachFileshareFrameKind,
  getReachGametypeIconUrl,
  getReachGametypeLayerStyle,
  getReachMapImageUrl,
  reachFiletypeShowsGametypeImage,
  reachFiletypeShowsMapImage,
} from "@/src/constants/fileshareIcons";
import {
  getIconSizeProps,
  layerImageStyle,
  mapLayerImageStyle,
  maskStyles,
} from "@/src/components/fileshare/fileshareIconStyles";

interface ReachFileshareIconProps {
  filetype: number;
  iconIndex?: number | null;
  size?: number | string;
  shareId?: string;
  fileId?: string;
  mapId?: number;
}

export function ReachFileshareIcon({
  filetype,
  iconIndex,
  size = "30%",
  shareId,
  fileId,
  mapId,
}: ReachFileshareIconProps) {
  const frameKind = getReachFileshareFrameKind(filetype);
  const overlayUrl = getFileshareOverlayUrl(frameKind);
  const { maxWidthValue, maxHeightValue } = getIconSizeProps(size);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hexShareId = shareId
    ? BigInt(shareId).toString(16).toUpperCase().padStart(16, "0")
    : null;

  const screenshotUrl =
    filetype === 2 && hexShareId && fileId
      ? `${env.NEXT_PUBLIC_HALO_REACH_API_BASE_URL}/haloreach/fileshare/${hexShareId}/${fileId}/view`
      : null;

  const showScreenshot = !!screenshotUrl;
  const mapImageUrl =
    mapId && reachFiletypeShowsMapImage(filetype) ? getReachMapImageUrl(mapId) : null;
  const gametypeImageUrl =
    iconIndex != null && reachFiletypeShowsGametypeImage(filetype)
      ? getReachGametypeIconUrl(iconIndex)
      : null;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: maxWidthValue,
        maxHeight: maxHeightValue,
        display: "inline-block",
        aspectRatio: "16 / 9",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          ...maskStyles(frameKind),
        }}
      >
        {mapImageUrl && (
          <Box component="img" src={mapImageUrl} alt="" sx={mapLayerImageStyle} />
        )}

        {gametypeImageUrl && (
          <Box
            component="img"
            src={gametypeImageUrl}
            alt=""
            sx={getReachGametypeLayerStyle()}
          />
        )}

        {showScreenshot && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {!imageLoaded && !imageError && (
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
            {!imageError ? (
              <Box
                component="img"
                src={screenshotUrl!}
                alt="Screenshot"
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  setImageError(true);
                  setImageLoaded(true);
                }}
                sx={{
                  ...layerImageStyle,
                  display: imageLoaded ? "block" : "none",
                }}
              />
            ) : (
              <Box
                component="img"
                src="/img/invalid_screen_ui.png"
                alt="Invalid screenshot"
                sx={layerImageStyle}
              />
            )}
          </Box>
        )}
      </Box>

      <Box
        component="img"
        src={overlayUrl}
        alt=""
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          pointerEvents: "none",
        }}
      />
    </Box>
  );
}
