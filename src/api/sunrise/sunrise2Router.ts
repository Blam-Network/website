import { Axios } from "axios";

import { createTRPCRouter } from "../trpc";
import { env } from "@/src/env";
import { getCarnageReport } from "./carnage-report";
import { unlockRecon } from "./unlockRecon";

export const sunrise2Router = createTRPCRouter({
  unlockRecon,
  getCarnageReport,
});

export const sunrise2Axios = new Axios({
    baseURL: env.HALO3_API_BASE_URL,
})