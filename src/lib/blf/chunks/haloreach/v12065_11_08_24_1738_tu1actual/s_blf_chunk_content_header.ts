import {
  BlfStructChunk,
  BlfError,
  c,
  type BlfChunkInstanceMixin,
  type blf_endian,
} from "../../../index";
import { s_content_item_metadata } from "../../../blam/haloreach/v12065_11_08_24_1738_tu1actual/saved_games/saved_game_files";

@BlfStructChunk("chdr", 10.2)
@c.struct({ endian: "big" })
export class s_blf_chunk_content_header {
  @c.field("u16")
  build_number!: number;

  @c.field("u16")
  map_minor_version!: number;

  @c.field(s_content_item_metadata)
  metadata!: s_content_item_metadata;

  write(_endian: blf_endian): Uint8Array {
    throw new BlfError(
      "s_blf_chunk_content_header.write requires c_bitstream_writer (not yet ported)",
    );
  }
}

export interface s_blf_chunk_content_header
  extends BlfChunkInstanceMixin<"chdr", 10.2> {}
