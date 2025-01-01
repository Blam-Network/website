import { Axios } from "axios";

import { createTRPCRouter } from "../trpc";
import { env } from "@/src/env";
import { getCarnageReport } from "./carnage-report";

export const sunrise2Router = createTRPCRouter({
  getCarnageReport,
});

export const sunrise2Axios = new Axios({
    baseURL: env.SUNRISE_API_BASE_URL,
})