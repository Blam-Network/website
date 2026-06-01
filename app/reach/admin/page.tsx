"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Box, Container, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";

const ADMIN_LINKS = [
    {
        href: "/reach/lobbies",
        label: "Live Lobbies",
        description: "Players online grouped by session from LSP presence",
    },
    { href: "/datamine", label: "View the Datamine", description: "Browse datamine sessions and event logs" },
    {
        href: "/reach/admin/fileshare/blamnetwork",
        label: "Blam Network file share",
        description: "Upload files to the Blam Network system file share",
    },
    {
        href: "/reach/admin/fileshare/bungie",
        label: "Bungie file share",
        description: "Upload files to the Bungie favourites system file share",
    },
] as const;

export default function ReachAdminPage() {
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "loading") return;
        if (!session?.user?.is_admin) {
            router.push("/");
        }
    }, [session, status, router]);

    if (status === "loading" || !session?.user?.is_admin) {
        return (
            <Box sx={{ width: "100%", minHeight: "50vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <LoadingSpinner size={96} />
            </Box>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 1, color: "#E0E0E0" }}>
                Reach Admin
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: "#B0B0B0" }}>
                Tools and pages for Halo: Reach administrators.
            </Typography>
            <List
                sx={{
                    bgcolor: "#1A1A1A",
                    border: "1px solid #333",
                    borderRadius: 1,
                }}
            >
                {ADMIN_LINKS.map((link) => (
                    <ListItem key={link.href} disablePadding divider sx={{ borderColor: "#333" }}>
                        <ListItemButton component={Link} href={link.href}>
                            <ListItemText
                                primary={link.label}
                                secondary={link.description}
                                primaryTypographyProps={{ color: "#E0E0E0" }}
                                secondaryTypographyProps={{ color: "#888" }}
                            />
                            <ChevronRightIcon sx={{ color: "#7CB342" }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
}
