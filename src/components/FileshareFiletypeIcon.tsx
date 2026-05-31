"use client";

import { ReachFileshareIcon } from "@/src/components/reach/ReachFileshareIcon";
import { Halo3FileshareIcon } from "@/src/components/fileshare/Halo3FileshareIcon";

interface FileshareFiletypeIconProps {
  filetype: number;
  gameEngineType?: number;
  iconIndex?: number | null;
  size?: number | string;
  shareId?: string;
  slot?: number;
  fileId?: string;
  mapId?: number;
  /** Reach fileshare uses different `filetype` values than Halo 3 (see HaloReachController). */
  fileShareGame?: "halo3" | "ares" | "odst" | "reach";
}

export const FileshareFiletypeIcon = (props: FileshareFiletypeIconProps) => {
  if (props.fileShareGame === "reach") {
    return (
      <ReachFileshareIcon
        filetype={props.filetype}
        iconIndex={props.iconIndex}
        size={props.size}
        shareId={props.shareId}
        fileId={props.fileId}
        mapId={props.mapId}
      />
    );
  }

  return (
    <Halo3FileshareIcon
      filetype={props.filetype}
      gameEngineType={props.gameEngineType}
      size={props.size}
      shareId={props.shareId}
      slot={props.slot}
      mapId={props.mapId}
      fileShareGame={props.fileShareGame ?? "halo3"}
    />
  );
};
