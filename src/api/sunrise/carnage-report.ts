import { z } from "zod";
import { publicProcedure } from "../trpc";
import { sunrise2Axios } from "./sunrise2Router";
import { CarnageReportSchema } from "./carnage-report/schema";
import { jsonStringifySchema } from "@/src/zod";

const CarnageReportResponseSchema = jsonStringifySchema(CarnageReportSchema);

export const getCarnageReport = publicProcedure.input(
    z.object({ id: z.string().uuid() })
).query(async (opts) => {
    const response = await sunrise2Axios.get(`/halo3/carnage-reports/${opts.input.id}`);
    const parsed = CarnageReportResponseSchema.safeParse(response.data);
    if (!parsed.success) {
        const errorDetails = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw new Error(`carnageReport: schema mismatch. Errors: ${errorDetails}. Got: ${JSON.stringify(response.data).slice(0, 1000)}`);
    }
    return parsed.data;
});