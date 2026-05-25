import { Axios } from "axios";
import { env } from "@/src/env";
import { attachAxiosRequestLogging } from "@/src/api/http/attachAxiosRequestLogging";

export const aresAxios = new Axios({
  baseURL: env.HALO3_API_BASE_URL,
  validateStatus: () => true,
});

attachAxiosRequestLogging(aresAxios, "ares");
