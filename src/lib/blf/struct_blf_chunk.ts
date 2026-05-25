import {
  registerBlfChunkClass,
  type BlfChunkInfo,
  type BlfSignature4,
  type BlfVersionNumber,
} from "./blf_chunk";
import { get_struct_meta, read_into } from "./struct/codec";
import type { StructConstructor } from "./struct/types";
import {
  BlfError,
  parse_blf_version,
  type blf_endian,
  validate_blf_signature,
  validate_blf_version,
} from "./shared";

type StructBlfChunkInstance = {
  afterRead?(payload: Uint8Array, endian: blf_endian): void;
  read(payload: Uint8Array, endian: blf_endian): void;
  write(endian: blf_endian): Uint8Array;
};

function attach_struct_read_write(
  structCtor: StructConstructor,
  info: BlfChunkInfo,
): void {
  structCtor.prototype.read = function (
    this: StructBlfChunkInstance,
    payload: Uint8Array,
    endian: blf_endian,
  ): void {
    const meta = get_struct_meta(structCtor);
    if (endian !== meta.endian) {
      throw new BlfError(
        `Chunk ${info.signature} expects ${meta.endian}-endian payload, got ${endian}`,
      );
    }

    if (payload.length < structCtor.byteSize) {
      throw new BlfError(
        `Cannot read ${info.signature} chunk: need at least ${structCtor.byteSize} bytes, got ${payload.length}`,
      );
    }

    read_into(
      structCtor as StructConstructor<object>,
      this,
      payload,
      0,
      endian,
    );
    this.afterRead?.(payload, endian);
  };

  structCtor.prototype.write = function (
    this: StructBlfChunkInstance,
    endian: blf_endian,
  ): Uint8Array {
    const meta = get_struct_meta(structCtor);
    if (endian !== meta.endian) {
      throw new BlfError(
        `Chunk ${info.signature} expects ${meta.endian}-endian payload, got ${endian}`,
      );
    }
    return structCtor.write(this, endian);
  };
}

/**
 * `@c.struct` chunk with generated {@link read} / {@link write} from field layout.
 * Apply on the class, above `@c.struct`.
 */
export function BlfStructChunk<
  TSignature extends BlfSignature4<string>,
  TVersion extends BlfVersionNumber,
>(signature: TSignature, version: TVersion) {
  validate_blf_signature(signature);
  const parsed = parse_blf_version(version);
  validate_blf_version(parsed);

  const info = {
    signature,
    version,
    major: parsed.major,
    minor: parsed.minor,
  } as BlfChunkInfo & { signature: TSignature; version: TVersion };

  return <T extends abstract new (...args: any) => object>(
    target: T,
    _context: ClassDecoratorContext,
  ): T => {
    const ctor = registerBlfChunkClass(target, info);
    attach_struct_read_write(
      target as unknown as StructConstructor,
      info,
    );
    return ctor;
  };
}
