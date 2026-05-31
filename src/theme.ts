'use client';
import { createTheme, alpha } from '@mui/material/styles';
import { FIXEDSYS_FAMILY, FIXEDSYS_SCALE, fixedsysStyle, BARLOW_FAMILY } from '@/src/theme/fonts';

const fs = (px: number) => `${px * FIXEDSYS_SCALE}px`;
const headingBase = {
    ...fixedsysStyle,
    lineHeight: 1.35,
};

const green = {
    main: '#7CB342',
    light: '#A5D65C',
    dark: '#558B2F',
};

const blue = {
    main: '#5B9FD4',
    light: '#7BB8E8',
    dark: '#3D7AB0',
};

const surfaces = {
    base: '#0B0E14',
    raised: '#12161F',
    elevated: '#1A2030',
    overlay: '#222A3A',
};

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: green.main,
            light: green.light,
            dark: green.dark,
            contrastText: '#0B0E14',
        },
        secondary: {
            main: blue.main,
            light: blue.light,
            dark: blue.dark,
            contrastText: '#fff',
        },
        background: {
            default: surfaces.base,
            paper: surfaces.elevated,
        },
        text: {
            primary: '#E8EDF4',
            secondary: '#8B9BB4',
        },
        divider: alpha('#FFFFFF', 0.08),
        error: {
            main: '#EF5350',
        },
        warning: {
            main: '#FFB74D',
        },
        info: {
            main: blue.main,
        },
        success: {
            main: green.main,
        },
    },
    shape: {
        borderRadius: 0,
    },
    typography: {
        fontFamily: BARLOW_FAMILY,
        h1: {
            ...headingBase,
            fontSize: fs(32),
            color: green.light,
            lineHeight: 1.3,
        },
        h2: {
            ...headingBase,
            fontSize: fs(24),
            color: green.light,
        },
        h3: {
            ...headingBase,
            fontSize: fs(20),
            color: green.light,
        },
        h4: {
            ...headingBase,
            fontSize: fs(18),
            color: '#E8EDF4',
        },
        h5: {
            ...headingBase,
            fontSize: fs(16),
            color: '#E8EDF4',
        },
        h6: {
            ...headingBase,
            fontSize: fs(15),
            color: '#8B9BB4',
        },
        body1: {
            fontSize: '0.9375rem',
            lineHeight: 1.65,
        },
        body2: {
            fontSize: '0.8125rem',
            lineHeight: 1.55,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
            letterSpacing: '0.02em',
        },
        caption: {
            letterSpacing: '0.01em',
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: surfaces.base,
                    backgroundImage: `
                        radial-gradient(ellipse 80% 50% at 50% -20%, ${alpha(green.main, 0.08)} 0%, transparent 60%),
                        radial-gradient(ellipse 60% 40% at 100% 100%, ${alpha(blue.main, 0.05)} 0%, transparent 50%),
                        linear-gradient(180deg, ${surfaces.base} 0%, #0E1219 100%)
                    `,
                    minHeight: '100vh',
                },
                '::selection': {
                    backgroundColor: alpha(green.main, 0.35),
                    color: '#fff',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: surfaces.elevated,
                    border: `1px solid ${alpha('#FFFFFF', 0.12)}`,
                    boxShadow: 'none',
                    borderRadius: 0,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    background: surfaces.elevated,
                    border: `1px solid ${alpha('#FFFFFF', 0.12)}`,
                    borderRadius: 0,
                    boxShadow: 'none',
                    transition: 'border-color 0.15s ease',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    padding: '7px 18px',
                    transition: 'all 0.15s ease',
                },
                contained: {
                    background: green.main,
                    boxShadow: 'none',
                    '&:hover': {
                        background: green.light,
                        boxShadow: 'none',
                    },
                },
                outlined: {
                    borderWidth: 1,
                    borderColor: alpha(green.main, 0.6),
                    color: green.light,
                    '&:hover': {
                        borderColor: green.light,
                        backgroundColor: alpha(green.main, 0.08),
                    },
                },
                text: {
                    color: '#8B9BB4',
                    '&:hover': {
                        color: green.light,
                        backgroundColor: alpha(green.main, 0.06),
                    },
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: blue.main,
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                    '&:hover': {
                        color: blue.light,
                        textDecoration: 'underline',
                    },
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: alpha('#FFFFFF', 0.08),
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontFamily: FIXEDSYS_FAMILY,
                    fontWeight: 400,
                    WebkitFontSmoothing: 'none',
                    MozOsxFontSmoothing: 'unset',
                    color: green.light,
                    fontSize: fs(14),
                    letterSpacing: 0,
                    textTransform: 'lowercase',
                    borderBottom: `2px solid ${alpha(green.main, 0.4)}`,
                    backgroundColor: surfaces.raised,
                },
                body: {
                    borderBottom: `1px solid ${alpha('#FFFFFF', 0.05)}`,
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    transition: 'background-color 0.15s ease',
                    '&:hover': {
                        backgroundColor: alpha(green.main, 0.06),
                    },
                },
            },
        },
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    overflow: 'hidden',
                    border: `1px solid ${alpha('#FFFFFF', 0.12)}`,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                    borderRadius: 0,
                },
                filled: {
                    backgroundColor: alpha(green.main, 0.15),
                    color: green.light,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        transition: 'border-color 0.15s ease',
                        '& fieldset': {
                            borderColor: alpha('#FFFFFF', 0.12),
                        },
                        '&:hover fieldset': {
                            borderColor: alpha(green.main, 0.5),
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: green.main,
                            borderWidth: 1,
                        },
                    },
                },
            },
        },
        MuiPagination: {
            styleOverrides: {
                root: {
                    '& .MuiPaginationItem-root': {
                        borderRadius: 0,
                        color: '#8B9BB4',
                        borderColor: alpha('#FFFFFF', 0.12),
                        '&.Mui-selected': {
                            backgroundColor: alpha(green.main, 0.15),
                            color: green.light,
                            borderColor: green.main,
                        },
                        '&:hover': {
                            backgroundColor: alpha(green.main, 0.08),
                        },
                    },
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: surfaces.overlay,
                    border: `1px solid ${alpha('#FFFFFF', 0.12)}`,
                    borderRadius: 0,
                    fontSize: '0.75rem',
                },
            },
        },
    },
});

export default theme;
