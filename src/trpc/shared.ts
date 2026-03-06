import type { HTTPBatchLinkOptions, HTTPHeaders, TRPCLink } from "@trpc/client";
import { httpBatchLink } from "@trpc/client";
import { AppRouter } from "../api/router";
import { getSiteUrl } from "../utils/siteUrl";

export const endingLink = (opts?: {
  headers?: HTTPHeaders | (() => HTTPHeaders);
}) =>
  ((runtime) => {
    const sharedOpts = {
      headers: opts?.headers,
    } satisfies Partial<HTTPBatchLinkOptions<any>>;

    const httpLink = httpBatchLink({
      ...sharedOpts,
      url: `${getSiteUrl()}/api/trpc`,
    })(runtime);

    return (ctx) => {
      const path = ctx.op.path.split(".") as [string, ...string[]];

      const newCtx = {
        ...ctx,
        op: { ...ctx.op, path: path.join(".") },
      };

      return httpLink(newCtx);
    };
  }) satisfies TRPCLink<AppRouter>;