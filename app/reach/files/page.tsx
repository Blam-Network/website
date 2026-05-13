"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/src/trpc/client";
import { Box, Typography, Container, Pagination, Stack, Button, Card, CardContent } from "@mui/material";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { useState, useEffect } from "react";
import type { FileshareFile } from "@/src/api/reach/fileshareFilesSchema";
import Link from "next/link";
import { FileshareFiletypeIcon } from "@/src/components/FileshareFiletypeIcon";
import { FileshareDownloadButton } from "@/src/components/FileshareDownloadButton";
import { DateTimeDisplay } from "@/src/components/DateTimeDisplay";
import { isGuestXuid } from "@/src/utils/xuid";
import { useSession } from "next-auth/react";

export default function ReachFilesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const loggedIn = !!session?.user?.xuid;
  const [query, setQuery] = useState<Record<string, string>>({});
  const page = parseInt(query.page || "1", 10);
  const fileType = query.fileType || "";
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
    queryKey: ["reachFileshareFiles", page, pageSize, fileType],
    queryFn: () =>
      api.reach.fileshareFiles.query({
        page,
        pageSize,
        fileType: fileType ? (fileType as "maps" | "gametypes" | "films" | "screenshots") : undefined,
      }),
  });

  const updateURL = (newPage: number, newFileType: string) => {
    const newQuery: Record<string, string> = {};
    if (newPage > 1) {
      newQuery.page = String(newPage);
    }
    if (newFileType) {
      newQuery.fileType = newFileType;
    }
    setQuery(newQuery);

    const params = new URLSearchParams();
    Object.entries(newQuery).forEach(([key, value]) => {
      params.set(key, value);
    });
    const queryString = params.toString();
    router.push(`/reach/files${queryString ? `?${queryString}` : ""}`);
  };

  const handleFilterChange = (newFileType: string) => {
    updateURL(1, newFileType);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    updateURL(value, fileType);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, pb: 1, borderBottom: "2px solid #7CB342" }}>
        Files
      </Typography>

      {!loggedIn && (
        <Typography variant="caption" sx={{ color: "#B0B0B0", display: "block", mb: 2 }}>
          Sign in with Xbox LIVE to queue files for download on your Xbox 360 (Halo: Reach).
        </Typography>
      )}

      <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: "wrap", rowGap: 1 }}>
        <Button
          variant={fileType === "" ? "contained" : "outlined"}
          onClick={() => handleFilterChange("")}
          sx={{
            backgroundColor: fileType === "" ? "#7CB342" : "transparent",
            color: fileType === "" ? "#fff" : "#7CB342",
            borderColor: "#7CB342",
            "&:hover": {
              backgroundColor: fileType === "" ? "#558B2F" : "rgba(124, 179, 66, 0.1)",
            },
          }}
        >
          All
        </Button>
        <Button
          variant={fileType === "maps" ? "contained" : "outlined"}
          onClick={() => handleFilterChange("maps")}
          sx={{
            backgroundColor: fileType === "maps" ? "#7CB342" : "transparent",
            color: fileType === "maps" ? "#fff" : "#7CB342",
            borderColor: "#7CB342",
            "&:hover": {
              backgroundColor: fileType === "maps" ? "#558B2F" : "rgba(124, 179, 66, 0.1)",
            },
          }}
        >
          Maps
        </Button>
        <Button
          variant={fileType === "gametypes" ? "contained" : "outlined"}
          onClick={() => handleFilterChange("gametypes")}
          sx={{
            backgroundColor: fileType === "gametypes" ? "#7CB342" : "transparent",
            color: fileType === "gametypes" ? "#fff" : "#7CB342",
            borderColor: "#7CB342",
            "&:hover": {
              backgroundColor: fileType === "gametypes" ? "#558B2F" : "rgba(124, 179, 66, 0.1)",
            },
          }}
        >
          Gametypes
        </Button>
        <Button
          variant={fileType === "films" ? "contained" : "outlined"}
          onClick={() => handleFilterChange("films")}
          sx={{
            backgroundColor: fileType === "films" ? "#7CB342" : "transparent",
            color: fileType === "films" ? "#fff" : "#7CB342",
            borderColor: "#7CB342",
            "&:hover": {
              backgroundColor: fileType === "films" ? "#558B2F" : "rgba(124, 179, 66, 0.1)",
            },
          }}
        >
          Films
        </Button>
        <Button
          variant={fileType === "screenshots" ? "contained" : "outlined"}
          onClick={() => handleFilterChange("screenshots")}
          sx={{
            backgroundColor: fileType === "screenshots" ? "#7CB342" : "transparent",
            color: fileType === "screenshots" ? "#fff" : "#7CB342",
            borderColor: "#7CB342",
            "&:hover": {
              backgroundColor: fileType === "screenshots" ? "#558B2F" : "rgba(124, 179, 66, 0.1)",
            },
          }}
        >
          Screenshots
        </Button>
      </Stack>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <LoadingSpinner size={48} />
        </Box>
      ) : data && data.data.length > 0 ? (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" },
              gap: 2,
              mb: 4,
            }}
          >
            {data.data.map((file: FileshareFile) => (
              <Card
                key={file.id}
                sx={{
                  background: "linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)",
                  border: "1px solid #333",
                  "&:hover": {
                    borderColor: "#7CB342",
                    backgroundColor: "rgba(124, 179, 66, 0.05)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <CardContent sx={{ py: 1, px: 1.5, "&:last-child": { pb: 1 } }}>
                  <Stack spacing={0.5}>
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: file.header.description ? 0.25 : 0 }}>
                        <Box sx={{ flexShrink: 0, width: "100%", maxWidth: 124 }}>
                          <FileshareFiletypeIcon
                            fileShareGame="reach"
                            filetype={file.header.filetype}
                            gameEngineType={file.header.gameEngineType}
                            size={124}
                            shareId={file.header.filetype === 2 ? file.shareId : undefined}
                            fileId={file.header.filetype === 2 ? file.id : undefined}
                            filename={file.header.filetype === 2 ? file.header.filename : undefined}
                            description={file.header.filetype === 2 ? file.header.description : undefined}
                            author={file.header.filetype === 2 ? file.header.author : undefined}
                            mapId={
                              file.header.filetype === 3 || file.header.filetype === 4 ? file.header.mapId : undefined
                            }
                          />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body2" sx={{ color: "#E0E0E0", fontWeight: 600 }}>
                            {file.header.filename || "Untitled"}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{ color: "#B0B0B0", display: "block", minHeight: "2.8em", lineHeight: 1.4 }}
                      >
                        {file.header.description || "\u00A0"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      {file.header.authorXuid && !isGuestXuid(file.header.authorXuid) ? (
                        <Link href={`/halo3/player/${file.header.author}`} style={{ textDecoration: "underline", color: "#4A90E2" }}>
                          <Typography variant="caption" sx={{ color: "inherit" }}>
                            {file.header.author}
                          </Typography>
                        </Link>
                      ) : (
                        <Typography variant="caption" sx={{ color: "#B0B0B0" }}>
                          {file.header.author}
                        </Typography>
                      )}
                      <FileshareDownloadButton fileId={file.id} game="reach" />
                    </Box>
                    <Typography variant="caption" sx={{ color: "#B0B0B0" }}>
                      <DateTimeDisplay date={file.header.date} />
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
          {data.totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={data.totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#B0B0B0",
                    "&.Mui-selected": {
                      backgroundColor: "#7CB342",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#558B2F",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "rgba(124, 179, 66, 0.1)",
                    },
                  },
                }}
              />
            </Box>
          )}
          {data.total > 0 && (
            <Typography variant="body2" sx={{ textAlign: "center", mt: 2, color: "#B0B0B0" }}>
              Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, data.total)} of {data.total} files
            </Typography>
          )}
        </>
      ) : (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
          No files found.
        </Typography>
      )}
    </Container>
  );
}
