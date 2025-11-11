"use client";

import { Typography, Box, Stack } from "@mui/material";
import Image from "next/image";
import { api } from "../trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export const FileshareDownloadButton = ({ fileId }: { fileId: string }) => {
    const [success, setSuccess] = useState(false);
    
    const mutation = useMutation({
        mutationFn: () => api.sunrise2.createFileshareTransfer.mutate({ fileId }),
        onSuccess: () => {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        },
    });

    if (success) {
        return <Typography variant='body2' color='success.main'>Transfer created!</Typography>;
    }

    return (
        <Stack 
            direction="row" 
            alignItems="center" 
            spacing={1}
            sx={{ 
                cursor: 'pointer',
                '&:hover .download-text': { color: 'primary.main' }
            }}
            onClick={() => {
                mutation.mutate();
            }}
        >
            <Typography 
                variant='body2' 
                className="download-text"
                sx={{ 
                    textDecoration: 'underline',
                }}
            >
                {mutation.isPending ? 'Creating transfer...' : 'Download to Halo 3'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Image 
                    src="/img/download_icon.png" 
                    alt="Download" 
                    width={16} 
                    height={16}
                />
            </Box>
        </Stack>
    );
};

