import { Box, Typography } from "@mui/material";
import type { FileshareFile } from "@/src/api/halo3/fileshareFilesSchema";
import { Halo3FileshareFileCard } from "@/src/components/files/Halo3FileshareFileCard";
import { OdstFileshareFileCard } from "@/src/components/files/OdstFileshareFileCard";
import { ReachFileshareFileCard } from "@/src/components/files/ReachFileshareFileCard";
import type { FilesGame } from "@/src/components/files/filesPageTypes";

interface FileshareRelatedFilesProps {
  game: FilesGame;
  files: FileshareFile[];
}

export function FileshareRelatedFiles({ game, files }: FileshareRelatedFilesProps) {
  if (files.length === 0) {
    return null;
  }

  const renderFileCard = (file: FileshareFile) => {
    switch (game) {
      case "odst":
        return <OdstFileshareFileCard key={file.id} file={file} />;
      case "reach":
        return <ReachFileshareFileCard key={file.id} file={file} />;
      default:
        return <Halo3FileshareFileCard key={file.id} file={file} />;
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Related Files
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 2,
        }}
      >
        {files.map((file) => renderFileCard(file))}
      </Box>
    </Box>
  );
}
