'use client';

import React, { ChangeEvent, useMemo, useState } from "react";
import { Box, Input, Stack, Typography } from "@mui/material";
import initBlfWasm, {get_screenshot_data, ScreenshotData} from "blf_wasm/blf_wasm.js"

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
            await initBlfWasm();
            const screenshot = get_screenshot_data(fileData);
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