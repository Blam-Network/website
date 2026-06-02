"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { SectionHeader } from "@/src/components/SectionHeader";
import {
  reachAdminTableCellSx,
  reachAdminTableHeadCellSx,
  reachAdminTableRowLinkSx,
} from "@/src/components/reach/reachAdminTableStyles";

const ADMIN_LINKS = [
  {
    href: "/reach/lobbies",
    label: "Live Lobbies",
    description: "Players online grouped by session from LSP presence",
  },
  {
    href: "/datamine",
    label: "Datamine",
    description: "Browse datamine sessions and event logs",
  },
  {
    href: "/admin/fileshare/blamnetwork",
    label: "Blam Network file share",
    description: "Upload and manage the Blam Network system file share",
  },
  {
    href: "/admin/fileshare/bungie",
    label: "Bungie file share",
    description: "Upload and manage the Bungie favourites system file share",
  },
] as const;

export default function AdminPage() {
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
      <Box
        sx={{
          width: "100%",
          minHeight: "50vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LoadingSpinner size={96} />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 4 } }}>
      <SectionHeader title="Admin" />
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, mt: -1 }}>
        Tools and pages for site administrators.
      </Typography>

      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={reachAdminTableHeadCellSx}>Tool</TableCell>
              <TableCell sx={reachAdminTableHeadCellSx}>Description</TableCell>
              <TableCell sx={{ ...reachAdminTableHeadCellSx, width: 48, px: 0.5 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {ADMIN_LINKS.map((link) => (
              <TableRow
                key={link.href}
                hover
                component={Link}
                href={link.href}
                sx={reachAdminTableRowLinkSx}
              >
                <TableCell sx={reachAdminTableCellSx}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                    {link.label}
                  </Typography>
                </TableCell>
                <TableCell sx={{ ...reachAdminTableCellSx, color: "text.secondary" }}>
                  {link.description}
                </TableCell>
                <TableCell sx={{ ...reachAdminTableCellSx, px: 0.5, textAlign: "center" }}>
                  <ChevronRightIcon fontSize="small" sx={{ color: "primary.main" }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
