"use client";

import { Box } from "@mui/material";
import { getWeaponIconPath } from "@/src/constants/weaponIcons";

type WeaponIconProps = {
  weapon: string;
  size?: number;
  highlighted?: boolean;
  variant?: "inline" | "backdrop";
  backdropAlign?: "left" | "center";
};

export function WeaponIcon({
  weapon,
  size = 32,
  highlighted = false,
  variant = "inline",
  backdropAlign = "left",
}: WeaponIconProps) {
  const src = getWeaponIconPath(weapon);
  if (!src) {
    return null;
  }

  const colorFilter = highlighted
    ? "brightness(0) saturate(100%) invert(72%) sepia(28%) saturate(622%) hue-rotate(46deg) brightness(95%) contrast(89%)"
    : "brightness(0) invert(0.78)";

  if (variant === "backdrop") {
    const centered = backdropAlign === "center";
    return (
      <Box
        component="img"
        src={src}
        alt=""
        draggable={false}
        aria-hidden
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          height: "100%",
          width: "auto",
          maxWidth: centered ? "95%" : "80%",
          objectFit: "contain",
          objectPosition: centered ? "center" : "left center",
          ...(centered ? { left: "50%", transform: "translateX(-50%)" } : { left: 0 }),
          filter: colorFilter,
          opacity: highlighted ? 0.28 : 0.18,
          zIndex: 0,
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
    );
  }

  return (
    <Box
      component="img"
      src={src}
      alt=""
      draggable={false}
      sx={{
        width: size,
        height: size,
        objectFit: "contain",
        flexShrink: 0,
        filter: colorFilter,
        opacity: highlighted ? 1 : 0.85,
        transition: "filter 0.2s ease, opacity 0.2s ease",
      }}
    />
  );
}
