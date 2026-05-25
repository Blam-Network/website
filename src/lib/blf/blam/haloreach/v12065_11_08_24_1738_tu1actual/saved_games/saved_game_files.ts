import { c } from "../../../../struct";

export enum e_file_type {
  Screenshot = 2,
  Film = 3,
  FilmClip = 4,
  MapVariant = 5,
  GameVariant = 6,
}

@c.struct({ endian: "big" })
export class s_content_item_history {
  @c.field(c.time64())
  timestamp!: Date;

  @c.field("u64")
  xuid!: bigint;

  @c.field(c.ascii(16))
  name!: string;

  @c.field("u8", { pad_after: 3 })
  is_online!: number;
}

@c.struct({ endian: "big" })
export class s_content_item_general_metadata {
  @c.field(c.enum("i8", e_file_type), { pad_after: 3 })
  file_type!: e_file_type;

  @c.field("u32")
  size_in_bytes!: number;

  @c.field("u64")
  unique_id!: bigint;

  @c.field("u64")
  parent_unique_id!: bigint;

  @c.field("u64")
  root_unique_id!: bigint;

  @c.field("u64")
  game_id!: bigint;

  @c.field("i8")
  activity!: number;

  @c.field("u8")
  game_mode!: number;

  @c.field("u8", { pad_after: 2 })
  game_engine_type!: number;

  @c.field("i32")
  map_id!: number;
}

@c.struct({ endian: "big" })
export class s_content_item_display_metadata {
  @c.field("i8", { pad_after: 7 })
  megalo_category_index!: number;
}

@c.struct({ endian: "big" })
export class s_content_item_film_metadata {
  @c.field("i32")
  seconds!: number;
}

@c.struct({ endian: "big" })
export class s_content_item_game_variant_metadata {
  @c.field("i8")
  icon_index!: number;
}

@c.struct({ endian: "big" })
export class s_content_item_matchmaking_metadata {
  @c.field("u16")
  hopper_identifier!: number;
}

@c.struct({ endian: "big" })
export class s_content_item_campaign_metadata {
  @c.field("i32")
  campaign_id!: number;

  @c.field("i16")
  campaign_difficulty!: number;

  @c.field("i16")
  campaign_metagame_scoring!: number;

  @c.field("i32")
  campaign_insertion_point!: number;

  @c.field("i16")
  campaign_primary_skulls!: number;

  @c.field("i16")
  campaign_secondary_skulls!: number;
}

@c.struct({ endian: "big" })
export class s_content_item_firefight_metadata {
  @c.field("i16")
  firefight_difficulty!: number;

  @c.field("i16")
  firefight_primary_skulls!: number;

  @c.field("i16")
  firefight_secondary_skulls!: number;
}

/** Full `c_content_item_metadata` binrw layout (fixed prefix + conditional union tails). */
@c.struct({ endian: "big" })
export class s_content_item_metadata {
  @c.field(s_content_item_general_metadata)
  general!: s_content_item_general_metadata;

  @c.field(s_content_item_display_metadata)
  display!: s_content_item_display_metadata;

  @c.field(s_content_item_history)
  creation_history!: s_content_item_history;

  @c.field(s_content_item_history)
  modification_history!: s_content_item_history;

  @c.field(c.wstring(0x80))
  name!: string;

  @c.field(c.wstring(0x80))
  description!: string;

  @c.union(
    { size: 16 },
    c.when(e_file_type.Film, s_content_item_film_metadata, (m) => m.general.file_type),
    c.when(
      e_file_type.GameVariant,
      s_content_item_game_variant_metadata,
      (m) => m.general.file_type,
    ),
  )
  file_type_data:
    | s_content_item_film_metadata
    | s_content_item_game_variant_metadata
    | null = null;

  @c.union(
    { size: 16 },
    c.arm(s_content_item_matchmaking_metadata, (m) => m.general.activity === 3),
  )
  activity_data: s_content_item_matchmaking_metadata | null = null;

  @c.union(
    { size: 16 },
    c.arm(s_content_item_campaign_metadata, (m) => m.general.game_mode === 1),
    c.arm(s_content_item_firefight_metadata, (m) => m.general.game_mode === 2),
  )
  game_mode_data:
    | s_content_item_campaign_metadata
    | s_content_item_firefight_metadata
    | null = null;
}

