"use client";

import { useState, useEffect } from "react";
import { Box, Paper, Container, CircularProgress } from "@mui/material";
import { useNightmap } from "../contexts/NightmapContext";

export const Nightmap = () => {
  const { show24h } = useNightmap();
  const [imagesLoaded, setImagesLoaded] = useState({ current: false, "24h": false });

  // Preload both images on mount - browser will cache them
  useEffect(() => {
    const img6h = new Image();
    const img24h = new Image();

    img6h.onload = () => {
      setImagesLoaded(prev => ({ ...prev, current: true }));
    };
    img24h.onload = () => {
      setImagesLoaded(prev => ({ ...prev, "24h": true }));
    };

    // Start loading both images immediately
    img6h.src = "/api/nightmap";
    img24h.src = "/api/nightmap-24h";
  }, []);

  const bothLoaded = imagesLoaded.current && imagesLoaded["24h"];
  const currentImageLoaded = show24h ? imagesLoaded["24h"] : imagesLoaded.current;

  return (
    <Box 
      sx={{ 
        width: '100%',
        backgroundColor: '#1f2a4a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 0,
        pb: 0,
      }}
    >
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 0 }}>
        <Paper
          elevation={8}
          sx={{
            p: 0,
            background: 'transparent',
            border: 'none',
            boxShadow: 'none',
            display: 'inline-block',
            position: 'relative',
            width: '120%',
            maxWidth: '120%',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '150px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {!bothLoaded && (
              <CircularProgress 
                size={60} 
                sx={{ 
                  color: '#FFFFFF',
                  position: 'absolute',
                  zIndex: 1,
                }} 
              />
            )}
            {/* Render both images but hide/show them - browser keeps them cached */}
            <img 
              src="/api/nightmap"
              alt="Nightmap" 
              style={{ 
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: !show24h && currentImageLoaded ? 'block' : 'none',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            />
            <img 
              src="/api/nightmap-24h"
              alt="Nightmap (24h)" 
              style={{ 
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: show24h && currentImageLoaded ? 'block' : 'none',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

