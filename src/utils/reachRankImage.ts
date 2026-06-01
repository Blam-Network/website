/**
 * Reach rank icons under `public/img/rank/reach/`.
 * Files are `{grade}_{subGrade}.png`; some top grades use `{grade}.png` at subGrade 0.
 */
export function getReachRankImagePath(grade: number, subGrade: number): string {
  const g = grade + 1;
  if (subGrade > 0) {
    return `/img/rank/reach/${g}_${subGrade}.png`;
  }
  if (g >= 10) {
    return `/img/rank/reach/${g}.png`;
  }
  return `/img/rank/reach/${g}_0.png`;
}
