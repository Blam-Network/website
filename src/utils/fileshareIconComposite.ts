import path from "node:path";
import sharp from "sharp";
import type { ResolvedFileshareIconLayers } from "@/src/utils/fileshareIconLayers";

/** OG output for file share embeds (256×256, large image card). */
export const FILESHARE_OG_ICON_WIDTH = 256;
export const FILESHARE_OG_ICON_HEIGHT = 256;

const OUTPUT_SIZE = FILESHARE_OG_ICON_WIDTH;
/** 16:9 icon frame composited inside the square output. */
const FRAME_WIDTH = OUTPUT_SIZE;
const FRAME_HEIGHT = Math.round((FRAME_WIDTH * 9) / 16);

const FRAME_BG = { r: 18, g: 22, b: 30, alpha: 1 } as const;

function publicAssetPath(assetPath: string): string {
  const normalized = assetPath.startsWith("/") ? assetPath.slice(1) : assetPath;
  return path.join(process.cwd(), "public", normalized);
}

async function loadImageBuffer(
  layer: NonNullable<ResolvedFileshareIconLayers["content"]>,
): Promise<Buffer | null> {
  try {
    if (layer.remote) {
      const response = await fetch(layer.url, { signal: AbortSignal.timeout(12_000) });
      if (!response.ok) return null;
      return Buffer.from(await response.arrayBuffer());
    }
    return await sharp(publicAssetPath(layer.path)).toBuffer();
  } catch {
    return null;
  }
}

function transparentFrame(): sharp.Sharp {
  return sharp({
    create: {
      width: FRAME_WIDTH,
      height: FRAME_HEIGHT,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  });
}

/** Matches `mapLayerImageStyle`: height fills the frame, width from aspect ratio, centered (clip if wider). */
async function buildMapContentLayer(source: Buffer): Promise<Buffer | null> {
  const meta = await sharp(source).metadata();
  const srcW = meta.width ?? 1;
  const srcH = meta.height ?? 1;
  if (srcW <= 0 || srcH <= 0) return null;

  const height = FRAME_HEIGHT;
  const width = Math.max(1, Math.round((srcW / srcH) * height));

  const resized = await sharp(source)
    .resize(width, height, { fit: "fill" })
    .png()
    .toBuffer();

  if (width > FRAME_WIDTH) {
    return sharp(resized)
      .extract({
        left: Math.round((width - FRAME_WIDTH) / 2),
        top: 0,
        width: FRAME_WIDTH,
        height: FRAME_HEIGHT,
      })
      .png()
      .toBuffer();
  }

  return transparentFrame()
    .composite([
      {
        input: resized,
        left: Math.round((FRAME_WIDTH - width) / 2),
        top: 0,
      },
    ])
    .png()
    .toBuffer();
}

async function resizeFrameAsset(assetPath: string): Promise<Buffer> {
  return sharp(assetPath)
    .resize(FRAME_WIDTH, FRAME_HEIGHT, { fit: "fill" })
    .png()
    .toBuffer();
}

async function buildContentLayer(
  content: NonNullable<ResolvedFileshareIconLayers["content"]>,
): Promise<Buffer | null> {
  const source = await loadImageBuffer(content);
  if (!source) return null;

  if (content.kind === "map") {
    return buildMapContentLayer(source);
  }

  if (content.kind === "gametype") {
    const iconSize = Math.round(FRAME_WIDTH * 0.35);
    const icon = await sharp(source)
      .resize(iconSize, iconSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    const meta = await sharp(icon).metadata();
    const iconW = meta.width ?? iconSize;
    const iconH = meta.height ?? iconSize;

    return sharp({
      create: {
        width: FRAME_WIDTH,
        height: FRAME_HEIGHT,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([
        {
          input: icon,
          left: Math.round((FRAME_WIDTH - iconW) / 2),
          top: Math.round((FRAME_HEIGHT - iconH) / 2),
        },
      ])
      .png()
      .toBuffer();
  }

  return sharp(source)
    .resize(FRAME_WIDTH, FRAME_HEIGHT, {
      fit: "contain",
      position: "center",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

async function applyMask(content: Buffer, maskPath: string): Promise<Buffer> {
  const mask = await resizeFrameAsset(maskPath);
  return sharp(content)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

async function emptyMaskedFrame(maskPath: string): Promise<Buffer> {
  const base = await sharp({
    create: {
      width: FRAME_WIDTH,
      height: FRAME_HEIGHT,
      channels: 4,
      background: FRAME_BG,
    },
  })
    .png()
    .toBuffer();

  return applyMask(base, maskPath);
}

async function padIconToSquare(icon: Buffer): Promise<Buffer> {
  const top = Math.round((OUTPUT_SIZE - FRAME_HEIGHT) / 2);
  return sharp({
    create: {
      width: OUTPUT_SIZE,
      height: OUTPUT_SIZE,
      channels: 4,
      background: FRAME_BG,
    },
  })
    .composite([{ input: icon, left: 0, top }])
    .png()
    .toBuffer();
}

/** Renders the same layered file icon as the site UI (mask + content + overlay). */
export async function compositeFileshareIconPng(
  layers: ResolvedFileshareIconLayers,
): Promise<Buffer> {
  const maskPath = publicAssetPath(layers.maskPath);
  const overlayPath = publicAssetPath(layers.overlayPath);

  let framed: Buffer;
  if (layers.content) {
    const contentLayer = await buildContentLayer(layers.content);
    framed = contentLayer ? await applyMask(contentLayer, maskPath) : await emptyMaskedFrame(maskPath);
  } else {
    framed = await emptyMaskedFrame(maskPath);
  }

  const overlay = await resizeFrameAsset(overlayPath);

  const withOverlay = await sharp(framed)
    .composite([{ input: overlay }])
    .png()
    .toBuffer();

  return padIconToSquare(withOverlay);
}
