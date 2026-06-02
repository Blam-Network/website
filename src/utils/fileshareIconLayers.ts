import { env } from "@/src/env";
import type { FilesGame } from "@/src/components/files/filesPageTypes";
import {
  getFileshareMaskUrl,
  getFileshareOverlayUrl,
  getHalo3FileshareFrameKind,
  getHalo3MapImageUrl,
  getReachFileshareFrameKind,
  getReachGametypeIconUrl,
  getReachMapImageUrl,
  halo3FiletypeShowsGametypeImage,
  halo3FiletypeShowsMapImage,
  halo3FiletypeToReachIconIndex,
  halo3GameEngineToReachIconIndex,
  reachFiletypeShowsGametypeImage,
  reachFiletypeShowsMapImage,
  type FileshareFrameKind,
} from "@/src/constants/fileshareIcons";

export type FileshareIconLayerInput = {
  game: FilesGame;
  filetype: number;
  gameEngineType?: number;
  iconIndex?: number | null;
  mapId?: number;
  shareId: string;
  slotNumber: number;
  fileId: string;
};

export type FileshareIconContentLayer =
  | {
      kind: "screenshot";
      url: string;
      remote: true;
    }
  | {
      kind: "map";
      path: string;
      remote: false;
    }
  | {
      kind: "gametype";
      path: string;
      remote: false;
    };

export type ResolvedFileshareIconLayers = {
  frameKind: FileshareFrameKind;
  maskPath: string;
  overlayPath: string;
  content: FileshareIconContentLayer | null;
};

function getHalo3ScreenshotUrl(
  fileShareGame: "halo3" | "odst" | "ares",
  hexShareId: string,
  slot: number,
): string {
  const apiPath =
    fileShareGame === "odst" ? "halo3odst" : fileShareGame === "ares" ? "ares" : "halo3";
  return `${env.NEXT_PUBLIC_HALO3_API_BASE_URL}/${apiPath}/fileshare/${hexShareId}/${slot}/view`;
}

export function resolveFileshareIconLayers(input: FileshareIconLayerInput): ResolvedFileshareIconLayers {
  const hexShareId = BigInt(input.shareId).toString(16).toUpperCase().padStart(16, "0");

  if (input.game === "reach") {
    const frameKind = getReachFileshareFrameKind(input.filetype);
    let content: FileshareIconContentLayer | null = null;

    if (input.filetype === 2) {
      content = {
        kind: "screenshot",
        url: `${env.NEXT_PUBLIC_HALO_REACH_API_BASE_URL}/haloreach/fileshare/${hexShareId}/${input.fileId}/view`,
        remote: true,
      };
    } else if (input.mapId && reachFiletypeShowsMapImage(input.filetype)) {
      content = { kind: "map", path: getReachMapImageUrl(input.mapId), remote: false };
    } else if (
      input.iconIndex != null &&
      reachFiletypeShowsGametypeImage(input.filetype)
    ) {
      content = {
        kind: "gametype",
        path: getReachGametypeIconUrl(input.iconIndex),
        remote: false,
      };
    }

    return {
      frameKind,
      maskPath: getFileshareMaskUrl(frameKind),
      overlayPath: getFileshareOverlayUrl(frameKind),
      content,
    };
  }

  const frameKind = getHalo3FileshareFrameKind(input.filetype);
  const fileShareGame = input.game === "odst" ? "odst" : "halo3";
  let content: FileshareIconContentLayer | null = null;

  if (input.filetype === 13) {
    content = {
      kind: "screenshot",
      url: getHalo3ScreenshotUrl(fileShareGame, hexShareId, input.slotNumber),
      remote: true,
    };
  } else if (input.mapId && halo3FiletypeShowsMapImage(input.filetype)) {
    content = { kind: "map", path: getHalo3MapImageUrl(input.mapId), remote: false };
  } else if (halo3FiletypeShowsGametypeImage(input.filetype)) {
    const reachIconIndex =
      input.gameEngineType != null
        ? halo3GameEngineToReachIconIndex(input.gameEngineType)
        : halo3FiletypeToReachIconIndex(input.filetype);
    if (reachIconIndex != null) {
      content = {
        kind: "gametype",
        path: getReachGametypeIconUrl(reachIconIndex),
        remote: false,
      };
    }
  }

  return {
    frameKind,
    maskPath: getFileshareMaskUrl(frameKind),
    overlayPath: getFileshareOverlayUrl(frameKind),
    content,
  };
}
