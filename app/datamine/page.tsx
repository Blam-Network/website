"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { api } from "@/src/trpc/client";
import {
    Box,
    Typography,
    Button,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Autocomplete,
    TextField,
    Stack,
    IconButton,
    Popover,
    Badge,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { DateTimeDisplay } from "@/src/components/DateTimeDisplay";
import type { DatamineSession } from "@/src/api/sunrise/datamine";

export default function DataminePage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const pageSize = 50;

    // Initialize state from URL params - ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
    const [page, setPage] = useState(() => {
        const pageParam = searchParams.get('page');
        return pageParam ? parseInt(pageParam, 10) : 1;
    });
    const [buildStringFilter, setBuildStringFilter] = useState(() => searchParams.get('buildString') || "");
    const [systemIdFilter, setSystemIdFilter] = useState(() => searchParams.get('systemId') || "");
    const [buildStringInput, setBuildStringInput] = useState(() => searchParams.get('buildString') || "");
    const [systemIdInput, setSystemIdInput] = useState(() => searchParams.get('systemId') || "");
    const systemIdDebounceRef = useRef<NodeJS.Timeout | null>(null);
    const [buildStringAnchorEl, setBuildStringAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [systemIdAnchorEl, setSystemIdAnchorEl] = useState<HTMLButtonElement | null>(null);

    // Check datamine access
    const { data: accessData, isLoading: accessLoading } = useQuery({
        queryKey: ['datamineAccess', session?.user?.xuid],
        queryFn: () => api.sunrise2.checkDatamineAccess.query(),
        enabled: !!session?.user?.xuid,
    });

    const { data: filterOptions } = useQuery({
        queryKey: ['datamineFilterOptions'],
        queryFn: () => api.sunrise2.datamineFilterOptions.query(),
    });

    const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
        queryKey: ['datamineSessions', page, pageSize, buildStringFilter, systemIdFilter],
        queryFn: () => api.sunrise2.datamineSessions.query({
            page,
            pageSize,
            buildString: buildStringFilter || undefined,
            systemId: systemIdFilter || undefined,
        }),
    });

    useEffect(() => {
        // Redirect if not logged in or if access check completes and user doesn't have access
        if (session === null) {
            router.push('/');
        } else if (!accessLoading && session?.user?.xuid && accessData && !accessData.hasAccess) {
            router.push('/');
        }
    }, [accessLoading, accessData, session, router]);

    useEffect(() => {
        return () => {
            if (systemIdDebounceRef.current) {
                clearTimeout(systemIdDebounceRef.current);
            }
        };
    }, []);

    // Sync state with URL params when navigating (back/forward)
    useEffect(() => {
        const pageParam = searchParams.get('page');
        const buildStringParam = searchParams.get('buildString') || "";
        const systemIdParam = searchParams.get('systemId') || "";
        
        const newPage = pageParam ? parseInt(pageParam, 10) : 1;
        if (newPage !== page) {
            setPage(newPage);
        }
        if (buildStringParam !== buildStringFilter) {
            setBuildStringFilter(buildStringParam);
            setBuildStringInput(buildStringParam);
        }
        if (systemIdParam !== systemIdFilter) {
            setSystemIdFilter(systemIdParam);
            setSystemIdInput(systemIdParam);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    // Show loading while checking access - AFTER ALL HOOKS
    if (session?.user?.xuid && accessLoading) {
        return (
            <Box sx={{ width: "100%", backgroundColor: "#fafafa", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress />
            </Box>
        );
    }

    // Update URL with current filters and page
    const updateURL = (newPage: number, newBuildString: string, newSystemId: string) => {
        const params = new URLSearchParams();
        if (newPage > 1) {
            params.set('page', String(newPage));
        }
        if (newBuildString) {
            params.set('buildString', newBuildString);
        }
        if (newSystemId) {
            params.set('systemId', newSystemId);
        }
        
        const queryString = params.toString();
        const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
        router.push(newUrl, { scroll: false });
    };

    const handleBuildStringChange = (value: string | null) => {
        const newValue = value || "";
        setBuildStringInput(newValue);
        setBuildStringFilter(newValue);
        setPage(1); // Reset to first page when filter changes
        updateURL(1, newValue, systemIdFilter);
    };

    const handleSystemIdInputChange = (value: string) => {
        setSystemIdInput(value);
        
        if (systemIdDebounceRef.current) {
            clearTimeout(systemIdDebounceRef.current);
        }
        
        systemIdDebounceRef.current = setTimeout(() => {
            setSystemIdFilter(value);
            setPage(1); // Reset to first page when filter changes
            updateURL(1, buildStringFilter, value);
        }, 500);
    };

    const handleClearFilters = () => {
        setBuildStringInput("");
        setBuildStringFilter("");
        setSystemIdInput("");
        setSystemIdFilter("");
        setPage(1);
        updateURL(1, "", "");
    };

    const handleBuildStringFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setBuildStringAnchorEl(event.currentTarget);
    };

    const handleSystemIdFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setSystemIdAnchorEl(event.currentTarget);
    };

    const handleBuildStringFilterClose = () => {
        setBuildStringAnchorEl(null);
    };

    const handleSystemIdFilterClose = () => {
        setSystemIdAnchorEl(null);
    };

    const buildStringFilterOpen = Boolean(buildStringAnchorEl);
    const systemIdFilterOpen = Boolean(systemIdAnchorEl);

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        updateURL(value, buildStringFilter, systemIdFilter);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


    return (
        <Box sx={{ width: "100%", backgroundColor: "#fafafa", minHeight: "100vh", py: 2 }}>
            <Box sx={{ maxWidth: "100%", mx: "auto", px: 2 }}>
                <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {(buildStringFilter || systemIdFilter) && (
                        <Button
                            size="small"
                            onClick={handleClearFilters}
                            sx={{
                                textTransform: "none",
                                color: "#1976d2",
                                "&:hover": {
                                    backgroundColor: "#e3f2fd",
                                },
                            }}
                        >
                            Clear Filters
                        </Button>
                    )}
                </Box>

                {/* Sessions Table */}
                <Box sx={{ backgroundColor: "#ffffff", borderRadius: 1, boxShadow: "0 1px 3px rgba(0,0,0,0.12)", overflow: "hidden" }}>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                    <TableCell sx={{ py: 1, px: 2, fontWeight: 600, fontSize: "0.875rem", color: "#424242", borderBottom: "2px solid #e0e0e0" }}>Start Date</TableCell>
                                    <TableCell sx={{ py: 1, px: 2, fontWeight: 600, fontSize: "0.875rem", color: "#424242", borderBottom: "2px solid #e0e0e0" }}>Session ID</TableCell>
                                    <TableCell sx={{ py: 1, px: 2, fontWeight: 600, fontSize: "0.875rem", color: "#424242", borderBottom: "2px solid #e0e0e0" }}>Title</TableCell>
                                    <TableCell sx={{ py: 1, px: 2, fontWeight: 600, fontSize: "0.875rem", color: "#424242", borderBottom: "2px solid #e0e0e0" }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                            Build
                                            <Badge color="primary" variant="dot" invisible={!buildStringFilter}>
                                                <IconButton
                                                    size="small"
                                                    onClick={handleBuildStringFilterClick}
                                                    sx={{ 
                                                        padding: 0.25,
                                                        color: buildStringFilter ? "#1976d2" : "#757575",
                                                        "&:hover": {
                                                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                                                            color: "#1976d2",
                                                        },
                                                    }}
                                                >
                                                    <FilterListIcon sx={{ fontSize: "1.125rem" }} />
                                                </IconButton>
                                            </Badge>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ py: 1, px: 2, fontWeight: 600, fontSize: "0.875rem", color: "#424242", borderBottom: "2px solid #e0e0e0" }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                            System ID
                                            <Badge color="primary" variant="dot" invisible={!systemIdFilter}>
                                                <IconButton
                                                    size="small"
                                                    onClick={handleSystemIdFilterClick}
                                                    sx={{ 
                                                        padding: 0.25,
                                                        color: systemIdFilter ? "#1976d2" : "#757575",
                                                        "&:hover": {
                                                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                                                            color: "#1976d2",
                                                        },
                                                    }}
                                                >
                                                    <FilterListIcon sx={{ fontSize: "1.125rem" }} />
                                                </IconButton>
                                            </Badge>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ py: 1, px: 2, fontWeight: 600, fontSize: "0.875rem", color: "#424242", borderBottom: "2px solid #e0e0e0" }}>Events</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sessionsLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                            <CircularProgress size={24} />
                                        </TableCell>
                                    </TableRow>
                                ) : sessionsData?.sessions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 4, color: "#757575" }}>
                                            No sessions found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    sessionsData?.sessions.map((session: DatamineSession) => (
                                        <TableRow
                                            key={session.id}
                                            hover
                                            sx={{
                                                backgroundColor: '#ffffff',
                                                cursor: 'pointer',
                                                borderBottom: "1px solid #f0f0f0",
                                                "&:hover": {
                                                    backgroundColor: '#f5f5f5',
                                                },
                                            }}
                                            onClick={() => router.push(`/datamine/${session.id}`)}
                                        >
                                            <TableCell sx={{ py: 1, px: 2, fontSize: "0.875rem", color: "#212121" }}>
                                                <DateTimeDisplay date={session.session_start_date} />
                                            </TableCell>
                                            <TableCell sx={{ py: 1, px: 2, fontSize: "0.875rem", color: "#212121" }}>{session.sessionid}</TableCell>
                                            <TableCell sx={{ py: 1, px: 2, fontSize: "0.875rem", color: "#212121" }}>{session.title}</TableCell>
                                            <TableCell sx={{ py: 1, px: 2, fontSize: "0.875rem", color: "#212121", fontFamily: "monospace" }}>{session.build_string}</TableCell>
                                            <TableCell sx={{ py: 1, px: 2, fontSize: "0.875rem", color: "#212121", fontFamily: "monospace" }}>{session.systemid}</TableCell>
                                            <TableCell sx={{ py: 1, px: 2, fontSize: "0.875rem", color: "#212121" }}>{session._count.events}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {sessionsData && sessionsData.totalPages > 1 && (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 2, borderTop: "1px solid #e0e0e0" }}>
                            <Pagination
                                count={sessionsData.totalPages}
                                page={page}
                                onChange={handlePageChange}
                                size="small"
                                color="primary"
                            />
                        </Box>
                    )}
                </Box>

                {/* Build String Filter Popover */}
                <Popover
                    open={buildStringFilterOpen}
                    anchorEl={buildStringAnchorEl}
                    onClose={handleBuildStringFilterClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <Box sx={{ p: 2, minWidth: 300 }}>
                        <Autocomplete
                            freeSolo
                            options={filterOptions?.buildStrings || []}
                            value={buildStringInput}
                            onChange={(_, newValue) => handleBuildStringChange(typeof newValue === 'string' ? newValue : newValue || null)}
                            onInputChange={(_, newInputValue) => handleBuildStringChange(newInputValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Build String"
                                    variant="outlined"
                                    size="small"
                                    autoFocus
                                />
                            )}
                        />
                    </Box>
                </Popover>

                {/* System ID Filter Popover */}
                <Popover
                    open={systemIdFilterOpen}
                    anchorEl={systemIdAnchorEl}
                    onClose={handleSystemIdFilterClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <Box sx={{ p: 2, minWidth: 300 }}>
                        <TextField
                            label="System ID"
                            variant="outlined"
                            value={systemIdInput}
                            onChange={(e) => handleSystemIdInputChange(e.target.value)}
                            size="small"
                            fullWidth
                            autoFocus
                        />
                    </Box>
                </Popover>
            </Box>
        </Box>
    );
}

