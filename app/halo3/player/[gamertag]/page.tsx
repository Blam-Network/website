import { getServerSession } from "next-auth";
import { api } from "@/src/trpc/server";
import { ServiceRecordComponent } from "@/src/components/ServiceRecord";
import { ServiceRecordBannerGameSelector } from "@/src/components/ServiceRecordBannerGameSelector";
import { Stack, Box, Typography, Paper, Container } from "@mui/material";
import { Screenshots } from "@/src/api/halo3/screenshots";
import { authOptions } from "@/src/api/auth";
import { RoadToRecon } from "@/src/components/RoadToRecon";
import { ScreenshotCard } from "@/src/components/ScreenshotCard";
import { getColor, getColorName, getCssColor } from "@/src/colors";
import { RecentGamesTable } from "@/src/components/RecentGamesTable";
import { SectionHeader } from "@/src/components/SectionHeader";
import { env } from "@/src/env";
import type { Metadata } from "next";
import { PlayerStatistics } from "@/src/components/PlayerStatistics";
import { generateHalo3PlayerMetadata } from "@/src/utils/playerPageMetadata";
import { FileshareQuotaMeters } from "@/src/components/player/FileshareQuotaMeters";
import { PlayerFileshareSlot } from "@/src/components/player/PlayerFileshareSlot";
import { PlayerPageSectionsGrid } from "@/src/components/player/PlayerPageSection";
import { PlayerServiceRecordMissingIntel } from "@/src/components/player/PlayerServiceRecordMissingIntel";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { gamertag: string };
  searchParams: { viewScreenshot?: string };
}): Promise<Metadata> {
  const gamertag = decodeURIComponent(params.gamertag);
  return generateHalo3PlayerMetadata(
    {
      gamertag,
      playerPath: "/halo3/player",
      gameLabel: "Halo 3",
      emblemApiSegment: "halo3",
      api: {
        serviceRecord: (input) => api.sunrise.serviceRecord.query(input),
        screenshot: (input) => api.sunrise.screenshot.query(input),
      },
    },
    searchParams,
  );
}

export default async function Home({params}: {params: { gamertag: string }}) {
  const session = await getServerSession(authOptions);
  const loggedIn = !!session?.user;

  const gamertag = decodeURIComponent(params.gamertag);
  let serviceRecord: any | undefined = undefined;
  let fileShare: any | undefined = undefined;
  let screenshots: Screenshots = [];
  const previousGamesResponse = await api.sunrise2.playerPreviousGames.query({ gamertag, page: 1, pageSize: 45 });
  const previousGames = previousGamesResponse.data;
  try {
    serviceRecord = await api.sunrise.serviceRecord.query({ gamertag });
  } catch {}
  try {
    fileShare = await api.sunrise.fileShare.query({ gamertag });
  } catch {}
  try {
    screenshots = await api.sunrise.playerScreenshots.query({ gamertag, pageSize: 12 });
  } catch {}
  const hasPlayed = previousGames.length > 0 || !!serviceRecord?.playerName;

  const armorColor = serviceRecord ? getCssColor(serviceRecord.primaryColor) : "#7CB342";
  const darkPrimaryColor = serviceRecord ? (() => {
    const color = getColor(getColorName(serviceRecord.primaryColor));
    const r = Math.round(color.r * 0.12);
    const g = Math.round(color.g * 0.12);
    const b = Math.round(color.b * 0.12);
    return `rgb(${r},${g},${b})`;
  })() : null;

  const slotCount = fileShare
    ? Math.max(fileShare.quotaSlots || 0, fileShare.slots.length || 0)
    : 0;

  return (
    <>
      {serviceRecord && darkPrimaryColor && (
        <Box 
          sx={{ 
            width: "100%",
            backgroundColor: darkPrimaryColor,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: { xs: 1, md: 1.5 },
            pb: { xs: 1, md: 1.5 },
            borderBottom: "2px solid",
            borderColor: armorColor,
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='174' viewBox='0 0 200 174' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5' stroke-opacity='0.1'%3E%3Cpath d='M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z'/%3E%3Cpath d='M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z' transform='translate(100, 0)'/%3E%3Cpath d='M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z' transform='translate(50, 87)'/%3E%3Cpath d='M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z' transform='translate(150, 87)'/%3E%3Cpath d='M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z' transform='translate(-50, 87)'/%3E%3Cpath d='M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z' transform='translate(0, 174)'/%3E%3Cpath d='M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z' transform='translate(100, 174)'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "200px 174px",
              backgroundRepeat: "repeat",
              pointerEvents: "none",
            },
          }}
        >
          <Container maxWidth="lg" sx={{ width: "100%", position: "relative", zIndex: 1 }}>
            <ServiceRecordComponent serviceRecord={serviceRecord} />
          </Container>
          <ServiceRecordBannerGameSelector
            gamertag={gamertag}
            currentGame="halo3"
            primaryColor={armorColor}
          />
        </Box>
      )}

      {!serviceRecord && (
        <PlayerServiceRecordMissingIntel gamertag={gamertag} game="halo3" />
      )}

      {serviceRecord && (
        <Container maxWidth="lg" sx={{ pt: 2 }}>
          <RoadToRecon profileGamertag={gamertag} />
        </Container>
      )}

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        {!serviceRecord && (
          <Box sx={{ mb: 3 }}>
            <RoadToRecon profileGamertag={gamertag} />
          </Box>
        )}
      
        {hasPlayed && (
          <PlayerPageSectionsGrid>
            <Box sx={{ minHeight: { lg: 480 }, display: "flex", flexDirection: "column" }}>
              <SectionHeader
                title="Recent Games"
                href={`/halo3/games?gamertag=${encodeURIComponent(gamertag)}`}
                sx={{ mb: 2 }}
              />
              {previousGames.length > 0 ? (
                <RecentGamesTable games={previousGames} stickyHeader />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No games found.
                </Typography>
              )}
            </Box>

            <Box>
              <SectionHeader title="File Share" sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
                {fileShare && <FileshareQuotaMeters fileShare={fileShare} />}
              </SectionHeader>
              {fileShare ? (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "repeat(2, minmax(0, 1fr))",
                      sm: "repeat(3, minmax(0, 1fr))",
                    },
                    gap: 1.5,
                    width: "100%",
                  }}
                >
                  {Array.from({ length: slotCount }, (_, i) => i).map((slotIndex) => {
                    const slot = fileShare.slots.find((s: { slotNumber: number }) => s.slotNumber === slotIndex);
                    return (
                      <PlayerFileshareSlot
                        key={slot?.id ?? `empty-${slotIndex}`}
                        slot={slot}
                        slotNumber={slotIndex + 1}
                        shareId={fileShare.id}
                        loggedIn={loggedIn}
                      />
                    );
                  })}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No file share data available.
                </Typography>
              )}
            </Box>
          </PlayerPageSectionsGrid>
        )}

        {hasPlayed && (
          <Box sx={{ mt: 4 }}>
            <SectionHeader
              title="Recent Screenshots"
              href={screenshots.length > 0 ? `/screenshots?gamertag=${encodeURIComponent(gamertag)}` : undefined}
              sx={{ mb: 2 }}
            />
            {screenshots.length > 0 ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(1, minmax(0, 1fr))",
                    sm: "repeat(2, minmax(0, 1fr))",
                    md: "repeat(3, minmax(0, 1fr))",
                    lg: "repeat(4, minmax(0, 1fr))",
                  },
                  gap: 2,
                  width: "100%",
                }}
              >
                {screenshots.map((screenshot: Screenshots[number]) => (
                  <ScreenshotCard
                    key={screenshot.id}
                    screenshotId={screenshot.id}
                    screenshotUrl={`${env.HALO3_API_BASE_URL}/halo3/screenshots/${screenshot.id}/view`}
                    filename={screenshot.header.filename}
                    description={screenshot.header.description || ""}
                    author={screenshot.author || undefined}
                    date={screenshot.date}
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary">
                {gamertag} hasn&apos;t uploaded any screenshots yet.
              </Typography>
            )}
          </Box>
        )}

        {hasPlayed && (
          <Box sx={{ mt: 4 }}>
            <PlayerStatistics gamertag={gamertag} />
          </Box>
        )}
      </Container>
    </>
  );
}
