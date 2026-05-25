import {
  BLF_CHUNK_HEADER_BYTE_SIZE,
  s_blf_chunk_header,
} from "./chunk_header";
import type { IBlfChunk } from "./blf_chunk";
import { BlfError, parse_blf_version, type blf_endian } from "./shared";

function little_endian_from(endian: blf_endian): boolean {
  return endian === "little";
}

function chunk_matches(
  header: s_blf_chunk_header,
  signature: string,
  major: number,
  minor: number,
): boolean {
  return (
    header.signature === signature &&
    header.major === major &&
    header.minor === minor
  );
}

function try_read_header(
  view: DataView,
  byte_offset: number,
  little_endian: boolean,
): s_blf_chunk_header | null {
  if (byte_offset + BLF_CHUNK_HEADER_BYTE_SIZE > view.byteLength) {
    return null;
  }
  try {
    return s_blf_chunk_header.read(view, byte_offset, little_endian);
  } catch {
    return null;
  }
}

function is_chunk_length_valid(
  chunk_length: number,
  byte_offset: number,
  buffer_length: number,
): boolean {
  return (
    Number.isInteger(chunk_length) &&
    chunk_length >= BLF_CHUNK_HEADER_BYTE_SIZE &&
    byte_offset + chunk_length <= buffer_length
  );
}

function load_chunk_at(
  buffer: Uint8Array,
  byte_offset: number,
  header: s_blf_chunk_header,
  chunk: IBlfChunk,
  endian: blf_endian,
): void {
  const chunk_end = byte_offset + header.chunk_length;
  const payload = buffer.subarray(
    byte_offset + BLF_CHUNK_HEADER_BYTE_SIZE,
    chunk_end,
  );
  chunk.read(payload, endian);
}

function search_for_chunk_bytes_matching(
  buffer: Uint8Array,
  endian: blf_endian,
  signature: string,
  major: number,
  minor: number,
): Uint8Array | null {
  const little_endian = little_endian_from(endian);
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  const last_offset = buffer.length - BLF_CHUNK_HEADER_BYTE_SIZE;

  const sig0 = signature.charCodeAt(0);
  const sig1 = signature.charCodeAt(1);
  const sig2 = signature.charCodeAt(2);
  const sig3 = signature.charCodeAt(3);

  for (let offset = 0; offset <= last_offset; offset++) {
    if (
      buffer[offset] !== sig0 ||
      buffer[offset + 1] !== sig1 ||
      buffer[offset + 2] !== sig2 ||
      buffer[offset + 3] !== sig3
    ) {
      continue;
    }

    const header = try_read_header(view, offset, little_endian);
    if (header === null || !chunk_matches(header, signature, major, minor)) {
      continue;
    }

    if (!is_chunk_length_valid(header.chunk_length, offset, buffer.length)) {
      continue;
    }

    return buffer.slice(offset, offset + header.chunk_length);
  }

  return null;
}

export type find_chunk_options = {
  /** Byte offset to start sequential BLF traversal (default `0`). */
  start_offset?: number;
};

/**
 * Walk a BLF file sequentially until `chunk` is found, then read it in place.
 */
export function find_chunk(
  buffer: Uint8Array,
  chunk: IBlfChunk,
  endian: blf_endian,
  options: find_chunk_options = {},
): boolean {
  const little_endian = little_endian_from(endian);
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  let offset = options.start_offset ?? 0;

  while (offset + BLF_CHUNK_HEADER_BYTE_SIZE <= buffer.length) {
    let header: s_blf_chunk_header;
    try {
      header = s_blf_chunk_header.read(view, offset, little_endian);
    } catch {
      return false;
    }

    if (chunk_matches(header, chunk.signature, chunk.major, chunk.minor)) {
      if (!is_chunk_length_valid(header.chunk_length, offset, buffer.length)) {
        throw new BlfError(
          `Matched chunk "${header.signature}" at offset ${offset} has invalid chunk_length ${header.chunk_length}`,
        );
      }
      load_chunk_at(buffer, offset, header, chunk, endian);
      return true;
    }

    if (!is_chunk_length_valid(header.chunk_length, offset, buffer.length)) {
      return false;
    }

    offset += header.chunk_length;
  }

  return false;
}

/**
 * Scan every byte offset for a matching chunk and return its raw bytes (header + payload).
 */
export function search_for_chunk_bytes(
  buffer: Uint8Array,
  endian: blf_endian,
  signature: string,
  version: number,
): Uint8Array | null {
  const { major, minor } = parse_blf_version(version);
  return search_for_chunk_bytes_matching(buffer, endian, signature, major, minor);
}

/**
 * Scan every byte offset for `chunk`, then read it in place when found.
 */
export function search_for_chunk(
  buffer: Uint8Array,
  chunk: IBlfChunk,
  endian: blf_endian,
): boolean {
  const bytes = search_for_chunk_bytes(
    buffer,
    endian,
    chunk.signature,
    chunk.version,
  );
  if (bytes === null) {
    return false;
  }

  const header = s_blf_chunk_header.read(
    new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength),
    0,
    little_endian_from(endian),
  );
  load_chunk_at(bytes, 0, header, chunk, endian);
  return true;
}
