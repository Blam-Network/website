import { getServerSession } from "next-auth";
import { api } from "@/src/trpc/server";
import { ServiceRecordComponent } from "@/src/components/ServiceRecord";
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
import { FileshareQuotaMeters } from "@/src/components/player/FileshareQuotaMeters";
import { PlayerFileshareSlot } from "@/src/components/player/PlayerFileshareSlot";
import { PlayerPageSectionsGrid } from "@/src/components/player/PlayerPageSection";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  const vc = process.env.VERCEL_URL;
  if (vc) return `https://${vc}`;
  return process.env.NEXT_PUBLIC_SITE_URL || `http://localhost:${env.PORT}`;
};

export async function generateMetadata({ 
  params,
  searchParams 
}: { 
  params: { gamertag: string };
  searchParams: { viewScreenshot?: string };
}): Promise<Metadata> {
  const gamertag = decodeURIComponent(params.gamertag);
  const baseUrl = getBaseUrl();
  
  if (searchParams?.viewScreenshot) {
    let screenshot: any | undefined = undefined;
    try {
      screenshot = await api.sunrise.screenshot.query({ id: searchParams.viewScreenshot });
    } catch {}

    if (screenshot) {
      const title = screenshot.header.filename || "Screenshot";
      const description = screenshot.header.description || `Halo 3 screenshot${screenshot.author ? ` by ${screenshot.author}` : ""}`;
      const imageUrl = `${env.NEXT_PUBLIC_HALO3_API_BASE_URL}/halo3/screenshots/${screenshot.id}/view`;
      const pageUrl = `${baseUrl}/halo3/player/${encodeURIComponent(gamertag)}?viewScreenshot=${screenshot.id}`;

      return {
        title: `${title} - Blam Network`,
        description,
        openGraph: {
          title,
          description,
          url: pageUrl,
          siteName: "Blam Network",
          images: [
            {
              url: imageUrl,
              width: 1280,
              height: 720,
              alt: title,
            },
          ],
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: [imageUrl],
        },
      };
    }
  }
  
  let serviceRecord: any | undefined = undefined;
  try {
    serviceRecord = await api.sunrise.serviceRecord.query({ gamertag });
  } catch {}

  const title = serviceRecord 
    ? `${serviceRecord.playerName} - Blam Network`
    : `${gamertag} - Blam Network`;
  
  const description = serviceRecord
    ? `View ${serviceRecord.playerName}'s Halo 3 service record, fileshare, screenshots, and game history on Blam Network.`
    : `View ${gamertag}'s Halo 3 profile on Blam Network.`;

  const emblemUrl = serviceRecord
    ? `${env.NEXT_PUBLIC_HALO3_API_BASE_URL}/halo3/emblem?primary=${serviceRecord.foregroundEmblem}&secondary=${serviceRecord.emblemFlags === 0 ? 'true' : 'false'}&background=${serviceRecord.backgroundEmblem}&primary_color=${serviceRecord.emblemPrimaryColor}&secondary_color=${serviceRecord.emblemSecondaryColor}&background_color=${serviceRecord.emblemBackgroundColor}&armour_primary_color=${serviceRecord.primaryColor}&size=400`
    : `${env.NEXT_PUBLIC_HALO3_API_BASE_URL}/halo3/emblem?primary=0&secondary=false&background=0&primary_color=0&secondary_color=0&background_color=0&size=400`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/halo3/player/${encodeURIComponent(gamertag)}`,
      siteName: "Blam Network",
      images: [
        {
          url: emblemUrl,
          width: 200,
          height: 200,
          alt: `${serviceRecord?.playerName || gamertag}'s emblem`,
        },
      ],
      type: "profile",
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [emblemUrl],
    },
  };
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
            pt: { xs: 2, md: 3 },
            pb: { xs: 2, md: 3 },
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
        </Box>
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

        {!hasPlayed && (
          <Paper
            sx={{
              p: { xs: 3, md: 4 },
              textAlign: "center",
              background: "linear-gradient(180deg, rgba(26, 32, 48, 0.5) 0%, rgba(15, 15, 15, 0.95) 100%)",
            }}
          >
            <Typography variant="h4" sx={{ color: "text.secondary", fontWeight: 600 }}>
              This player hasn&apos;t played in any Sunrise lobbies yet.
            </Typography>
          </Paper>
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
