import { Container, Typography } from "@mui/material";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";

export default function Loading() {
  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 4, md: 5 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
      }}
    >
      <LoadingSpinner size={96} sx={{ mb: 2 }} />
      <Typography variant="body1" color="text.secondary">
        Loading carnage report...
      </Typography>
    </Container>
  );
}
