import { Box, CircularProgress, Container, Typography } from "@mui/material";

export default function Loading() {
  return (
    <Container maxWidth="lg" sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
      <CircularProgress size={60} sx={{ color: '#7CB342', mb: 2 }} />
      <Typography variant="body1" sx={{ color: '#B0B0B0' }}>
        Loading campaign report...
      </Typography>
    </Container>
  );
}

