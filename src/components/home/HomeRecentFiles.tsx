import { Box } from "@mui/material";
import type { HomeRecentFile } from "@/src/api/home/recentFilesAcrossGames";
import { Halo3FileshareFileCard } from "@/src/components/files/Halo3FileshareFileCard";
import { OdstFileshareFileCard } from "@/src/components/files/OdstFileshareFileCard";
import { ReachFileshareFileCard } from "@/src/components/files/ReachFileshareFileCard";

interface HomeRecentFilesProps {
  files: HomeRecentFile[];
}

export function HomeRecentFiles({ files }: HomeRecentFilesProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(1, minmax(0, 1fr))",
          sm: "repeat(2, minmax(0, 1fr))",
          md: "repeat(4, minmax(0, 1fr))",
        },
        gap: 2,
        width: "100%",
      }}
    >
      {files.map((entry) => {
        switch (entry.game) {
          case "odst":
            return <OdstFileshareFileCard key={`odst-${entry.file.id}`} file={entry.file} />;
          case "reach":
            return <ReachFileshareFileCard key={`reach-${entry.file.id}`} file={entry.file} />;
          default:
            return <Halo3FileshareFileCard key={`halo3-${entry.file.id}`} file={entry.file} />;
        }
      })}
    </Box>
  );
}
