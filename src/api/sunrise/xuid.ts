import { z } from "zod";
import { publicProcedure } from "../trpc";
import { sunriseAxios } from "./sunriseRouter";

// Accept decimal or hex; return DECIMAL string (what the backend expects for player endpoints)
const XuidFlexibleSchema = z.string().min(1);

export const getXuid = publicProcedure.input(
    z.object({ gamertag: z.string().min(1) })
).query(async (opts) => {
    const response = await sunriseAxios.get("/sunrise/xuid", {params: {
        gamertag: opts.input.gamertag,
    }});
    const raw = XuidFlexibleSchema.parse(String(response.data).trim());
    // If it's hex, convert to decimal. Otherwise assume decimal.
    const cleaned = raw.replace(/\s+/g, '');
    const isHex = /^[0-9A-Fa-f]{16}$/.test(cleaned) || /^0x[0-9A-Fa-f]+$/.test(cleaned);
    const decimal = isHex ? BigInt(cleaned.startsWith('0x') ? cleaned : '0x' + cleaned).toString(10) : cleaned;
    return decimal;
});