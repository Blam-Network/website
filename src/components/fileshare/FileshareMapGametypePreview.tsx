import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import {
  getHalo3MapImageUrl,
  getReachGametypeIconUrl,
  getReachGametypeLayerStyle,
  halo3GameEngineToReachIconIndex,
} from "@/src/constants/fileshareIcons";
import { mapLayerImageStyle } from "@/src/components/fileshare/fileshareIconStyles";

interface FileshareMapGametypePreviewProps {
  mapId: number;
  gameEngineType?: number;
  sx?: SxProps<Theme>;
}

/** Map + gametype layers used inside fileshare icons, without mask or frame overlay. */
export function FileshareMapGametypePreview({
  mapId,
  gameEngineType,
  sx,
}: FileshareMapGametypePreviewProps) {
  const mapImageUrl = getHalo3MapImageUrl(mapId);
  const reachIconIndex =
    gameEngineType != null ? halo3GameEngineToReachIconIndex(gameEngineType) : null;
  const gametypeImageUrl =
    reachIconIndex != null ? getReachGametypeIconUrl(reachIconIndex) : null;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        overflow: "hidden",
        backgroundColor: "rgba(0, 0, 0, 0.35)",
        ...sx,
      }}
    >
      <Box sx={{ position: "absolute", inset: 0 }}>
        <Box component="img" src={mapImageUrl} alt="" sx={mapLayerImageStyle} />
        {gametypeImageUrl ? (
          <Box
            component="img"
            src={gametypeImageUrl}
            alt=""
            sx={getReachGametypeLayerStyle()}
          />
        ) : null}
      </Box>
    </Box>
  );
}
