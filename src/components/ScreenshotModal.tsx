"use client";

import { useState, useEffect } from "react";
import { Modal, Box, IconButton } from "@mui/material";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { ScreenshotPolaroid } from "@/src/components/ScreenshotPolaroid";
import CloseIcon from "@mui/icons-material/Close";

interface ScreenshotModalProps {
  open: boolean;
  onClose: () => void;
  screenshotUrl: string;
  filename: string;
  description: string;
  author?: string;
}

export const ScreenshotModal = ({
  open,
  onClose,
  screenshotUrl,
  filename,
  description,
  author,
}: ScreenshotModalProps) => {
  const [shouldShowModal, setShouldShowModal] = useState(false);

  useEffect(() => {
    if (open) {
      setShouldShowModal(false);

      const img = new Image();
      img.onload = () => {
        setShouldShowModal(true);
      };
      img.onerror = () => {
        setShouldShowModal(true);
      };
      img.src = screenshotUrl;
    } else {
      setShouldShowModal(false);
    }
  }, [open, screenshotUrl]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
      }}
    >
      <Box
        sx={{
          position: "relative",
          maxWidth: "95vw",
          maxHeight: "95vh",
          outline: "none",
          padding: "20px",
          ...(!shouldShowModal && {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }),
        }}
      >
        {!shouldShowModal && <LoadingSpinner size={120} />}
        {shouldShowModal && (
          <>
            <IconButton
              onClick={onClose}
              sx={{
                position: "absolute",
                top: -10,
                right: -10,
                color: "#fff",
                zIndex: 1,
                width: 40,
                height: 40,
                "&:hover": {
                  color: "#7CB342",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
            <ScreenshotPolaroid
              screenshotUrl={screenshotUrl}
              filename={filename}
              description={description}
              author={author}
              imageMaxHeight="65vh"
            />
          </>
        )}
      </Box>
    </Modal>
  );
};
