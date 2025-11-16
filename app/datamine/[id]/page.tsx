"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DateTimeDisplay } from "@/src/components/DateTimeDisplay";

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

export default function DatamineSessionPage() {
    const router = useRouter();
    const params = useParams();
    const { data: session } = useSession();
    const sessionId = params.id as string;
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
    const [selectedPriorities, setSelectedPriorities] = useState<Set<number>>(new Set());
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Check datamine access - ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
    const { data: accessData, isLoading: accessLoading } = useQuery({
        queryKey: ['datamineAccess', session?.user?.xuid],
        queryFn: () => api.sunrise2.checkDatamineAccess.query(),
        enabled: !!session?.user?.xuid,
    });

    const { data: eventsData, isLoading: eventsLoading } = useQuery({
        queryKey: ['datamineSessionEvents', sessionId, search],
        queryFn: () => api.sunrise2.datamineSessionEvents.query({
            sessionId: sessionId,
            search: search || undefined,
        }),
        enabled: !!sessionId,
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
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);


    // Show loading while checking access - AFTER ALL HOOKS
    if (session?.user?.xuid && accessLoading) {
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
        }, 500);
    };

    // Filter events based on search, selected categories, and selected priorities
    const filteredEvents = (eventsData?.events || []).filter((event: any) => {
        // Search filter (handled by backend)
        // Category filter (client-side)
        if (selectedCategories.size > 0) {
            const hasSelectedCategory = event.categories.some((cat: string) => selectedCategories.has(cat));
            if (!hasSelectedCategory) return false;
        }
        // Priority filter (client-side)
        if (selectedPriorities.size > 0) {
            if (!selectedPriorities.has(event.priority)) return false;
        }
        return true;
    });

    // Extract unique categories from all events (not filtered) so all categories always remain visible
    const availableCategories = (eventsData?.events || []).reduce((acc: Set<string>, event: any) => {
        event.categories.forEach((cat: string) => acc.add(cat));
        return acc;
    }, new Set<string>());

    const categoriesArray = Array.from<string>(availableCategories).sort();

    const handleCategoryToggle = (category: string) => {
        setSelectedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(category)) {
                newSet.delete(category);
            } else {
                newSet.add(category);
            }
            return newSet;
        });
    };

    const handleClearCategories = () => {
        setSelectedCategories(new Set());
    };

    const handlePriorityToggle = (priority: number) => {
        setSelectedPriorities(prev => {
            const newSet = new Set(prev);
            if (newSet.has(priority)) {
                newSet.delete(priority);
            } else {
                newSet.add(priority);
            }
            return newSet;
        });
    };

    const handleClearPriorities = () => {
        setSelectedPriorities(new Set());
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

    return (
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
                        {eventsData?.session ? eventsData.session.sessionid : "Event Logs"}
                        {eventsData && ` (${filteredEvents.length} of ${eventsData.events.length} events)`}
                    </Typography>
                </Box>

                {eventsData?.session && (
                    <Box sx={{ mb: 2, p: 2, backgroundColor: "#ffffff", borderRadius: 1, boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#424242", mb: 1 }}>
                            Session Information
                        </Typography>
                        <Stack spacing={0.5}>
                            <Typography variant="body2" sx={{ fontSize: "0.875rem", color: "#212121" }}>
                                <strong>Session ID:</strong> {eventsData.session.sessionid}
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: "0.875rem", color: "#212121" }}>
                                <strong>Title:</strong> {eventsData.session.title}
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: "0.875rem", color: "#212121" }}>
                                <strong>Build:</strong> {eventsData.session.build_string}
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: "0.875rem", color: "#212121" }}>
                                <strong>System ID:</strong> {eventsData.session.systemid}
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: "0.875rem", color: "#212121" }}>
                                <strong>Start Date:</strong> <DateTimeDisplay date={eventsData.session.session_start_date} />
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
                                    {categoriesArray.map((category) => (
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
                        </Box>
                    </Box>

                    {eventsLoading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : filteredEvents.length === 0 ? (
                        <Typography sx={{ py: 4, textAlign: "center", color: "#757575", fontSize: "0.875rem" }}>
                            {search || selectedCategories.size > 0 || selectedPriorities.size > 0
                                ? "No events match your filters" 
                                : "No events found for this session"}
                        </Typography>
                        ) : (
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                            <TableCell sx={{ py: 1, px: 2, fontWeight: 600, fontSize: "0.875rem", color: "#424242", borderBottom: "2px solid #e0e0e0", width: "40px" }}></TableCell>
                                            <TableCell sx={{ py: 1, px: 2, fontWeight: 600, fontSize: "0.875rem", color: "#424242", borderBottom: "2px solid #e0e0e0" }}>Index</TableCell>
                                            <TableCell sx={{ py: 1, px: 2, fontWeight: 600, fontSize: "0.875rem", color: "#424242", borderBottom: "2px solid #e0e0e0", width: "180px", whiteSpace: "nowrap" }}>Date</TableCell>
                                            <TableCell sx={{ py: 1, px: 2, fontWeight: 600, fontSize: "0.875rem", color: "#424242", borderBottom: "2px solid #e0e0e0" }}>Priority</TableCell>
                                            <TableCell sx={{ py: 1, px: 2, fontWeight: 600, fontSize: "0.875rem", color: "#424242", borderBottom: "2px solid #e0e0e0" }}>Map</TableCell>
                                            <TableCell sx={{ py: 1, px: 2, fontWeight: 600, fontSize: "0.875rem", color: "#424242", borderBottom: "2px solid #e0e0e0" }}>Message</TableCell>
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
                                                            "&:hover": {
                                                                backgroundColor: event.priority >= 4 ? "#ffcdd2" : "#f0f0f0",
                                                            },
                                                        }}
                                                        onClick={() => toggleRowExpansion(event.event_index)}
                                                    >
                                                        <TableCell sx={{ py: 0, px: 2, width: "40px" }}>
                                                            <ExpandMoreIcon 
                                                                sx={{ 
                                                                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                                                    transition: 'transform 0.2s',
                                                                    fontSize: "1.2rem",
                                                                    color: "#757575"
                                                                }} 
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={{ py: 0, px: 2, fontSize: "0.875rem", color: "#212121" }}>{event.event_index}</TableCell>
                                                        <TableCell sx={{ py: 0, px: 2, fontSize: "0.875rem", color: "#212121", width: "180px", whiteSpace: "nowrap" }}>
                                                            <DateTimeDisplay date={event.event_date} />
                                                        </TableCell>
                                                        <TableCell sx={{ py: 0, px: 2, fontSize: "0.875rem", color: "#212121", fontWeight: event.priority >= 3 ? 600 : 400 }}>
                                                            {getPriorityString(event.priority)}
                                                        </TableCell>
                                                        <TableCell sx={{ py: 0, px: 2, fontSize: "0.875rem", color: "#212121", fontFamily: "monospace" }}>
                                                            {event.map ? event.map.split(/[/\\]/).pop() || event.map : ""}
                                                        </TableCell>
                                                        <TableCell sx={{ py: 0, px: 2, fontSize: "0.875rem", color: "#212121" }}>{event.message}</TableCell>
                                                    </TableRow>
                                                    {isExpanded && (
                                                        <TableRow>
                                                            <TableCell colSpan={6} sx={{ py: 1.5, px: 2, backgroundColor: "#ffffff", borderBottom: "1px solid #e0e0e0" }}>
                                                                <Box sx={{ pl: 4 }}>
                                                                    <Box sx={{ mb: 1.5 }}>
                                                                        <Typography variant="body2" sx={{ fontSize: "0.8125rem", color: "#424242", mb: 0.5 }}>
                                                                            <strong>Map:</strong> <span style={{ fontFamily: "monospace" }}>{event.map}</span>
                                                                        </Typography>
                                                                        <Typography variant="body2" sx={{ fontSize: "0.8125rem", color: "#424242", mb: 0.5 }}>
                                                                            <strong>Game Instance:</strong> <span style={{ fontFamily: "monospace" }}>{event.game_instance}</span>
                                                                        </Typography>
                                                                        {event.categories.length > 0 && (
                                                                            <Box sx={{ mt: 1 }}>
                                                                                <Typography variant="body2" sx={{ fontSize: "0.8125rem", color: "#424242", mb: 0.5 }}>
                                                                                    <strong>Categories:</strong>
                                                                                </Typography>
                                                                                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                                                                                    {event.categories.map((category: string) => (
                                                                                        <Chip
                                                                                            key={category}
                                                                                            label={category}
                                                                                            size="small"
                                                                                            sx={{
                                                                                                height: 22,
                                                                                                fontSize: "0.6875rem",
                                                                                                backgroundColor: "#e0e0e0",
                                                                                                color: "#424242",
                                                                                            }}
                                                                                        />
                                                                                    ))}
                                                                                </Box>
                                                                            </Box>
                                                                        )}
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
                </Box>
            </Box>
        </Box>
    );
}

