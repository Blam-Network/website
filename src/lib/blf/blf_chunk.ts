import {
  parse_blf_version,
  validate_blf_signature,
  validate_blf_version,
  BlfError,
  type blf_endian,
} from "./shared";

type StringLength<
  S extends string,
  Acc extends unknown[] = [],
> = S extends `${string}${infer Rest}`
  ? StringLength<Rest, [...Acc, unknown]>
  : Acc["length"];

/** Exactly four characters (FourCC). */
export type BlfSignature4<T extends string = string> = string extends T
  ? string
  : StringLength<T> extends 4
    ? T
    : never;

/** Major.minor version as a float literal, e.g. `1.1` (major 1, minor 1). */
export type BlfVersionNumber<T extends number = number> = T;

export const BLF_CHUNK_META = Symbol.for("blf.chunk.meta");

export type BlfChunkInfo = {
  readonly signature: string;
  readonly version: number;
  readonly major: number;
  readonly minor: number;
};

export interface IBlfChunk {
  readonly signature: string;
  readonly version: number;
  readonly major: number;
  readonly minor: number;
  read(payload: Uint8Array, endian: blf_endian): void;
  write(endian: blf_endian): Uint8Array;
}

/** Instance metadata from {@link BlfChunk}. */
export type BlfChunkBrand<
  TSignature extends BlfSignature4<string>,
  TVersion extends BlfVersionNumber,
> = {
  readonly signature: TSignature;
  readonly version: TVersion;
  readonly major: number;
  readonly minor: number;
};

/** Use after `@BlfChunk` if the class body does not declare chunk metadata. */
export type BlfChunkInstanceMixin<
  TSignature extends BlfSignature4<string>,
  TVersion extends BlfVersionNumber,
> = IBlfChunk & BlfChunkBrand<TSignature, TVersion>;

export type BlfChunkConstructor<
  T extends IBlfChunk = IBlfChunk,
  TSignature extends BlfSignature4<string> = BlfSignature4,
  TVersion extends BlfVersionNumber = BlfVersionNumber,
> = abstract new (...args: any[]) => T & BlfChunkBrand<TSignature, TVersion>;

const chunk_registry = new Map<string, BlfChunkConstructor>();

function registry_key(signature: string, major: number, minor: number): string {
  return `${signature}\0${major}\0${minor}`;
}

function attach_chunk_metadata(
  target: BlfChunkConstructor,
  info: BlfChunkInfo,
): void {
  Object.defineProperty(target, BLF_CHUNK_META, {
    value: info,
    enumerable: false,
    configurable: false,
  });

  for (const key of ["signature", "version", "major", "minor"] as const) {
    Object.defineProperty(target.prototype, key, {
      get(): number | string {
        return info[key];
      },
      enumerable: true,
      configurable: true,
    });
  }

  chunk_registry.set(
    registry_key(info.signature, info.major, info.minor),
    target,
  );
}

export function registerBlfChunkClass<
  T extends abstract new (...args: any) => object,
  TSignature extends BlfSignature4<string>,
  TVersion extends BlfVersionNumber,
>(
  target: T,
  info: BlfChunkInfo & { signature: TSignature; version: TVersion },
): T {
  attach_chunk_metadata(target as BlfChunkConstructor, info);
  return target;
}

/**
 * Declares BLF chunk signature/version on a class and registers a factory.
 */
export function BlfChunk<
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
    return registerBlfChunkClass(target, info);
  };
}

export function getBlfChunkMeta(
  from: BlfChunkConstructor | IBlfChunk,
): BlfChunkInfo {
  if (typeof from === "function") {
    const meta = (
      from as BlfChunkConstructor & { [BLF_CHUNK_META]?: BlfChunkInfo }
    )[BLF_CHUNK_META];
    if (!meta) {
      throw new BlfError(`${from.name} is not decorated with @BlfChunk`);
    }
    return meta;
  }

  return {
    signature: from.signature,
    version: from.version,
    major: from.major,
    minor: from.minor,
  };
}

export function createBlfChunk<T extends abstract new (...args: any) => object>(
  ctor: T,
): InstanceType<T> {
  return new ctor();
}

export function createBlfChunkBySignature(
  signature: string,
  version: number,
): IBlfChunk {
  const { major, minor } = parse_blf_version(version);
  const ctor = chunk_registry.get(registry_key(signature, major, minor));
  if (!ctor) {
    throw new BlfError(
      `No @BlfChunk registered for ${signature} ${major}.${minor}`,
    );
  }
  return createBlfChunk(ctor) as IBlfChunk;
}

export function isBlfChunk(value: unknown): value is IBlfChunk {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as IBlfChunk).read === "function" &&
    typeof (value as IBlfChunk).write === "function" &&
    typeof (value as IBlfChunk).signature === "string" &&
    typeof (value as IBlfChunk).version === "number"
  );
}
