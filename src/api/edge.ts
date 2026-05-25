import { aresRouter } from "./ares/aresRouter";
import { odstRouter } from "./odst/odstRouter";
import { reachRouter } from "./reach/reachRouter";
import { sunrise2Router } from "./halo3/sunrise2Router";
import { sunriseRouter } from "./halo3/sunriseRouter";
import { createTRPCRouter } from "./trpc";
import { xboxRouter } from "./xbox/xboxRouter";

// tRPC API router - served at /api/trpc
export const apiRouter = createTRPCRouter({
  sunrise: sunriseRouter,
  sunrise2: sunrise2Router,
  reach: reachRouter,
  ares: aresRouter,
  odst: odstRouter,
  xbox: xboxRouter,
});