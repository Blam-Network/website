import type { Metadata } from "next";
import { getHalo3MapImageUrl } from "@/src/constants/fileshareIcons";
import { getSiteUrl } from "@/src/utils/siteUrl";

export const SITE_NAME = "Blam Network";
export const DEFAULT_DESCRIPTION =
  "Unofficial Halo Web Services — service records, carnage reports, file share, screenshots, and more for Halo 3, ODST, and Reach.";

export type OgImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

export type BuildPageMetadataInput = {
  /** Page title without site suffix (suffix is added automatically). */
  title: string;
  description: string;
  /** Site path, e.g. `/halo3/player/foo` */
  path?: string;
  images?: OgImage[];
  type?: "website" | "article" | "profile";
  twitterCard?: "summary" | "summary_large_image";
};

export function getMetadataBase(): URL {
  return new URL(getSiteUrl());
}

/** Resolve a site path or leave external URLs unchanged. */
export function resolveOgImageUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return new URL(url.startsWith("/") ? url : `/${url}`, getMetadataBase()).toString();
}

function normalizeImages(images: OgImage[] | undefined) {
  if (!images?.length) return undefined;
  return images.map((image) => ({
    url: resolveOgImageUrl(image.url),
    width: image.width,
    height: image.height,
    alt: image.alt,
  }));
}

function pickTwitterCard(
  images: ReturnType<typeof normalizeImages>,
  explicit?: BuildPageMetadataInput["twitterCard"],
): "summary" | "summary_large_image" {
  if (explicit) return explicit;
  const first = images?.[0];
  if (!first) return "summary";
  const w = first.width ?? 0;
  const h = first.height ?? 0;
  if (w >= 600 || h >= 600 || (w >= 400 && h >= 200)) {
    return "summary_large_image";
  }
  return "summary";
}

/** Strip a trailing site suffix so layout `title.template` does not duplicate it. */
export function stripSiteNameFromTitle(title: string): string {
  const stripped = title.replace(/\s*[-·]\s*Blam Network\s*$/i, "").trim();
  return stripped || title;
}

export function buildPageMetadata(input: BuildPageMetadataInput): Metadata {
  const images = normalizeImages(input.images);
  const pageTitle = stripSiteNameFromTitle(input.title);
  const title =
    pageTitle === SITE_NAME
      ? { absolute: SITE_NAME }
      : pageTitle;
  const twitterCard = pickTwitterCard(images, input.twitterCard);
  const canonicalUrl = input.path
    ? new URL(input.path.startsWith("/") ? input.path : `/${input.path}`, getMetadataBase()).toString()
    : undefined;

  return {
    title,
    description: input.description,
    ...(canonicalUrl && {
      alternates: { canonical: canonicalUrl },
    }),
    openGraph: {
      title: pageTitle,
      description: input.description,
      siteName: SITE_NAME,
      type: input.type ?? "website",
      ...(canonicalUrl && { url: canonicalUrl }),
      ...(images?.length && { images }),
    },
    twitter: {
      card: twitterCard,
      title: pageTitle,
      description: input.description,
      ...(images?.length && { images: images.map((image) => image.url) }),
    },
  };
}

export function buildMapOgImage(mapId: number, alt: string): OgImage {
  return {
    url: getHalo3MapImageUrl(mapId),
    width: 512,
    height: 512,
    alt,
  };
}

export const rootLayoutMetadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
  },
};
