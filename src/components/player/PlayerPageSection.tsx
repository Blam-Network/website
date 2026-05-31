import { Box, Paper, PaperProps } from "@mui/material";

type PlayerPageSectionProps = PaperProps & {
  children: React.ReactNode;
};

export function PlayerPageSection({ children, sx, ...props }: PlayerPageSectionProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 2.5 },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, rgba(26, 32, 48, 0.6) 0%, rgba(15, 15, 15, 0.95) 100%)",
        ...sx,
      }}
      {...props}
    >
      {children}
    </Paper>
  );
}

export function PlayerPageSectionsGrid({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
        gap: 3,
        alignItems: "stretch",
      }}
    >
      {children}
    </Box>
  );
}
