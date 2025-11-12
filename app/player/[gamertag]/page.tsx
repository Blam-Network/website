import Image from "next/image";
import { getServerSession } from "next-auth";
import { api } from "@/src/trpc/server";
import { ServiceRecordComponent } from "@/src/components/ServiceRecord";
import { Stack, Box, Typography, Divider, Paper, Container, Link as MuiLink } from "@mui/material";
import { Screenshots } from "@/src/api/sunrise/screenshots";
import { authOptions } from "@/src/api/auth";
import { FileShare } from "@/src/api/sunrise/fileShare";
import Link from "next/link";
import { format } from "date-fns";
import { PreviousGame } from "@/src/api/sunrise/previousGames";
import { RoadToRecon } from "@/src/components/RoadToRecon";
import { FileshareDownloadButton } from "@/src/components/FileshareDownloadButton";
import { ScreenshotCard } from "@/src/components/ScreenshotCard";
import { FileshareFiletypeIcon } from "@/src/components/FileshareFiletypeIcon";
import { getColor, getColorName, getCssColor } from "@/src/colors";
import { RecentGamesTable } from "@/src/components/RecentGamesTable";
import { env } from "@/src/env";

export default async function Home({params}: {params: { gamertag: string }}) {
  const session = await getServerSession(authOptions);
  const loggedIn = !!session?.user;

  // Decode the gamertag from URL encoding (e.g., %20 -> space)
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
    screenshots = await api.sunrise.playerScreenshots.query({ gamertag });
  } catch {}
  const hasPlayed = previousGames.length > 0 || !!serviceRecord?.playerName;

  const darkPrimaryColor = serviceRecord ? (() => {
    const color = getColor(getColorName(serviceRecord.primaryColor));
    const r = Math.round(color.r * 0.15);
    const g = Math.round(color.g * 0.15);
    const b = Math.round(color.b * 0.15);
    return `rgb(${r},${g},${b})`;
  })() : null;

  return (
    <>
      {serviceRecord && darkPrimaryColor && (
        <Box 
          sx={{ 
            width: '100%',
            backgroundColor: darkPrimaryColor,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: 2,
            pb: 2,
            borderBottom: `2px solid ${serviceRecord ? getCssColor(serviceRecord.primaryColor) : '#7CB342'}`,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='174' viewBox='0 0 200 174' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5' stroke-opacity='0.1'%3E%3Cpath d='M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z'/%3E%3Cpath d='M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z' transform='translate(100, 0)'/%3E%3Cpath d='M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z' transform='translate(50, 87)'/%3E%3Cpath d='M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z' transform='translate(150, 87)'/%3E%3Cpath d='M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z' transform='translate(-50, 87)'/%3E%3Cpath d='M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z' transform='translate(0, 174)'/%3E%3Cpath d='M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z' transform='translate(100, 174)'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '200px 174px',
              backgroundRepeat: 'repeat',
              pointerEvents: 'none',
            },
          }}
        >
          <Container maxWidth="lg" sx={{ width: '100%' }}>
            <ServiceRecordComponent serviceRecord={serviceRecord} />
          </Container>
        </Box>
      )}
      {serviceRecord && (
        <Container maxWidth="lg" sx={{ pt: 2 }}>
          <RoadToRecon profileGamertag={gamertag} />
        </Container>
      )}
      <Container maxWidth="lg" sx={{ py: 4 }}>
      {!serviceRecord && (
        <Box sx={{ mb: 4 }}>
          <RoadToRecon profileGamertag={gamertag} />
        </Box>
      )}
      {!hasPlayed && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant='h4'>{"This player hasn't played in any Sunrise lobbies yet."}</Typography>
        </Paper>
      )}
      
      {hasPlayed && (
        <Box sx={{ width: '100%', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, alignItems: 'stretch' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 2, pb: 1, borderBottom: '2px solid #7CB342' }}>
              <Typography variant='h4'>Recent Games</Typography>
              <Link href={`/games?gamertag=${encodeURIComponent(gamertag)}`} style={{ textDecoration: 'none' }}>
                <Typography 
                  variant='body2' 
                  sx={{ 
                    textDecoration: 'underline',
                    color: '#4A90E2',
                    '&:hover': { color: '#6BA3E8' },
                  }}
                >
                  View All
                </Typography>
              </Link>
            </Stack>
            {previousGames.length > 0 ? (
              <RecentGamesTable games={previousGames} stickyHeader={true} />
            ) : (
              <Typography variant='body2' color='text.secondary'>No games found.</Typography>
            )}
          </Box>
          <Box>
            <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ mb: 2, pb: 1, borderBottom: '2px solid #7CB342' }}>
              <Typography variant='h4'>File Share</Typography>
              {fileShare && (
                <Stack direction='row' gap={2} alignItems='center'>
                  {(() => {
                    const slotsUsed = fileShare.slots.length;
                    const slotsTotal = fileShare.quotaSlots;
                    const slotsPercent = Math.min((slotsUsed / slotsTotal) * 100, 100);
                    return (
                      <Box
                        sx={{
                          width: 120,
                          height: 24,
                          border: '1px solid #444',
                          position: 'relative',
                          overflow: 'hidden',
                          backgroundColor: '#0F0F0F',
                          borderRadius: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            width: `${slotsPercent}%`,
                            height: '100%',
                            background: slotsPercent > 90 
                              ? 'linear-gradient(90deg, #d32f2f 0%, #b71c1c 100%)'
                              : slotsPercent > 75 
                              ? 'linear-gradient(90deg, #f57c00 0%, #e65100 100%)'
                              : 'linear-gradient(90deg, #4caf50 0%, #2e7d32 100%)',
                            transition: 'width 0.3s ease',
                            left: 0,
                            top: 0,
                          }}
                        />
                        <Typography 
                          variant='caption' 
                          sx={{ 
                            position: 'relative',
                            zIndex: 1,
                            color: '#E0E0E0',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        >
                          {slotsUsed} / {slotsTotal} slots
                        </Typography>
                      </Box>
                    );
                  })()}
                  {fileShare.quotaBytes > 0 && (() => {
                    const usedBytes = fileShare.slots.reduce((sum: number, slot: FileShare['slots'][number]) => sum + (slot.header.size || 0), 0);
                    const usedPercent = Math.min((usedBytes / fileShare.quotaBytes) * 100, 100);
                    const formatBytes = (bytes: number) => {
                      if (bytes < 1024) return bytes.toFixed(1);
                      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1);
                      return (bytes / (1024 * 1024)).toFixed(1);
                    };
                    const getUnit = (bytes: number) => {
                      if (bytes < 1024) return 'B';
                      if (bytes < 1024 * 1024) return 'KB';
                      return 'MB';
                    };
                    return (
                      <Box
                        sx={{
                          width: 150,
                          height: 24,
                          border: '1px solid #444',
                          position: 'relative',
                          overflow: 'hidden',
                          backgroundColor: '#0F0F0F',
                          borderRadius: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            width: `${usedPercent}%`,
                            height: '100%',
                            background: usedPercent > 90 
                              ? 'linear-gradient(90deg, #d32f2f 0%, #b71c1c 100%)'
                              : usedPercent > 75 
                              ? 'linear-gradient(90deg, #f57c00 0%, #e65100 100%)'
                              : 'linear-gradient(90deg, #4caf50 0%, #2e7d32 100%)',
                            transition: 'width 0.3s ease',
                            left: 0,
                            top: 0,
                          }}
                        />
                        <Typography 
                          variant='caption' 
                          sx={{ 
                            position: 'relative',
                            zIndex: 1,
                            color: '#E0E0E0',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        >
                          {formatBytes(usedBytes)} / {formatBytes(fileShare.quotaBytes)} {getUnit(fileShare.quotaBytes)}
                        </Typography>
                      </Box>
                    );
                  })()}
                </Stack>
              )}
            </Stack>
            {fileShare && (
              <>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 2, width: '100%' }}>
                  {Array.from({ length: Math.max(fileShare.quotaSlots || 0, fileShare.slots.length || 0) }, (_, i) => i).map((slotIndex) => {
                    const displaySlotNumber = slotIndex + 1; // Display as 1-indexed for users
                    const slot = fileShare.slots.find((s: FileShare['slots'][number]) => s.slotNumber === slotIndex);
                    if (!slot) {
                      return (
                        <Paper
                          key={`empty-${slotIndex}`}
                          elevation={2}
                          sx={{
                            border: '1px dashed #444',
                            minHeight: 160,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(180deg, #0F0F0F 0%, #1A1A1A 100%)',
                          }}
                        >
                          <Typography variant='h2' sx={{ color: '#666', fontWeight: 700 }}>{displaySlotNumber}</Typography>
                        </Paper>
                      );
                    }
                    return (
                      <Paper
                        key={slot.id}
                        elevation={4}
                        sx={{
                          border: '1px solid #333',
                          background: 'linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)',
                          p: 1.5,
                          display: 'flex',
                          flexDirection: 'column',
                          '&:hover': {
                            borderColor: '#7CB342',
                            boxShadow: '0 0 10px rgba(124, 179, 66, 0.2)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <Box sx={{ width: '100%', mb: 1 }}>
                          <FileshareFiletypeIcon 
                            filetype={slot.header.filetype} 
                            gameEngineType={slot.header.gameEngineType}
                            size="100%"
                            shareId={slot.header.filetype === 13 ? fileShare.id : undefined}
                            slot={slot.header.filetype === 13 ? slot.slotNumber : undefined}
                            fileId={slot.header.filetype === 13 ? slot.id : undefined}
                            filename={slot.header.filetype === 13 ? slot.header.filename : undefined}
                            description={slot.header.filetype === 13 ? slot.header.description : undefined}
                            author={slot.header.filetype === 13 ? slot.header.author : undefined}
                          />
                        </Box>
                        <Typography variant='body1' sx={{ fontWeight: 600, color: '#9CCC65', mb: 0.5 }}>
                          {slot.header.filename}
                        </Typography>
                        <Typography variant='body2' sx={{ fontSize: '0.75rem', color: '#B0B0B0', mb: 1 }}>
                          by{' '}
                          <Link href={"/player/" + slot.header.author} style={{ color: '#4A90E2', textDecoration: 'none' }}>
                            {slot.header.author}
                          </Link>
                        </Typography>
                        {loggedIn && (
                          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 'auto' }}>
                            <FileshareDownloadButton fileId={slot.id} />
                          </Box>
                        )}
                      </Paper>
                    );
                  })}
                </Box>
              </>
            )}
          </Box>
        </Box>
      )}
      {hasPlayed && (
        <Box sx={{ mt: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 1, borderBottom: '2px solid #7CB342' }}>
            <Typography variant='h4'>Recent Screenshots</Typography>
            {screenshots.length > 0 && (
              <MuiLink 
                component={Link}
                href={`/screenshots?gamertag=${encodeURIComponent(gamertag)}`}
                underline="always"
              >
                <Typography variant="body2" component="span">
                  View All
                </Typography>
              </MuiLink>
            )}
          </Box>
          {screenshots.length > 0 ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 2, width: '100%' }}>
              {screenshots?.map((screenshot: Screenshots[number]) => (
                <ScreenshotCard
                    key={screenshot.id}
                  screenshotId={screenshot.id}
                  screenshotUrl={`${env.HALO3_API_BASE_URL}/halo3/screenshots/${screenshot.id}/view`}
                  filename={screenshot.header.filename}
                  description={screenshot.header.description}
                />
              ))}
            </Box>
          ) : (
            <Typography variant='body1' color='text.secondary'>
              {gamertag} {"hasn't uploaded any Screenshots yet."}
            </Typography>
          )}
        </Box>
      )}
      </Container>
    </>
  );
}
