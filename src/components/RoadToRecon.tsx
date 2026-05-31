"use client";

import { Stack, Box, Alert, AlertTitle, Button, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from "../trpc/client";
import { useToast } from "@/src/contexts/ToastContext";

export const RoadToRecon = ({ profileGamertag }: { profileGamertag?: string }) => {
    const { data: session } = useSession();
    const loggedIn = !!session?.user?.xuid;
    const isOwnProfile = loggedIn && session?.user?.gamertag === profileGamertag;
    const queryClient = useQueryClient();

    const { data: vidmasters } = useQuery({
        queryKey: ['cheevos'],
        queryFn: () => api.xbox.getVidmasters.query(),
        enabled: loggedIn && isOwnProfile,
    });

    const { data: serviceRecord } = useQuery({
        queryKey: ['serviceRecord', profileGamertag],
        queryFn: () => api.sunrise.serviceRecord.query({ gamertag: profileGamertag! }),
        enabled: loggedIn && isOwnProfile && !!profileGamertag,
    });

    const { showSuccess, showError } = useToast();

    const unlockMutation = useMutation({
        mutationFn: () => api.sunrise2.unlockRecon.mutate(),
        onSuccess: () => {
            queryClient.setQueryData(['serviceRecord', profileGamertag], (prev: typeof serviceRecord) =>
                prev ? { ...prev, roadToReconCompleted: true } : prev,
            );
            void queryClient.invalidateQueries({ queryKey: ['serviceRecord', profileGamertag] });
            showSuccess(
                "Your Recon armor will be available next time you play Halo 3 on your Xbox 360.",
                "Recon unlocked",
            );
        },
        onError: (err: unknown) => {
            const message = err instanceof Error && err.message ? err.message : "Failed to unlock Recon";
            showError(message, "Unlock failed");
        },
    });

    if (!loggedIn || !isOwnProfile) return null;

    const vidmastersUnlocked =
        vidmasters?.annual &&
        vidmasters?.brainpan &&
        vidmasters?.lightswitch &&
        vidmasters?.sevenOnSeven &&
        vidmasters?.classic &&
        vidmasters?.endure &&
        vidmasters?.dejaVu;
    const reconCompleted = serviceRecord?.roadToReconCompleted ?? false;

    const vidmasterItems = [
        { key: 'annual' as const, src: '/img/vidmasters/annual.png', label: 'Annual' },
        { key: 'brainpan' as const, src: '/img/vidmasters/brainpan.png', label: 'Brainpan' },
        { key: 'lightswitch' as const, src: '/img/vidmasters/lightswitch.png', label: 'Lightswitch' },
        { key: 'sevenOnSeven' as const, src: '/img/vidmasters/7on7.png', label: '7 on 7' },
        { key: 'classic' as const, src: '/img/vidmasters/classic.png', label: 'Classic' },
        { key: 'endure' as const, src: '/img/vidmasters/endure.png', label: 'Endure' },
        { key: 'dejaVu' as const, src: '/img/vidmasters/deja_vu.png', label: 'Déjà Vu' },
    ];

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                mt: 2,
            }}
        >
            {vidmastersUnlocked && !reconCompleted ? (
                <Alert severity="success">
                    <AlertTitle>Recon Available</AlertTitle>
                    <Stack direction="column" gap={1}>
                        You&apos;ve unlocked all of the Vidmaster achievements! <br />
                        Click the button below to unlock your Recon armor.
                        <Button
                            size="small"
                            disabled={unlockMutation.isPending}
                            variant="contained"
                            color="success"
                            onClick={() => unlockMutation.mutate()}
                        >
                            Unlock Recon
                        </Button>
                    </Stack>
                </Alert>
            ) : (
                <Stack direction="column" gap={2} alignItems="center">
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                        }}
                    >
                        Road to Recon
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#B0B0B0',
                            textAlign: 'center',
                            mb: 2,
                        }}
                    >
                        {reconCompleted
                            ? "You've completed the Road to Recon. Your Recon armor will be available next time you play Halo 3 on your Xbox 360."
                            : "Unlock the 7 Vidmaster Achievements to earn the Recon armor set!"}
                    </Typography>
                    <Stack direction="row" gap={3} justifyContent="center" flexWrap="wrap">
                        {vidmasterItems.map(({ key, src, label }) => {
                            const unlocked = !!vidmasters?.[key];
                            return (
                                <Stack key={key} direction="column" alignItems="center" gap={1}>
                                    <Box
                                        sx={{
                                            transform: !unlocked ? 'rotate(-15deg)' : 'none',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: !unlocked ? 'rotate(0deg)' : 'none',
                                                '& img': {
                                                    filter: !unlocked ? 'saturate(0.3)' : 'none',
                                                },
                                            },
                                        }}
                                    >
                                        <img
                                            src={src}
                                            width={64}
                                            height={64}
                                            alt={label}
                                            style={
                                                !unlocked
                                                    ? { filter: 'saturate(0)', transition: 'filter 0.3s ease' }
                                                    : {
                                                          filter: 'drop-shadow(0 0 8px rgba(124, 179, 66, 0.6))',
                                                          transition: 'filter 0.3s ease',
                                                      }
                                            }
                                        />
                                    </Box>
                                    <Typography variant="body2">{label}</Typography>
                                </Stack>
                            );
                        })}
                    </Stack>
                </Stack>
            )}
        </Box>
    );
};
