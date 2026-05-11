import { Axios } from "axios";
import { env } from "@/src/env";

export const reachAxios = new Axios({
  baseURL: env.HALO_REACH_API_BASE_URL,
  validateStatus: () => true,
});
