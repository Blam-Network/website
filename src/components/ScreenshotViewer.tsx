'use client';

import React, { ChangeEvent, useMemo, useState } from "react";
import { Box, Input, Stack, Typography } from "@mui/material";
import { search_for_chunk } from "@blamnetwork/blf";
import {
    s_blf_chunk_content_header,
    s_blf_chunk_screenshot_data,
} from "@blamnetwork/blf/halo3/v12070_08_09_05_2031_halo3_ship";

type ScreenshotData = {
    name: string;
    author: string;
    description: string;
    jpeg_data: Uint8Array;
}

export const Screenshot = ({screenshotData}: {screenshotData: ScreenshotData}) => {
    const screenshotUrl = useMemo(() => {
        // jpeg_data is a Uint8Array, turn it into a Blob
        const jpegBlob = new Blob([screenshotData.jpeg_data], { type: "image/jpeg" });

        // Create an object URL for the blob
        return URL.createObjectURL(jpegBlob);
    }, [screenshotData])

    return (
        <Box>
            <Box>
                <img width="100%" src={screenshotUrl} />
            </Box>
            <Stack>
                <Typography>{screenshotData.name} by {screenshotData.author}</Typography>
                <Typography variant="subtitle1">{screenshotData.description}</Typography>
            </Stack>
        </Box>
    )
}

export const ScreenshotViewer = () => {
    const [screenshotData, setScreenshotData] = useState<ScreenshotData | undefined>()

    const selectScreenshot = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : undefined;
        if (file) {
            const arrayBuffer = await file.arrayBuffer(); // read blob as ArrayBuffer
            const fileData = new Uint8Array(arrayBuffer);
            const chdr = new s_blf_chunk_content_header();
            const scnd = new s_blf_chunk_screenshot_data();
            if (!search_for_chunk(fileData, chdr, "big") || !search_for_chunk(fileData, scnd, "big")) {
                setScreenshotData(undefined);
                return;
            }
            const { name, author, description } = chdr.metadata;
            const screenshot: ScreenshotData = { name, author, description, jpeg_data: scnd.jpeg_data };
            console.log({screenshot})
            setScreenshotData(screenshot);
        }
    }

    return (
        <Box>
            <Input type="file" name="Screenshot" onChange={selectScreenshot} />
            <Box>
            </Box>
            {screenshotData && <Screenshot screenshotData={screenshotData} />}
        </Box>
    )
}