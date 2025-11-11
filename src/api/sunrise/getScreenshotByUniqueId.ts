import { z } from "zod";
import { publicProcedure } from "../trpc";
import { sunrise2Axios } from "./sunrise2Router";
import { jsonStringifySchema } from "@/src/zod";

const ScreenshotByFileshareSchema = z.preprocess(
    (val) => {
        if (typeof val === 'string') {
            try {
                const parsed = JSON.parse(val);
                // If parsed is null, return null directly
                if (parsed === null) {
                    return null;
                }
                return parsed;
            } catch {
                return val;
            }
        }
        // If val is already null, return it
        if (val === null) {
            return null;
        }
        return val;
    },
    z.union([
        z.object({
            id: z.string(),
            header: z.object({
                filename: z.string(),
                description: z.string(),
            }),
            author: z.string(),
        }),
        z.null(),
    ])
);

export const getScreenshotByFileshare = publicProcedure.input(
    z.object({ 
        shareId: z.string(),
        slot: z.number(),
    })
).query(async (opts) => {
    try {
        const response = await sunrise2Axios.get(`/halo3/fileshare/${opts.input.shareId}/${opts.input.slot}/metadata`);
        
        // Handle case where response.data might be the string "null" or actual null
        if (!response.data || response.data === 'null' || response.data === '' || response.data === null) {
            return null;
        }
        
        // Parse the JSON string if needed (Axios might return it as a string)
        let parsedData = response.data;
        if (typeof response.data === 'string') {
            try {
                parsedData = JSON.parse(response.data);
                // If parsed result is null, return null early
                if (parsedData === null) {
                    return null;
                }
            } catch {
                // If it's not JSON, use as-is
            }
        }
        
        // Check if parsed data is null before validation
        if (parsedData === null || parsedData === undefined) {
            return null;
        }
        
        // Use safeParse to handle validation errors gracefully
        const result = ScreenshotByFileshareSchema.safeParse(response.data);
        if (!result.success) {
            // If validation fails, check if it's because the data is null/empty
            if (!response.data || response.data === 'null' || response.data === '' || parsedData === null) {
                return null;
            }
            console.error('Schema validation error for shareId/slot:', opts.input.shareId, opts.input.slot, result.error);
            return null;
        }
        
        return result.data;
    } catch (error) {
        // If screenshot not found or validation fails, return null instead of throwing
        console.error('Error fetching screenshot by fileshare:', opts.input.shareId, opts.input.slot, error);
        return null;
    }
});

