import type { Metadata } from "next";
import { env } from "@/src/env";
import { buildPageMetadata, type OgImage } from "@/src/utils/metadata";

type ServiceRecordEmblemFields = {
  playerName: string;
  foregroundEmblem: number;
  emblemFlags: number;
  backgroundEmblem: number;
  emblemPrimaryColor: number;
  emblemSecondaryColor: number;
  emblemBackgroundColor: number;
  primaryColor: number;
};

type ScreenshotFields = {
  id: string;
  header: { filename: string; description?: string | null };
  author?: string | null;
};

export type Halo3PlayerMetadataApi = {
  serviceRecord: (input: { gamertag: string }) => Promise<ServiceRecordEmblemFields | undefined>;
  screenshot: (input: { id: string }) => Promise<ScreenshotFields | undefined>;
};

export async function generateHalo3PlayerMetadata(
  options: {
    gamertag: string;
    playerPath: string;
    gameLabel: string;
    emblemApiSegment: "halo3" | "ares";
    api: Halo3PlayerMetadataApi;
  },
  searchParams?: { viewScreenshot?: string },
): Promise<Metadata> {
  const { gamertag, playerPath, gameLabel, emblemApiSegment, api: playerApi } = options;
  const encodedTag = encodeURIComponent(gamertag);

  if (searchParams?.viewScreenshot) {
    let screenshot: ScreenshotFields | undefined;
    try {
      screenshot = await playerApi.screenshot({ id: searchParams.viewScreenshot });
    } catch {
      screenshot = undefined;
    }

    if (screenshot) {
      const title = screenshot.header.filename || "Screenshot";
      const description =
        screenshot.header.description?.trim() ||
        `${gameLabel} screenshot${screenshot.author ? ` by ${screenshot.author}` : ""}`;
      const imageUrl = `${env.NEXT_PUBLIC_HALO3_API_BASE_URL}/${emblemApiSegment}/screenshots/${screenshot.id}/view`;

      return buildPageMetadata({
        title,
        description,
        path: `${playerPath}/${encodedTag}?viewScreenshot=${screenshot.id}`,
        images: [{ url: imageUrl, width: 1280, height: 720, alt: title }],
        twitterCard: "summary_large_image",
      });
    }
  }

  let serviceRecord: ServiceRecordEmblemFields | undefined;
  try {
    serviceRecord = await playerApi.serviceRecord({ gamertag });
  } catch {
    serviceRecord = undefined;
  }

  const displayName = serviceRecord?.playerName ?? gamertag;
  const title = displayName;
  const description = serviceRecord
    ? `${displayName}'s ${gameLabel} service record, file share, screenshots, and match history on Blam Network.`
    : `${gamertag}'s ${gameLabel} profile on Blam Network.`;

  const emblemParams = serviceRecord
    ? `primary=${serviceRecord.foregroundEmblem}&secondary=${serviceRecord.emblemFlags === 0 ? "true" : "false"}&background=${serviceRecord.backgroundEmblem}&primary_color=${serviceRecord.emblemPrimaryColor}&secondary_color=${serviceRecord.emblemSecondaryColor}&background_color=${serviceRecord.emblemBackgroundColor}&armour_primary_color=${serviceRecord.primaryColor}&size=400`
    : "primary=0&secondary=false&background=0&primary_color=0&secondary_color=0&background_color=0&size=400";

  const emblemUrl = `${env.NEXT_PUBLIC_HALO3_API_BASE_URL}/${emblemApiSegment}/emblem?${emblemParams}`;
  const images: OgImage[] = [
    {
      url: emblemUrl,
      width: 400,
      height: 400,
      alt: `${displayName}'s emblem`,
    },
  ];

  return buildPageMetadata({
    title,
    description,
    path: `${playerPath}/${encodedTag}`,
    images,
    type: "profile",
    twitterCard: "summary",
  });
}

export async function generateReachPlayerMetadata(
  gamertag: string,
  searchParams?: { viewScreenshot?: string },
): Promise<Metadata> {
  const { api } = await import("@/src/trpc/server");
  const encodedTag = encodeURIComponent(gamertag);
  const playerPath = `/haloreach/player/${encodedTag}`;

  if (searchParams?.viewScreenshot) {
    try {
      const { reachAxios } = await import("@/src/api/reach/reachAxios");
      const { ReachScreenshotResponseSchema } = await import("@/src/api/reach/screenshotsSchema");
      const response = await reachAxios.get(
        `/haloreach/screenshots/${encodeURIComponent(searchParams.viewScreenshot)}`,
      );
      const parsed = ReachScreenshotResponseSchema.safeParse(response.data);
      const screenshot = parsed.success ? parsed.data : undefined;
      if (screenshot) {
        const title = screenshot.header.filename || "Screenshot";
        const description =
          screenshot.header.description?.trim() ||
          `Halo Reach screenshot${screenshot.author ? ` by ${screenshot.author}` : ""}`;
        const imageUrl = `${env.NEXT_PUBLIC_HALO_REACH_API_BASE_URL}/haloreach/screenshots/${screenshot.id}/view`;

        return buildPageMetadata({
          title,
          description,
          path: `${playerPath}?viewScreenshot=${screenshot.id}`,
          images: [{ url: imageUrl, width: 1280, height: 720, alt: title }],
          twitterCard: "summary_large_image",
        });
      }
    } catch {
      // fall through to profile metadata
    }
  }

  let serviceRecord: Awaited<ReturnType<typeof api.reach.serviceRecord.query>> | undefined;
  try {
    serviceRecord = await api.reach.serviceRecord.query({ gamertag });
  } catch {
    serviceRecord = undefined;
  }

  const displayName = serviceRecord?.playerName ?? gamertag;
  const description = serviceRecord
    ? `${displayName}'s Halo Reach service record, file share, and profile on Blam Network.`
    : `${gamertag}'s Halo Reach profile on Blam Network.`;

  const spartanUrl = `${env.NEXT_PUBLIC_HALO_REACH_API_BASE_URL}/haloreach/spartan/${encodedTag}.png`;

  return buildPageMetadata({
    title: displayName,
    description,
    path: playerPath,
    images: [{ url: spartanUrl, width: 420, height: 720, alt: `${displayName} Spartan` }],
    type: "profile",
    twitterCard: "summary_large_image",
  });
}
