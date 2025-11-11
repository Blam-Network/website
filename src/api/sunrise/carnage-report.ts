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
        throw new Error(`carnageReport: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
    }
    return parsed.data;
});