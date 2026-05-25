import { z } from "zod";
import { publicProcedure } from "../trpc";
import { odstAxios } from "./odstAxios";
import { FileshareFilesResponseSchema } from "../halo3/fileshareFilesSchema";

export type { FileshareFile } from "../halo3/fileshareFilesSchema";

export const fileshareFiles = publicProcedure
  .input(
    z.object({
      page: z.number().min(1).default(1),
      pageSize: z.number().min(1).max(100).default(48),
      fileType: z.enum(["maps", "gametypes", "films", "screenshots"]).optional(),
    }),
  )
  .query(async ({ input }) => {
    const params = new URLSearchParams();
    params.set("page", String(input.page));
    params.set("pageSize", String(input.pageSize));
    if (input.fileType) params.set("fileType", input.fileType);

    const response = await odstAxios.get(`/halo3odst/fileshare/files?${params.toString()}`);
    const parsed = FileshareFilesResponseSchema.safeParse(response.data);
    if (!parsed.success) throw new Error(`fileshareFiles: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
    return parsed.data;
  });
