"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/src/trpc/client";
import { Box, Typography, Container, Pagination } from "@mui/material";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { SectionHeader } from "@/src/components/SectionHeader";
import { ScreenshotCard } from "@/src/components/ScreenshotCard";
import { ScreenshotsPageFilters } from "@/src/components/screenshots/ScreenshotsPageFilters";
import { FilesGame, getFilesGameLabel, parseFilesGame } from "@/src/components/files/filesPageTypes";
import type { Screenshot } from "@/src/api/halo3/screenshots";
import { env } from "@/src/env";
import { useState, useEffect } from "react";

const SCREENSHOTS_BASE_PATH = "/screenshots";

function getScreenshotViewUrl(game: FilesGame, id: string): string {
  switch (game) {
    case "odst":
      return `${env.NEXT_PUBLIC_HALO3_API_BASE_URL}/halo3odst/screenshots/${id}/view`;
    case "reach":
      return `${env.NEXT_PUBLIC_HALO_REACH_API_BASE_URL}/haloreach/screenshots/${id}/view`;
    default:
      return `${env.NEXT_PUBLIC_HALO3_API_BASE_URL}/halo3/screenshots/${id}/view`;
  }
}

interface ScreenshotsPageProps {
  defaultGame?: FilesGame;
}

export function ScreenshotsPage({ defaultGame = "halo3" }: ScreenshotsPageProps) {
  const router = useRouter();
  const [query, setQuery] = useState<Record<string, string>>({});
  const page = parseInt(query.page || "1", 10);
  const game = parseFilesGame(query.game || (defaultGame !== "halo3" ? defaultGame : undefined));
  const gamertag = query.gamertag || "";
  const pageSize = 48;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryObj: Record<string, string> = {};
      params.forEach((value, key) => {
        queryObj[key] = value;
      });
      setQuery(queryObj);
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const queryObj: Record<string, string> = {};
      params.forEach((value, key) => {
        queryObj[key] = value;
      });
      setQuery(queryObj);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["screenshots", game, page, pageSize, gamertag],
    queryFn: () => {
      const input = { page, pageSize, gamertag: gamertag || undefined };
      switch (game) {
        case "odst":
          return api.odst.screenshots.query(input);
        case "reach":
          return api.reach.screenshots.query(input);
        default:
          return api.sunrise.screenshots.query(input);
      }
    },
  });

  const updateURL = (newPage: number, newGame: FilesGame) => {
    const newQuery: Record<string, string> = {};
    if (newPage > 1) newQuery.page = String(newPage);
    if (newGame !== "halo3") newQuery.game = newGame;
    if (gamertag) newQuery.gamertag = gamertag;
    if (query.viewScreenshot) newQuery.viewScreenshot = query.viewScreenshot;
    setQuery(newQuery);

    const params = new URLSearchParams();
    Object.entries(newQuery).forEach(([key, value]) => params.set(key, value));
    const queryString = params.toString();
    router.push(`${SCREENSHOTS_BASE_PATH}${queryString ? `?${queryString}` : ""}`);
  };

  const handleGameChange = (newGame: FilesGame) => updateURL(1, newGame);
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => updateURL(value, game);

  const gameLabel = getFilesGameLabel(game);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <SectionHeader title="Screenshots">
        {data && data.total > 0 && (
          <Typography variant="caption" color="text.secondary">
            {data.total.toLocaleString()} screenshots
          </Typography>
        )}
      </SectionHeader>

      <ScreenshotsPageFilters game={game} onGameChange={handleGameChange} />

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <LoadingSpinner size={96} />
        </Box>
      ) : data && data.data.length > 0 ? (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {gameLabel} — showing {((page - 1) * pageSize) + 1}–
            {Math.min(page * pageSize, data.total)} of {data.total.toLocaleString()}
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 2,
              mb: 4,
            }}
          >
            {data.data.map((screenshot: Screenshot) => (
              <ScreenshotCard
                key={screenshot.id}
                screenshotId={screenshot.id}
                screenshotUrl={getScreenshotViewUrl(game, screenshot.id)}
                filename={screenshot.header.filename}
                description={screenshot.header.description || ""}
                author={screenshot.author || undefined}
                date={screenshot.date}
                profileGame={game}
              />
            ))}
          </Box>

          {data.totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Pagination
                count={data.totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                sx={{ "& .MuiPaginationItem-root": { borderRadius: 0 } }}
              />
            </Box>
          )}
        </>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No screenshots found for {gameLabel}.
          </Typography>
        </Box>
      )}
    </Container>
  );
}
