'use client';

import { Stack, Box, Typography } from "@mui/material";
import { getColor, getColorName, getCssColor } from "../colors";
import { useEffect, useRef } from "react";


export type Emblem = {
    armourPrimaryColor?: number;
    primary: number;
    secondary: boolean;
    background: number;
    primaryColor: number;
    secondaryColor: number;
    backgroundColor: number;
}

const getColoredLayer = (layer: 'PRIMARY' | 'SECONDARY' | 'BACKGROUND', image: HTMLImageElement, colorIndex: number, size: number) => {
    const canvas = new OffscreenCanvas(size, size);
    const ctx = canvas.getContext('2d');
    const color = getColor(getColorName(colorIndex));

    const layerIndex = layer === 'PRIMARY' ? 2 : layer === 'SECONDARY' ? 1 : 0;

    if (!ctx) {
        throw new Error('Could not get 2d context');
    }
    
    ctx.drawImage(image, 0, 0, size, size);
    const imageData = ctx.getImageData(0, 0, size, size);
    const data = imageData.data;
    for(var p = 0, len = data.length; p < len; p+=4) {
        if (layerIndex == 1) {
            if (data[p + 0] > 0) {
                data[p + 3] = (data[p + 0] / 15) * 255; // max is 15... scale up to 255
                data[p + 0] = color.r;
                data[p + 1] = color.g;
                data[p + 2] = color.b;
                continue
            }
        }
        else if (layerIndex == 2) {
            if (data[p + 1] > 0) {
                data[p + 3] = (data[p + 1] / 240) * 255; // max is 15... scale up to 255
                data[p + 0] = color.r;
                data[p + 1] = color.g;
                data[p + 2] = color.b;
                continue
            }
        }
        if (layerIndex == 0) {
            if (data[p + 2] > 0) {
                data[p + 3] = (data[p + 2] / 15) * 255; // max is 15... scale up to 255
                data[p + 0] = color.r;
                data[p + 1] = color.g;
                data[p + 2] = color.b;
                continue
            }
        }
        data[p + 3] = 0;
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas;
}

const drawEmblem = async (canvas: HTMLCanvasElement, emblem: Emblem, size: number) => {
    

    const [primaryImage, backgroundImage] = await Promise.all([
        new Promise<HTMLImageElement>((resolve) => {
            const image = new Image(size, size);

            image.src = `/img/emblems/emblems [${emblem.primary}].png`;

            image.onload = () => {
                resolve(image);
            };
        }),
        new Promise<HTMLImageElement>((resolve) => {

            const image = new Image(size, size);

            image.src = `/img/emblems/emblems [${emblem.background}].png`;

            image.onload = () => {
                resolve(image);
            };
        }),
    ]);

    const coloredPrimary = getColoredLayer('PRIMARY', primaryImage, emblem.primaryColor, size);
    const coloredSecondary = getColoredLayer('SECONDARY', primaryImage, emblem.secondaryColor, size);
    const coloredBackground = getColoredLayer('BACKGROUND', backgroundImage, emblem.backgroundColor, size);

    const ctx = canvas.getContext('2d');
    if (ctx) {
        if (emblem.armourPrimaryColor) {
            ctx.fillStyle = getCssColor(emblem.armourPrimaryColor);
            ctx.fillRect(0, 0, size, size);
        }

        ctx.drawImage(coloredBackground, 0, 0, size, size);
        if (emblem.secondary)
            ctx.drawImage(coloredSecondary, 0, 0, size, size);
        ctx.drawImage(coloredPrimary, 0, 0, size, size);

        console.log("Drawn emblem");
    }
}

export const Emblem = ({emblem, size}: {emblem: Emblem, size?: number}) => {
    const emblemCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        console.log("Drawing emblem");
        if (emblemCanvasRef.current) {
            drawEmblem(emblemCanvasRef.current, emblem, size || 100);
        }
    }, [emblem]);

    return (
        <Box sx={{ height: size || 100, width: size || 100 }}>
            <canvas  ref={emblemCanvasRef} width={size || 100} height={size || 100} style={{ width: size || 100, height: size || 100}}/>
        </Box>
    );
}