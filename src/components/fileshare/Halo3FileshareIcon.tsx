"use client";

import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { ScreenshotModal } from "@/src/components/ScreenshotModal";
import { env } from "@/src/env";
import {
  getFileshareOverlayUrl,
  getHalo3FileshareFrameKind,
  getHalo3MapImageUrl,
  getReachGametypeIconUrl,
  getReachGametypeLayerStyle,
  halo3FiletypeShowsGametypeImage,
  halo3FiletypeShowsMapImage,
  halo3FiletypeToReachIconIndex,
  halo3GameEngineToReachIconIndex,
} from "@/src/constants/fileshareIcons";
import {
  getIconSizeProps,
  layerImageStyle,
  mapLayerImageStyle,
  maskStyles,
} from "@/src/components/fileshare/fileshareIconStyles";

interface Halo3FileshareIconProps {
  filetype: number;
  gameEngineType?: number;
  size?: number | string;
  shareId?: string;
  slot?: number;
  fileId?: string;
  filename?: string;
  description?: string;
  author?: string;
  mapId?: number;
  fileShareGame?: "halo3" | "ares" | "odst";
}

export function Halo3FileshareIcon({
  filetype,
  gameEngineType,
  size = "30%",
  shareId,
  slot,
  fileId,
  filename,
  description,
  author,
  mapId,
  fileShareGame = "halo3",
}: Halo3FileshareIconProps) {
  const router = useRouter();
  const frameKind = getHalo3FileshareFrameKind(filetype);
  const overlayUrl = getFileshareOverlayUrl(frameKind);
  const { maxWidthValue, maxHeightValue } = getIconSizeProps(size);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [query, setQuery] = useState<Record<string, string>>({});
  const [localModalOpen, setLocalModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryObj: Record<string, string> = {};
      params.forEach((value, key) => {
        queryObj[key] = value;
      });
      setQuery(queryObj);
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const queryObj: Record<string, string> = {};
      params.forEach((value, key) => {
        queryObj[key] = value;
      });
      setQuery(queryObj);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const hexShareId = shareId
    ? BigInt(shareId).toString(16).toUpperCase().padStart(16, "0")
    : null;

  const apiPath =
    fileShareGame === "odst"
      ? "halo3odst"
      : fileShareGame === "ares"
        ? "ares"
        : "halo3";

  const screenshotUrl =
    filetype === 13 && hexShareId && slot != null
      ? `${env.NEXT_PUBLIC_HALO3_API_BASE_URL}/${apiPath}/fileshare/${hexShareId}/${slot}/view`
      : null;

  const showScreenshot = !!screenshotUrl;
  const mapImageUrl =
    mapId && halo3FiletypeShowsMapImage(filetype) ? getHalo3MapImageUrl(mapId) : null;

  const reachIconIndex =
    gameEngineType != null
      ? halo3GameEngineToReachIconIndex(gameEngineType)
      : filetype < 10
        ? halo3FiletypeToReachIconIndex(filetype)
        : null;
  const gametypeImageUrl =
    reachIconIndex != null && halo3FiletypeShowsGametypeImage(filetype)
      ? getReachGametypeIconUrl(reachIconIndex)
      : null;

  const updateURL = (slotUniqueId: string | null) => {
    const newQuery = { ...query };
    if (slotUniqueId) {
      newQuery.viewSlot = slotUniqueId;
      setLocalModalOpen(true);
    } else {
      delete newQuery.viewSlot;
      setLocalModalOpen(false);
    }
    setQuery(newQuery);

    const params = new URLSearchParams();
    Object.entries(newQuery).forEach(([key, value]) => {
      params.set(key, value);
    });
    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  };

  useEffect(() => {
    if (fileId) {
      const shouldBeOpen = query.viewSlot === fileId;
      if (shouldBeOpen !== localModalOpen) {
        setLocalModalOpen(shouldBeOpen);
      }
    } else {
      setLocalModalOpen(false);
    }
  }, [query.viewSlot, fileId, localModalOpen]);

  const modalOpen = fileId ? query.viewSlot === fileId || localModalOpen : false;
  const isClickable = showScreenshot && !imageError && !!fileId;

  return (
    <>
      <Box
        onClick={isClickable ? () => updateURL(fileId!) : undefined}
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: maxWidthValue,
          maxHeight: maxHeightValue,
          display: "inline-block",
          cursor: isClickable ? "pointer" : "default",
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
                  alt={description || filename || "Screenshot"}
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

      {showScreenshot && screenshotUrl && !imageError && fileId && (
        <ScreenshotModal
          open={modalOpen}
          onClose={() => updateURL(null)}
          screenshotUrl={screenshotUrl}
          filename={filename || ""}
          description={description || ""}
          author={author}
        />
      )}
    </>
  );
}
