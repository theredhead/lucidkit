export type UIDensity = 'small' | 'compact' | 'comfortable' | 'generous';

export const DEFAULT_UI_DENSITY: UIDensity = 'comfortable';

export const UI_DENSITY_SCALE: Record<UIDensity, number> = {
    small: 0.86,
    compact: 0.93,
    comfortable: 1,
    generous: 1.12,
};

export interface UIDensityTokens {
    controlHeight: string;
    cellHeight: string;
    inlinePadding: string;
    blockPadding: string;
    gap: string;
    radius: string;
}

export const UI_DENSITY_TOKENS: Record<UIDensity, UIDensityTokens> = {
    small: {
        controlHeight: '1.7rem',
        cellHeight: '1.9rem',
        inlinePadding: '0.55rem',
        blockPadding: '0.45rem',
        gap: '0.45rem',
        radius: '0.45rem',
    },
    compact: {
        controlHeight: '1.9rem',
        cellHeight: '2.1rem',
        inlinePadding: '0.7rem',
        blockPadding: '0.55rem',
        gap: '0.6rem',
        radius: '0.5rem',
    },
    comfortable: {
        controlHeight: '2.05rem',
        cellHeight: '2.25rem',
        inlinePadding: '0.85rem',
        blockPadding: '0.65rem',
        gap: '0.75rem',
        radius: '0.55rem',
    },
    generous: {
        controlHeight: '2.3rem',
        cellHeight: '2.55rem',
        inlinePadding: '1rem',
        blockPadding: '0.8rem',
        gap: '0.9rem',
        radius: '0.65rem',
    },
};
