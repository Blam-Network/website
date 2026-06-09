import {
  Box,
  Container,
  Divider,
  Link as MuiLink,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { fixedsysSize, fixedsysStyle } from "@/src/theme/fonts";

function ArticleList({ items }: { items: string[] }) {
  return (
    <Box
      component="ul"
      sx={{
        m: 0,
        pl: 2.5,
        "& li": {
          mb: 1,
          lineHeight: 1.65,
          "&::marker": {
            color: "primary.main",
          },
        },
      }}
    >
      {items.map((item) => (
        <Typography key={item} component="li" variant="body1" color="text.primary">
          {item}
        </Typography>
      ))}
    </Box>
  );
}

const violations = [
  "Manipulating network conditions to give yourself an advantage, or to the detriment of the experience for other players.",
  "Modifying your Xbox 360 hardware or game software in any way.",
  "Skill or XP boosting, deleveling, cheating, or any other type of unsociable and unsportsmanlike behavior.",
  "Uploading or sharing modified map variants, game variants, or other file share content that violates fair play.",
  "Impersonating a Blam Network administrator on Xbox LIVE with intent to defraud or cause harm to other players.",
];

const notViolations = [
  "Lag (poor or intermittent network performance).",
  "Occasional disconnects due to inconsistent network conditions.",
  "Playing with the same group of friends over and over using the party system, as long as this is not for the purpose of boosting.",
  "Losing games over and over again, as long as this is not for the purpose of boosting.",
  "Winning games over and over again, as long as this is not for the purpose of boosting.",
  "Being polite, courteous, and refraining from hate speech and racial slurs.",
];

export function BanPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Paper
        elevation={0}
        sx={{
          px: { xs: 2.5, md: 4 },
          py: { xs: 3, md: 4 },
          backgroundColor: "background.paper",
        }}
      >
        <Stack spacing={3}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                ...fixedsysStyle,
                fontSize: fixedsysSize(20),
                color: "primary.light",
                mb: 1,
              }}
            >
              Blam Network Banhammer Information
            </Typography>
          </Box>

          <Divider />

          <Stack spacing={2.5}>

            <Typography variant="body1" color="text.primary">
              If you are checking this page because of an in-game message from Halo: Reach or Halo 3
              on Blam Network, it is likely that you have been banned from matchmaking for violating
              the terms of use and/or committing a code of conduct violation. It is also possible, in
              the case of an especially egregious violation, that your Xbox 360 system itself is now
              banned from matchmaking. The duration of this ban will be based on the type, frequency,
              or nature of the committed violation.
            </Typography>

            <Typography variant="body1" color="text.primary">
              In most cases, custom games will still be available. For extreme cases, they will not.
            </Typography>

            <Typography variant="body1" color="text.primary">
              Types of violation include, but are not limited to, the following example actions:
            </Typography>

            <ArticleList items={violations} />

            <Typography variant="body1" color="text.primary">
              The following things will not result in a visit from the banhammer:
            </Typography>

            <ArticleList items={notViolations} />

            <Typography variant="body1" color="text.primary">
              The above violations cover a wide gamut of deliberate and obnoxious behaviors. The
              bans, when implemented, are done so with rigorous checking to ensure that the innocent
              are not netted alongside the guilty.
            </Typography>

            <Typography variant="body1" color="text.primary">
              Please note that while this process is automated, it is accurate. Bans are almost
              certainly legitimate, and will stay in force for their stated duration. To keep your
              matchmaking privileges in good standing, immediately cease any unsociable behavior and
              wait out the ban. Either way, there will be no response communication from this process.
            </Typography>

            <Box
              sx={{
                borderLeft: "3px solid",
                borderColor: "warning.main",
                pl: 2,
                py: 0.5,
              }}
            >
              <Typography variant="body1" color="text.primary">
                <Box component="span" sx={{ fontWeight: 700 }}>
                  IMPORTANT:
                </Box>{" "}
                You are ultimately responsible for the use of your Xbox Live account and Xbox 360
                hardware. If a friend or relative&apos;s actions have put you in this position, please
                take it up with them, not us.
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
