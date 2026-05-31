import { Box, Typography } from "@mui/material";

interface CarnageReportSectionProps {
  title: string;
  children: React.ReactNode;
}

export function CarnageReportSection({ title, children }: CarnageReportSectionProps) {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        {title}
      </Typography>
      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          overflow: "hidden",
          backgroundColor: "rgba(0, 0, 0, 0.18)",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
