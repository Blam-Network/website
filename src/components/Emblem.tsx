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

export const Emblem = ({emblem, size}: {emblem: Emblem, size?: number}) => {
    let params = new URLSearchParams({
        primary: emblem.primary.toString(),
        secondary: emblem.secondary ? 'true' : 'false',
        background: emblem.background.toString(),
        primary_color: emblem.primaryColor.toString(),
        secondary_color: emblem.secondaryColor.toString(),
        background_color: emblem.backgroundColor.toString(),
    });
    if (emblem.armourPrimaryColor) {
        params.append('armour_primary_color', emblem.armourPrimaryColor.toString());
    }
    if (size) {
        params.append('size', size.toString());
    } else {
        params.append('size', '100');
    }

    let url = process.env.NEXT_PUBLIC_HALO3_API_BASE_URL + '/halo3/emblem?' + params.toString();

    return (
        <img width={size} height={size} src={url} alt="Emblem" />
    );
}