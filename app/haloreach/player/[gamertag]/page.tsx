import { api } from "@/src/trpc/server";
import { Box, Container, Typography } from "@mui/material";
import { PlayerServiceRecordMissingIntel } from "@/src/components/player/PlayerServiceRecordMissingIntel";
import { getColor, getColorName, getCssColor } from "@/src/colors";
import { ReachServiceRecordBanner } from "@/src/components/reach/ReachServiceRecordBanner";
import { ReachSpartanRender } from "@/src/components/reach/ReachSpartanRender";
import { ReachFileshareSlotMeter } from "@/src/components/reach/ReachFileshareSlotMeter";
import { ReachPlayerFileshareTables } from "@/src/components/reach/ReachPlayerFileshareTables";
import { ServiceRecordBannerGameSelector } from "@/src/components/ServiceRecordBannerGameSelector";
import { SectionHeader } from "@/src/components/SectionHeader";
import { ReachNameplates } from "@/src/components/reach/ReachNameplates";
import { ReachArmourUnlocks } from "@/src/components/reach/ReachArmourUnlocks";
import { env } from "@/src/env";
import type { Metadata } from "next";
import { generateReachPlayerMetadata } from "@/src/utils/playerPageMetadata";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { gamertag: string };
  searchParams: { viewScreenshot?: string };
}): Promise<Metadata> {
  return generateReachPlayerMetadata(decodeURIComponent(params.gamertag), searchParams);
}

export default async function HaloReachPlayerPage({ params }: { params: { gamertag: string } }) {
  const gamertag = decodeURIComponent(params.gamertag);
  let serviceRecord: Awaited<ReturnType<typeof api.reach.serviceRecord.query>> | undefined;
  let fileShare: Awaited<ReturnType<typeof api.reach.fileShare.query>> | undefined;

  try {
    serviceRecord = await api.reach.serviceRecord.query({ gamertag });
  } catch {
    serviceRecord = undefined;
  }

  try {
    fileShare = await api.reach.fileShare.query({ gamertag });
  } catch {
    fileShare = undefined;
  }

  const darkPrimaryColor = serviceRecord
    ? (() => {
        const color = getColor(getColorName(serviceRecord.primaryColor));
        const r = Math.round(color.r * 0.12);
        const g = Math.round(color.g * 0.12);
        const b = Math.round(color.b * 0.12);
        return `rgb(${r},${g},${b})`;
      })()
    : null;
  const spartanRenderUrl = `${env.NEXT_PUBLIC_HALO_REACH_API_BASE_URL}/haloreach/spartan/${encodeURIComponent(gamertag)}.png`;

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
            borderColor: getCssColor(serviceRecord.primaryColor),
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'174\' viewBox=\'0 0 200 174\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' stroke=\'%23ffffff\' stroke-width=\'0.5\' stroke-opacity=\'0.1\'%3E%3Cpath d=\'M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z\'/%3E%3Cpath d=\'M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z\' transform=\'translate(100, 0)\'/%3E%3Cpath d=\'M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z\' transform=\'translate(50, 87)\'/%3E%3Cpath d=\'M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z\' transform=\'translate(150, 87)\'/%3E%3Cpath d=\'M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z\' transform=\'translate(-50, 87)\'/%3E%3Cpath d=\'M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z\' transform=\'translate(0, 174)\'/%3E%3Cpath d=\'M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z\' transform=\'translate(100, 174)\'/%3E%3C/g%3E%3C/svg%3E")',
              backgroundSize: "200px 174px",
              backgroundRepeat: "repeat",
              pointerEvents: "none",
            },
          }}
        >
          <Container maxWidth="lg" sx={{ width: "100%", position: "relative", zIndex: 1 }}>
            <ReachServiceRecordBanner serviceRecord={serviceRecord} />
          </Container>
          <ServiceRecordBannerGameSelector
            gamertag={serviceRecord.playerName}
            currentGame="reach"
            primaryColor={getCssColor(serviceRecord.primaryColor)}
          />
        </Box>
      )}

      {!serviceRecord && (
        <PlayerServiceRecordMissingIntel
          gamertag={gamertag}
          game="reach"
          spartanRenderUrl={spartanRenderUrl}
        />
      )}

      {serviceRecord && (
        <Container maxWidth="lg" sx={{ pt: 2 }}>
          <ReachNameplates profileGamertag={gamertag} />
          <ReachArmourUnlocks profileGamertag={gamertag} />
        </Container>
      )}

      {serviceRecord && (
        <Container maxWidth="lg" sx={{ py: 4, pt: 2 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) minmax(0, 1fr)" },
              gap: { xs: 4, lg: 4 },
              alignItems: "start",
            }}
          >
            <Box>
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
                Coming Soon
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                We are building out the full Halo: Reach player page with deeper stats, progression views,
                and more profile details. This section will expand over time as additional Reach systems come online.
              </Typography>
              <ReachSpartanRender src={spartanRenderUrl} alt={`${gamertag} spartan render`} />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <SectionHeader title="File Share" sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
                {fileShare && <ReachFileshareSlotMeter fileShare={fileShare} />}
              </SectionHeader>
              {fileShare ? (
                <ReachPlayerFileshareTables fileShare={fileShare} />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No file share data available.
                </Typography>
              )}
            </Box>
          </Box>
        </Container>
      )}
    </>
  );
}
