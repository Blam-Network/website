import { Container, Typography } from "@mui/material";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";

export default function Loading() {
  return (
    <Container maxWidth="lg" sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
      <LoadingSpinner size={120} sx={{ mb: 2 }} />
      <Typography variant="body1" sx={{ color: '#B0B0B0' }}>
        Loading...
      </Typography>
    </Container>
  );
}

