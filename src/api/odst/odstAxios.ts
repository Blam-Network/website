import { Axios } from "axios";
import { env } from "@/src/env";
import { attachAxiosRequestLogging } from "@/src/api/http/attachAxiosRequestLogging";

export const odstAxios = new Axios({
  baseURL: env.HALO3_API_BASE_URL,
  validateStatus: () => true,
});

attachAxiosRequestLogging(odstAxios, "odst");