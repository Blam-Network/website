import { Box, Container } from "@mui/material";
import { api } from "@/src/trpc/server";
import { RecentScreenshot } from "@/src/api/halo3/recentScreenshots";
import { ScreenshotCard } from "@/src/components/ScreenshotCard";
import { Nightmap } from "@/src/components/Nightmap";
import { RecentGamesTable } from "@/src/components/RecentGamesTable";
import { SectionHeader } from "@/src/components/SectionHeader";
import { env } from "@/src/env";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blam Network - Halo Web Services",
  description: "View Halo 3 service records, carnage reports, fileshare, screenshots, and more on Blam Network.",
  openGraph: {
    title: "Blam Network - Halo Web Services",
    description: "View Halo 3 service records, carnage reports, fileshare, screenshots, and more on Blam Network.",
    siteName: "Blam Network",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blam Network - Halo Web Services",
    description: "View Halo 3 service records, carnage reports, fileshare, screenshots, and more on Blam Network.",
  },
};

export default async function Home() {
  const recentGames = await api.sunrise2.recentGames.query();
  const recentScreenshots = await api.sunrise2.recentScreenshots.query();

  return (
    <>
      <Nightmap />
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 4, md: 5 }, width: '100%' }}>
          <Box>
            <SectionHeader title="Recent Games" href="/halo3/games" />
            <RecentGamesTable games={recentGames} />
          </Box>
          <Box>
            <SectionHeader title="Recent Screenshots" href="/halo3/screenshots" />
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 2 }}>
              {recentScreenshots.map((screenshot: RecentScreenshot) => (
                <ScreenshotCard
                  key={screenshot.id}
                  screenshotId={screenshot.id}
                  screenshotUrl={`${env.HALO3_API_BASE_URL}/halo3/screenshots/${screenshot.id}/view`}
                  filename={screenshot.header.filename}
                  description={screenshot.header.description}
                  author={screenshot.author}
                  date={screenshot.date}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
}
