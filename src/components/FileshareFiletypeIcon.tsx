"use client";

import { Box, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ScreenshotModal } from "./ScreenshotModal";
import { env } from "@/src/env";

interface FileshareFiletypeIconProps {
  filetype: number;
  gameEngineType?: number;
  size?: number | string;
  shareId?: string;
  slot?: number;
  fileId?: string;
  filename?: string;
  description?: string;
  author?: string;
}

const getFileImage = (type: number): string => {
  if (type < 10) return "gametype";
  if (type === 10) return "map";
  if (type === 11) return "film";
  if (type === 12) return "clip";
  if (type === 13) return "screenshot";

  return "gametype";
};

const getGametypeIconPosition = (gameEngineType: number): { x: number; y: number } | null => {
  // Sprite sheet has 2 columns, 5 rows
  // Left column: forge (10), slayer (2), koth (4), juggernaut (5), assault (7)
  // Right column: ctf (1), oddball (3), vip (8), territories (6), infection (9)
  
  switch (gameEngineType) {
    case 10: // Forge
      return { x: 0, y: 0 }; // Left column, row 0
    case 2: // Slayer
      return { x: 0, y: 1 }; // Left column, row 1
    case 4: // KOTH
      return { x: 0, y: 2 }; // Left column, row 2
    case 5: // Juggernaut
      return { x: 0, y: 3 }; // Left column, row 3
    case 7: // Assault
      return { x: 0, y: 4 }; // Left column, row 4
    case 1: // CTF
      return { x: 1, y: 0 }; // Right column, row 0
    case 3: // Oddball
      return { x: 1, y: 1 }; // Right column, row 1
    case 8: // VIP
      return { x: 1, y: 2 }; // Right column, row 2
    case 6: // Territories
      return { x: 1, y: 3 }; // Right column, row 3
    case 9: // Infection
      return { x: 1, y: 4 }; // Right column, row 4
    default:
      return null;
  }
};

export const FileshareFiletypeIcon = ({
  filetype,
  gameEngineType,
  size = '30%',
  shareId,
  slot,
  fileId,
  filename,
  description,
  author,
}: FileshareFiletypeIconProps) => {
  const router = useRouter();
  const fileImage = getFileImage(filetype);
  const gametypePosition = filetype < 10 && gameEngineType ? getGametypeIconPosition(gameEngineType) : null;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [query, setQuery] = useState<Record<string, string>>({});
  const [localModalOpen, setLocalModalOpen] = useState(false);
  
  // Read query params from URL on mount and when URL changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const queryObj: Record<string, string> = {};
      params.forEach((value, key) => {
        queryObj[key] = value;
      });
      setQuery(queryObj);
    }
  }, []);
  
  // Listen for popstate events (back/forward button)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const queryObj: Record<string, string> = {};
      params.forEach((value, key) => {
        queryObj[key] = value;
      });
      setQuery(queryObj);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  const sizeValue = typeof size === 'number' ? `${size}px` : size;
  const iconSize = typeof size === 'number' ? size : 64; // Default size for calculations

  // Convert shareId to padded hex string - shareId comes as decimal string from backend
  const hexShareId = shareId 
    ? BigInt(shareId).toString(16).toUpperCase().padStart(16, '0')
    : null;

  // Use the fileshare endpoint to load the image directly
  const screenshotUrl = (filetype === 13 && hexShareId && slot !== undefined && slot !== null) 
    ? `${env.NEXT_PUBLIC_HALO3_API_BASE_URL}/halo3/fileshare/${hexShareId}/${slot}/view` 
    : null;
  const showScreenshot = filetype === 13 && screenshotUrl;

  const updateURL = (slotUniqueId: string | null) => {
    const newQuery = { ...query };
    if (slotUniqueId) {
      newQuery.viewSlot = slotUniqueId;
      setLocalModalOpen(true); // Open modal immediately
    } else {
      delete newQuery.viewSlot;
      setLocalModalOpen(false); // Close modal immediately
    }
    setQuery(newQuery); // Update local state immediately
    
    const params = new URLSearchParams();
    Object.entries(newQuery).forEach(([key, value]) => {
      params.set(key, value);
    });
    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;
    
    router.replace(newUrl, { scroll: false });
  };

  // Sync local modal state with URL param
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

  const modalOpen = fileId ? (query.viewSlot === fileId || localModalOpen) : false;

  return (
    <>
      <Box
        onClick={showScreenshot && !imageError && fileId ? () => updateURL(fileId) : undefined}
        sx={{
          position: 'relative',
          width: sizeValue,
          height: sizeValue,
          display: 'inline-block',
          cursor: showScreenshot && !imageError && fileId ? 'pointer' : 'default',
        }}
      >
        {/* Screenshot thumbnail behind icon */}
        {showScreenshot && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 0,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            {!imageLoaded && !imageError && (
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
            {!imageError ? (
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Screenshot image - will be masked by the icon */}
                <img
                  src={screenshotUrl!}
                  alt={description || filename || 'Screenshot'}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    setImageError(true);
                    setImageLoaded(true);
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: imageLoaded ? 'block' : 'none',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 0,
                  }}
                />
                {/* Screenshot icon as mask/overlay - defines the visible area */}
                <img
                  src="/img/files/screenshot.png"
                  alt="Screenshot icon"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 1,
                    pointerEvents: 'none',
                    mixBlendMode: 'normal',
                  }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                }}
              >
                <img
                  src="/img/invalid_screen_ui.png"
                  alt="Invalid screenshot"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            )}
          </Box>
        )}
        {/* Filetype icon */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            zIndex: 1,
            pointerEvents: showScreenshot && !imageError ? 'none' : 'auto',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
          >
            <img
              src={`/img/files/${fileImage}.png`}
              alt={fileImage}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
              }}
            />
            {gametypePosition && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: 'url("/img/game_types_lg_ui.png")',
                  backgroundSize: '200% 500%', // 2 columns, 5 rows
                  backgroundPosition: `${gametypePosition.x * 100}% ${gametypePosition.y * 25}%`, // x: 0% or 100%, y: 0%, 25%, 50%, 75%, 100%
                  backgroundRepeat: 'no-repeat',
                  pointerEvents: 'none',
                  objectFit: 'contain',
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
      {showScreenshot && screenshotUrl && !imageError && fileId && (
        <ScreenshotModal
          open={modalOpen}
          onClose={() => updateURL(null)}
          screenshotUrl={screenshotUrl}
          filename={filename || ''}
          description={description || ''}
          author={author}
        />
      )}
    </>
  );
};

