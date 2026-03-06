
import { aresRouter } from "./sunrise/aresRouter";
import { sunrise2Router } from "./sunrise/sunrise2Router";
import { sunriseRouter } from "./sunrise/sunriseRouter";
import { createTRPCRouter } from "./trpc";
import { xboxRouter } from "./xbox/xboxRouter";

// tRPC API router - served at /api/trpc
export const apiRouter = createTRPCRouter({
  sunrise: sunriseRouter,
  sunrise2: sunrise2Router,
  ares: aresRouter,
  xbox: xboxRouter,
});