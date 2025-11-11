"use client";

import { useState, useEffect } from "react";
import { Modal, Box, Typography, IconButton, CircularProgress } from "@mui/material";

interface ScreenshotModalProps {
  open: boolean;
  onClose: () => void;
  screenshotUrl: string;
  filename: string;
  description: string;
  author?: string;
}

export const ScreenshotModal = ({
  open,
  onClose,
  screenshotUrl,
  filename,
  description,
  author,
}: ScreenshotModalProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [shouldShowModal, setShouldShowModal] = useState(false);

  // Preload image when open prop changes
  useEffect(() => {
    if (open) {
      setImageLoaded(false);
      setShouldShowModal(false);
      
      const img = new Image();
      img.onload = () => {
        setImageLoaded(true);
        setShouldShowModal(true);
      };
      img.onerror = () => {
        // Even on error, show the modal so user can see there was an issue
        setImageLoaded(true);
        setShouldShowModal(true);
      };
      img.src = screenshotUrl;
    } else {
      setImageLoaded(false);
      setShouldShowModal(false);
    }
  }, [open, screenshotUrl]);
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          maxWidth: '95vw',
          maxHeight: '95vh',
          outline: 'none',
          ...(!shouldShowModal && {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }),
        }}
      >
        {!shouldShowModal && (
          <CircularProgress size={60} sx={{ color: '#7CB342' }} />
        )}
        {shouldShowModal && (
          <>
            <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: -40,
            right: 0,
            color: '#fff',
            zIndex: 1,
            fontSize: '1.5rem',
            fontWeight: 700,
            width: 40,
            height: 40,
            '&:hover': {
              color: '#7CB342',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          ×
        </IconButton>
        <Box
          sx={{
            background: '#fff',
            padding: '30px',
            borderRadius: '2px',
            boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1), 0 10px 40px rgba(0, 0, 0, 0.6)',
            transform: 'rotate(-1deg)',
            '&:hover': {
              transform: 'rotate(0deg)',
            },
            transition: 'transform 0.3s ease',
            maxWidth: '1200px',
            width: '90vw',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 1px,
                  rgba(0, 0, 0, 0.02) 1px,
                  rgba(0, 0, 0, 0.02) 2px
                ),
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 1px,
                  rgba(0, 0, 0, 0.02) 1px,
                  rgba(0, 0, 0, 0.02) 2px
                )
              `,
              pointerEvents: 'none',
              borderRadius: '2px',
              zIndex: 0,
            },
            '& > *': {
              position: 'relative',
              zIndex: 1,
            },
          }}
        >
          <Box
            sx={{
              mb: 3,
            }}
          >
            <img
              src={screenshotUrl}
              alt={description}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                maxHeight: '65vh',
                objectFit: 'contain',
              }}
            />
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: '"Permanent Marker", "Comic Sans MS", cursive',
                fontSize: '1.8rem',
                color: '#222',
                mb: 1,
                lineHeight: 1.2,
              }}
            >
              {filename}
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Permanent Marker", "Comic Sans MS", cursive',
                fontSize: '1.2rem',
                color: '#555',
                lineHeight: 1.3,
              }}
            >
              {description}
            </Typography>
            {author && (
              <Typography
                sx={{
                  fontFamily: '"Permanent Marker", "Comic Sans MS", cursive',
                  fontSize: '1rem',
                  color: '#888',
                  mt: 1.5,
                }}
              >
                by {author}
              </Typography>
            )}
          </Box>
        </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

