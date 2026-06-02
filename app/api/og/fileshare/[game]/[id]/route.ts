import { NextResponse } from "next/server";
import { api } from "@/src/trpc/server";
import { isValidFilesGame } from "@/src/components/files/filesPageTypes";
import { resolveFileshareIconLayers } from "@/src/utils/fileshareIconLayers";
import { compositeFileshareIconPng } from "@/src/utils/fileshareIconComposite";

export const runtime = "nodejs";

const CACHE_HEADER = "public, max-age=86400, stale-while-revalidate=604800";

export async function GET(
  _request: Request,
  { params }: { params: { game: string; id: string } },
) {
  if (!isValidFilesGame(params.game)) {
    return new NextResponse("Invalid game", { status: 400 });
  }
  const game = params.game;

  let file: Awaited<ReturnType<typeof api.files.fileshareFile.query>> | null = null;
  try {
    file = await api.files.fileshareFile.query({ game, fileId: params.id });
  } catch {
    file = null;
  }

  if (!file) {
    return new NextResponse("Not found", { status: 404 });
  }

  const layers = resolveFileshareIconLayers({
    game,
    filetype: file.header.filetype,
    gameEngineType: file.header.gameEngineType,
    iconIndex:
      game === "reach" && "iconIndex" in file.header
        ? (file.header.iconIndex ?? undefined)
        : undefined,
    mapId: file.header.mapId,
    shareId: file.shareId,
    slotNumber: file.slotNumber,
    fileId: file.id,
  });

  try {
    const png = await compositeFileshareIconPng(layers);
    return new NextResponse(png, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": CACHE_HEADER,
      },
    });
  } catch (error) {
    console.error("[og/fileshare] composite failed", error);
    return new NextResponse("Failed to render", { status: 500 });
  }
}
