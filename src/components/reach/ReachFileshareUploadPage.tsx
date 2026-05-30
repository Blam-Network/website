"use client";

import { memo, startTransition, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
    Box,
    Button,
    Container,
    Modal,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import {
    REACH_ADMIN_FILESHARE_TARGETS,
    type ReachAdminFileshareTarget,
} from "@/src/constants/reachAdminFileshare";
import { ReachAdminFileshareFilesTables } from "@/src/components/reach/ReachAdminFileshareFilesTables";
import {
    fileEntryKey,
    formatFileSize,
    formatReachFileType,
    parseFileForUpload,
    uploadReadyEntry,
    type ParsedFileMetadata,
} from "@/src/services/reach/fileshare";

const METADATA_COLUMN_COUNT = 3;
const MAX_CONCURRENT_PARSING = 1;
const MAX_CONCURRENT_UPLOADS = 1;

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
const STATUS_COLUMN_WIDTH = 148;
const tableStatusCellSx = {
    ...tableCellSx,
    width: STATUS_COLUMN_WIDTH,
    minWidth: STATUS_COLUMN_WIDTH,
    maxWidth: STATUS_COLUMN_WIDTH,
    whiteSpace: "nowrap" as const,
};
const tableStatusHeadCellSx = {
    ...tableHeadCellSx,
    width: STATUS_COLUMN_WIDTH,
    minWidth: STATUS_COLUMN_WIDTH,
    maxWidth: STATUS_COLUMN_WIDTH,
};
const modalTextFieldSx = {
    "& .MuiInputLabel-root": { color: "#888" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#7CB342" },
    "& .MuiOutlinedInput-root": {
        color: "#E0E0E0",
        "& fieldset": { borderColor: "#444" },
        "&:hover fieldset": { borderColor: "#666" },
        "&.Mui-focused fieldset": { borderColor: "#7CB342" },
    },
};

function StatusWithSpinner({ label, color }: { label: string; color: string }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, minWidth: 0 }}>
            <LoadingSpinner size={18} periodSec={6} />
            <Typography
                noWrap
                sx={{ ...tableStatusTypographySx, color, fontVariantNumeric: "tabular-nums" }}
            >
                {label}
            </Typography>
        </Box>
    );
}

type UploadNameEditModalProps = {
    open: boolean;
    fileName: string;
    initialName: string;
    initialDescription: string;
    onClose: () => void;
    onSave: (values: { name: string; description: string }) => void;
};

function UploadNameEditModal({
    open,
    fileName,
    initialName,
    initialDescription,
    onClose,
    onSave,
}: UploadNameEditModalProps) {
    const [nameDraft, setNameDraft] = useState(initialName);
    const [descriptionDraft, setDescriptionDraft] = useState(initialDescription);

    useEffect(() => {
        if (open) {
            setNameDraft(initialName);
            setDescriptionDraft(initialDescription);
        }
    }, [open, initialName, initialDescription]);

    const handleSave = () => {
        const trimmedName = nameDraft.trim();
        if (!trimmedName) {
            return;
        }
        onSave({ name: trimmedName, description: descriptionDraft });
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="upload-name-edit-title"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(4px)",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 420,
                    mx: 2,
                    p: 3,
                    bgcolor: "#1A1A1A",
                    border: "1px solid #333",
                    borderRadius: 1,
                    outline: "none",
                }}
            >
                <Typography id="upload-name-edit-title" variant="h6" sx={{ color: "#E0E0E0", mb: 0.5 }}>
                    Edit name and description
                </Typography>
                <Typography variant="body2" sx={{ color: "#888", mb: 2 }}>
                    {fileName}
                </Typography>
                <TextField
                    value={nameDraft}
                    onChange={(event) => setNameDraft(event.target.value)}
                    label="Name"
                    fullWidth
                    autoFocus
                    inputProps={{ maxLength: 128 }}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                            event.preventDefault();
                            handleSave();
                        }
                        if (event.key === "Escape") {
                            onClose();
                        }
                    }}
                    sx={{ ...modalTextFieldSx, mb: 2 }}
                />
                <TextField
                    value={descriptionDraft}
                    onChange={(event) => setDescriptionDraft(event.target.value)}
                    label="Description"
                    fullWidth
                    multiline
                    minRows={3}
                    inputProps={{ maxLength: 128 }}
                    onKeyDown={(event) => {
                        if (event.key === "Escape") {
                            onClose();
                        }
                    }}
                    sx={modalTextFieldSx}
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}>
                    <Button
                        onClick={onClose}
                        sx={{ color: "#B0B0B0", "&:hover": { color: "#E0E0E0" } }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={!nameDraft.trim()}
                        sx={{
                            bgcolor: "#7CB342",
                            "&:hover": { bgcolor: "#689F38" },
                        }}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

type UploadFileRowProps = {
    entry: SelectedFileEntry;
    onRemove: (key: string) => void;
    onEdit: (key: string) => void;
    removeDisabled: boolean;
};

const UploadFileRow = memo(function UploadFileRow({
    entry,
    onRemove,
    onEdit,
    removeDisabled,
}: UploadFileRowProps) {
    const metadata = entry.metadata;
    const key = fileEntryKey(entry.file);

    return (
        <TableRow>
            <TableCell
                sx={{
                    ...tableCellSx,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
            >
                {entry.file.name}
            </TableCell>
            <TableCell sx={tableStatusCellSx}>
                {entry.status === "parsing" && (
                    <Typography sx={{ ...tableStatusTypographySx, color: "#888" }}>
                        Parsing…
                    </Typography>
                )}
                {entry.status === "ready" && (
                    <Typography sx={{ ...tableStatusTypographySx, color: "#7CB342" }}>
                        Ready
                    </Typography>
                )}
                {entry.status === "preparing" && (
                    <StatusWithSpinner label="Preparing…" color="#E0E0E0" />
                )}
                {entry.status === "uploading" && (
                    <StatusWithSpinner
                        label={`Uploading ${entry.uploadProgress ?? 0}%`}
                        color="#E0E0E0"
                    />
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
                <TableCell colSpan={METADATA_COLUMN_COUNT} sx={tableCellSx} />
            )}
            {entry.status === "error" && (
                <TableCell colSpan={METADATA_COLUMN_COUNT} sx={tableCellSx}>
                    <Typography sx={{ ...tableStatusTypographySx, color: "#e57373" }}>
                        {entry.error}
                    </Typography>
                </TableCell>
            )}
            {(entry.status === "ready" ||
                entry.status === "preparing" ||
                entry.status === "uploading" ||
                entry.status === "uploaded") &&
                metadata && (
                <>
                    <TableCell sx={tableCellSx}>{metadata.name}</TableCell>
                    <TableCell sx={tableCellSx}>{formatReachFileType(metadata.fileType)}</TableCell>
                    <TableCell sx={tableCellSx}>{formatFileSize(metadata.sizeInBytes)}</TableCell>
                </>
            )}
            <TableCell sx={{ ...tableCellSx, width: 72, py: 0, px: 0.5, whiteSpace: "nowrap" }}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    {entry.status === "ready" && metadata && (
                        <IconButton
                            size="small"
                            aria-label={`Edit name and description for ${entry.file.name}`}
                            onClick={() => onEdit(key)}
                            disabled={removeDisabled}
                            sx={{
                                p: 0.25,
                                color: "#888",
                                "&:hover": { color: "#7CB342" },
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    )}
                    <IconButton
                    size="small"
                    aria-label={`Remove ${entry.file.name}`}
                    onClick={() => onRemove(key)}
                    disabled={removeDisabled}
                    sx={{
                        p: 0.25,
                        color: "#888",
                        "&:hover": { color: "#e57373" },
                    }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
                </Box>
            </TableCell>
        </TableRow>
    );
});

type FileEntryStatus =
    | "parsing"
    | "ready"
    | "preparing"
    | "uploading"
    | "uploaded"
    | "error";

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
                error: DUPLICATE_UNIQUE_ID_ERROR,
            };
        }

        seenUniqueIds.add(uniqueId);
        return entry;
    });
}

const DUPLICATE_UNIQUE_ID_ERROR = "Duplicate unique ID in selection";

function selectionHasDuplicates(entries: SelectedFileEntry[]): boolean {
    if (
        entries.some(
            (entry) => entry.status === "error" && entry.error === DUPLICATE_UNIQUE_ID_ERROR,
        )
    ) {
        return true;
    }

    const seenUniqueIds = new Set<string>();
    for (const entry of entries) {
        if (entry.status !== "ready" || !entry.metadata) {
            continue;
        }
        if (seenUniqueIds.has(entry.metadata.uniqueId)) {
            return true;
        }
        seenUniqueIds.add(entry.metadata.uniqueId);
    }
    return false;
}

function removeDuplicateEntries(entries: SelectedFileEntry[]): SelectedFileEntry[] {
    const seenUniqueIds = new Set<string>();

    return entries.filter((entry) => {
        if (entry.status === "error" && entry.error === DUPLICATE_UNIQUE_ID_ERROR) {
            return false;
        }
        if (entry.status === "ready" && entry.metadata) {
            if (seenUniqueIds.has(entry.metadata.uniqueId)) {
                return false;
            }
            seenUniqueIds.add(entry.metadata.uniqueId);
        }
        return true;
    });
}

export function ReachFileshareUploadPage({
    fileshareTarget,
}: {
    fileshareTarget: ReachAdminFileshareTarget;
}) {
    const fileshareLabel = REACH_ADMIN_FILESHARE_TARGETS[fileshareTarget].label;
    const router = useRouter();
    const { data: session, status } = useSession();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFiles, setSelectedFiles] = useState<SelectedFileEntry[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [nameEditKey, setNameEditKey] = useState<string | null>(null);
    const [uploadedFilesRefreshKey, setUploadedFilesRefreshKey] = useState(0);

    const updateEntry = (key: string, patch: Partial<SelectedFileEntry>) => {
        startTransition(() => {
            setSelectedFiles((prev) =>
                prev.map((entry) =>
                    fileEntryKey(entry.file) === key ? { ...entry, ...patch } : entry,
                ),
            );
        });
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
            (entry) => entry.status === "preparing" || entry.status === "uploading",
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
        event.target.value = "";
        setSelectedFiles(entries);

        await runWithConcurrency(fileList, MAX_CONCURRENT_PARSING, async (file) => {
            const key = fileEntryKey(file);
            const result = await parseFileForUpload(file);

            startTransition(() => {
                setSelectedFiles((prev) =>
                    markDuplicateUniqueIdErrors(
                        prev.map((entry) => {
                            if (fileEntryKey(entry.file) !== key) {
                                return entry;
                            }
                            if (result.ok) {
                                return {
                                    file,
                                    status: "ready" as const,
                                    metadata: {
                                        name: result.name,
                                        description: result.description,
                                        fileType: result.fileType,
                                        uniqueId: result.uniqueId,
                                        sizeInBytes: result.sizeInBytes,
                                    },
                                };
                            }
                            return { file, status: "error" as const, error: result.error };
                        }),
                    ),
                );
            });
        });
    };

    const handleRemoveFile = useCallback((key: string) => {
        setSelectedFiles((prev) => prev.filter((entry) => fileEntryKey(entry.file) !== key));
    }, []);

    const handleMetadataChange = useCallback(
        (key: string, values: { name: string; description: string }) => {
            startTransition(() => {
                setSelectedFiles((prev) =>
                    prev.map((entry) =>
                        fileEntryKey(entry.file) === key && entry.metadata
                            ? { ...entry, metadata: { ...entry.metadata, ...values } }
                            : entry,
                    ),
                );
            });
        },
        [],
    );

    const handleOpenNameEdit = useCallback((key: string) => {
        setNameEditKey(key);
    }, []);

    const handleCloseNameEdit = useCallback(() => {
        setNameEditKey(null);
    }, []);

    const nameEditEntry =
        nameEditKey !== null
            ? selectedFiles.find((entry) => fileEntryKey(entry.file) === nameEditKey)
            : undefined;

    const hasFileError = selectedFiles.some((entry) => entry.status === "error");
    const hasReadyFiles = selectedFiles.some((entry) => entry.status === "ready");
    const isParsing = selectedFiles.some((entry) => entry.status === "parsing");
    const isPreparing = selectedFiles.some((entry) => entry.status === "preparing");
    const hasDuplicates = selectionHasDuplicates(selectedFiles);

    const handleRemoveDuplicates = () => {
        setSelectedFiles((prev) => removeDuplicateEntries(prev));
    };

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
                await uploadReadyEntry(entry, fileshareTarget, updateEntry);
            } catch (error) {
                const message = error instanceof Error ? error.message : "Upload failed";
                updateEntry(key, { status: "error", error: message, uploadProgress: undefined });
            }
        });

        setIsUploading(false);
        setUploadedFilesRefreshKey((key) => key + 1);
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
                href="/reach/admin"
                startIcon={<ArrowBackIcon />}
                sx={{ mb: 2, color: "#B0B0B0", "&:hover": { color: "#7CB342" } }}
            >
                Admin
            </Button>

            <Typography variant="h4" sx={{ mb: 1, color: "#E0E0E0" }}>
                Halo: Reach File Share - {fileshareLabel}
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: "#B0B0B0" }}>
                Upload files to the {fileshareLabel} Reach file share. Halo: Reach release files from Xbox 360 and MCC are supported.
            </Typography>

            <ReachAdminFileshareFilesTables
                fileshareTarget={fileshareTarget}
                refreshKey={uploadedFilesRefreshKey}
            />

            <Typography variant="h5" sx={{ color: "#E0E0E0", mb: 2 }}>
                Upload queue
            </Typography>

            <input
                ref={fileInputRef}
                type="file"
                multiple
                hidden
                disabled={fileSelectDisabled}
                onChange={handleFilesSelected}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Button
                    variant="outlined"
                    onClick={handleChooseFiles}
                    disabled={fileSelectDisabled}
                    sx={{
                        color: "#E0E0E0",
                        borderColor: "#555",
                        "&:hover": { borderColor: "#7CB342", color: "#7CB342" },
                    }}
                >
                    Choose files
                </Button>
                {hasDuplicates && (
                    <Button
                        variant="outlined"
                        onClick={handleRemoveDuplicates}
                        disabled={fileSelectDisabled || isParsing}
                        sx={{
                            color: "#E0E0E0",
                            borderColor: "#555",
                            "&:hover": { borderColor: "#7CB342", color: "#7CB342" },
                        }}
                    >
                        Remove duplicates
                    </Button>
                )}
            </Box>

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
                                tableLayout: "fixed",
                                width: "100%",
                                "& .MuiTableCell-root": { borderBottomColor: "#333" },
                                "& .MuiTableRow-root:last-child .MuiTableCell-root": { borderBottom: 0 },
                            }}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={tableHeadCellSx}>File</TableCell>
                                    <TableCell sx={tableStatusHeadCellSx}>Status</TableCell>
                                    <TableCell sx={tableHeadCellSx}>Name</TableCell>
                                    <TableCell sx={tableHeadCellSx}>File type</TableCell>
                                    <TableCell sx={tableHeadCellSx}>Size</TableCell>
                                    <TableCell sx={{ ...tableHeadCellSx, width: 72, px: 0.5 }} />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedFiles.map((entry) => (
                                    <UploadFileRow
                                        key={fileEntryKey(entry.file)}
                                        entry={entry}
                                        onRemove={handleRemoveFile}
                                        onEdit={handleOpenNameEdit}
                                        removeDisabled={
                                            isUploading ||
                                            entry.status === "preparing" ||
                                            entry.status === "uploading"
                                        }
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Button
                        variant="contained"
                        disabled={hasFileError || isUploading || isParsing || !hasReadyFiles}
                        onClick={handleUpload}
                        startIcon={
                            isUploading || isPreparing ? (
                                <LoadingSpinner size={20} periodSec={6} />
                            ) : (
                                <UploadFileIcon />
                            )
                        }
                        sx={{
                            bgcolor: "#7CB342",
                            "&:hover": { bgcolor: "#689F38" },
                        }}
                    >
                        Upload
                    </Button>
                </>
            )}

            <UploadNameEditModal
                open={nameEditKey !== null && !!nameEditEntry?.metadata}
                fileName={nameEditEntry?.file.name ?? ""}
                initialName={nameEditEntry?.metadata?.name ?? ""}
                initialDescription={nameEditEntry?.metadata?.description ?? ""}
                onClose={handleCloseNameEdit}
                onSave={(values) => {
                    if (nameEditKey) {
                        handleMetadataChange(nameEditKey, values);
                    }
                    handleCloseNameEdit();
                }}
            />
        </Container>
    );
}
