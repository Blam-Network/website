import { Box, Container, Typography, Stack, Divider } from "@mui/material";
import Link from "next/link";
import { fixedsysSize, fixedsysStyle } from "@/src/theme/fonts";

const footerLinks = [
    { href: '/', label: 'Home' },
    { href: '/halo3/players', label: 'Players' },
    { href: '/screenshots', label: 'Screenshots' },
    { href: '/files', label: 'Files' },
];

export const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                mt: 'auto',
                borderTop: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'rgba(11, 14, 20, 0.6)',
                py: 4,
            }}
        >
            <Container maxWidth="lg">
                <Stack spacing={3}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        spacing={2}
                    >
                        <Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    ...fixedsysStyle,
                                    fontSize: fixedsysSize(14),
                                    color: 'primary.light',
                                    mb: 0.5,
                                }}
                            >
                                BLAM! network
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                © {new Date().getFullYear()} Unofficial Halo Web Services
                            </Typography>
                        </Box>
                        <Stack direction="row" spacing={3}>
                            {footerLinks.map(({ href, label }) => (
                                <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            transition: 'color 0.15s ease',
                                            '&:hover': {
                                                color: 'primary.light',
                                            },
                                        }}
                                    >
                                        {label}
                                    </Typography>
                                </Link>
                            ))}
                        </Stack>
                    </Stack>
                    <Divider />
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ textAlign: 'center', opacity: 0.7 }}
                    >
                        This is an unofficial fan project and is not affiliated with Microsoft, Halo Studios, or Bungie.
                    </Typography>
                </Stack>
            </Container>
        </Box>
    );
};
