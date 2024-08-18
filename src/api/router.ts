import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { mergeRouters } from "./trpc";
import { edgeRouter } from "./edge";

export const appRouter = mergeRouters(edgeRouter);
export type AppRouter = typeof appRouter;

export { createTRPCContext, createInnerTRPCContext } from "./trpc";

// TODO: Maybe just export `createAction` instead of the whole `trpc` object?
export { t } from "./trpc";


export type RouterInputs = inferRouterInputs<AppRouter>;


export type RouterOutputs = inferRouterOutputs<AppRouter>;