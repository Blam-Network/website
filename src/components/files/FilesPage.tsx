"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/src/trpc/client";
import { Box, Typography, Container, Pagination, Stack } from "@mui/material";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { SectionHeader } from "@/src/components/SectionHeader";
import { Halo3FileshareFileCard } from "@/src/components/files/Halo3FileshareFileCard";
import { OdstFileshareFileCard } from "@/src/components/files/OdstFileshareFileCard";
import { ReachFileshareFileCard } from "@/src/components/files/ReachFileshareFileCard";
import type { FileshareFile } from "@/src/api/halo3/fileshareFiles";
import { FilesPageFilters } from "@/src/components/files/FilesPageFilters";
import {
  FileTypeFilter,
  FilesGame,
  getFileTypeFiltersForGame,
  getFilesGameLabel,
  isValidFileTypeForGame,
  parseFilesGame,
} from "@/src/components/files/filesPageTypes";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

const FILES_BASE_PATH = "/files";

interface FilesPageProps {
  defaultGame?: FilesGame;
}

export function FilesPage({ defaultGame = "halo3" }: FilesPageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const loggedIn = !!session?.user?.xuid;
  const [query, setQuery] = useState<Record<string, string>>({});
  const page = parseInt(query.page || "1", 10);
  const game = parseFilesGame(query.game || defaultGame);
  const rawFileType = (query.fileType || "") as FileTypeFilter;
  const fileType = isValidFileTypeForGame(game, rawFileType) ? rawFileType : "";
  const search = query.search || "";
  const [searchInput, setSearchInput] = useState(search);
  const pageSize = 50;
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => () => clearTimeout(searchDebounceRef.current), []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    if (!params.has("game")) {
      params.set("game", defaultGame);
      const queryObj: Record<string, string> = {};
      params.forEach((value, key) => {
        queryObj[key] = value;
      });
      setQuery(queryObj);
      router.replace(`${FILES_BASE_PATH}?${params.toString()}`);
      return;
    }

    const queryObj: Record<string, string> = {};
    params.forEach((value, key) => {
      queryObj[key] = value;
    });
    setQuery(queryObj);
  }, [defaultGame, router]);

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

  const fileTypeParam = fileType
    ? (fileType as "maps" | "gametypes" | "films" | "screenshots")
    : undefined;

  const { data, isLoading } = useQuery({
    queryKey: ["fileshareFiles", game, page, pageSize, fileType, search],
    queryFn: () => {
      const input = {
        page,
        pageSize,
        fileType: fileTypeParam,
        search: search || undefined,
      };
      switch (game) {
        case "odst":
          return api.odst.fileshareFiles.query(input);
        case "reach":
          return api.reach.fileshareFiles.query(input);
        default:
          return api.sunrise2.fileshareFiles.query(input);
      }
    },
  });

  const updateURL = (
    newPage: number,
    newFileType: FileTypeFilter,
    newGame: FilesGame,
    newSearch?: string,
  ) => {
    const newQuery: Record<string, string> = { game: newGame };
    if (newPage > 1) newQuery.page = String(newPage);
    if (newFileType) newQuery.fileType = newFileType;
    const searchValue = newSearch !== undefined ? newSearch : search;
    if (searchValue.trim()) newQuery.search = searchValue.trim();
    setQuery(newQuery);

    const params = new URLSearchParams();
    Object.entries(newQuery).forEach(([key, value]) => params.set(key, value));
    const queryString = params.toString();
    router.push(`${FILES_BASE_PATH}${queryString ? `?${queryString}` : ""}`);
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      updateURL(1, fileType, game, value);
    }, 300);
  };

  const handleGameChange = (newGame: FilesGame) => {
    const nextFileType = isValidFileTypeForGame(newGame, fileType) ? fileType : "";
    updateURL(1, nextFileType, newGame);
  };
  const handleFilterChange = (newFileType: FileTypeFilter) => updateURL(1, newFileType, game);
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) =>
    updateURL(value, fileType, game);

  const activeFilter = getFileTypeFiltersForGame(game).find((f) => f.value === fileType)?.label ?? "All";
  const gameLabel = getFilesGameLabel(game);

  const signInMessage =
    game === "reach"
      ? "Sign in with Xbox LIVE to queue files for download on your Xbox 360 (Halo: Reach)."
      : "Sign in with Xbox LIVE to download files to your Xbox 360 console";

  const renderFileCard = (file: FileshareFile) => {
    switch (game) {
      case "odst":
        return <OdstFileshareFileCard key={file.id} file={file} />;
      case "reach":
        return <ReachFileshareFileCard key={file.id} file={file} />;
      default:
        return <Halo3FileshareFileCard key={file.id} file={file} />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <SectionHeader title="Files">
        {data && data.total > 0 && (
          <Typography variant="caption" color="text.secondary">
            {data.total.toLocaleString()} files
          </Typography>
        )}
      </SectionHeader>

      {!loggedIn && (
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
          {signInMessage}
        </Typography>
      )}

      <FilesPageFilters
        game={game}
        fileType={fileType}
        search={searchInput}
        onGameChange={handleGameChange}
        onFileTypeChange={handleFilterChange}
        onSearchChange={handleSearchChange}
      />

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <LoadingSpinner size={96} />
        </Box>
      ) : data && data.data.length > 0 ? (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {gameLabel} — {activeFilter} — showing {((page - 1) * pageSize) + 1}–
            {Math.min(page * pageSize, data.total)} of {data.total.toLocaleString()}
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(5, 1fr)",
              },
              gap: 2,
              mb: 4,
            }}
          >
            {data.data.map((file: FileshareFile) => renderFileCard(file))}
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
            No files found
            {search ? ` matching "${search}"` : ""}
            {fileType ? ` in ${activeFilter.toLowerCase()}` : ""} for {gameLabel}.
          </Typography>
        </Box>
      )}
    </Container>
  );
}
