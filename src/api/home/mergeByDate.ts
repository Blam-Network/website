export function toTimestamp(value: Date | string): number {
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

export function mergeByDateDesc<T>(
  groups: T[][],
  getDate: (item: T) => Date | string,
  limit: number,
): T[] {
  return groups
    .flat()
    .sort((a, b) => toTimestamp(getDate(b)) - toTimestamp(getDate(a)))
    .slice(0, limit);
}
