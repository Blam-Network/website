import { Box, Container } from "@mui/material";
import { api } from "@/src/trpc/server";
import { ScreenshotCard } from "@/src/components/ScreenshotCard";
import { Nightmap } from "@/src/components/Nightmap";
import { RecentGamesTable } from "@/src/components/RecentGamesTable";
import { SectionHeader } from "@/src/components/SectionHeader";
import { HomeRecentFiles } from "@/src/components/home/HomeRecentFiles";
import { getScreenshotViewUrl } from "@/src/components/home/getScreenshotViewUrl";
import { buildPageMetadata } from "@/src/utils/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "Blam Network",
  description:
    "Halo 3, ODST, and Reach service records, carnage reports, file share, screenshots, and more on Blam Network.",
  path: "/",
});

export default async function Home() {
  const [recentGames, recentScreenshots, recentFiles] = await Promise.all([
    api.sunrise2.recentGames.query(),
    api.home.recentScreenshotsAcrossGames.query(),
    api.home.recentFilesAcrossGames.query(),
  ]);

  return (
    <>
      <Nightmap />
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 4, md: 5 },
            width: "100%",
          }}
        >
          <Box>
            <SectionHeader title="Recent Games" href="/halo3/games" />
            <RecentGamesTable games={recentGames} />
          </Box>
          <Box>
            <SectionHeader title="Recent Screenshots" href="/screenshots" />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 2,
              }}
            >
              {recentScreenshots.map((screenshot) => (
                <ScreenshotCard
                  key={`${screenshot.game}-${screenshot.id}`}
                  screenshotId={screenshot.id}
                  screenshotUrl={getScreenshotViewUrl(screenshot.game, screenshot.id)}
                  filename={screenshot.header.filename}
                  description={screenshot.header.description ?? ""}
                  author={screenshot.author ?? undefined}
                  date={screenshot.date}
                  profileGame={screenshot.game}
                />
              ))}
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: { xs: 4, md: 5 } }}>
          <SectionHeader title="Recent Files" href="/files" />
          <HomeRecentFiles files={recentFiles} />
        </Box>
      </Container>
    </>
  );
}
