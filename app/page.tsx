import { Typography, Box, Container } from "@mui/material";
import { api } from "@/src/trpc/server";
import Link from "next/link";
import { RecentScreenshot } from "@/src/api/sunrise/recentScreenshots";
import { ScreenshotCard } from "@/src/components/ScreenshotCard";
import { Nightmap } from "@/src/components/Nightmap";
import { RecentGamesTable } from "@/src/components/RecentGamesTable";

export default async function Home() {
  const recentGames = await api.sunrise2.recentGames.query();
  const recentScreenshots = await api.sunrise2.recentScreenshots.query();

  return (
    <>
      <Nightmap />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, width: '100%' }}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 1, borderBottom: '2px solid #7CB342' }}>
              <Typography variant='h4'>
                Recent Games
              </Typography>
              <Link href="/games" style={{ textDecoration: 'none' }}>
                <Typography 
                  variant='body2' 
                  sx={{ 
                    color: '#4A90E2',
                    textDecoration: 'underline',
                    '&:hover': { color: '#6BA3E8' },
                  }}
                >
                  View All
                </Typography>
              </Link>
            </Box>
            <RecentGamesTable games={recentGames} />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 1, borderBottom: '2px solid #7CB342' }}>
              <Typography variant='h4'>
                Recent Screenshots
              </Typography>
              <Link href="/screenshots" style={{ textDecoration: 'none' }}>
                <Typography 
                  variant='body2' 
                  sx={{ 
                    color: '#4A90E2',
                    textDecoration: 'underline',
                    '&:hover': { color: '#6BA3E8' },
                  }}
                >
                  View All
                </Typography>
              </Link>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 2 }}>
              {recentScreenshots.map((screenshot: RecentScreenshot) => (
                <ScreenshotCard
                  key={screenshot.id}
                  screenshotId={screenshot.id}
                  screenshotUrl={`https://halo3.blam.network/halo3/screenshots/${screenshot.id}/view`}
                  filename={screenshot.header.filename}
                  description={screenshot.header.description}
                  author={screenshot.author}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
}
