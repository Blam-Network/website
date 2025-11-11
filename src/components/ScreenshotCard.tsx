"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Paper, Box, Typography, CircularProgress } from "@mui/material";
import Link from "next/link";
import { ScreenshotModal } from "./ScreenshotModal";

interface ScreenshotCardProps {
  screenshotId: string;
  screenshotUrl: string;
  filename: string;
  description: string;
  author?: string;
}

export const ScreenshotCard = ({
  screenshotId,
  screenshotUrl,
  filename,
  description,
  author,
}: ScreenshotCardProps) => {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [query, setQuery] = useState<Record<string, string>>({});
  
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
  
  const modalOpen = query.viewScreenshot === screenshotId;

  const updateURL = (screenshotId: string | null) => {
    const newQuery = { ...query };
    if (screenshotId) {
      newQuery.viewScreenshot = screenshotId;
    } else {
      delete newQuery.viewScreenshot;
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

  return (
    <>
      <Paper
        elevation={4}
        onClick={() => {
          if (!imageError) {
            updateURL(screenshotId);
          }
        }}
        sx={{
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)',
          border: '1px solid #333',
          cursor: imageError ? 'default' : 'pointer',
          '&:hover': {
            borderColor: imageError ? '#333' : '#7CB342',
            boxShadow: imageError ? 'none' : '0 0 10px rgba(124, 179, 66, 0.2)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            paddingBottom: '56.25%', // 16:9 aspect ratio (9/16 = 0.5625)
            backgroundColor: '#0F0F0F',
            overflow: 'hidden',
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
              <CircularProgress size={40} sx={{ color: '#7CB342' }} />
            </Box>
          )}
          {imageError ? (
            <>
              <img
                src="/img/invalid_screen_ui.png"
                alt="Invalid screenshot"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
              <img
                src="/img/files/screenshot.png"
                alt="Screenshot icon"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100%',
                  height: 'auto',
                  opacity: 0.8,
                  zIndex: 1,
                }}
              />
            </>
          ) : (
            <img
              src={screenshotUrl}
              alt={description}
              onLoad={() => {
                setImageLoaded(true);
              }}
              onError={() => {
                setImageError(true);
                setImageLoaded(true);
                // Close modal if it was opened during load
                if (modalOpen) {
                  updateURL(null);
                }
              }}
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
          )}
        </Box>
        <Box sx={{ p: 1 }}>
          <Typography variant='body2' sx={{ fontWeight: 500, color: '#E0E0E0' }}>
            {filename}
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            {author ? (
              <>
                by{' '}
                <Link
                  href={`/player/${author}`}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    color: '#4A90E2',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  {author}
                </Link>
              </>
            ) : (
              description
            )}
          </Typography>
        </Box>
      </Paper>
      {!imageError && (
        <ScreenshotModal
          open={modalOpen}
          onClose={() => {
            updateURL(null);
          }}
          screenshotUrl={screenshotUrl}
          filename={filename}
          description={description}
          author={author}
        />
      )}
    </>
  );
};

