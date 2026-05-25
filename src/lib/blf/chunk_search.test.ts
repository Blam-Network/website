import { describe, expect, it } from "vitest";
import {
  BlfChunk,
  createBlfChunk,
  type BlfChunkInstanceMixin,
} from "./blf_chunk";
import type { blf_endian } from "./shared";
import { s_blf_chunk_header } from "./chunk_header";
import {
  find_chunk,
  search_for_chunk,
  search_for_chunk_bytes,
} from "./chunk_search";

@BlfChunk("test", 1.2)
class TestChunk {
  bytes: Uint8Array = new Uint8Array(0);

  read(payload: Uint8Array, _endian: blf_endian): void {
    this.bytes = payload;
  }

  write(_endian: blf_endian): Uint8Array {
    return this.bytes;
  }
}

interface TestChunk extends BlfChunkInstanceMixin<"test", 1.2> {}

function write_chunk(
  signature: string,
  version: { major: number; minor: number },
  payload: Uint8Array,
): Uint8Array {
  const chunk_length = s_blf_chunk_header.byte_size + payload.length;
  const buffer = new Uint8Array(chunk_length);
  const header = new s_blf_chunk_header(
    signature,
    chunk_length,
    version.major,
    version.minor,
  );
  header.write(new DataView(buffer.buffer), 0);
  buffer.set(payload, s_blf_chunk_header.byte_size);
  return buffer;
}

describe("createBlfChunk", () => {
  it("instantiates a decorated chunk", () => {
    const chunk = createBlfChunk(TestChunk);
    expect(chunk.signature).toBe("test");
    expect(chunk.version).toBe(1.2);
    expect(chunk.major).toBe(1);
    expect(chunk.minor).toBe(2);
  });
});

describe("find_chunk", () => {
  it("finds a chunk in a valid BLF chain", () => {
    const first = write_chunk("blf ", { major: 1, minor: 0 }, new Uint8Array([1]));
    const target = write_chunk("test", { major: 1, minor: 2 }, new Uint8Array([9, 8]));
    const file = new Uint8Array(first.length + target.length);
    file.set(first, 0);
    file.set(target, first.length);

    const chunk = createBlfChunk(TestChunk);
    expect(find_chunk(file, chunk, "little")).toBe(true);
    expect(chunk.bytes).toEqual(new Uint8Array([9, 8]));
  });

  it("returns false when chunk is missing", () => {
    const file = write_chunk("blf ", { major: 1, minor: 0 }, new Uint8Array(0));
    expect(find_chunk(file, createBlfChunk(TestChunk), "little")).toBe(false);
  });
});

describe("search_for_chunk", () => {
  it("finds a chunk embedded in arbitrary data", () => {
    const target = write_chunk("test", { major: 1, minor: 2 }, new Uint8Array([5]));
    const file = new Uint8Array([0, 1, 2, 3, ...target, 99, 100]);
    file.set(target, 4);

    const chunk = createBlfChunk(TestChunk);
    expect(search_for_chunk(file, chunk, "little")).toBe(true);
    expect(chunk.bytes).toEqual(new Uint8Array([5]));
  });
});

describe("search_for_chunk_bytes", () => {
  it("returns the full chunk including header", () => {
    const target = write_chunk("test", { major: 1, minor: 2 }, new Uint8Array([5]));
    const file = new Uint8Array([0, 1, 2, 3, ...target, 99, 100]);
    file.set(target, 4);

    const found = search_for_chunk_bytes(file, "little", "test", 1.2);
    expect(found).toEqual(target);
  });

  it("returns null when chunk is missing", () => {
    const file = write_chunk("blf ", { major: 1, minor: 0 }, new Uint8Array(0));
    expect(search_for_chunk_bytes(file, "little", "test", 1.2)).toBeNull();
  });
});
