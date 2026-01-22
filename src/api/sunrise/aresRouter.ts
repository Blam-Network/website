import { Axios } from "axios";

import { createTRPCRouter } from "../trpc";
import { env } from "@/src/env";
import { getCarnageReport } from "./ares/carnage-report";

export const aresRouter = createTRPCRouter({
  getCarnageReport,
});

export const aresAxios = new Axios({
    baseURL: env.HALO3_API_BASE_URL,
})