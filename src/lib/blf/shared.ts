export const U16_MAX = 0xffff;

export type blf_endian = "big" | "little";

export class BlfError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BlfError";
  }
}

export type BlfVersion = {
  major: number;
  minor: number;
};

export function validate_blf_signature(signature: string): void {
  if (signature.length !== 4) {
    throw new BlfError(
      `BLF chunk signature must be exactly 4 characters, got ${signature.length}: "${signature}"`,
    );
  }
}

export function validate_blf_version(version: BlfVersion): void {
  for (const [label, value] of [
    ["major", version.major],
    ["minor", version.minor],
  ] as const) {
    if (!Number.isInteger(value) || value < 0 || value > U16_MAX) {
      throw new BlfError(
        `BLF chunk version ${label} must be an integer from 0 to ${U16_MAX}, got ${value}`,
      );
    }
  }
}

export function parse_blf_version_string(version: string): BlfVersion {
  const match = /^(\d+)\.(\d+)$/.exec(version);
  if (!match) {
    throw new BlfError(
      `BLF chunk version must be major.minor (e.g. "1.1"), got "${version}"`,
    );
  }
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
  };
}

export function parse_blf_version(version: number): BlfVersion {
  return parse_blf_version_string(version.toString());
}
