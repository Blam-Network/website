import { Box, Container, Stack, Typography } from "@mui/material";
import { PGCRBreakdown } from "@/src/components/PGCRBreakdown";
import { MVPSection } from "@/src/components/MVPSection";
import { CarnageReportHeader } from "./CarnageReportHeader";
import { CarnageReportRelatedFiles } from "./CarnageReportRelatedFiles";
import { CarnageReportSection } from "./CarnageReportSection";
import type { RouterOutputs } from "@/src/api/router";
import type { FileshareFile } from "@/src/api/halo3/fileshareFilesSchema";

type CarnageReport =
  | RouterOutputs["sunrise2"]["getCarnageReport"]
  | RouterOutputs["ares"]["getCarnageReport"];

type RelatedFiles = {
  fileshare: FileshareFile[];
  screenshots: Array<{
    id: string;
    header: { filename: string; description: string };
    author: string;
    date: Date;
  }>;
};

interface CarnageReportViewProps {
  game: "halo3" | "ares";
  report: CarnageReport;
  relatedFiles?: RelatedFiles;
}

export function CarnageReportView({ game, report, relatedFiles }: CarnageReportViewProps) {
  const players = [...report.players].sort((a, b) => a.standing - b.standing);
  const winner = players[0];
  const playerRouteBase = game === "ares" ? "/ares/player" : "/halo3/player";

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <CarnageReportHeader game={game} report={report} />

        <MVPSection player={winner} playerRouteBase={playerRouteBase} />

        <CarnageReportSection title="Player Breakdown">
          <PGCRBreakdown report={report} playerRouteBase={playerRouteBase} />
        </CarnageReportSection>

        {relatedFiles &&
        (relatedFiles.fileshare.length > 0 || relatedFiles.screenshots.length > 0) ? (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Related Files
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
              Related files are other files created from the same match, including the map and
              gametype variants used.
            </Typography>
            <CarnageReportRelatedFiles relatedFiles={relatedFiles} />
          </Box>
        ) : null}
      </Stack>
    </Container>
  );
}
