import { FileshareMapGametypePreview } from "@/src/components/fileshare/FileshareMapGametypePreview";

interface CarnageReportMapImageProps {
  mapId: number;
  gameEngineType?: number;
}

export function CarnageReportMapImage({ mapId, gameEngineType }: CarnageReportMapImageProps) {
  return (
    <FileshareMapGametypePreview
      mapId={mapId}
      gameEngineType={gameEngineType}
      sx={{
        width: { xs: "100%", md: 240 },
        flexShrink: 0,
      }}
    />
  );
}
