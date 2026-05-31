import type { CSSProperties } from "react";
import { getFileshareMaskUrl } from "@/src/constants/fileshareIcons";

export const layerImageStyle: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "contain",
};

/** Map thumbnails: scale to frame height, center horizontally. */
export const mapLayerImageStyle: CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: "100%",
  width: "auto",
  objectFit: "contain",
};

export function maskStyles(kind: Parameters<typeof getFileshareMaskUrl>[0]) {
  const maskUrl = getFileshareMaskUrl(kind);
  return {
    WebkitMaskImage: `url(${maskUrl})`,
    maskImage: `url(${maskUrl})`,
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskMode: "luminance",
    maskMode: "luminance",
  } as const;
}

export function getIconSizeProps(size: number | string | undefined) {
  const aspectRatio = 16 / 9;
  if (size === undefined) {
    return { maxWidthValue: undefined, maxHeightValue: undefined };
  }
  if (typeof size === "number") {
    return {
      maxWidthValue: `${size}px`,
      maxHeightValue: `${size / aspectRatio}px`,
    };
  }
  return { maxWidthValue: size, maxHeightValue: undefined };
}
