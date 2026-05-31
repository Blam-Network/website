import { Box, Stack, Typography } from "@mui/material";
import type { FileShare } from "@/src/api/halo3/fileShare";

function QuotaMeter({
  label,
  percent,
  width = 120,
}: {
  label: string;
  percent: number;
  width?: number;
}) {
  const fillColor =
    percent > 90 ? "error.main" : percent > 75 ? "warning.main" : "primary.main";

  return (
    <Box
      sx={{
        width,
        height: 22,
        border: "1px solid",
        borderColor: "divider",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "rgba(0, 0, 0, 0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: `${percent}%`,
          bgcolor: fillColor,
          opacity: 0.85,
          transition: "width 0.3s ease",
        }}
      />
      <Typography
        variant="caption"
        sx={{
          position: "relative",
          zIndex: 1,
          color: "text.primary",
          fontWeight: 700,
          fontSize: "0.65rem",
          letterSpacing: "0.02em",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes.toFixed(1);
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1);
  return (bytes / (1024 * 1024)).toFixed(1);
}

function getUnit(bytes: number) {
  if (bytes < 1024) return "B";
  if (bytes < 1024 * 1024) return "KB";
  return "MB";
}

export function FileshareQuotaMeters({ fileShare }: { fileShare: FileShare }) {
  const slotsUsed = fileShare.slots.length;
  const slotsTotal = fileShare.quotaSlots;
  const slotsPercent = Math.min((slotsUsed / slotsTotal) * 100, 100);

  const usedBytes = fileShare.slots.reduce(
    (sum: number, slot: FileShare["slots"][number]) => sum + (slot.header.size || 0),
    0,
  );
  const usedPercent =
    fileShare.quotaBytes > 0
      ? Math.min((usedBytes / fileShare.quotaBytes) * 100, 100)
      : 0;

  return (
    <Stack direction="row" gap={1.5} alignItems="center" flexWrap="wrap">
      <QuotaMeter
        label={`${slotsUsed} / ${slotsTotal} slots`}
        percent={slotsPercent}
        width={128}
      />
      {fileShare.quotaBytes > 0 && (
        <QuotaMeter
          label={`${formatBytes(usedBytes)} / ${formatBytes(fileShare.quotaBytes)} ${getUnit(fileShare.quotaBytes)}`}
          percent={usedPercent}
          width={156}
        />
      )}
    </Stack>
  );
}
