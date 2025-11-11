import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { ThemeProvider } from '@mui/material/styles';
import theme from "@/src/theme";
import { Container, Box } from "@mui/material";
import { Header } from "@/src/components/Header";
import CssBaseline from '@mui/material/CssBaseline';
import { getServerSession } from "next-auth";
import { NavBar } from "@/src/components/NavBar";
import { Footer } from "@/src/components/Footer";
import { authOptions } from "@/src/api/auth";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Providers } from "@/src/components/Providers";
import { DebugMenu } from "@/src/components/DebugMenu/DebugMenu";
import { NightmapProvider } from "@/src/contexts/NightmapContext";


export const metadata: Metadata = {
  title: "Blam Network",
  description: "Unofficial Halo Web Services",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);


  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Caveat:wght@400;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Conduit+ITC:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: 'inherit' }}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
          <CssBaseline />
            <Providers>
              <NightmapProvider>
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                  <DebugMenu/>
                  <Header session={session} />
                  <NavBar session={session}/>
                  <Box sx={{ flex: 1 }}>
                    {children}
                  </Box>
                  <Footer />
                </Box>
              </NightmapProvider>
            </Providers>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
