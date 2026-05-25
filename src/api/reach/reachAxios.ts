import { Axios } from "axios";
import { env } from "@/src/env";
import { attachAxiosRequestLogging } from "@/src/api/http/attachAxiosRequestLogging";

export const reachAxios = new Axios({
  baseURL: env.HALO_REACH_API_BASE_URL,
  validateStatus: () => true,
});

attachAxiosRequestLogging(reachAxios, "reach");
