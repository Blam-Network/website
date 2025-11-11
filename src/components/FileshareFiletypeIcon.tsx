"use client";

import { Box, CircularProgress } from "@mui/material";
import { useState } from "react";
import { ScreenshotModal } from "./ScreenshotModal";

interface FileshareFiletypeIconProps {
  filetype: number;
  gameEngineType?: number;
  size?: number | string;
  shareId?: string;
  slot?: number;
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
  filename,
  description,
  author,
}: FileshareFiletypeIconProps) => {
  const fileImage = getFileImage(filetype);
  const gametypePosition = filetype < 10 && gameEngineType ? getGametypeIconPosition(gameEngineType) : null;
  const [modalOpen, setModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const sizeValue = typeof size === 'number' ? `${size}px` : size;
  const iconSize = typeof size === 'number' ? size : 64; // Default size for calculations

  // Convert shareId to padded hex string - shareId comes as decimal string from backend
  // const hexShareId = shareId 
  //   ? BigInt(shareId).toString(16).toUpperCase().padStart(16, '0')
  //   : null;

  // Use the fileshare endpoint to load the image directly
  // Temporarily disabled due to screenshot file errors
  // const screenshotUrl = (filetype === 13 && hexShareId && slot !== undefined && slot !== null) 
  //   ? `https://halo3.blam.network/halo3/fileshare/${hexShareId}/${slot}/view` 
  //   : null;
  const screenshotUrl: string | null = null;
  const showScreenshot = false; // filetype === 13 && screenshotUrl;

  return (
    <>
      <Box
        onClick={showScreenshot ? () => setModalOpen(true) : undefined}
        sx={{
          position: 'relative',
          width: sizeValue,
          height: sizeValue,
          display: 'inline-block',
          cursor: showScreenshot ? 'pointer' : 'default',
        }}
      >
        {/* Screenshot thumbnail behind icon - Temporarily disabled due to screenshot file errors */}
        {/* {showScreenshot && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 0,
              overflow: 'hidden',
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
              src={screenshotUrl!}
              alt={description || filename || 'Screenshot'}
              onLoad={() => setImageLoaded(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: imageLoaded ? 'block' : 'none',
              }}
            />
          </Box>
        )} */}
        {/* Filetype icon */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            zIndex: 1,
          }}
        >
          <img
            src={`/img/files/${fileImage}.png`}
            alt={fileImage}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
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
              }}
            />
          )}
        </Box>
      </Box>
      {/* Temporarily disabled due to screenshot file errors */}
      {/* {showScreenshot && screenshotUrl && (
        <ScreenshotModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          screenshotUrl={screenshotUrl}
          filename={filename || ''}
          description={description || ''}
          author={author}
        />
      )} */}
    </>
  );
};

