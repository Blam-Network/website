'use client';
import { createTheme } from '@mui/material/styles';

// Light, retro debugging tool theme for datamine pages
export const datamineTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
            contrastText: '#fff',
        },
        background: {
            default: '#fafafa',
            paper: '#ffffff',
        },
        text: {
            primary: '#212121',
            secondary: '#757575',
        },
        divider: '#e0e0e0',
        error: {
            main: '#d32f2f',
        },
        warning: {
            main: '#ed6c02',
        },
        info: {
            main: '#0288d1',
        },
        success: {
            main: '#2e7d32',
        },
    },
    typography: {
        fontFamily: 'monospace',
        fontSize: 14,
        h5: {
            fontWeight: 500,
            color: '#212121',
        },
        subtitle1: {
            fontWeight: 500,
            color: '#212121',
        },
        subtitle2: {
            fontWeight: 600,
            color: '#424242',
        },
        body1: {
            fontSize: '0.875rem',
            color: '#212121',
        },
        body2: {
            fontSize: '0.875rem',
            color: '#212121',
        },
        caption: {
            fontSize: '0.75rem',
            color: '#757575',
            fontWeight: 600,
        },
    },
    components: {
        MuiTable: {
            styleOverrides: {
                root: {
                    fontFamily: 'monospace',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    color: '#212121',
                    borderBottom: '1px solid #e0e0e0',
                    padding: '0 16px',
                },
                head: {
                    fontWeight: 600,
                    color: '#424242',
                    backgroundColor: '#f5f5f5',
                    borderBottom: '2px solid #e0e0e0',
                    padding: '8px 16px',
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    fontFamily: 'monospace',
                    backgroundColor: '#fafafa',
                    '&:hover': {
                        backgroundColor: '#f0f0f0',
                    },
                    '&.Mui-selected': {
                        backgroundColor: '#e3f2fd',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        fontSize: '0.875rem',
                        backgroundColor: '#ffffff',
                        fontFamily: 'monospace',
                        '& fieldset': {
                            borderColor: '#bdbdbd',
                        },
                        '&:hover fieldset': {
                            borderColor: '#9e9e9e',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#1976d2',
                        },
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    height: 24,
                    cursor: 'pointer',
                    '&:hover': {
                        opacity: 0.8,
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontFamily: 'monospace',
                },
                text: {
                    color: '#1976d2',
                    '&:hover': {
                        backgroundColor: '#e3f2fd',
                    },
                },
            },
        },
        MuiPagination: {
            styleOverrides: {
                root: {
                    fontFamily: 'monospace',
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    fontFamily: 'monospace',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    borderRadius: '4px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                },
            },
        },
        MuiAutocomplete: {
            styleOverrides: {
                root: {
                    fontFamily: 'monospace',
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    fontFamily: 'monospace',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                },
            },
        },
    },
});

