"use client";

import { Box, Snackbar, Typography } from "@mui/material";
import Image from "next/image";
import { useEffect, useRef } from "react";

const TOAST_BG = "rgba(18, 32, 58, 0.8)";
const TOAST_BORDER = "rgba(72, 108, 148, 0.4)";
const DEFAULT_ICON = "/img/toast_alert.png";

export type HaloToastPayload = {
  title: string;
  message: string;
  duration: number;
  iconSrc: string;
};

export function HaloToast({
  toast,
  onClose,
}: {
  toast: HaloToastPayload | null;
  onClose: () => void;
}) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const open = toast !== null;
  const duration = toast?.duration ?? 8000;

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => onCloseRef.current(), duration);
    return () => window.clearTimeout(id);
  }, [open, duration, toast?.message, toast?.title]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={null}
      onClose={() => onCloseRef.current()}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      ContentProps={{
        sx: {
          p: 0,
          m: 0,
          width: "auto",
          maxWidth: "none",
          flexGrow: 0,
          bgcolor: "transparent",
          boxShadow: "none",
          "&:hover": { bgcolor: "transparent" },
        },
      }}
      sx={{
        bottom: { xs: 40, sm: 72 },
        left: "50%",
        right: "auto",
        transform: "translateX(-50%)",
        width: "auto",
      }}
    >
      {toast && (
        <Box
          role="alert"
          aria-live="assertive"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            px: 3.5,
            py: 3,
            minWidth: { xs: "min(100vw - 48px, 520px)", sm: 520 },
            maxWidth: 640,
            backgroundColor: TOAST_BG,
            border: `1px solid ${TOAST_BORDER}`,
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
          }}
        >
          <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Image src={toast.iconSrc} alt="" width={72} height={72} priority />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                color: "#E8ECF0",
                fontWeight: 700,
                fontSize: "1.25rem",
                letterSpacing: "0.06em",
                lineHeight: 1.2,
                textTransform: "uppercase",
              }}
            >
              {toast.title}
            </Typography>
            <Typography
              sx={{
                color: "#9AA8B8",
                fontSize: "1rem",
                lineHeight: 1.45,
                mt: 1,
              }}
            >
              {toast.message}
            </Typography>
          </Box>
        </Box>
      )}
    </Snackbar>
  );
}

const SUCCESS_ICON = "/img/toast_success.png";

export { DEFAULT_ICON as HALO_TOAST_DEFAULT_ICON, SUCCESS_ICON as HALO_TOAST_SUCCESS_ICON };
