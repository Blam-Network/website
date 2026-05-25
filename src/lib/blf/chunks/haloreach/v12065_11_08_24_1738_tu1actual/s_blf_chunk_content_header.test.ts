import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { search_for_chunk } from "../../../chunk_search";
import { s_blf_chunk_content_header } from "./s_blf_chunk_content_header";

const FIXTURE_PATH = join(
  import.meta.dirname,
  "../../../fixtures/haloreach_gea0_map.blf",
);

describe("s_blf_chunk_content_header", () => {
  const file = new Uint8Array(readFileSync(FIXTURE_PATH));

  it("finds and reads the Reach map CHDR chunk (big-endian)", () => {
    const chdr = new s_blf_chunk_content_header();
    expect(search_for_chunk(file, chdr, "big")).toBe(true);

    expect(chdr.build_number).toBe(12065);
    expect(chdr.map_minor_version).toBe(0);

    expect(chdr.metadata.general.file_type).toBe(6); // e_file_type.GameVariant
    expect(chdr.metadata.general.size_in_bytes).toBe(21289);
    expect(chdr.metadata.general.map_id).toBe(-1);
    expect(chdr.metadata.general.activity).toBe(3);
    expect(chdr.metadata.general.game_mode).toBe(3);
    expect(chdr.metadata.name).toBe("Oddball");
    expect(chdr.metadata.description).toBe(
      "Hold the skull to earn points. It's like Hamlet with guns.",
    );
    expect(chdr.metadata.file_type_data).toEqual({ icon_index: 2 });
    expect(chdr.metadata.activity_data).not.toBeNull();
  });
});
