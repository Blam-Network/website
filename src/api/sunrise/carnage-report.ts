import { z } from "zod";
import { publicProcedure } from "../trpc";
import { sunrise2Axios } from "./sunrise2Router";
import { CarnageReportSchema } from "./carnage-report/schema";

export const getCarnageReport = publicProcedure.input(
    z.object({ id: z.string().uuid() })
).query(async (opts) => {
    const response = await sunrise2Axios.get(`/halo3/carnage-reports/${opts.input.id}`);
    const data = CarnageReportSchema.parse(JSON.parse(response.data));
    return data;
});