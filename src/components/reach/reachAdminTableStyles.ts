import type { SxProps, Theme } from "@mui/material/styles";

export const reachAdminTableHeadCellSx: SxProps<Theme> = {
  fontWeight: 700,
  fontSize: "0.75rem",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "text.secondary",
  bgcolor: "action.hover",
  borderBottomColor: "divider",
  py: 1.25,
  px: 2,
  whiteSpace: "nowrap",
};

export const reachAdminTableCellSx: SxProps<Theme> = {
  borderBottomColor: "divider",
  py: 1.5,
  px: 2,
  verticalAlign: "middle",
};

export const reachAdminTableRowLinkSx: SxProps<Theme> = {
  textDecoration: "none",
  cursor: "pointer",
  transition: "background-color 0.15s ease",
  "&:hover": {
    bgcolor: "action.selected",
  },
  "&:last-child td": {
    borderBottom: 0,
  },
};

export const reachAdminFileshareTableContainerSx: SxProps<Theme> = {
  borderRadius: 1,
  overflow: "hidden",
  bgcolor: "background.paper",
  border: "1px solid",
  borderColor: "divider",
};

export const reachAdminFileshareTableSx: SxProps<Theme> = {
  tableLayout: "fixed",
  width: "100%",
  "& .MuiTableCell-root": {
    borderBottomColor: "divider",
  },
  "& .MuiTableRow-root:last-child .MuiTableCell-root": {
    borderBottom: 0,
  },
};
