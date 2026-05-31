export const BARLOW_FAMILY = '"Barlow", "Segoe UI", system-ui, sans-serif';

export const FIXEDSYS_FAMILY = '"Fixedsys", "Fixedsys Excelsior 3.01", monospace';

/** Fixedsys renders small at 1:1 — bump all uses uniformly. */
export const FIXEDSYS_SCALE = 1.5;

export const fixedsysSize = (px: number) => `${px * FIXEDSYS_SCALE}px`;

export const fixedsysStyle = {
    fontFamily: FIXEDSYS_FAMILY,
    fontWeight: 400,
    letterSpacing: 0,
    WebkitFontSmoothing: 'none',
    MozOsxFontSmoothing: 'unset',
} as const;
