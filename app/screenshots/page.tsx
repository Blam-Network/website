"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/src/trpc/client";
import { Box, Typography, Container, Pagination, CircularProgress, TextField, Button, Stack } from "@mui/material";
import { ScreenshotCard } from "@/src/components/ScreenshotCard";
import { useState, useEffect } from "react";
import { Screenshot } from "@/src/api/sunrise/screenshots";
import { env } from "@/src/env";

export default function ScreenshotsPage() {
  const router = useRouter();
  const [query, setQuery] = useState<Record<string, string>>({});
  const page = parseInt(query.page || "1", 10);
  const gamertag = query.gamertag || "";
  const [gamertagInput, setGamertagInput] = useState(gamertag);
  const pageSize = 48;

  // Read query params from URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const queryObj: Record<string, string> = {};
      params.forEach((value, key) => {
        queryObj[key] = value;
      });
      setQuery(queryObj);
      setGamertagInput(queryObj.gamertag || "");
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
      setGamertagInput(queryObj.gamertag || "");
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['screenshots', page, pageSize, gamertag],
    queryFn: () => api.sunrise.screenshots.query({
      page,
      pageSize,
      gamertag: gamertag || undefined,
    }),
  });

  const updateURL = (newPage: number, newGamertag: string) => {
    const newQuery = { ...query };
    if (newPage > 1) {
      newQuery.page = String(newPage);
    } else {
      delete newQuery.page;
    }
    if (newGamertag) {
      newQuery.gamertag = newGamertag;
    } else {
      delete newQuery.gamertag;
    }
    setQuery(newQuery);
    
    const params = new URLSearchParams();
    Object.entries(newQuery).forEach(([key, value]) => {
      params.set(key, value);
    });
    const queryString = params.toString();
    const newUrl = `/screenshots${queryString ? `?${queryString}` : ""}`;
    
    router.push(newUrl);
  };

  const handleSearch = () => {
    updateURL(1, gamertagInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    updateURL(value, gamertag);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, pb: 1, borderBottom: "2px solid #7CB342" }}>
        Screenshots
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress sx={{ color: '#7CB342' }} />
        </Box>
      ) : data && data.data.length > 0 ? (
        <>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2, width: '100%', mb: 4 }}>
            {data.data.map((screenshot: Screenshot) => (
              <ScreenshotCard
                key={screenshot.id}
                screenshotId={screenshot.id}
                  screenshotUrl={`${env.NEXT_PUBLIC_HALO3_API_BASE_URL}/halo3/screenshots/${screenshot.id}/view`}
                filename={screenshot.header.filename}
                description={screenshot.header.description || ""}
                author={screenshot.author || undefined}
                date={screenshot.date}
              />
            ))}
          </Box>
          {data.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={data.totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: '#B0B0B0',
                    '&.Mui-selected': {
                      backgroundColor: '#7CB342',
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: '#558B2F',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(124, 179, 66, 0.1)',
                    },
                  },
                }}
              />
            </Box>
          )}
          {data.total > 0 && (
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 2, color: '#B0B0B0' }}>
              Showing {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, data.total)} of {data.total} screenshots
            </Typography>
          )}
        </>
      ) : (
        <Typography variant='body1' color='text.secondary' sx={{ textAlign: 'center', py: 4 }}>
          No screenshots found.
        </Typography>
      )}
    </Container>
  );
}
