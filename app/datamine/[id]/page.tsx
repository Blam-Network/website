"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { api } from "@/src/trpc/client";
import {
    Stack,
    Box,
    Typography,
    TextField,
    Chip,
    CircularProgress,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Pagination,
    ThemeProvider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DownloadIcon from "@mui/icons-material/Download";
import { DateTimeDisplay } from "@/src/components/DateTimeDisplay";
import { datamineTheme } from "@/src/theme/datamineTheme";

const PRIORITY_MAP: Record<number, string> = {
    0: "verbose",
    1: "status",
    2: "message",
    3: "WARNING",
    4: "-ERROR-",
    5: "-CRITICAL-",
};

const getPriorityString = (priority: number): string => {
    return PRIORITY_MAP[priority] || `Unknown (${priority})`;
};

const formatEventDateTime = (date: Date | string): string => {
    const dateObj = date instanceof Date ? date : new Date(date);
    // Format as MM.DD.YY HH:mm:ss.SSS
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = String(dateObj.getFullYear()).slice(-2);
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');
    const milliseconds = String(dateObj.getMilliseconds()).padStart(3, '0');
    return `${month}.${day}.${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;
};

const formatEventIndex = (index: number): string => {
    return String(index).padStart(7, '0');
};

export default function DatamineSessionPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const { data: authSession } = useSession();
    const sessionId = params.id as string;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    
    // Initialize filters from URL params
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(() => {
        const cats = searchParams.get('categories');
        return cats ? new Set(cats.split(',')) : new Set();
    });
    const [selectedPriorities, setSelectedPriorities] = useState<Set<number>>(() => {
        const prios = searchParams.get('priorities');
        return prios ? new Set(prios.split(',').map(p => parseInt(p, 10)).filter(p => !isNaN(p))) : new Set();
    });
    const [selectedMaps, setSelectedMaps] = useState<Set<string>>(() => {
        const maps = searchParams.get('maps');
        return maps ? new Set(maps.split(',')) : new Set();
    });
    
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Check datamine access - ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
    const { data: accessData, isLoading: accessLoading } = useQuery({
        queryKey: ['datamineAccess', authSession?.user?.xuid],
        queryFn: () => api.sunrise2.checkDatamineAccess.query(),
        enabled: !!authSession?.user?.xuid,
    });

    const { data: eventsData, isLoading: eventsLoading } = useQuery({
        queryKey: [
            'datamineSessionEvents', 
            sessionId, 
            search, 
            page, 
            Array.from(selectedCategories).sort().join(','), 
            Array.from(selectedPriorities).sort().join(','), 
            Array.from(selectedMaps).sort().join(',')
        ],
        queryFn: () => api.sunrise2.datamineSessionEvents.query({
            sessionId: sessionId,
            search: search || undefined,
            categories: selectedCategories.size > 0 ? Array.from(selectedCategories) : undefined,
            priorities: selectedPriorities.size > 0 ? Array.from(selectedPriorities) : undefined,
            maps: selectedMaps.size > 0 ? Array.from(selectedMaps) : undefined,
            page: page,
        }),
        enabled: !!sessionId,
    });

    const { data: filterOptionsData } = useQuery({
        queryKey: ['datamineSessionFilterOptions', sessionId],
        queryFn: () => api.sunrise2.datamineSessionFilterOptions.query({
            sessionId: sessionId,
        }),
        enabled: !!sessionId,
    });

    const allEvents = eventsData?.events || [];
    const datamineSession = eventsData?.session;

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(value));
        router.push(`/datamine/${sessionId}?${params.toString()}`);
    };

    useEffect(() => {
        // Redirect if not logged in or if access check completes and user doesn't have access
        if (authSession === null) {
            router.push('/');
        } else if (!accessLoading && authSession?.user?.xuid && accessData && !accessData.hasAccess) {
            router.push('/');
        }
    }, [accessLoading, accessData, authSession, router]);

    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    // Sync filters from URL params when navigating (back/forward)
    useEffect(() => {
        const pageParam = searchParams.get('page');
        const newPage = pageParam ? parseInt(pageParam, 10) : 1;
        if (newPage !== page) {
            // Page is managed separately, but we'll let handlePageChange handle it
        }
        
        // Sync filters from URL
        const cats = searchParams.get('categories');
        const newCategories = cats ? new Set<string>(cats.split(',')) : new Set<string>();
        if (JSON.stringify(Array.from(newCategories).sort()) !== JSON.stringify(Array.from(selectedCategories).sort())) {
            setSelectedCategories(newCategories);
        }
        
        const prios = searchParams.get('priorities');
        const priorityNumbers = prios ? prios.split(',').map(p => parseInt(p, 10)).filter(p => !isNaN(p)) : [];
        const newPriorities = new Set<number>(priorityNumbers);
        if (JSON.stringify(Array.from(newPriorities).sort()) !== JSON.stringify(Array.from(selectedPriorities).sort())) {
            setSelectedPriorities(newPriorities);
        }
        
        const maps = searchParams.get('maps');
        const newMaps = maps ? new Set<string>(maps.split(',')) : new Set<string>();
        if (JSON.stringify(Array.from(newMaps).sort()) !== JSON.stringify(Array.from(selectedMaps).sort())) {
            setSelectedMaps(newMaps);
        }
        
        // Sync search
        const searchParam = searchParams.get('search') || "";
        if (searchParam !== search) {
            setSearch(searchParam);
            setSearchInput(searchParam);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);


    // Show loading while checking access - AFTER ALL HOOKS
    if (authSession?.user?.xuid && accessLoading) {
        return (
            <Box sx={{ width: "100%", backgroundColor: "#fafafa", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress />
            </Box>
        );
    }

    const handleSearchInputChange = (value: string) => {
        setSearchInput(value);
        
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        
        debounceTimerRef.current = setTimeout(() => {
            setSearch(value);
            // Reset to page 1 when search changes
            const params = new URLSearchParams(searchParams.toString());
            params.set('page', '1');
            router.push(`/datamine/${sessionId}?${params.toString()}`);
        }, 500);
    };

    // Filters are now handled by the backend, so we just use allEvents directly
    const filteredEvents = allEvents;

    // Use filter options from backend (all pages) instead of extracting from current page
    const categoriesArray = filterOptionsData?.categories || [];
    const mapsArray = filterOptionsData?.maps || [];

    // Helper function to update URL with filters and reset to page 1
    const updateFiltersInURL = (newCategories: Set<string>, newPriorities: Set<number>, newMaps: Set<string>) => {
        const params = new URLSearchParams();
        
        // Preserve search if it exists
        if (search) {
            params.set('search', search);
        }
        
        // Add filters to URL
        if (newCategories.size > 0) {
            params.set('categories', Array.from(newCategories).join(','));
        }
        if (newPriorities.size > 0) {
            params.set('priorities', Array.from(newPriorities).map(p => String(p)).join(','));
        }
        if (newMaps.size > 0) {
            params.set('maps', Array.from(newMaps).join(','));
        }
        
        // Always reset to page 1 when filters change (page 1 is default, so don't include it)
        
        router.push(`/datamine/${sessionId}?${params.toString()}`, { scroll: false });
    };

    const handleCategoryToggle = (category: string) => {
        setSelectedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(category)) {
                newSet.delete(category);
            } else {
                newSet.add(category);
            }
            updateFiltersInURL(newSet, selectedPriorities, selectedMaps);
            return newSet;
        });
    };

    const handleClearCategories = () => {
        const newSet = new Set<string>();
        setSelectedCategories(newSet);
        updateFiltersInURL(newSet, selectedPriorities, selectedMaps);
    };

    const handlePriorityToggle = (priority: number) => {
        setSelectedPriorities(prev => {
            const newSet = new Set(prev);
            if (newSet.has(priority)) {
                newSet.delete(priority);
            } else {
                newSet.add(priority);
            }
            updateFiltersInURL(selectedCategories, newSet, selectedMaps);
            return newSet;
        });
    };

    const handleClearPriorities = () => {
        const newSet = new Set<number>();
        setSelectedPriorities(newSet);
        updateFiltersInURL(selectedCategories, newSet, selectedMaps);
    };

    const handleMapToggle = (map: string) => {
        setSelectedMaps(prev => {
            const newSet = new Set(prev);
            if (newSet.has(map)) {
                newSet.delete(map);
            } else {
                newSet.add(map);
            }
            updateFiltersInURL(selectedCategories, selectedPriorities, newSet);
            return newSet;
        });
    };

    const handleClearMaps = () => {
        const newSet = new Set<string>();
        setSelectedMaps(newSet);
        updateFiltersInURL(selectedCategories, selectedPriorities, newSet);
    };

    const toggleRowExpansion = (eventIndex: number) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(eventIndex)) {
                newSet.delete(eventIndex);
            } else {
                newSet.add(eventIndex);
            }
            return newSet;
        });
    };

    const handleDownloadLog = async () => {
        if (!datamineSession) return;

        try {
            // Download via the Next.js API route which proxies to the backend
            const response = await fetch(`/api/datamine/${sessionId}/download`);

            if (!response.ok) {
                throw new Error('Failed to download log file');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${datamineSession.sessionid}_datamine.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download log:', error);
        }
    };

    return (
        <ThemeProvider theme={datamineTheme}>
            <Box sx={{ width: "100%", backgroundColor: "#fafafa", minHeight: "100vh", py: 2 }}>
                <Box sx={{ maxWidth: "100%", mx: "auto", px: 2 }}>
                <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => router.push('/datamine')}
                        sx={{ textTransform: "none" }}
                    >
                        Back to Sessions
                    </Button>
                    <Typography variant="h5" sx={{ fontWeight: 500, color: "#212121" }}>
                        {datamineSession ? datamineSession.sessionid : "Event Logs"}
                        {eventsData && ` (${filteredEvents.length} of ${eventsData.total} events)`}
                    </Typography>
                </Box>

                {datamineSession && (
                    <Box sx={{ mb: 2, p: 2, backgroundColor: "#ffffff", borderRadius: 1, boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#424242" }}>
                                Session Information
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<DownloadIcon />}
                                onClick={handleDownloadLog}
                                sx={{
                                    textTransform: "none",
                                    fontSize: "0.875rem",
                                }}
                            >
                                Download Log
                            </Button>
                        </Box>
                        <Stack spacing={0.5}>
                            <Typography variant="body2" sx={{ fontSize: "0.875rem", color: "#212121" }}>
                                <strong>Session ID:</strong> {datamineSession.sessionid}
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: "0.875rem", color: "#212121" }}>
                                <strong>Title:</strong> {datamineSession.title}
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: "0.875rem", color: "#212121" }}>
                                <strong>Build:</strong> {datamineSession.build_string}
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: "0.875rem", color: "#212121" }}>
                                <strong>System ID:</strong> {datamineSession.systemid}
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: "0.875rem", color: "#212121" }}>
                                <strong>Start Date:</strong> <DateTimeDisplay date={datamineSession.session_start_date} />
                            </Typography>
                        </Stack>
                    </Box>
                )}

                <Box sx={{ backgroundColor: "#ffffff", borderRadius: 1, boxShadow: "0 1px 3px rgba(0,0,0,0.12)", overflow: "hidden" }}>
                    <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0", backgroundColor: "#fafafa" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 500, color: "#212121" }}>
                                Events
                            </Typography>
                            <TextField
                                placeholder="Search logs..."
                                variant="outlined"
                                value={searchInput}
                                onChange={(e) => handleSearchInputChange(e.target.value)}
                                size="small"
                                sx={{
                                    width: 280,
                                    "& .MuiOutlinedInput-root": {
                                        fontSize: "0.875rem",
                                        backgroundColor: "#ffffff",
                                        "& fieldset": {
                                            borderColor: "#bdbdbd",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#9e9e9e",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#1976d2",
                                        },
                                    },
                                }}
                            />
                        </Box>
                        <Accordion defaultExpanded={true} sx={{ boxShadow: "none", "&:before": { display: "none" }, border: "1px solid #e0e0e0", borderRadius: 1 }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{
                                    minHeight: 40,
                                    "&.Mui-expanded": {
                                        minHeight: 40,
                                    },
                                    "& .MuiAccordionSummary-content": {
                                        margin: "8px 0",
                                        "&.Mui-expanded": {
                                            margin: "8px 0",
                                        },
                                    },
                                }}
                            >
                                <Typography variant="caption" sx={{ fontWeight: 600, color: "#757575", fontSize: "0.75rem" }}>
                                    Filters
                                    {(selectedPriorities.size > 0 || selectedCategories.size > 0 || selectedMaps.size > 0) && (
                                        <span style={{ marginLeft: 8, color: "#1976d2" }}>
                                            ({selectedPriorities.size + selectedCategories.size + selectedMaps.size} active)
                                        </span>
                                    )}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ pt: 0, pb: 2 }}>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    {/* Priority/Log Level Filter */}
                                    <Box>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                            <Typography variant="caption" sx={{ fontWeight: 600, color: "#757575", fontSize: "0.75rem" }}>
                                                Filter by Log Level:
                                            </Typography>
                                            {selectedPriorities.size > 0 && (
                                                <Button
                                                    size="small"
                                                    onClick={handleClearPriorities}
                                                    sx={{
                                                        fontSize: "0.75rem",
                                                        textTransform: "none",
                                                        minWidth: "auto",
                                                        px: 1,
                                                        py: 0.25,
                                                        color: "#1976d2",
                                                        "&:hover": {
                                                            backgroundColor: "#e3f2fd",
                                                        },
                                                    }}
                                                >
                                                    Clear ({selectedPriorities.size})
                                                </Button>
                                            )}
                                        </Box>
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                            {Object.entries(PRIORITY_MAP).map(([priority, label]) => (
                                                <Chip
                                                    key={priority}
                                                    label={label}
                                                    size="small"
                                                    onClick={() => handlePriorityToggle(parseInt(priority))}
                                                    sx={{
                                                        height: 24,
                                                        fontSize: "0.75rem",
                                                        cursor: "pointer",
                                                        backgroundColor: selectedPriorities.has(parseInt(priority)) ? "#1976d2" : "#e0e0e0",
                                                        color: selectedPriorities.has(parseInt(priority)) ? "#ffffff" : "#424242",
                                                        "&:hover": {
                                                            backgroundColor: selectedPriorities.has(parseInt(priority)) ? "#1565c0" : "#d0d0d0",
                                                        },
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>

                                    {/* Category Filter */}
                                    {categoriesArray.length > 0 && (
                                        <Box>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                                <Typography variant="caption" sx={{ fontWeight: 600, color: "#757575", fontSize: "0.75rem" }}>
                                                    Filter by Category:
                                                </Typography>
                                            {selectedCategories.size > 0 && (
                                                <Button
                                                    size="small"
                                                    onClick={handleClearCategories}
                                                    sx={{
                                                        fontSize: "0.75rem",
                                                        textTransform: "none",
                                                        minWidth: "auto",
                                                        px: 1,
                                                        py: 0.25,
                                                        color: "#1976d2",
                                                        "&:hover": {
                                                            backgroundColor: "#e3f2fd",
                                                        },
                                                    }}
                                                >
                                                    Clear ({selectedCategories.size})
                                                </Button>
                                            )}
                                        </Box>
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                            {categoriesArray.map((category: string) => (
                                                <Chip
                                                    key={category}
                                                    label={category}
                                                    size="small"
                                                    onClick={() => handleCategoryToggle(category)}
                                                    sx={{
                                                        height: 24,
                                                        fontSize: "0.75rem",
                                                        cursor: "pointer",
                                                        backgroundColor: selectedCategories.has(category) ? "#1976d2" : "#e0e0e0",
                                                        color: selectedCategories.has(category) ? "#ffffff" : "#424242",
                                                        "&:hover": {
                                                            backgroundColor: selectedCategories.has(category) ? "#1565c0" : "#d0d0d0",
                                                        },
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                    )}

                                    {/* Map Filter */}
                                    {mapsArray.length > 0 && (
                                        <Box>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                                <Typography variant="caption" sx={{ fontWeight: 600, color: "#757575", fontSize: "0.75rem" }}>
                                                    Filter by Map:
                                                </Typography>
                                            {selectedMaps.size > 0 && (
                                                <Button
                                                    size="small"
                                                    onClick={handleClearMaps}
                                                    sx={{
                                                        fontSize: "0.75rem",
                                                        textTransform: "none",
                                                        minWidth: "auto",
                                                        px: 1,
                                                        py: 0.25,
                                                        color: "#1976d2",
                                                        "&:hover": {
                                                            backgroundColor: "#e3f2fd",
                                                        },
                                                    }}
                                                >
                                                    Clear ({selectedMaps.size})
                                                </Button>
                                            )}
                                        </Box>
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                            {mapsArray.map((map: string) => (
                                                <Chip
                                                    key={map}
                                                    label={map}
                                                    size="small"
                                                    onClick={() => handleMapToggle(map)}
                                                    sx={{
                                                        height: 24,
                                                        fontSize: "0.75rem",
                                                        cursor: "pointer",
                                                        backgroundColor: selectedMaps.has(map) ? "#1976d2" : "#e0e0e0",
                                                        color: selectedMaps.has(map) ? "#ffffff" : "#424242",
                                                        "&:hover": {
                                                            backgroundColor: selectedMaps.has(map) ? "#1565c0" : "#d0d0d0",
                                                        },
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                    )}
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    </Box>

                    {/* Pagination above table */}
                    {eventsData && eventsData.totalPages > 1 && (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 2, borderBottom: "1px solid #e0e0e0" }}>
                            <Pagination
                                count={eventsData.totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                size="medium"
                                showFirstButton
                                showLastButton
                            />
                        </Box>
                    )}

                    {eventsLoading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : filteredEvents.length === 0 ? (
                        <Typography sx={{ py: 4, textAlign: "center", color: "#757575", fontSize: "0.875rem" }}>
                            {search || selectedCategories.size > 0 || selectedPriorities.size > 0 || selectedMaps.size > 0
                                ? "No events match your filters" 
                                : "No events found for this session"}
                        </Typography>
                        ) : (
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                            <TableCell sx={{ py: 1, px: 2, fontWeight: 600, fontSize: "0.875rem", color: "#424242", borderBottom: "2px solid #e0e0e0", width: "180px", whiteSpace: "nowrap", fontFamily: "monospace" }}>Date</TableCell>
                                            <TableCell sx={{ py: 1, px: 2, fontWeight: 600, fontSize: "0.875rem", color: "#424242", borderBottom: "2px solid #e0e0e0", fontFamily: "monospace" }}>Index</TableCell>
                                            <TableCell sx={{ py: 1, px: 2, fontWeight: 600, fontSize: "0.875rem", color: "#424242", borderBottom: "2px solid #e0e0e0", fontFamily: "monospace", whiteSpace: "nowrap" }}>Priority</TableCell>
                                            <TableCell sx={{ py: 1, px: 2, fontWeight: 600, fontSize: "0.875rem", color: "#424242", borderBottom: "2px solid #e0e0e0", fontFamily: "monospace" }}>Message</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredEvents.map((event: any) => {
                                            const isExpanded = expandedRows.has(event.event_index);
                                            return (
                                                <>
                                                    <TableRow 
                                                        key={`${event.event_index}-${sessionId}`}
                                                        hover
                                                        sx={{
                                                            backgroundColor: event.priority >= 4 ? "#ffebee" : "#fafafa",
                                                            borderBottom: "1px solid #e0e0e0",
                                                            cursor: "pointer",
                                                            fontFamily: "monospace",
                                                            "&:hover": {
                                                                backgroundColor: event.priority >= 4 ? "#ffcdd2" : "#f0f0f0",
                                                            },
                                                        }}
                                                        onClick={() => toggleRowExpansion(event.event_index)}
                                                    >
                                                        <TableCell sx={{ py: 0, px: 2, fontSize: "0.875rem", color: "#212121", width: "180px", whiteSpace: "nowrap", fontFamily: "monospace" }}>
                                                            {formatEventDateTime(event.event_date)}
                                                        </TableCell>
                                                        <TableCell sx={{ py: 0, px: 2, fontSize: "0.875rem", color: "#212121", fontFamily: "monospace" }}>{formatEventIndex(event.event_index)}</TableCell>
                                                        <TableCell sx={{ py: 0, px: 2, fontSize: "0.875rem", color: "#212121", fontWeight: event.priority >= 3 ? 600 : 400, fontFamily: "monospace", whiteSpace: "nowrap" }}>
                                                            {getPriorityString(event.priority)}
                                                        </TableCell>
                                                        <TableCell sx={{ py: 0, px: 2, fontSize: "0.875rem", color: "#212121", fontFamily: "monospace" }}>{event.message}</TableCell>
                                                    </TableRow>
                                                    {isExpanded && (
                                                        <TableRow>
                                                            <TableCell colSpan={4} sx={{ py: 1.5, px: 2, backgroundColor: "#ffffff", borderBottom: "1px solid #e0e0e0" }}>
                                                                <Box sx={{ pl: 4 }}>
                                                                    <Box sx={{ mb: 1.5 }}>
                                                                        <Typography variant="body2" sx={{ fontSize: "0.8125rem", color: "#424242", mb: 0.5 }}>
                                                                            <strong>Map:</strong> <span style={{ fontFamily: "monospace" }}>{event.map}</span>
                                                                        </Typography>
                                                                        <Typography variant="body2" sx={{ fontSize: "0.8125rem", color: "#424242", mb: 0.5 }}>
                                                                            <strong>Game Instance:</strong> <span style={{ fontFamily: "monospace" }}>{event.game_instance}</span>
                                                                        </Typography>
                                                                    </Box>
                                                                    {event.parameters.length > 0 && (
                                                                        <>
                                                                            <Typography variant="caption" sx={{ fontWeight: 600, color: "#757575", textTransform: "uppercase", letterSpacing: 0.5, fontSize: "0.75rem", mb: 1, display: "block" }}>
                                                                                Parameters ({event.parameters.length})
                                                                            </Typography>
                                                                            <Box sx={{ backgroundColor: "#ffffff", borderRadius: 1, overflow: "hidden", border: "1px solid #e0e0e0" }}>
                                                                                <TableContainer>
                                                                                    <Table size="small">
                                                                                        <TableHead>
                                                                                            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                                                                                <TableCell sx={{ py: 1, px: 2, fontWeight: 600, fontSize: "0.75rem", color: "#424242", borderBottom: "1px solid #e0e0e0" }}>Key</TableCell>
                                                                                                <TableCell sx={{ py: 1, px: 2, fontWeight: 600, fontSize: "0.75rem", color: "#424242", borderBottom: "1px solid #e0e0e0" }}>Value</TableCell>
                                                                                            </TableRow>
                                                                                        </TableHead>
                                                                                        <TableBody>
                                                                                            {event.parameters.map((param: any) => (
                                                                                                <TableRow key={param.id} hover sx={{ "&:hover": { backgroundColor: "#fafafa" } }}>
                                                                                                    <TableCell sx={{ py: 1, px: 2, fontSize: "0.8125rem", color: "#212121" }}>{param.key}</TableCell>
                                                                                                    <TableCell sx={{ py: 1, px: 2, fontSize: "0.8125rem", fontFamily: "monospace", color: "#212121" }}>{param.string_value}</TableCell>
                                                                                                </TableRow>
                                                                                            ))}
                                                                                        </TableBody>
                                                                                    </Table>
                                                                                </TableContainer>
                                                                            </Box>
                                                                        </>
                                                                    )}
                                                                </Box>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                    )}
                    {/* Pagination */}
                    {eventsData && eventsData.totalPages > 1 && (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 3, borderTop: "1px solid #e0e0e0" }}>
                            <Pagination
                                count={eventsData.totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                size="medium"
                                showFirstButton
                                showLastButton
                            />
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
        </ThemeProvider>
    );
}

