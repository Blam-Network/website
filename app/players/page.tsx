"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/src/trpc/client";
import { ServiceRecordListItem } from "@/src/components/ServiceRecordListItem";
import { Stack, Box, Typography, Container, TextField, Button, Paper, Pagination } from "@mui/material";
import Link from "next/link";
import { ServiceRecord } from "@/src/api/sunrise/serviceRecord";

export default function PlayersPage() {
  const router = useRouter();
  const [query, setQuery] = useState<Record<string, string>>({});
  const page = parseInt(query.page || "1", 10);
  const search = query.search || "";
  const [searchInput, setSearchInput] = useState(search);
  const pageSize = 20;
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Read query params from URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const queryObj: Record<string, string> = {};
      params.forEach((value, key) => {
        queryObj[key] = value;
      });
      setQuery(queryObj);
      setSearchInput(queryObj.search || "");
    }
  }, []);

  // Listen for popstate events (back/forward button)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const queryObj: Record<string, string> = {};
      params.forEach((value, key) => {
        queryObj[key] = value;
      });
      setQuery(queryObj);
      setSearchInput(queryObj.search || "");
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['serviceRecords', page, pageSize, search],
    queryFn: () => api.sunrise.serviceRecords.query({
      page,
      pageSize,
      search: search || undefined,
    }),
  });

  const updateURL = (newPage: number, newSearch: string) => {
    const newQuery = { ...query };
    if (newPage > 1) {
      newQuery.page = String(newPage);
    } else {
      delete newQuery.page;
    }
    if (newSearch) {
      newQuery.search = newSearch;
    } else {
      delete newQuery.search;
    }
    setQuery(newQuery);
    
    const params = new URLSearchParams();
    Object.entries(newQuery).forEach(([key, value]) => {
      params.set(key, value);
    });
    const queryString = params.toString();
    const newUrl = `/players${queryString ? `?${queryString}` : ""}`;
    
    router.push(newUrl);
  };

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
    
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Debounce the URL update
    debounceTimerRef.current = setTimeout(() => {
      updateURL(1, value);
    }, 500);
  };

  const handleSearch = () => {
    // Clear any pending debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    updateURL(1, searchInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // Clear any pending debounce
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      updateURL(1, searchInput);
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    updateURL(value, search);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1, borderBottom: "2px solid #7CB342" }}>
        <Typography variant="h4">
          Players
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            label="Search by name"
            variant="outlined"
            value={searchInput}
            onChange={(e) => handleSearchInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            size="small"
            sx={{
              width: 250,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#7CB342",
                },
                "&:hover fieldset": {
                  borderColor: "#9CCC65",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#7CB342",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#7CB342",
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            size="small"
            sx={{
              backgroundColor: "#7CB342",
              "&:hover": {
                backgroundColor: "#558B2F",
              },
            }}
          >
            Search
          </Button>
          {search && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setSearchInput("");
                updateURL(1, "");
              }}
              sx={{
                borderColor: "#7CB342",
                color: "#7CB342",
                "&:hover": {
                  borderColor: "#9CCC65",
                  backgroundColor: "rgba(124, 179, 66, 0.1)",
                },
              }}
            >
              Clear
            </Button>
          )}
        </Box>
      </Box>

      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : data && data.players.length > 0 ? (
        <>
          <Typography variant="body2" sx={{ mb: 2, color: "#B0B0B0" }}>
            Showing {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, data.total)} of {data.total} players
          </Typography>
          <Stack spacing={2}>
            {data.players.map((serviceRecord: ServiceRecord) => (
              <Link
                key={serviceRecord.id}
                href={"/player/" + serviceRecord.playerName}
                style={{
                  textDecoration: "none",
                  color: "unset",
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 0 10px rgba(124, 179, 66, 0.2)",
                      borderColor: "#7CB342",
                    },
                    border: "1px solid transparent",
                  }}
                >
                  <ServiceRecordListItem serviceRecord={serviceRecord} />
                </Paper>
              </Link>
            ))}
          </Stack>
          {data.totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={data.totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#E0E0E0",
                    "&.Mui-selected": {
                      backgroundColor: "#7CB342",
                      color: "#000",
                      "&:hover": {
                        backgroundColor: "#9CCC65",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "rgba(124, 179, 66, 0.2)",
                    },
                  },
                }}
              />
            </Box>
          )}
        </>
      ) : (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" sx={{ color: "#B0B0B0" }}>
            {search ? "No players found matching your search." : "No players found."}
          </Typography>
        </Paper>
      )}
    </Container>
  );
}
