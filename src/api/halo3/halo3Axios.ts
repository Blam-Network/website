import { Axios } from "axios";
import { env } from "@/src/env";
import { attachAxiosRequestLogging } from "@/src/api/http/attachAxiosRequestLogging";

/** Halo 3 (Sunrise / MCC-style) backend — shared by `sunrise` and `sunrise2` routers only within this folder. */
export const halo3Axios = new Axios({
  baseURL: env.HALO3_API_BASE_URL,
  validateStatus: () => true,
});

attachAxiosRequestLogging(halo3Axios, "halo3");
