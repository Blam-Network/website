'use client';
import { createTheme } from '@mui/material/styles';

// 2008 Bungie.NET / Halo 3 inspired color palette - Spartan green
const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#7CB342', // Spartan green
            light: '#9CCC65',
            dark: '#558B2F',
            contrastText: '#000',
        },
        secondary: {
            main: '#4A90E2', // Tech blue
            light: '#6BA3E8',
            dark: '#2E5C8A',
            contrastText: '#fff',
        },
        background: {
            default: '#0A0A0A', // Deep black
            paper: '#1A1A1A', // Dark gray for cards
        },
        text: {
            primary: '#E0E0E0',
            secondary: '#B0B0B0',
        },
        divider: '#333333',
        error: {
            main: '#D32F2F',
        },
        warning: {
            main: '#7CB342',
        },
        info: {
            main: '#4A90E2',
        },
        success: {
            main: '#4CAF50',
        },
    },
    typography: {
        fontFamily: '"Segoe UI", "Arial", "Helvetica", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#7CB342',
            textShadow: '0 0 10px rgba(124, 179, 66, 0.5)',
            letterSpacing: '0.05em',
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
            color: '#7CB342',
            letterSpacing: '0.03em',
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
            color: '#9CCC65',
            letterSpacing: '0.02em',
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#9CCC65',
            letterSpacing: '0.02em',
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500,
            color: '#E0E0E0',
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500,
            color: '#E0E0E0',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
            letterSpacing: '0.05em',
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background: 'linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 100%)',
                    minHeight: '100vh',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #333',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '4px',
                    padding: '8px 16px',
                    '&:hover': {
                        boxShadow: '0 0 10px rgba(124, 179, 66, 0.3)',
                    },
                },
                contained: {
                    background: 'linear-gradient(180deg, #7CB342 0%, #558B2F 100%)',
                    '&:hover': {
                        background: 'linear-gradient(180deg, #9CCC65 0%, #7CB342 100%)',
                    },
                },
                outlined: {
                    borderColor: '#7CB342',
                    color: '#7CB342',
                    '&:hover': {
                        borderColor: '#9CCC65',
                        backgroundColor: 'rgba(124, 179, 66, 0.1)',
                    },
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: '#4A90E2',
                    textDecoration: 'none',
                    '&:hover': {
                        color: '#6BA3E8',
                        textDecoration: 'underline',
                    },
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: '#333',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    background: 'linear-gradient(180deg, #1A1A1A 0%, #0F0F0F 100%)',
                    border: '1px solid #333',
                    borderRadius: '4px',
                },
            },
        },
    },
});

export default theme;