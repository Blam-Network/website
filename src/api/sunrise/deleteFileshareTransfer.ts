import { protectedProcedure } from "../trpc";
import { sunrise2Axios } from "./sunrise2Router";
import { z } from "zod";
import { xuidToHex } from "@/src/utils/xuid";

export const deleteFileshareTransfer = protectedProcedure.input(
    z.object({ fileId: z.string().uuid() })
).mutation(async (opts) => {
    const url = `/halo3/fileshare/transfers/${opts.input.fileId}`;
    console.log('[deleteFileshareTransfer] Deleting transfer:', url);
    
    try {
        const response = await sunrise2Axios.delete(url, {
            headers: {
                'x-xuid': xuidToHex(opts.ctx.auth.user.xuid),
                'x-uhs': opts.ctx.auth.user.xboxUserHash,
                'Authorization': opts.ctx.auth.tokens.xsts,
            }
        });
        
        console.log('[deleteFileshareTransfer] Response status:', response.status);
        console.log('[deleteFileshareTransfer] Response data:', response.data);
        
        // Check if the response indicates an error
        if (response.status && response.status >= 400) {
            throw new Error(`Failed to delete transfer: ${response.status} ${response.statusText || ''}`);
        }
        
        return { success: true };
    } catch (error: any) {
        console.error('[deleteFileshareTransfer] Error:', error);
        // If it's an Axios error, extract the message
        if (error.response) {
            throw new Error(`Failed to delete transfer: ${error.response.status} ${error.response.statusText || ''}`);
        }
        if (error.message) {
            throw error;
        }
        throw new Error(`Failed to delete transfer: ${error.toString()}`);
    }
});

