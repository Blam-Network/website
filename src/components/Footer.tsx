import { Box, Container, Typography, Stack, Divider } from "@mui/material";
import Link from "next/link";

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        backgroundColor: '#0F0F0F',
        borderTop: '1px solid #333',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Blam! Network. Unofficial Halo Web Services.
            </Typography>
            <Stack direction="row" spacing={3}>
              <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#9CCC65',
                    '&:hover': { 
                      color: '#7CB342',
                      textDecoration: 'underline',
                    },
                    transition: 'color 0.2s ease',
                  }}
                >
                  Home
                </Typography>
              </Link>
              <Link href="/players" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#9CCC65',
                    '&:hover': { 
                      color: '#7CB342',
                      textDecoration: 'underline',
                    },
                    transition: 'color 0.2s ease',
                  }}
                >
                  Players
                </Typography>
              </Link>
              <Link href="/screenshots" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#9CCC65',
                    '&:hover': { 
                      color: '#7CB342',
                      textDecoration: 'underline',
                    },
                    transition: 'color 0.2s ease',
                  }}
                >
                  Screenshots
                </Typography>
              </Link>
            </Stack>
          </Stack>
          <Divider sx={{ borderColor: '#333' }} />
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
            This is an unofficial fan project and is not affiliated with Microsoft, 343 Industries, or Bungie.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

