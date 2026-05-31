import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { assertAxiosOk } from "../http/axiosError";
import { FileshareFileResponseSchema as Halo3FileshareFileResponseSchema } from "../halo3/fileshareFilesSchema";
import { halo3Axios } from "../halo3/halo3Axios";
import { odstAxios } from "../odst/odstAxios";
import { reachAxios } from "../reach/reachAxios";
import { FileshareFileResponseSchema as ReachFileshareFileResponseSchema } from "../reach/fileshareFilesSchema";
import { publicProcedure } from "../trpc";

export const fileshareFile = publicProcedure
  .input(
    z.object({
      game: z.enum(["halo3", "odst", "reach"]),
      fileId: z.string().min(1),
    }),
  )
  .query(async ({ input }) => {
    let response;
    let schema;

    switch (input.game) {
      case "odst":
        response = await odstAxios.get(
          `/halo3odst/fileshare/files/${encodeURIComponent(input.fileId)}`,
        );
        schema = Halo3FileshareFileResponseSchema;
        break;
      case "reach":
        response = await reachAxios.get(
          `/haloreach/fileshare/files/${encodeURIComponent(input.fileId)}`,
        );
        schema = ReachFileshareFileResponseSchema;
        break;
      default:
        response = await halo3Axios.get(
          `/halo3/fileshare/files/${encodeURIComponent(input.fileId)}`,
        );
        schema = Halo3FileshareFileResponseSchema;
    }

    if (response.status === 404) {
      throw new TRPCError({ code: "NOT_FOUND", message: "File not found" });
    }

    assertAxiosOk(response);

    const parsed = schema.safeParse(response.data);
    if (!parsed.success) {
      throw new Error(
        `fileshareFile: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`,
      );
    }

    return parsed.data;
  });
