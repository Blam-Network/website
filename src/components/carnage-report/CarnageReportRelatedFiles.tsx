import { Box, Typography } from "@mui/material";
import { ScreenshotCard } from "@/src/components/ScreenshotCard";
import { Halo3FileshareFileCard } from "@/src/components/files/Halo3FileshareFileCard";
import type { FileshareFile } from "@/src/api/halo3/fileshareFilesSchema";

type RelatedScreenshot = {
  id: string;
  header: {
    filename: string;
    description: string;
  };
  author: string;
  date: Date;
};

interface CarnageReportRelatedFilesProps {
  relatedFiles: {
    fileshare: FileshareFile[];
    screenshots: RelatedScreenshot[];
  };
}

export function CarnageReportRelatedFiles({ relatedFiles }: CarnageReportRelatedFilesProps) {
  if (relatedFiles.fileshare.length === 0 && relatedFiles.screenshots.length === 0) {
    return null;
  }

  return (
    <Box>
      {relatedFiles.fileshare.length > 0 ? (
        <Box sx={{ mb: relatedFiles.screenshots.length > 0 ? 3 : 0 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 600 }}>
            File Share
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(3, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            {relatedFiles.fileshare.map((file) => (
              <Halo3FileshareFileCard key={file.id} file={file} />
            ))}
          </Box>
        </Box>
      ) : null}

      {relatedFiles.screenshots.length > 0 ? (
        <Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 600 }}>
            Screenshots
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                sm: "repeat(3, minmax(0, 1fr))",
                md: "repeat(4, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            {relatedFiles.screenshots.map((screenshot) => (
              <ScreenshotCard
                key={screenshot.id}
                screenshotId={screenshot.id}
                screenshotUrl={`/api/screenshot/${screenshot.id}`}
                filename={screenshot.header.filename}
                description={screenshot.header.description}
                author={screenshot.author}
                date={screenshot.date}
              />
            ))}
          </Box>
        </Box>
      ) : null}
    </Box>
  );
}
