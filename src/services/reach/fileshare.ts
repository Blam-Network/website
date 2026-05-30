import { find_chunk, search_for_chunk, write_blffile } from "@blamnetwork/blf";
import {
    e_file_type,
    s_blf_chunk_compressed_data,
    s_blf_chunk_content_header,
    s_blf_chunk_end_of_file,
    s_blf_chunk_game_variant,
    s_blf_chunk_map_variant,
    s_blf_chunk_packed_game_variant,
    s_blf_chunk_start_of_file,
    c_game_variant,
    c_map_variant,
    s_content_item_metadata,
} from "@blamnetwork/blf/haloreach/v12065_11_08_24_1738_tu1actual";
import * as reach_mcc from "@blamnetwork/blf/haloreach_mcc/v_untracked_25_08_16_1352";
import { s_blf_chunk_fileshare_metadata } from "@blamnetwork/blf/mcc/v2025_08_16_178512_1_release";
import { convert_reach_gametype, e_reach_gametype_conversion_error } from "@blamnetwork/blf/helpers";
import type { ReachAdminFileshareTarget } from "@/src/constants/reachAdminFileshare";

const BLF_ENDIAN = "big" as const;
const REACH_TU1_BUILD_NUMBER = 12065;
const REACH_TU1_BUILD_SEQUENCE_NUMBER = 2;
const MCC_MAP_VARIANT_STRING_PREFIX = "$hr_mvar_";
const REACH_SHAREDFILE_MIME = "application/x-reach-sharedfile";

type ReachVariantMetadata = s_content_item_metadata;

type ReachGameVariantExtractResult =
    | { ok: true; variant: c_game_variant; convertedFromMcc: boolean }
    | { ok: false; error: string };

type ReachMapVariantExtractResult =
    | { ok: true; variant: c_map_variant }
    | { ok: false; error: string };

type ReachInferredFileType = {
    fileType: e_file_type;
    metadata: ReachVariantMetadata;
};

export type ParsedFileMetadata = {
    name: string;
    description: string;
    fileType: number;
    uniqueId: string;
    sizeInBytes: number;
};

export type ContentHeaderParseResult =
    | ({ ok: true } & ParsedFileMetadata)
    | { ok: false; error: string };

export type ReachFileshareUploadEntryPatch = {
    status?: "preparing" | "uploading" | "uploaded";
    uploadProgress?: number;
    error?: string;
};

function yieldToMain(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 0));
}

function isMccFileshareExport(data: Uint8Array): boolean {
    const fsm = new s_blf_chunk_fileshare_metadata();
    return find_chunk(data, fsm, BLF_ENDIAN);
}

function formatReachGametypeConversionError(
    error: e_reach_gametype_conversion_error,
): string {
    switch (error) {
        case e_reach_gametype_conversion_error.forge_variant:
            return "Forge (sandbox) gametypes cannot be converted for Xbox 360 upload";
        case e_reach_gametype_conversion_error.campaign_variant:
            return "Campaign gametypes cannot be converted for Xbox 360 upload";
        case e_reach_gametype_conversion_error.mcc_exclusive_action:
            return "This gametype uses MCC-only megalo actions that Xbox 360 does not support";
        case e_reach_gametype_conversion_error.mcc_exclusive_math_operator:
            return "This gametype uses MCC-only math operators (<<=, >>=) that Xbox 360 does not support";
        case e_reach_gametype_conversion_error.mcc_survival_additional_flags:
            return "This Firefight gametype uses MCC-only options (e.g. Network Test 1) that Xbox 360 does not support";
        case e_reach_gametype_conversion_error.insufficient_global_slots:
            return "This gametype uses too many temporary object, player, or team references to map onto Xbox 360 global slots";
        default:
            return "This MCC gametype cannot be converted for Xbox 360 upload";
    }
}

function extractReachGameVariant(
    data: Uint8Array,
    isMccFile: boolean,
): ReachGameVariantExtractResult {
    const cmp = new s_blf_chunk_compressed_data(s_blf_chunk_game_variant);
    if (search_for_chunk(data, cmp, BLF_ENDIAN)) {
        return { ok: true, variant: cmp.chunk.game_variant, convertedFromMcc: false };
    }

    if (isMccFile) {
        const mcc_gvar = new reach_mcc.s_blf_chunk_packed_game_variant();
        if (search_for_chunk(data, mcc_gvar, BLF_ENDIAN)) {
            const converted = new c_game_variant();
            const conversionError = convert_reach_gametype(
                mcc_gvar.game_variant,
                converted,
            );
            if (conversionError === e_reach_gametype_conversion_error.ok) {
                return { ok: true, variant: converted, convertedFromMcc: true };
            }
            return {
                ok: false,
                error: formatReachGametypeConversionError(conversionError),
            };
        }

        const mcc_mpvr = new reach_mcc.s_blf_chunk_game_variant();
        if (search_for_chunk(data, mcc_mpvr, BLF_ENDIAN)) {
            const converted = new c_game_variant();
            const conversionError = convert_reach_gametype(
                mcc_mpvr.game_variant,
                converted,
            );
            if (conversionError === e_reach_gametype_conversion_error.ok) {
                return { ok: true, variant: converted, convertedFromMcc: true };
            }
            return {
                ok: false,
                error: formatReachGametypeConversionError(conversionError),
            };
        }
    }

    const gvar = new s_blf_chunk_packed_game_variant();
    if (search_for_chunk(data, gvar, BLF_ENDIAN)) {
        return { ok: true, variant: gvar.game_variant, convertedFromMcc: false };
    }

    const mpvr = new s_blf_chunk_game_variant();
    if (search_for_chunk(data, mpvr, BLF_ENDIAN)) {
        return { ok: true, variant: mpvr.game_variant, convertedFromMcc: false };
    }

    return { ok: false, error: "Could not find a game variant in this file" };
}

function extractReachMapVariant(data: Uint8Array): ReachMapVariantExtractResult {
    const cmp = new s_blf_chunk_compressed_data(s_blf_chunk_map_variant);
    if (search_for_chunk(data, cmp, BLF_ENDIAN)) {
        return { ok: true, variant: cmp.chunk.map_variant };
    }

    const mvar = new s_blf_chunk_map_variant();
    if (search_for_chunk(data, mvar, BLF_ENDIAN)) {
        return { ok: true, variant: mvar.map_variant };
    }

    return { ok: false, error: "Could not find a map variant in this file" };
}

function readSourceContentHeader(
    data: Uint8Array,
): { chdr: s_blf_chunk_content_header; hasChdr: boolean; chdrIsLittleEndian: boolean } {
    const chdr = new s_blf_chunk_content_header();
    if (search_for_chunk(data, chdr, BLF_ENDIAN)) {
        return { chdr, hasChdr: true, chdrIsLittleEndian: false };
    }
    if (search_for_chunk(data, chdr, "little")) {
        return { chdr, hasChdr: true, chdrIsLittleEndian: true };
    }
    return { chdr, hasChdr: false, chdrIsLittleEndian: false };
}

function shouldNormalizeMapVariantContentHeader(
    hasChdr: boolean,
    isMccFile: boolean,
    chdrIsLittleEndian: boolean,
): boolean {
    if (!hasChdr) {
        return true;
    }
    // MCC fileshare exports include fsm; hopper downloads use little-endian chdr.
    return isMccFile || chdrIsLittleEndian;
}

function decodeMccMapVariantDisplayString(value: string): string {
    if (!value.startsWith(MCC_MAP_VARIANT_STRING_PREFIX)) {
        return value;
    }
    return value.slice(MCC_MAP_VARIANT_STRING_PREFIX.length).replaceAll("_", " ");
}

function applyMccMapVariantDisplayMetadata(metadata: ReachVariantMetadata): void {
    metadata.name = decodeMccMapVariantDisplayString(metadata.name);
    metadata.description = decodeMccMapVariantDisplayString(metadata.description);
}

function isMccMapVariantSource(isMccFile: boolean, chdrIsLittleEndian: boolean): boolean {
    return isMccFile || chdrIsLittleEndian;
}

function inferReachMapVariantMetadata(data: Uint8Array): ReachInferredFileType | undefined {
    const cmp = new s_blf_chunk_compressed_data(s_blf_chunk_map_variant);
    if (find_chunk(data, cmp, BLF_ENDIAN)) {
        return {
            fileType: e_file_type.MapVariant,
            metadata: cmp.chunk.map_variant.m_metadata,
        };
    }

    const mvar = new s_blf_chunk_map_variant();
    if (find_chunk(data, mvar, BLF_ENDIAN)) {
        return {
            fileType: e_file_type.MapVariant,
            metadata: mvar.map_variant.m_metadata,
        };
    }

    return undefined;
}

function inferReachFileTypeFromVariant(
    data: Uint8Array,
    isMccFile: boolean,
): ReachInferredFileType | undefined {
    const mapVariant = inferReachMapVariantMetadata(data);
    if (mapVariant) {
        return mapVariant;
    }

    if (isMccFile) {
        const mcc_gvar = new reach_mcc.s_blf_chunk_packed_game_variant();
        if (find_chunk(data, mcc_gvar, BLF_ENDIAN)) {
            return {
                fileType: e_file_type.GameVariant,
                metadata: mcc_gvar.game_variant.get_metadata(),
            };
        }

        const mcc_mpvr = new reach_mcc.s_blf_chunk_game_variant();
        if (find_chunk(data, mcc_mpvr, BLF_ENDIAN)) {
            return {
                fileType: e_file_type.GameVariant,
                metadata: mcc_mpvr.game_variant.get_metadata(),
            };
        }
    }

    const gvar = new s_blf_chunk_packed_game_variant();
    if (find_chunk(data, gvar, BLF_ENDIAN)) {
        return {
            fileType: e_file_type.GameVariant,
            metadata: gvar.game_variant.get_metadata(),
        };
    }

    const mpvr = new s_blf_chunk_game_variant();
    if (find_chunk(data, mpvr, BLF_ENDIAN)) {
        return {
            fileType: e_file_type.GameVariant,
            metadata: mpvr.game_variant.get_metadata(),
        };
    }

    return undefined;
}

function formatPrepareError(error: unknown): string {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("invalid distance") || message.includes("incorrect header check")) {
        return "Could not read compressed variant data (file may be corrupt or an unsupported layout)";
    }
    return message || "Error preparing file for upload";
}

function applyReachDisplayMetadata(
    chdr: s_blf_chunk_content_header,
    metadata: ReachVariantMetadata,
    display: { name: string; description: string },
): void {
    chdr.metadata.name = display.name;
    chdr.metadata.description = display.description;
    metadata.name = display.name;
    metadata.description = display.description;
}

function applyReachContentHeaderForUpload(
    chdr: s_blf_chunk_content_header,
    metadata: ReachVariantMetadata,
): void {
    chdr.build_number = REACH_TU1_BUILD_NUMBER;
    chdr.build_sequence_number = REACH_TU1_BUILD_SEQUENCE_NUMBER;
    chdr.metadata = metadata;
}

function readContentHeaderFromBlf(data: Uint8Array): s_blf_chunk_content_header | undefined {
    const chdr = new s_blf_chunk_content_header();
    if (search_for_chunk(data, chdr, BLF_ENDIAN)) {
        return chdr;
    }
    return undefined;
}

/** Repack source BLF into fileshare layout (_blf + chdr + _cmp(variant) + _eof). */
export function prepareFileshareUpload(
    data: Uint8Array,
    displayMetadata?: { name: string; description: string },
): Uint8Array {
    try {
        const _blf = new s_blf_chunk_start_of_file();
        const _eof = new s_blf_chunk_end_of_file();
        const isMccFile = isMccFileshareExport(data);
        const { chdr, hasChdr, chdrIsLittleEndian } = readSourceContentHeader(data);
        let fileType = hasChdr ? chdr.metadata.general.file_type : undefined;

        if (!fileType) {
            const inferred = inferReachFileTypeFromVariant(data, isMccFile);
            if (!inferred) {
                throw new Error(
                    hasChdr
                        ? "Missing or unsupported file type"
                        : "Missing content header (chdr) chunk",
                );
            }

            fileType = inferred.fileType;
            applyReachContentHeaderForUpload(chdr, inferred.metadata);
        }

        switch (fileType) {
            case e_file_type.GameVariant: {
                const extracted = extractReachGameVariant(data, isMccFile);
                if (!extracted.ok) {
                    throw new Error(extracted.error);
                }

                if (extracted.convertedFromMcc) {
                    applyReachContentHeaderForUpload(
                        chdr,
                        extracted.variant.get_metadata(),
                    );
                }

                if (displayMetadata !== undefined) {
                    applyReachDisplayMetadata(
                        chdr,
                        extracted.variant.get_metadata(),
                        displayMetadata,
                    );
                }

                const mpvr = new s_blf_chunk_game_variant();
                mpvr.game_variant = extracted.variant;
                const _cmp = new s_blf_chunk_compressed_data(
                    s_blf_chunk_game_variant,
                    mpvr,
                );

                return write_blffile(BLF_ENDIAN, [_blf, chdr, _cmp, _eof]);
            }
            case e_file_type.MapVariant: {
                const extracted = extractReachMapVariant(data);
                if (!extracted.ok) {
                    throw new Error(extracted.error);
                }

                if (isMccMapVariantSource(isMccFile, chdrIsLittleEndian)) {
                    applyMccMapVariantDisplayMetadata(extracted.variant.m_metadata);
                }

                if (shouldNormalizeMapVariantContentHeader(hasChdr, isMccFile, chdrIsLittleEndian)) {
                    applyReachContentHeaderForUpload(chdr, extracted.variant.m_metadata);
                }

                if (displayMetadata !== undefined) {
                    applyReachDisplayMetadata(
                        chdr,
                        extracted.variant.m_metadata,
                        displayMetadata,
                    );
                }

                const mvar = new s_blf_chunk_map_variant();
                mvar.map_variant = extracted.variant;
                const _cmp = new s_blf_chunk_compressed_data(
                    s_blf_chunk_map_variant,
                    mvar,
                );

                return write_blffile(BLF_ENDIAN, [_blf, chdr, _cmp, _eof]);
            }
            default:
                throw new Error(`Unsupported Reach file type: ${fileType}`);
        }
    } catch (error) {
        console.error(error);
        throw new Error(formatPrepareError(error));
    }
}

export function formatReachFileType(fileType: number): string {
    switch (fileType) {
        case 2:
            return "Screenshot";
        case 3:
            return "Film";
        case 4:
            return "Film clip";
        case 5:
            return "Map variant";
        case 6:
            return "Game variant";
        default:
            return `Unknown (${fileType})`;
    }
}

export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function fileEntryKey(file: File): string {
    return `${file.name}-${file.size}-${file.lastModified}`;
}

function estimateUploadTotalBytes(fileBytes: number): number {
    // Multipart overhead for four text fields + file part headers.
    return fileBytes + 1024;
}

export function uploadReachBytes(
    uploadBytes: Uint8Array,
    fileName: string,
    metadata: ParsedFileMetadata,
    fileshareTarget: ReachAdminFileshareTarget,
    onProgress: (percent: number) => void,
): Promise<void> {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append(
            "file",
            new Blob([new Uint8Array(uploadBytes)], { type: REACH_SHAREDFILE_MIME }),
            fileName || "upload.blf",
        );
        formData.append("uniqueId", metadata.uniqueId);
        formData.append("fileType", String(metadata.fileType));
        formData.append("uncompressedSize", String(metadata.sizeInBytes));
        formData.append("compressedSize", String(uploadBytes.byteLength));

        const xhr = new XMLHttpRequest();
        const estimatedTotal = estimateUploadTotalBytes(uploadBytes.byteLength);
        let lastReported = -1;

        const report = (percent: number) => {
            const clamped = Math.min(100, Math.max(0, percent));
            if (clamped === lastReported) {
                return;
            }
            lastReported = clamped;
            onProgress(clamped);
        };

        report(0);

        xhr.upload.addEventListener("progress", (event) => {
            const total = event.lengthComputable ? event.total : estimatedTotal;
            const percent = total > 0 ? Math.floor((event.loaded / total) * 100) : 0;
            report(percent);
        });

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                report(100);
                resolve();
                return;
            }
            if (xhr.status === 401) {
                reject(new Error("Session expired — sign in again and retry the upload."));
                return;
            }
            try {
                const body = JSON.parse(xhr.responseText) as { error?: string; details?: string };
                reject(new Error(body.details ?? body.error ?? `Upload failed (${xhr.status})`));
            } catch {
                reject(new Error(`Upload failed (${xhr.status})`));
            }
        };
        xhr.onerror = () => {
            reject(new Error("Upload failed"));
        };
        xhr.onabort = () => {
            reject(new Error("Upload aborted"));
        };
        xhr.open("POST", `/api/reach/upload/${fileshareTarget}`);
        xhr.send(formData);
    });
}

export async function uploadReadyEntry(
    entry: { file: File; metadata: ParsedFileMetadata },
    fileshareTarget: ReachAdminFileshareTarget,
    updateEntry: (key: string, patch: ReachFileshareUploadEntryPatch) => void,
): Promise<void> {
    const key = fileEntryKey(entry.file);

    updateEntry(key, { status: "preparing", uploadProgress: undefined, error: undefined });
    await yieldToMain();

    const raw = new Uint8Array(await entry.file.arrayBuffer());
    await yieldToMain();
    const prepared = prepareFileshareUpload(raw, {
        name: entry.metadata.name,
        description: entry.metadata.description,
    });
    await yieldToMain();

    updateEntry(key, { status: "uploading", uploadProgress: 0 });
    await yieldToMain();

    await uploadReachBytes(prepared, entry.file.name, entry.metadata, fileshareTarget, (percent) => {
        updateEntry(key, { uploadProgress: percent });
    });

    updateEntry(key, { status: "uploaded", uploadProgress: 100 });
}

export async function parseFileForUpload(file: File): Promise<ContentHeaderParseResult> {
    const raw = new Uint8Array(await file.arrayBuffer());
    await yieldToMain();

    try {
        await yieldToMain();
        const prepared = prepareFileshareUpload(raw);
        await yieldToMain();
        const chdr = readContentHeaderFromBlf(prepared);
        if (!chdr) {
            return { ok: false, error: "Missing content header in prepared file" };
        }

        const general = chdr.metadata.general;
        return {
            ok: true,
            name: chdr.metadata.name,
            description: chdr.metadata.description,
            fileType: general.file_type,
            uniqueId: general.unique_id.toString(),
            sizeInBytes: general.size_in_bytes,
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unsupported file";
        return { ok: false, error: message };
    }
}
