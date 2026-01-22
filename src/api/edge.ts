
import { aresRouter } from "./sunrise/aresRouter";
import { sunrise2Router } from "./sunrise/sunrise2Router";
import { sunriseRouter } from "./sunrise/sunriseRouter";
import { createTRPCRouter } from "./trpc";
import { xboxRouter } from "./xbox/xboxRouter";

// Deployed to /trpc/edge/**
export const edgeRouter = createTRPCRouter({
  sunrise: sunriseRouter,
  sunrise2: sunrise2Router,
  ares: aresRouter,
  xbox: xboxRouter,
});