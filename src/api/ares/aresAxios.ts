import { Axios } from "axios";
import { env } from "@/src/env";

export const aresAxios = new Axios({
  baseURL: env.HALO3_API_BASE_URL,
  validateStatus: () => true,
});
