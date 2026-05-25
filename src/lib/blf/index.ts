import { e_bitstream_byte_order } from "../bitstream";
import { type blf_endian } from "./shared";

export {
  BlfError,
  type blf_endian,
  type BlfVersion,
  parse_blf_version,
  parse_blf_version_string,
  U16_MAX,
  validate_blf_signature,
  validate_blf_version,
} from "./shared";
export {
  BLF_CHUNK_HEADER_BYTE_SIZE,
  s_blf_chunk_header,
} from "./chunk_header";
export {
  find_chunk,
  search_for_chunk,
  search_for_chunk_bytes,
  type find_chunk_options,
} from "./chunk_search";
export {
  BlfChunk,
  BLF_CHUNK_META,
  createBlfChunk,
  createBlfChunkBySignature,
  getBlfChunkMeta,
  isBlfChunk,
  type BlfChunkConstructor,
  type BlfChunkInfo,
  type BlfChunkInstanceMixin,
  type BlfSignature4,
  type BlfVersionNumber,
  type IBlfChunk,
} from "./blf_chunk";
export { BlfStructChunk } from "./struct_blf_chunk";
export { c } from "./struct";
export type {
  Endian as StructEndian,
  FieldOptions as StructFieldOptions,
  PrimitiveType as StructPrimitiveType,
  StructConstructor,
  Time64Field,
} from "./struct";
export {
  date_to_time64_seconds,
  time64_seconds_to_date,
} from "./struct";
export {
  get_buffer_hash,
  NETWORK_HTTP_REQUEST_HASH_LENGTH,
  assert_network_http_request_hash,
} from "./hash";
export { zlib_compress } from "./zlib";
export {
  s_blf_chunk_compressed_data,
  type BlfCompressedInnerCtor,
} from "./chunks/halo3/v12070_08_09_05_2031_halo3_ship/s_blf_chunk_compressed_data";

export function blf_endian_to_bitstream_order(
  endian: blf_endian,
): e_bitstream_byte_order {
  return endian === "little"
    ? e_bitstream_byte_order._bitstream_byte_order_little_endian
    : e_bitstream_byte_order._bitstream_byte_order_big_endian;
}
