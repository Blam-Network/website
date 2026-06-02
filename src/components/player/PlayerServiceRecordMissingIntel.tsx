import Link from "next/link";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import TravelExploreOutlinedIcon from "@mui/icons-material/TravelExploreOutlined";
import { formatGamertag, playerProfilePath } from "@/src/components/Gamertag";
import { GameIcon } from "@/src/components/GameIcon";
import { ReachSpartanRender } from "@/src/components/reach/ReachSpartanRender";
import type { ServiceRecordGame } from "@/src/components/ServiceRecordGameSelector";

const GAME_LABELS: Record<ServiceRecordGame, string> = {
  halo3: "Halo 3",
  reach: "Halo Reach",
};

const OTHER_GAME: Record<ServiceRecordGame, ServiceRecordGame> = {
  halo3: "reach",
  reach: "halo3",
};

function otherGameProfileHref(gamertag: string, otherGame: ServiceRecordGame): string {
  return otherGame === "halo3"
    ? playerProfilePath(gamertag)
    : playerProfilePath(gamertag, "/haloreach/player");
}

export interface PlayerServiceRecordMissingIntelProps {
  gamertag: string;
  game: ServiceRecordGame;
  /** When set (Reach), shows the spartan render beside the message. */
  spartanRenderUrl?: string;
}

export function PlayerServiceRecordMissingIntel({
  gamertag,
  game,
  spartanRenderUrl,
}: PlayerServiceRecordMissingIntelProps) {
  const displayGamertag = formatGamertag(gamertag);
  const gameLabel = GAME_LABELS[game];
  const otherGame = OTHER_GAME[game];
  const otherGameLabel = GAME_LABELS[otherGame];
  const otherHref = otherGameProfileHref(gamertag, otherGame);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            px: { xs: 3, sm: 4 },
            py: { xs: 4, sm: 5 },
            background:
              "radial-gradient(ellipse at top, rgba(124, 179, 66, 0.12) 0%, transparent 55%)",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: spartanRenderUrl ? "minmax(0, 1fr) auto" : "1fr",
              },
              gap: { xs: 3, md: 4 },
              alignItems: "center",
            }}
          >
            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 72,
                  height: 72,
                  mb: 2,
                  borderRadius: "50%",
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "rgba(0, 0, 0, 0.35)",
                  color: "text.secondary",
                }}
              >
                <TravelExploreOutlinedIcon sx={{ fontSize: 36 }} />
              </Box>

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.25rem", sm: "3rem" },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                  mb: 1,
                  background: "linear-gradient(180deg, #A5D65C 0%, #7CB342 45%, #558B2F 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Missing Intel
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "center",
                  justifyContent: { xs: "center", md: "flex-start" },
                  mb: 1.5,
                  color: "text.secondary",
                }}
              >
                <GameIcon game={game} size={20} />
                <Typography variant="body1" color="text.secondary">
                  {gameLabel} Service Record
                </Typography>
              </Stack>

              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                No profile data for {displayGamertag}
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  maxWidth: 520,
                  mb: 1.5,
                  mx: { xs: "auto", md: 0 },
                }}
              >
                We don&apos;t have any information about this player. Play {gameLabel} with the Sunrise
                plugin active, or in a Sunrise lobby, to update your Service Record on Blam Network.
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  maxWidth: 520,
                  mb: 3,
                  mx: { xs: "auto", md: 0 },
                }}
              >
                They may have stats in {otherGameLabel} instead — check that service record below.
              </Typography>

              <Button
                component={Link}
                href={otherHref}
                variant="contained"
                sx={{ textTransform: "none" }}
              >
                <Stack direction="row" alignItems="center" spacing={0.75}>
                  <GameIcon game={otherGame} size={18} aria-hidden />
                  <span>View {otherGameLabel} Service Record</span>
                </Stack>
              </Button>
            </Box>

            {spartanRenderUrl && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  px: { md: 2 },
                }}
              >
                <ReachSpartanRender
                  src={spartanRenderUrl}
                  alt={`${displayGamertag} spartan render`}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
