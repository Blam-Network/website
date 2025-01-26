import { createTRPCRouter } from "../trpc";
import { getVidmasters } from "./getVidmasters";

export const xboxRouter = createTRPCRouter({
  getVidmasters,
});