/**
 * All `--ui-*` CSS custom property names used by `@theredhead/ui-kit`.
 *
 * Import these constants when you need to read or override tokens
 * programmatically (e.g. via `getComputedStyle` or `element.style.setProperty`).
 *
 * @example
 * ```ts
 * import { UI_TOKENS } from '@theredhead/ui-theme';
 *
 * const accent = getComputedStyle(el).getPropertyValue(UI_TOKENS.accent);
 * el.style.setProperty(UI_TOKENS.surface, '#fff');
 * ```
 */
export const UI_TOKENS = {
  // ── Core colours ───────────────────────────────────────────────
  text: "--ui-text",
  textMuted: "--ui-text-muted",
  muted: "--ui-muted",
  accent: "--ui-accent",
  accentHover: "--ui-accent-hover",
  accentContrast: "--ui-accent-contrast",
  link: "--ui-link",
  linkHover: "--ui-link-hover",
  error: "--ui-error",
  onError: "--ui-on-error",
  secondary: "--ui-secondary",
  tertiary: "--ui-tertiary",
  onTertiary: "--ui-on-tertiary",

  // ── Surfaces ───────────────────────────────────────────────────
  surface: "--ui-surface",
  surface2: "--ui-surface-2",
  surfaceVariant: "--ui-surface-variant",
  primaryContainer: "--ui-primary-container",
  onPrimaryContainer: "--ui-on-primary-container",
  bg: "--ui-bg",
  hoverBg: "--ui-hover-bg",
  shadow: "--ui-shadow",

  // ── Borders ────────────────────────────────────────────────────
  border: "--ui-border",
  borderStrong: "--ui-border-strong",

  // ── Typography ─────────────────────────────────────────────────
  font: "--ui-font",
  fontBody: "--ui-font-body",
  fontHeader: "--ui-font-header",
  fontCaption: "--ui-font-caption",
  fontFooter: "--ui-font-footer",
  fontBadge: "--ui-font-badge",
  fontSortIcon: "--ui-font-sort-icon",
  lsHeader: "--ui-ls-header",
  lsCaption: "--ui-ls-caption",

  // ── Badge (standalone) ─────────────────────────────────────────
  badgeBg: "--ui-badge-bg",
  badgeText: "--ui-badge-text",

  // ── Badge (table-view inline) ──────────────────────────────────
  badgeNeutralFg: "--ui-badge-neutral-fg",
  badgeNeutralBg: "--ui-badge-neutral-bg",
  badgeNeutralBorder: "--ui-badge-neutral-border",
  badgeSuccessFg: "--ui-badge-success-fg",
  badgeSuccessBg: "--ui-badge-success-bg",
  badgeSuccessBorder: "--ui-badge-success-border",
  badgeWarningFg: "--ui-badge-warning-fg",
  badgeWarningBg: "--ui-badge-warning-bg",
  badgeWarningBorder: "--ui-badge-warning-border",
  badgeDangerFg: "--ui-badge-danger-fg",
  badgeDangerBg: "--ui-badge-danger-bg",
  badgeDangerBorder: "--ui-badge-danger-border",
  badgePadding: "--ui-badge-padding",
  badgeLineHeight: "--ui-badge-line-height",
  badgeLetterSpacing: "--ui-badge-letter-spacing",

  // ── Table ──────────────────────────────────────────────────────
  captionBg: "--ui-caption-bg",
  captionText: "--ui-caption-text",
  viewportHeight: "--ui-viewport-height",
  resizeHandleWidth: "--ui-resize-handle-width",
  resizeIndicatorWidth: "--ui-resize-indicator-width",
  selectionColWidth: "--ui-selection-col-width",
  rowIndexWidth: "--ui-row-index-width",
  selectedBg: "--ui-selected-bg",
  selectedHoverBg: "--ui-selected-hover-bg",
  checkboxSize: "--ui-checkbox-size",
  radioSize: "--ui-radio-size",

  // ── Slider / Progress ──────────────────────────────────────────
  track: "--ui-track",
  thumb: "--ui-thumb",

  // ── Chip ───────────────────────────────────────────────────────
  chipBg: "--ui-chip-bg",
  chipText: "--ui-chip-text",
  chipDismiss: "--ui-chip-dismiss",

  // ── Avatar ─────────────────────────────────────────────────────
  fallback: "--ui-fallback",

  // ── Rich-text editor ───────────────────────────────────────────
  placeholderBg: "--ui-placeholder-bg",
  placeholderText: "--ui-placeholder-text",

  // ── Density ────────────────────────────────────────────────────
  density: "--ui-density",
  densityScale: "--ui-density-scale",
  controlHeight: "--ui-control-height",
  cellHeight: "--ui-cell-height",
  gap: "--ui-gap",
  inlinePadding: "--ui-inline-padding",
  blockPadding: "--ui-block-padding",
  radius: "--ui-radius",

  // ── Elevation ──────────────────────────────────────────────────
  shadowSm: "--ui-shadow-sm",
  shadowMd: "--ui-shadow-md",
  shadowLg: "--ui-shadow-lg",
  shadowXl: "--ui-shadow-xl",
  shadowDropdown: "--ui-shadow-dropdown",
} as const;

/** Union of all `--ui-*` CSS custom property names. */
export type UITokenName = (typeof UI_TOKENS)[keyof typeof UI_TOKENS];
