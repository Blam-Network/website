import type { Metadata } from "next";
import { buildPageMetadata } from "@/src/utils/metadata";

export const screenshotsPageMetadata: Metadata = buildPageMetadata({
  title: "Screenshots",
  description: "Browse Halo 3, ODST, and Reach screenshots uploaded to Blam Network.",
  path: "/screenshots",
});

export const filesPageMetadata: Metadata = buildPageMetadata({
  title: "File Share",
  description: "Browse maps, gametypes, films, and screenshots shared on Blam Network.",
  path: "/files",
});

export const playersPageMetadata: Metadata = buildPageMetadata({
  title: "Players",
  description: "Browse Halo 3 and Halo: Reach player service records on Blam Network.",
  path: "/players",
});

export const halo3GamesPageMetadata: Metadata = buildPageMetadata({
  title: "Recent Games",
  description: "Recent Halo 3 multiplayer matches on Blam Network.",
  path: "/halo3/games",
});

export const reachLobbiesPageMetadata: Metadata = buildPageMetadata({
  title: "Reach Lobbies",
  description: "Live Halo Reach lobby browser on Blam Network.",
  path: "/reach/lobbies",
});
