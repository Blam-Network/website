import { Box, Container } from "@mui/material";
import { api } from "@/src/trpc/server";
import { ScreenshotCard } from "@/src/components/ScreenshotCard";
import { Nightmap } from "@/src/components/Nightmap";
import { RecentGamesTable, type RecentGamesTableRow } from "@/src/components/RecentGamesTable";
import { reachGameTitle } from "@/src/components/reach/games/ReachGamesTable";
import { getReachGameModeLabel } from "@/src/constants/reach/reachGameData";
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

const RECENT_GAMES_COUNT = 22;

export default async function Home() {
  const [gamesResult, reachGamesResult, screenshotsResult, filesResult] = await Promise.allSettled([
    api.sunrise2.recentGames.query(),
    api.reach.games.query({ page: 1, pageSize: RECENT_GAMES_COUNT }),
    api.home.recentScreenshotsAcrossGames.query(),
    api.home.recentFilesAcrossGames.query(),
  ]);

  const halo3Games: RecentGamesTableRow[] =
    gamesResult.status === "fulfilled" ? gamesResult.value.map((game) => ({ ...game, game: "halo3" as const })) : [];
  const reachGames: RecentGamesTableRow[] =
    reachGamesResult.status === "fulfilled"
      ? reachGamesResult.value.data.map((game) => ({
          id: game.id,
          map_id: game.map_id,
          start_time: game.start_time,
          finish_time: game.finish_time,
          game: "reach" as const,
          href: `/haloreach/carnage-report/${game.id}`,
          title: reachGameTitle(game),
          type_label: getReachGameModeLabel(game.gui_game_mode, game.game_engine),
        }))
      : [];
  const recentGames = [...halo3Games, ...reachGames]
    .sort((a, b) => new Date(b.finish_time).getTime() - new Date(a.finish_time).getTime())
    .slice(0, RECENT_GAMES_COUNT);
  const recentScreenshots =
    screenshotsResult.status === "fulfilled" ? screenshotsResult.value : [];
  const recentFiles = filesResult.status === "fulfilled" ? filesResult.value : [];

  if (gamesResult.status === "rejected") {
    console.error("[home] recentGames failed:", gamesResult.reason);
  }
  if (reachGamesResult.status === "rejected") {
    console.error("[home] reach games failed:", reachGamesResult.reason);
  }
  if (screenshotsResult.status === "rejected") {
    console.error("[home] recentScreenshots failed:", screenshotsResult.reason);
  }
  if (filesResult.status === "rejected") {
    console.error("[home] recentFiles failed:", filesResult.reason);
  }

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
            <SectionHeader title="Recent Games" href="/games" />
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
