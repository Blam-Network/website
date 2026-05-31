import { Box, Typography } from "@mui/material";
import type { FileshareFile } from "@/src/api/halo3/fileshareFilesSchema";
import { Halo3FileshareFileCard } from "@/src/components/files/Halo3FileshareFileCard";
import { OdstFileshareFileCard } from "@/src/components/files/OdstFileshareFileCard";
import { ReachFileshareFileCard } from "@/src/components/files/ReachFileshareFileCard";
import type { FilesGame } from "@/src/components/files/filesPageTypes";

interface FileshareRelatedFilesProps {
  game: FilesGame;
  files: FileshareFile[];
  filesReturnTo?: string;
}

export function FileshareRelatedFiles({ game, files, filesReturnTo }: FileshareRelatedFilesProps) {
  if (files.length === 0) {
    return null;
  }

  const renderFileCard = (file: FileshareFile) => {
    const linkOptions = filesReturnTo ? { returnTo: filesReturnTo } : undefined;
    switch (game) {
      case "odst":
        return <OdstFileshareFileCard key={file.id} file={file} linkOptions={linkOptions} />;
      case "reach":
        return <ReachFileshareFileCard key={file.id} file={file} linkOptions={linkOptions} />;
      default:
        return <Halo3FileshareFileCard key={file.id} file={file} linkOptions={linkOptions} />;
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        Related Files
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
        Related files are other files created from the same match.
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
