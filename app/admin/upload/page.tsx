"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
    Box,
    Button,
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { search_for_chunk, write_blffile } from "@blamnetwork/blf";
import {
    e_file_type,
    s_blf_chunk_compressed_data,
    s_blf_chunk_content_header,
    s_blf_chunk_end_of_file,
    s_blf_chunk_game_variant,
    s_blf_chunk_packed_game_variant,
    s_blf_chunk_start_of_file,
    s_blf_chunk_author,
    c_game_variant,
} from "@blamnetwork/blf/haloreach/v12065_11_08_24_1738_tu1actual";
import * as reach_mcc from "@blamnetwork/blf/haloreach_mcc/v_untracked_25_08_19_1352";
import { convert_reach_gametype } from "@blamnetwork/blf/helpers";

const METADATA_COLUMN_COUNT = 4;
const REACH_SHAREDFILE_MIME = "application/x-reach-sharedfile";
const MAX_CONCURRENT_UPLOADS = 5;
/** XHR upload progress maps to 0–85%; 85–99% while waiting on /api/reach/upload (Reach LSP). */
const UPLOAD_CLIENT_PERCENT_CAP = 85;
const UPLOAD_SERVER_PERCENT_CAP = 99;
const UPLOAD_SERVER_TICK_MS = 150;

type GameVersion = "Halo: Reach";

/** Repack source BLF into fileshare layout (_blf + chdr + _cmp(mpvr) + _eof). */
function compressFile(
    data: Uint8Array,
    fileType: e_file_type,
    gameVersion: GameVersion,
): Uint8Array {
    switch (gameVersion) {
        case "Halo: Reach": {
            const _blf = new s_blf_chunk_start_of_file();
            const chdr = new s_blf_chunk_content_header();
            const _eof = new s_blf_chunk_end_of_file();

            // first we need to figure out wtf the user uploaded.
            // usually we can use the chdr for this but on occasion we cant
            search_for_chunk(data, chdr, "big");

            if (!chdr.metadata.general.file_type) {
                const mcc_gvar = new reach_mcc.s_blf_chunk_packed_game_variant();
                const mcc_mpvr = new reach_mcc.s_blf_chunk_game_variant();
                if (search_for_chunk(data, mcc_gvar, "big")) {
                    fileType = e_file_type.GameVariant;
                    chdr.build_number = 12065;
                    chdr.map_minor_version = 2;
                    chdr.metadata = mcc_gvar.game_variant.get_metadata();
                }
                else if (search_for_chunk(data, mcc_mpvr, "big")) {
                    fileType = e_file_type.GameVariant;
                    chdr.build_number = 12065;
                    chdr.map_minor_version = 2;
                    chdr.metadata = mcc_mpvr.game_variant.get_metadata();
                }
            }

            if (!chdr.metadata.general.file_type) {
                const gvar = new s_blf_chunk_packed_game_variant();
                const mpvr = new s_blf_chunk_game_variant();
                if (search_for_chunk(data, gvar, "big")) {
                    fileType = e_file_type.GameVariant;
                    chdr.build_number = 12065;
                    chdr.map_minor_version = 2;
                    chdr.metadata = gvar.game_variant.get_metadata();                
                }
                else if (search_for_chunk(data, mpvr, "big")) {
                    fileType = e_file_type.GameVariant;
                    chdr.build_number = 12065;
                    chdr.map_minor_version = 2;
                    chdr.metadata = mpvr.game_variant.get_metadata();
                }
            }

            switch (fileType) {
                case e_file_type.GameVariant: {
                    let game_variant: c_game_variant | undefined = undefined;
                    
                    if (!chdr.metadata.general.file_type) {
                        const mcc_gvar = new reach_mcc.s_blf_chunk_packed_game_variant();
                        const mcc_mpvr = new reach_mcc.s_blf_chunk_game_variant();
                        const converted_game_variant = new c_game_variant();
                        if (search_for_chunk(data, mcc_gvar, "big")
                            && convert_reach_gametype(mcc_gvar.game_variant, converted_game_variant)) {
                                game_variant = converted_game_variant;
                        }
                        else if (search_for_chunk(data, mcc_mpvr, "big") 
                            && convert_reach_gametype(mcc_mpvr.game_variant, converted_game_variant)) {
                            game_variant = converted_game_variant;
                        }
                    }
        
                    if (!chdr.metadata.general.file_type) {
                        const gvar = new s_blf_chunk_packed_game_variant();
                        const mpvr = new s_blf_chunk_game_variant();
                        if (search_for_chunk(data, gvar, "big")) {
                            game_variant = gvar.game_variant;              
                        }
                        else if (search_for_chunk(data, mpvr, "big")) {
                            game_variant = mpvr.game_variant;
                        }
                    }

                    if (!game_variant) {
                        throw new Error("Broken game variant file.");
                    }

                    // Fileshare uploads store mpvr inside _cmp, not as a top-level chunk.

                    const mpvr = new s_blf_chunk_game_variant();
                    mpvr.game_variant = game_variant;
                    const _cmp = new s_blf_chunk_compressed_data(s_blf_chunk_game_variant, mpvr);

                    return write_blffile("big", [_blf, chdr, _cmp, _eof]);
                }
                default:
                    throw new Error(`Unsupported Reach file type: ${fileType}`);
            }
        }
        default:
            throw new Error(`Unsupported game version: ${gameVersion}`);
    }
}

const HALO_REACH_BUILD_NUMBERS = {
    HALO_REACH_TU0: 11860,
    HALO_REACH_TU1: 12065,
}

function formatReachFileType(fileType: number): string {
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

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

const tableCellSx = {
    color: "#E0E0E0",
    borderColor: "#333",
    verticalAlign: "middle" as const,
    py: 0.5,
    px: 1,
    fontSize: "0.8125rem",
    lineHeight: 1.3,
};
const tableHeadCellSx = {
    color: "#B0B0B0",
    borderColor: "#333",
    py: 0.5,
    px: 1,
    fontSize: "0.75rem",
    fontWeight: 600,
    lineHeight: 1.3,
    whiteSpace: "nowrap" as const,
};
const tableStatusTypographySx = { fontSize: "0.8125rem", lineHeight: 1.3 };

type ParsedFileMetadata = {
    name: string;
    fileType: number;
    uniqueId: string;
    sizeInBytes: number;
    game: GameVersion;
};

type FileEntryStatus =
    | "parsing"
    | "ready"
    | "compressing"
    | "uploading"
    | "uploaded"
    | "error";

function yieldToMain(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 0));
}

async function runWithConcurrency<T>(
    items: readonly T[],
    limit: number,
    worker: (item: T) => Promise<void>,
): Promise<void> {
    const queue = [...items];
    const concurrency = Math.min(limit, queue.length);
    if (!concurrency) {
        return;
    }

    await Promise.all(
        Array.from({ length: concurrency }, async () => {
            while (queue.length > 0) {
                const item = queue.shift()!;
                await worker(item);
            }
        }),
    );
}

type SelectedFileEntry = {
    file: File;
    status: FileEntryStatus;
    metadata?: ParsedFileMetadata;
    error?: string;
    uploadProgress?: number;
};

function fileEntryKey(file: File): string {
    return `${file.name}-${file.size}-${file.lastModified}`;
}

function markDuplicateUniqueIdErrors(entries: SelectedFileEntry[]): SelectedFileEntry[] {
    const seenUniqueIds = new Set<string>();

    return entries.map((entry) => {
        if (entry.status !== "ready" || !entry.metadata) {
            return entry;
        }

        const { uniqueId } = entry.metadata;
        if (seenUniqueIds.has(uniqueId)) {
            return {
                file: entry.file,
                status: "error",
                error: "Duplicate unique ID in selection",
            };
        }

        seenUniqueIds.add(uniqueId);
        return entry;
    });
}

type ContentHeaderParseResult =
    | {
          ok: true;
          name: string;
          fileType: number;
          uniqueId: string;
          sizeInBytes: number;
          game: GameVersion;
      }
    | { ok: false; error: string };

async function compressReachFile(
    file: File,
    metadata: ParsedFileMetadata,
): Promise<Uint8Array> {
    const raw = new Uint8Array(await file.arrayBuffer());
    await yieldToMain();
    return compressFile(raw, metadata.fileType, metadata.game);
}

function estimateUploadTotalBytes(fileBytes: number): number {
    // Multipart overhead for four text fields + file part headers.
    return fileBytes + 1024;
}

function uploadReachBytes(
    uploadBytes: Uint8Array,
    fileName: string,
    metadata: ParsedFileMetadata,
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
        let serverPercent = UPLOAD_CLIENT_PERCENT_CAP;
        let serverTimer: ReturnType<typeof setInterval> | undefined;

        const report = (percent: number) => {
            const clamped = Math.min(100, Math.max(0, percent));
            if (clamped === lastReported) {
                return;
            }
            lastReported = clamped;
            onProgress(clamped);
        };

        const clearServerTimer = () => {
            if (serverTimer !== undefined) {
                clearInterval(serverTimer);
                serverTimer = undefined;
            }
        };

        const startServerPhase = () => {
            if (serverTimer !== undefined) {
                return;
            }
            report(UPLOAD_CLIENT_PERCENT_CAP);
            serverTimer = setInterval(() => {
                if (serverPercent < UPLOAD_SERVER_PERCENT_CAP) {
                    serverPercent += 1;
                    report(serverPercent);
                }
            }, UPLOAD_SERVER_TICK_MS);
        };

        const reportClientBytes = (loaded: number, total: number) => {
            const safeTotal = total > 0 ? total : estimatedTotal;
            const percent = Math.floor((loaded / safeTotal) * UPLOAD_CLIENT_PERCENT_CAP);
            report(percent);
            if (loaded >= safeTotal) {
                startServerPhase();
            }
        };

        report(0);

        xhr.upload.addEventListener("progress", (event) => {
            const total = event.lengthComputable ? event.total : estimatedTotal;
            reportClientBytes(event.loaded, total);
        });
        xhr.upload.addEventListener("load", () => {
            reportClientBytes(estimatedTotal, estimatedTotal);
            startServerPhase();
        });

        xhr.onload = () => {
            clearServerTimer();
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
            clearServerTimer();
            reject(new Error("Upload failed"));
        };
        xhr.onabort = () => {
            clearServerTimer();
            reject(new Error("Upload aborted"));
        };
        xhr.open("POST", "/api/reach/upload");
        xhr.send(formData);
    });
}

async function uploadReadyEntry(
    entry: SelectedFileEntry & { metadata: ParsedFileMetadata },
    updateEntry: (key: string, patch: Partial<SelectedFileEntry>) => void,
): Promise<void> {
    const key = fileEntryKey(entry.file);

    updateEntry(key, { status: "compressing", uploadProgress: undefined, error: undefined });
    await yieldToMain();

    const compressed = await compressReachFile(entry.file, entry.metadata);
    await yieldToMain();

    updateEntry(key, { status: "uploading", uploadProgress: 0 });
    await yieldToMain();

    await uploadReachBytes(compressed, entry.file.name, entry.metadata, (percent) => {
        updateEntry(key, { uploadProgress: percent });
    });

    updateEntry(key, { status: "uploaded", uploadProgress: 100 });
}

async function parseContentHeaderFromFile(file: File): Promise<ContentHeaderParseResult> {
    const buffer = new Uint8Array(await file.arrayBuffer());
    const chunk = new s_blf_chunk_content_header();
    try {
        const found = search_for_chunk(buffer, chunk, "big");
        if (
            found &&
            (chunk.build_number === HALO_REACH_BUILD_NUMBERS.HALO_REACH_TU0 ||
                chunk.build_number === HALO_REACH_BUILD_NUMBERS.HALO_REACH_TU1)
        )
        {
            const general = chunk.metadata.general;
            return {
                ok: true,
                name: chunk.metadata.name,
                fileType: general.file_type,
                uniqueId: general.unique_id.toString(),
                sizeInBytes: general.size_in_bytes,
                game: "Halo: Reach",
            };
        }


    } catch {
        return { ok: false, error: "Error parsing file" };
    }

    return { ok: false, error: "Unsupported file" };
}

export default function AdminUploadPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFiles, setSelectedFiles] = useState<SelectedFileEntry[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const updateEntry = (key: string, patch: Partial<SelectedFileEntry>) => {
        setSelectedFiles((prev) =>
            prev.map((entry) => (fileEntryKey(entry.file) === key ? { ...entry, ...patch } : entry)),
        );
    };

    useEffect(() => {
        if (status === "loading") return;
        if (!session?.user?.is_admin) {
            router.push("/");
        }
    }, [session, status, router]);

    const fileSelectDisabled =
        isUploading ||
        selectedFiles.some(
            (entry) => entry.status === "compressing" || entry.status === "uploading",
        );

    const handleChooseFiles = () => {
        if (fileSelectDisabled) return;
        fileInputRef.current?.click();
    };

    const handleFilesSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (fileSelectDisabled) return;

        const files = event.target.files;
        if (!files?.length) return;

        const fileList = Array.from(files);
        const entries: SelectedFileEntry[] = fileList.map((file) => ({
            file,
            status: "parsing",
        }));
        setSelectedFiles(entries);
        event.target.value = "";

        const parseResults = await Promise.all(
            fileList.map(async (file) => parseContentHeaderFromFile(file)),
        );

        setSelectedFiles(
            markDuplicateUniqueIdErrors(
                fileList.map((file, index) => {
                    const result = parseResults[index]!;
                    if (result.ok) {
                        return {
                            file,
                            status: "ready" as const,
                            metadata: {
                                name: result.name,
                                fileType: result.fileType,
                                uniqueId: result.uniqueId,
                                sizeInBytes: result.sizeInBytes,
                                game: result.game,
                            },
                        };
                    }
                    return { file, status: "error" as const, error: result.error };
                }),
            ),
        );
    };

    const handleRemoveFile = (key: string) => {
        setSelectedFiles((prev) => prev.filter((entry) => fileEntryKey(entry.file) !== key));
    };

    const hasFileError = selectedFiles.some((entry) => entry.status === "error");
    const hasReadyFiles = selectedFiles.some((entry) => entry.status === "ready");
    const isParsing = selectedFiles.some((entry) => entry.status === "parsing");

    const handleUpload = async () => {
        const toUpload = selectedFiles.filter(
            (entry): entry is SelectedFileEntry & { metadata: ParsedFileMetadata } =>
                entry.status === "ready" && !!entry.metadata,
        );
        if (!toUpload.length) return;

        setIsUploading(true);

        await runWithConcurrency(toUpload, MAX_CONCURRENT_UPLOADS, async (entry) => {
            const key = fileEntryKey(entry.file);
            try {
                await uploadReadyEntry(entry, updateEntry);
            } catch (error) {
                const message = error instanceof Error ? error.message : "Upload failed";
                updateEntry(key, { status: "error", error: message, uploadProgress: undefined });
            }
        });

        setIsUploading(false);
    };

    if (status === "loading" || !session?.user?.is_admin) {
        return (
            <Box sx={{ width: "100%", minHeight: "50vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <LoadingSpinner size={96} />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Button
                component={Link}
                href="/admin"
                startIcon={<ArrowBackIcon />}
                sx={{ mb: 2, color: "#B0B0B0", "&:hover": { color: "#7CB342" } }}
            >
                Admin
            </Button>

            <Typography variant="h4" sx={{ mb: 1, color: "#E0E0E0" }}>
                Upload
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: "#B0B0B0" }}>
                Select files to upload. Currently Halo: Reach release files are supported.
            </Typography>

            <input
                ref={fileInputRef}
                type="file"
                multiple
                hidden
                disabled={fileSelectDisabled}
                onChange={handleFilesSelected}
            />

            <Button
                variant="outlined"
                onClick={handleChooseFiles}
                disabled={fileSelectDisabled}
                sx={{
                    mb: 3,
                    color: "#E0E0E0",
                    borderColor: "#555",
                    "&:hover": { borderColor: "#7CB342", color: "#7CB342" },
                }}
            >
                Choose files
            </Button>

            {selectedFiles.length > 0 && (
                <>
                    <TableContainer
                        sx={{
                            mb: 3,
                            bgcolor: "#1A1A1A",
                            border: "1px solid #333",
                            borderRadius: 1,
                        }}
                    >
                        <Table
                            size="small"
                            sx={{
                                "& .MuiTableCell-root": { borderBottomColor: "#333" },
                                "& .MuiTableRow-root:last-child .MuiTableCell-root": { borderBottom: 0 },
                            }}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={tableHeadCellSx}>File</TableCell>
                                    <TableCell sx={tableHeadCellSx}>Status</TableCell>
                                    <TableCell sx={tableHeadCellSx}>Name</TableCell>
                                    <TableCell sx={tableHeadCellSx}>Game</TableCell>
                                    <TableCell sx={tableHeadCellSx}>File type</TableCell>
                                    <TableCell sx={tableHeadCellSx}>Size</TableCell>
                                    <TableCell sx={{ ...tableHeadCellSx, width: 36, px: 0.5 }} />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedFiles.map((entry) => {
                                    const metadata = entry.metadata;
                                    const key = fileEntryKey(entry.file);

                                    return (
                                        <TableRow key={key}>
                                            <TableCell sx={tableCellSx}>{entry.file.name}</TableCell>
                                            <TableCell sx={tableCellSx}>
                                                {entry.status === "ready" && (
                                                    <Typography sx={{ ...tableStatusTypographySx, color: "#7CB342" }}>
                                                        Ready
                                                    </Typography>
                                                )}
                                                {entry.status === "compressing" && (
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                        <LoadingSpinner size={16} />
                                                        <Typography sx={{ ...tableStatusTypographySx, color: "#E0E0E0" }}>
                                                            Compressing…
                                                        </Typography>
                                                    </Box>
                                                )}
                                                {entry.status === "uploading" && (
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                        <LoadingSpinner size={16} />
                                                        <Typography sx={{ ...tableStatusTypographySx, color: "#E0E0E0" }}>
                                                            {(entry.uploadProgress ?? 0) >= UPLOAD_CLIENT_PERCENT_CAP
                                                                ? `Finishing ${entry.uploadProgress ?? 0}%`
                                                                : `Uploading ${entry.uploadProgress ?? 0}%`}
                                                        </Typography>
                                                    </Box>
                                                )}
                                                {entry.status === "uploaded" && (
                                                    <Typography sx={{ ...tableStatusTypographySx, color: "#64B5F6" }}>
                                                        Uploaded
                                                    </Typography>
                                                )}
                                                {entry.status === "error" && (
                                                    <Typography sx={{ ...tableStatusTypographySx, color: "#e57373" }}>
                                                        Error
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            {entry.status === "parsing" && (
                                                <TableCell colSpan={METADATA_COLUMN_COUNT} sx={tableCellSx}>
                                                    <Typography sx={{ ...tableStatusTypographySx, color: "#888" }}>
                                                        Parsing…
                                                    </Typography>
                                                </TableCell>
                                            )}
                                            {entry.status === "error" && (
                                                <TableCell colSpan={METADATA_COLUMN_COUNT} sx={tableCellSx}>
                                                    <Typography sx={{ ...tableStatusTypographySx, color: "#e57373" }}>
                                                        {entry.error}
                                                    </Typography>
                                                </TableCell>
                                            )}
                                            {(entry.status === "ready" ||
                                                entry.status === "compressing" ||
                                                entry.status === "uploading" ||
                                                entry.status === "uploaded") &&
                                                metadata && (
                                                <>
                                                    <TableCell sx={tableCellSx}>{metadata.name}</TableCell>
                                                    <TableCell sx={tableCellSx}>{metadata.game}</TableCell>
                                                    <TableCell sx={tableCellSx}>{formatReachFileType(metadata.fileType)}</TableCell>
                                                    <TableCell sx={tableCellSx}>{formatFileSize(metadata.sizeInBytes)}</TableCell>
                                                </>
                                            )}
                                            <TableCell sx={{ ...tableCellSx, width: 36, py: 0, px: 0.5 }}>
                                                <IconButton
                                                    size="small"
                                                    aria-label={`Remove ${entry.file.name}`}
                                                    onClick={() => handleRemoveFile(key)}
                                                    disabled={
                                                        isUploading ||
                                                        entry.status === "compressing" ||
                                                        entry.status === "uploading"
                                                    }
                                                    sx={{
                                                        p: 0.25,
                                                        color: "#888",
                                                        "&:hover": { color: "#e57373" },
                                                    }}
                                                >
                                                    <CloseIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Button
                        variant="contained"
                        disabled={hasFileError || isUploading || isParsing || !hasReadyFiles}
                        onClick={handleUpload}
                        startIcon={<UploadFileIcon />}
                        sx={{
                            bgcolor: "#7CB342",
                            "&:hover": { bgcolor: "#689F38" },
                        }}
                    >
                        Upload
                    </Button>
                </>
            )}
        </Container>
    );
}
