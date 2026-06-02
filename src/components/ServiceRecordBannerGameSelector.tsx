import { Box, Container } from "@mui/material";
import {
  ServiceRecordGameSelector,
  type ServiceRecordGame,
} from "@/src/components/ServiceRecordGameSelector";

interface ServiceRecordBannerGameSelectorProps {
  gamertag: string;
  currentGame: ServiceRecordGame;
  primaryColor: string;
}

export function ServiceRecordBannerGameSelector({
  gamertag,
  currentGame,
  primaryColor,
}: ServiceRecordBannerGameSelectorProps) {
  return (
    <Box
      sx={{
        position: "absolute",
        left: 0,
        right: 0,
        top: "100%",
        zIndex: 2,
        pointerEvents: "none",
      }}
    >
      <Container maxWidth="lg" sx={{ pointerEvents: "auto" }}>
        <ServiceRecordGameSelector
          gamertag={gamertag}
          currentGame={currentGame}
          primaryColor={primaryColor}
        />
      </Container>
    </Box>
  );
}
