'use client';

import React, { ChangeEvent, useMemo, useState } from "react";
import { Box, Button, Input, Typography } from "@mui/material";
import { search_for_chunk, write_blffile } from "@blamnetwork/blf";
import {
    e_game_engine,
    s_blf_chunk_content_header,
    s_blf_chunk_end_of_file,
    s_blf_chunk_game_variant,
    s_blf_chunk_map_variant,
    s_blf_chunk_saved_film_header,
    s_blf_chunk_start_of_file,
    type s_content_item_metadata,
} from "@blamnetwork/blf/halo3/v12070_08_09_05_2031_halo3_ship";

type FilmVariants = {
    film_name: string;
    map_name: string;
    map_author: string;
    map_variant: Uint8Array;
    game_name: string;
    game_author: string;
    game_engine: e_game_engine;
    game_variant: Uint8Array;
}

// _blf, chdr, variant chunk, _eof: the file the console saves a variant as.
const writeVariantFile = (metadata: s_content_item_metadata, variantChunk: s_blf_chunk_map_variant | s_blf_chunk_game_variant) => {
    const chdr = new s_blf_chunk_content_header();
    chdr.build_number = 12070;
    chdr.metadata = metadata;
    return write_blffile("big", [new s_blf_chunk_start_of_file(), chdr, variantChunk, new s_blf_chunk_end_of_file()]);
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
            case e_game_engine.ctf: return 'ctf.variant';
            case e_game_engine.slayer: return 'slayer.variant';
            case e_game_engine.oddball: return 'oddball.variant';
            case e_game_engine.king: return 'koth.variant';
            case e_game_engine.sandbox: return 'sandbox.variant';
            case e_game_engine.vip: return 'vip.variant';
            case e_game_engine.juggernaut: return 'jugg.variant';
            case e_game_engine.territories: return 'terries.variant';
            case e_game_engine.assault: return 'assault.variant';
            case e_game_engine.infection: return 'zombiez.variant';
        }
        return undefined;
    }, [filmVariants])

    const selectFilm = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : undefined;
        if (file) {
            const arrayBuffer = await file.arrayBuffer(); // read blob as ArrayBuffer
            const fileData = new Uint8Array(arrayBuffer);
            const chdr = new s_blf_chunk_content_header();
            const flmh = new s_blf_chunk_saved_film_header();
            if (!search_for_chunk(fileData, chdr, "big") || !search_for_chunk(fileData, flmh, "big")) {
                setFilmVariants(undefined);
                return;
            }
            const { map_variant, multiplayer_variant } = flmh.options;
            const mpvr = new s_blf_chunk_game_variant();
            mpvr.game_variant = multiplayer_variant;
            const variants: FilmVariants = {
                film_name: chdr.metadata.name,
                map_name: map_variant.m_metadata.name,
                map_author: map_variant.m_metadata.author,
                map_variant: writeVariantFile(map_variant.m_metadata, s_blf_chunk_map_variant.create(map_variant)),
                game_name: multiplayer_variant.m_base_variant.m_metadata.name,
                game_author: multiplayer_variant.m_base_variant.m_metadata.author,
                game_engine: multiplayer_variant.m_game_engine,
                game_variant: writeVariantFile(multiplayer_variant.m_base_variant.m_metadata, mpvr),
            };
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
                        <a href={gameUrl} download={gameFileName} target='_blank'>
                            <Button>Save Game Variant</Button>
                        </a>
                    </Box>
                    <Box>
                    <Typography>{filmVariants.map_name} by {filmVariants.map_author}</Typography>
                        <a href={mapUrl} download="sandbox.map" target='_blank'>
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