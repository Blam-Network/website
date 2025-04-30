'use client';

import React, { ChangeEvent, useMemo, useState } from "react";
import { Box, Button, Input, Stack, Typography } from "@mui/material";
import initBlfWasm, {FilmVariants, get_film_variants, get_screenshot_data, ScreenshotData} from "blf_wasm/blf_wasm.js"

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

export const FilmUnpacker = () => {
    const [filmVariants, setFilmVariants] = useState<FilmVariants | undefined>()

    const [gameUrl, mapUrl] = useMemo(() => {
        if (!filmVariants) return [];
        return [
            URL.createObjectURL(new Blob([filmVariants.game_variant])),
            URL.createObjectURL(new Blob([filmVariants.map_variant]))
        ]
    }, [filmVariants])

    const gameFileName = useMemo(() => {
        switch(filmVariants?.game_engine) {
            case 1: return 'ctf.variant';
            case 2: return 'slayer.variant';
            case 3: return 'oddball.variant';
            case 4: return 'koth.variant';
            case 5: return 'jugg.variant';
            case 6: return 'terries.variant';
            case 7: return 'assault.variant';
            case 8: return 'zombiez.variant';
            case 9: return 'vip.variant';
        }
        return undefined;
    }, [filmVariants])

    const selectFilm = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : undefined;
        if (file) {
            const arrayBuffer = await file.arrayBuffer(); // read blob as ArrayBuffer
            const fileData = new Uint8Array(arrayBuffer);
            await initBlfWasm();
            const variants = get_film_variants(fileData);
            console.log({variants})
            setFilmVariants(variants);
        }
    }

    return (
        <Box>
            <Input type="file" name="Screenshot" onChange={selectFilm} />
            {filmVariants && (
                <Box>
                    <Typography>Selected Film: {filmVariants.film_name}</Typography>
                    <br />
                    <Box>
                    <Typography>{filmVariants.game_name} by {filmVariants.game_author}</Typography>
                        <a href={gameUrl} download="sandbox.map" target='_blank'>
                            <Button>Save Game Variant</Button>
                        </a>
                    </Box>
                    <Box>
                    <Typography>{filmVariants.map_name} by {filmVariants.map_author}</Typography>
                        <a href={mapUrl} download={gameFileName} target='_blank'>
                            <Button>Save Map Variant</Button>
                        </a>
                    </Box>
                    <Typography>
                        The output files must be injected into an Xbox 360 console package in order to be loaded by the console, this can be done using Horizon.
                    </Typography>
                </Box>
            )}
        </Box>
    )
}