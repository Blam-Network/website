/** Halo file descriptions encode newlines as |n|. */
export function formatFileshareDescription(description: string | null | undefined): string {
  if (!description) return "";
  return description.replace(/\|n\|/g, "\n");
}
