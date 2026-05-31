import { Typography, Box, BoxProps } from "@mui/material";
import Link from "next/link";

interface SectionHeaderProps {
    title: string;
    href?: string;
    linkLabel?: string;
    sx?: BoxProps['sx'];
    children?: React.ReactNode;
}

export function SectionHeader({ title, href, linkLabel = 'View All →', sx, children }: SectionHeaderProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2.5,
                pb: 1.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
                position: 'relative',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -1,
                    left: 0,
                    width: 48,
                    height: 2,
                    backgroundColor: 'primary.main',
                    borderRadius: 0,
                },
                ...sx,
            }}
        >
            <Typography variant="h4">{title}</Typography>
            {children}
            {href && (
                <Link href={href} style={{ textDecoration: 'none' }}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'secondary.main',
                            fontWeight: 600,
                            '&:hover': { color: 'secondary.light' },
                            transition: 'color 0.15s ease',
                        }}
                    >
                        {linkLabel}
                    </Typography>
                </Link>
            )}
        </Box>
    );
}
