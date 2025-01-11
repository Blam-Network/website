import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { ThemeProvider } from '@mui/material/styles';
import theme from "@/src/theme";
import { Container } from "@mui/material";
import { Header } from "@/src/components/Header";
import CssBaseline from '@mui/material/CssBaseline';
import { getServerSession } from "next-auth";
import { NavBar } from "@/src/components/NavBar";
import { authOptions } from "@/src/api/auth";


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
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
          <CssBaseline />
            <Header session={session} />
            <NavBar session={session}/>
            <Container maxWidth="lg">              
              {children}
            </Container>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
