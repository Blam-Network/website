import { createTRPCRouter } from "../trpc";
import { fileshareFile } from "./fileshareFile";
import { fileshareRelatedFiles } from "./fileshareRelatedFiles";
import { fileshareSourceGame } from "./fileshareSourceGame";

export const filesRouter = createTRPCRouter({
  fileshareFile,
  fileshareRelatedFiles,
  fileshareSourceGame,
});
