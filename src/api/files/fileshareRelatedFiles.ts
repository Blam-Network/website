import { z } from "zod";
import { assertAxiosOk } from "../http/axiosError";
import { FileshareRelatedFilesResponseSchema } from "../halo3/fileshareFilesSchema";
import { FileshareRelatedFilesResponseSchema as ReachFileshareRelatedFilesResponseSchema } from "../reach/fileshareFilesSchema";
import { halo3Axios } from "../halo3/halo3Axios";
import { odstAxios } from "../odst/odstAxios";
import { reachAxios } from "../reach/reachAxios";
import { publicProcedure } from "../trpc";

export const fileshareRelatedFiles = publicProcedure
  .input(
    z.object({
      game: z.enum(["halo3", "odst", "reach"]),
      fileId: z.string().min(1),
    }),
  )
  .query(async ({ input }) => {
    let path: string;
    let client;
    let schema;

    switch (input.game) {
      case "odst":
        path = `/halo3odst/fileshare/files/${encodeURIComponent(input.fileId)}/related-files`;
        client = odstAxios;
        schema = FileshareRelatedFilesResponseSchema;
        break;
      case "reach":
        path = `/haloreach/fileshare/files/${encodeURIComponent(input.fileId)}/related-files`;
        client = reachAxios;
        schema = ReachFileshareRelatedFilesResponseSchema;
        break;
      default:
        path = `/halo3/fileshare/files/${encodeURIComponent(input.fileId)}/related-files`;
        client = halo3Axios;
        schema = FileshareRelatedFilesResponseSchema;
    }

    const response = await client.get(path);

    assertAxiosOk(response);

    const parsed = schema.safeParse(response.data);
    if (!parsed.success) {
      throw new Error(
        `fileshareRelatedFiles: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`,
      );
    }

    return parsed.data;
  });
