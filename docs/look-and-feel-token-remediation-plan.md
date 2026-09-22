# Look-and-Feel Token Remediation Plan

This plan makes every component theme-aware while preserving local token injection. Each component should declare local semantic tokens, derive their defaults from root `--ui-*` tokens, and use only those local tokens in its styles.

## Token Contract

- [x] Define and document the canonical root tokens in `packages/ui-theme/src/lib/styles/_tokens.scss`.
- [x] Add shared root tokens for concepts used broadly, rather than creating unrelated aliases in individual components.
- [x] Establish the local-token pattern using component-specific names here:

  ```scss
  :host {
    --local-surface: var(--ui-surface);
    --local-text: var(--ui-text);
    --local-border: var(--ui-border);
    --local-shadow: var(--ui-shadow-dropdown);
  }
  ```

- [ ] Ensure component styles consume local tokens, not root tokens directly.
- [x] Preserve consumer overrides by allowing local tokens to be set on the component host.
- [x] Treat global tokens such as `--ui-font-mono` as defaults that components bridge through local tokens before descendants consume them.
- [x] Add an audit check for invalid `--ui-*` names and local tokens with hardcoded fallbacks that bypass root tokens.
- [x] Keep intentional extension points documented and chained to a valid root-token fallback.

## Popup And Overlay Components

These are the first priority because they expose theme failures most visibly.

- [x] Refactor `packages/ui-kit/src/lib/autocomplete/autocomplete.component.scss`.
  - Add local popup, option, chip, active-option, border, text, and shadow tokens.
  - Base them on `--ui-surface`, `--ui-hover-bg`, `--ui-selected-bg`, `--ui-accent`, and `--ui-shadow-dropdown`.
- [x] Refactor `packages/ui-kit/src/lib/dropdown-menu/dropdown-menu.component.scss`.
  - Replace the hardcoded panel shadow.
  - Add local panel surface, border, radius, and shadow tokens.
- [x] Refactor `packages/ui-kit/src/lib/dialog/dialog.component.scss`.
  - Add local surface, text, border, shadow, and backdrop tokens.
  - Base dialog elevation on `--ui-shadow-lg`.
- [x] Refactor `packages/ui-kit/src/lib/calendar-panel/calendar-panel.component.scss`.
  - Add local popup surface, text, border, shadow, and navigation-hover tokens.
- [x] Refactor `packages/ui-kit/src/lib/calendar/calendar-day-popover.component.scss`.
  - Apply the same popup token contract as the calendar panel.
- [x] Refactor `packages/ui-kit/src/lib/color-picker/color-picker-popover.component.scss`.
  - Add local surface, border, shadow, text, and focus tokens.
  - Verify swatches remain legible in dark mode.
- [x] Refactor popup styles in `packages/ui-kit/src/lib/input/input.component.scss`.
- [x] Refactor `packages/ui-kit/src/lib/drawer/drawer.component.scss`.
  - Add local panel surface, text, shadow, and backdrop tokens.
  - Base panel elevation on `--ui-shadow-lg`.
- [x] Audit `packages/ui-theme/src/lib/styles/_tooltip.scss`.
  - Ensure body-appended tooltips use semantic root tokens for text, surface, border, and shadow.

## Semantic Component Colors

- [x] Refactor `packages/ui-blocks/src/lib/command-palette/command-palette.component.scss`.
  - Keep the `--cp-*` local token layer.
  - Chain muted text, active text, keyboard hints, background, border, and shadow to root tokens.
- [x] Refactor warning states in:
  - `packages/ui-forms/src/lib/components/form-field/form-field.component.scss`
  - `packages/ui-forms/src/lib/components/form.component.scss`
  - Base warning foreground, surface, border, and code background on warning root tokens.
- [x] Refactor `packages/ui-kit/src/lib/toast/toast.component.scss`.
  - Add local success, warning, info, and error tokens.
  - Base error states on `--ui-error`.
- [x] Refactor `packages/ui-blocks/src/lib/property-sheet/property-sheet.component.scss`.
  - Replace danger fallbacks with local error tokens.
- [ ] Audit `packages/ui-blocks/src/lib/rich-text-editor/rich-text-editor.component.scss`.
  - Add local tokens for destructive actions, placeholders, dropdowns, pickers, and fullscreen overlays.
- [x] Refactor `packages/ui-kit/src/lib/json-view/json-node.component.scss`.
  - Keep syntax-specific tokens.
  - Derive key, string, number, boolean, and null colors from semantic root tokens.
- [x] Refactor `packages/ui-kit/src/lib/rating/rating.component.scss`.
  - Add local empty, filled, hover, disabled, and focus tokens.
- [x] Refactor `packages/ui-kit/src/lib/timeline/timeline.component.scss`.
  - Add local dot, connector, hover-ring, and focus tokens.
- [x] Review `packages/ui-kit/src/lib/signature/signature.component.scss`.
  - Decide whether the canvas intentionally remains paper-colored.
  - If intentional, expose it as a documented local override with a root-token fallback.

## Data Visualization And Loading States

- [x] Refactor chart colors through a `ChartColoringStrategy` abstraction in:
  - `packages/ui-kit/src/lib/chart/strategies/bar-graph.strategy.ts`
  - `packages/ui-kit/src/lib/chart/strategies/line-graph.strategy.ts`
  - `packages/ui-kit/src/lib/chart/strategies/scatter-plot.strategy.ts`
  - `packages/ui-kit/src/lib/chart/strategies/stacked-bar-graph.strategy.ts`
  - `packages/ui-kit/src/lib/chart/strategies/pie-chart.strategy.ts`
- [x] Add a `classic` coloring strategy that preserves the current on-screen chart palette.
- [x] Add a `modern` coloring strategy with a more intentional, theme-aware palette and contrast treatment.
- [x] Define chart text, grid, surface, and series token conventions for each strategy.
- [x] Keep strategy-specific and chart-specific overrides possible without bypassing the root theme.
- [x] Refactor table skeleton styles in `packages/ui-kit/src/lib/table-view/table-view-body/table-view-body.component.scss`.
  - Keep width, height, radius, and animation settings local.
  - Base skeleton colors on `--ui-border` and `--ui-surface-2`.
- [x] Audit `packages/ui-kit/src/lib/media-player/media-player.component.scss`.
  - Separate deliberate video-overlay colors from audio/control-surface colors.
  - Keep video controls legible while making audio mode theme-aware.

## Toolbar And Navigation Tools

- [x] Refactor `packages/ui-kit/src/lib/toolbar/tools/button-tool/button-tool.component.scss`.
  - Add local radius, text, hover surface, border, and focus tokens.
- [x] Refactor `packages/ui-kit/src/lib/toolbar/tools/toggle-tool/toggle-tool.component.scss`.
  - Add local checked-background and checked-text tokens.
  - Base checked text on `--ui-accent-contrast`.
- [x] Refactor inline styles in `packages/ui-kit/src/lib/toolbar/tools/dropdown-tool/dropdown-tool.component.ts`.
  - Apply the same local popup token pattern to list and icon-grid modes.
- [x] Audit toolbar shell background, border, shadow, and text tokens.

## Showcase Applications

These contain many intentionally local surfaces and need a separate visual pass.

- [x] Audit the recipe-book showcase.
  - Review cards, category panels, featured cards, and navigation in both modes.
- [x] Audit the video-sharing showcase.
  - Separate video surfaces from ordinary application surfaces.
- [x] Audit the warehouse-management showcase.
  - Review tables, warning/error states, and inline styles.
- [x] Audit the communication-suite showcase.
  - Review message panels, selected states, and composer surfaces.
- [x] Audit the quick-tour showcase.
  - Keep `--tour-*` tokens local while deriving their defaults from root tokens.

## Light/Dark Verification

- [ ] Test every popup and overlay in light mode.
- [ ] Test every popup and overlay with explicit `.dark-theme`.
- [ ] Test system dark mode with no explicit theme class.
- [ ] Test direct local-token overrides on component hosts.
- [ ] Test Theme Studio overrides for root tokens.
- [ ] Verify contrast for text, selected, hover, focus, disabled, warning, success, and error states.
- [ ] Check that body-appended overlays inherit the active theme correctly.

## Regression Coverage

- [x] Add a token-audit check for invalid root-token names.
- [ ] Add coverage for important local token host variables where practical.
- [ ] Add Storybook visual checks for autocomplete, dropdown menu, dialog, calendar, color picker, command palette, drawer, toast, and table loading rows.
- [ ] Capture light and dark screenshots for the popup/overlay group.
- [x] Run the Sass compilation check:

  ```sh
  npx sass --no-source-map --load-path=packages/ui-theme/src/lib/styles styles.scss /tmp/theme.css
  ```

- [x] Run the full test suite:

  ```sh
  npx vitest run
  ```

- [x] Run lint:

  ```sh
  npm run lint
  ```

## Recommended Execution Order

1. [ ] Finalize the root/local token contract and audit check.
2. [ ] Refactor autocomplete, dropdown menu, dialog, calendar, and color picker.
3. [ ] Refactor drawer, tooltip, and command palette.
4. [ ] Refactor forms, toast, JSON view, rating, timeline, and signature.
5. [ ] Refactor charts, table skeletons, and media player.
6. [ ] Refactor toolbar tools.
7. [ ] Audit showcase applications.
8. [ ] Run light/dark visual verification and regression checks.
9. [ ] Commit the completed work in focused checkpoints.
