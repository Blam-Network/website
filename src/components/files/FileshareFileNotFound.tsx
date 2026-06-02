"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FolderOffOutlinedIcon from "@mui/icons-material/FolderOffOutlined";
import { GameIcon } from "@/src/components/GameIcon";
import {
  getFilesGameLabel,
  parseFilesGameFromFilePagePathname,
  type FilesGame,
} from "@/src/components/files/filesPageTypes";

export function FileshareFileNotFound() {
  const pathname = usePathname();
  const game: FilesGame | null = parseFilesGameFromFilePagePathname(pathname);
  const gameLabel = game ? getFilesGameLabel(game) : null;

  const filesHref = game ? `/files?game=${game}` : "/files";

  return (
    <Container
      maxWidth="md"
      sx={{
        py: { xs: 4, md: 6 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "55vh",
      }}
    >
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
            textAlign: "center",
            background:
              "radial-gradient(ellipse at top, rgba(124, 179, 66, 0.12) 0%, transparent 55%)",
          }}
        >
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
            <FolderOffOutlinedIcon sx={{ fontSize: 36 }} />
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "3.5rem", sm: "4.5rem" },
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              mb: 1,
              background: "linear-gradient(180deg, #A5D65C 0%, #7CB342 45%, #558B2F 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </Typography>

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            File not found
          </Typography>

          {gameLabel ? (
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
                justifyContent: "center",
                mb: 1.5,
                color: "text.secondary",
              }}
            >
              <GameIcon game={game!} size={20} />
              <Typography variant="body1" color="text.secondary">
                {gameLabel} File Share
              </Typography>
            </Stack>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1.5 }}>
              File Share
            </Typography>
          )}

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 480, mx: "auto", mb: 3 }}
          >
            This file may have been removed, never uploaded to the network, or the link may be
            incorrect.
          </Typography>

          <Button
            component={Link}
            href={filesHref}
            variant="contained"
            startIcon={<ArrowBackIcon />}
            sx={{ textTransform: "none" }}
          >
            {gameLabel ? `Back to ${gameLabel} Files` : "Browse Files"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
