import {
  BlfError,
  parse_blf_version,
  validate_blf_signature,
  validate_blf_version,
} from "./shared";

export const BLF_CHUNK_HEADER_BYTE_SIZE = 12;

function read_signature(view: DataView, byte_offset: number): string {
  return String.fromCharCode(
    view.getUint8(byte_offset),
    view.getUint8(byte_offset + 1),
    view.getUint8(byte_offset + 2),
    view.getUint8(byte_offset + 3),
  );
}

function write_signature(
  view: DataView,
  byte_offset: number,
  signature: string,
): void {
  validate_blf_signature(signature);
  for (let i = 0; i < 4; i++) {
    view.setUint8(byte_offset + i, signature.charCodeAt(i)!);
  }
}

export class s_blf_chunk_header {
  static readonly byte_size = BLF_CHUNK_HEADER_BYTE_SIZE;

  signature: string;
  chunk_length: number;
  major: number;
  minor: number;

  constructor(
    signature: string,
    chunk_length: number,
    major: number,
    minor: number,
  ) {
    validate_blf_signature(signature);
    validate_blf_version({ major, minor });
    if (!Number.isInteger(chunk_length) || chunk_length < 0) {
      throw new BlfError(
        `BLF chunk length must be a non-negative integer, got ${chunk_length}`,
      );
    }
    this.signature = signature;
    this.chunk_length = chunk_length;
    this.major = major;
    this.minor = minor;
  }

  /** Build from a `major.minor` float (e.g. `1.1`). */
  static from_version_float(
    signature: string,
    chunk_length: number,
    version: number,
  ): s_blf_chunk_header {
    const { major, minor } = parse_blf_version(version);
    return new s_blf_chunk_header(signature, chunk_length, major, minor);
  }

  static read(
    view: DataView,
    byte_offset = 0,
    little_endian = true,
  ): s_blf_chunk_header {
    if (byte_offset + BLF_CHUNK_HEADER_BYTE_SIZE > view.byteLength) {
      throw new BlfError(
        `Cannot read BLF chunk header at offset ${byte_offset}: need ${BLF_CHUNK_HEADER_BYTE_SIZE} bytes, buffer has ${view.byteLength}`,
      );
    }

    return new s_blf_chunk_header(
      read_signature(view, byte_offset),
      view.getUint32(byte_offset + 4, little_endian),
      view.getUint16(byte_offset + 8, little_endian),
      view.getUint16(byte_offset + 10, little_endian),
    );
  }

  write(view: DataView, byte_offset = 0, little_endian = true): void {
    if (byte_offset + BLF_CHUNK_HEADER_BYTE_SIZE > view.byteLength) {
      throw new BlfError(
        `Cannot write BLF chunk header at offset ${byte_offset}: need ${BLF_CHUNK_HEADER_BYTE_SIZE} bytes, buffer has ${view.byteLength}`,
      );
    }

    write_signature(view, byte_offset, this.signature);
    view.setUint32(byte_offset + 4, this.chunk_length, little_endian);
    view.setUint16(byte_offset + 8, this.major, little_endian);
    view.setUint16(byte_offset + 10, this.minor, little_endian);
  }

  /** Allocate a 12-byte buffer and write this header. */
  to_bytes(little_endian = true): Uint8Array {
    const buffer = new ArrayBuffer(BLF_CHUNK_HEADER_BYTE_SIZE);
    const view = new DataView(buffer);
    this.write(view, 0, little_endian);
    return new Uint8Array(buffer);
  }
}
