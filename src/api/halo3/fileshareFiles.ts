import { z } from "zod";
import { publicProcedure } from "../trpc";
import { halo3Axios } from "./halo3Axios";
import { FileshareFilesResponseSchema } from "./fileshareFilesSchema";

export type { FileshareFile } from "./fileshareFilesSchema";

export { FileshareFilesResponseSchema } from "./fileshareFilesSchema";

export const fileshareFiles = publicProcedure.input(
  z.object({
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(50),
    fileType: z.enum(["maps", "gametypes", "films", "screenshots"]).optional(),
    search: z.string().optional(),
  }),
).query(async ({ input }) => {
  const params = new URLSearchParams();
  params.set("page", String(input.page));
  params.set("pageSize", String(input.pageSize));
  if (input.fileType) {
    params.set("fileType", input.fileType);
  }
  if (input.search?.trim()) {
    params.set("search", input.search.trim());
  }

  const url = `/halo3/fileshare/files?${params.toString()}`;
  const response = await halo3Axios.get(url);
  const parsed = FileshareFilesResponseSchema.safeParse(response.data);
  if (!parsed.success) {
    throw new Error(`fileshareFiles: schema mismatch. got=${JSON.stringify(response.data).slice(0, 500)}`);
  }
  return parsed.data;
});
