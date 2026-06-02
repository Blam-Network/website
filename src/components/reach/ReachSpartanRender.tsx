"use client";

import { useEffect, useState } from "react";
import { Box } from "@mui/material";

export const REACH_SPARTAN_RENDER_FALLBACK =
  "/img/service_record/reach/player_model_invalid.png";

interface ReachSpartanRenderProps {
  src: string;
  alt: string;
}

export function ReachSpartanRender({ src, alt }: ReachSpartanRenderProps) {
  const [displaySrc, setDisplaySrc] = useState(src);

  useEffect(() => {
    setDisplaySrc(src);
  }, [src]);

  return (
    <Box
      component="img"
      src={displaySrc}
      alt={alt}
      onError={() => {
        setDisplaySrc((current) =>
          current === REACH_SPARTAN_RENDER_FALLBACK ? current : REACH_SPARTAN_RENDER_FALLBACK,
        );
      }}
      sx={{
        width: { xs: "100%", md: 320 },
        maxWidth: 420,
        height: "auto",
        display: "block",
        filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.4))",
      }}
    />
  );
}
