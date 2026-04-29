# Scripts

This folder contains one-off maintenance tools, code generators, and Storybook asset utilities for the LucidKit workspace.

## General usage

Run scripts from the repository root:

```sh
node scripts/<script-name>.mjs
```

Some scripts rewrite files in place. Review the diff after running them.

## Script index

| Script                               | Purpose                                                                               |
| ------------------------------------ | ------------------------------------------------------------------------------------- |
| `add-surface-directive.mjs`          | Adds the `UISurface` host directive to `ui-*` components that do not already have it. |
| `capture-storybook-screenshots.mjs`  | Captures Storybook story screenshots and writes a manifest for the generated assets.  |
| `coverage-report.mjs`                | Reads Vitest coverage output and prints a prioritized under-coverage report.          |
| `extract-story-source-files.mjs`     | Extracts `.story.ts/.html/.scss` source files from legacy monolithic Storybook files. |
| `find-jsdoc-violations.mjs`          | Reports JSDoc spacing violations in TypeScript files.                                 |
| `fix-jsdoc-spacing.mjs`              | Fixes the JSDoc spacing issues reported by `find-jsdoc-violations.mjs`.               |
| `generate-icon-registry.mjs`         | Builds the generated Lucide icon registry TypeScript file from raw SVG assets.        |
| `generate-showcase-story-data.mjs`   | Regenerates demo JSON datasets used by showcase stories.                              |
| `generate-token-manifest.mjs`        | Scans source files for CSS custom properties and writes a token manifest JSON file.   |
| `refactor-dark-mode.mjs`             | Migrates older SCSS dark-mode blocks to the shared mixin-based pattern.               |
| `storybook-screenshot-overrides.mjs` | Provides per-component and per-story overrides for screenshot capture.                |
| `strip-colors.mjs`                   | Removes color-related SCSS declarations from component stylesheets.                   |

## `add-surface-directive.mjs`

Adds `UISurface` to Angular component metadata for `ui-*` components that do not already declare `hostDirectives`.

What it does:

- Finds `*.component.ts` files under `packages/` whose selector starts with `ui-`.
- Adds a `UISurface` import.
- Inserts `hostDirectives: [{ directive: UISurface, inputs: ['surfaceType'] }]` into `@Component(...)` metadata.
- Uses a relative import when modifying files inside `packages/foundation`.

Usage:

```sh
node scripts/add-surface-directive.mjs
```

Notes:

- This script rewrites component source files in place.
- It skips files that already contain `hostDirectives`.
- It is intended as a migration utility, not a routine build step.

## `capture-storybook-screenshots.mjs`

Captures cropped Storybook screenshots for component stories in light and dark themes, then writes `artifacts/storybook-screenshots/manifest.json`.

Prerequisites:

- Build Storybook first: `npm run build-storybook`
- Install Playwright Chromium once if needed: `npm run storybook:screenshots:install`

Usage:

```sh
node scripts/capture-storybook-screenshots.mjs
node scripts/capture-storybook-screenshots.mjs --title='@theredhead/UI Kit/Map View'
node scripts/capture-storybook-screenshots.mjs --story='default'
node scripts/capture-storybook-screenshots.mjs --limit=10
node scripts/capture-storybook-screenshots.mjs --manifest-only
```

CLI options:

- `--title=<text>`: only capture stories whose Storybook title contains the given text.
- `--story=<text>`: only capture stories whose story id or story name contains the given text.
- `--limit=<number>`: only process the first N matched component groups.
- `--manifest-only`: rebuild `manifest.json` from existing PNG files without recapturing images.

Outputs:

- PNG screenshots under `artifacts/storybook-screenshots/...`
- A manifest at `artifacts/storybook-screenshots/manifest.json`

Notes:

- The script serves `dist/storybook` locally and captures `iframe.html` pages with Playwright.
- Theme switching, shrink-wrap capture behavior, selectors, delays, and exclusions are controlled through `storybook-screenshot-overrides.mjs`.
- Workspace npm shortcuts are also available:

```sh
npm run storybook:screenshots
npm run storybook:screenshots:manifest
npm run storybook:screenshots:build
```

## `coverage-report.mjs`

Analyzes `coverage/coverage-summary.json` and prints a readable report of under-covered source files.

Usage:

```sh
node scripts/coverage-report.mjs
node scripts/coverage-report.mjs --run
node scripts/coverage-report.mjs --json
node scripts/coverage-report.mjs --all
node scripts/coverage-report.mjs --threshold 85
node scripts/coverage-report.mjs --help
```

Options:

- `--run`: runs `npx vitest run --coverage` before analysis.
- `--json`: prints machine-readable JSON instead of the human report.
- `--all`: includes healthy files in the output.
- `--threshold <n>`: sets the healthy line-coverage cutoff. Default: `80`.
- `--help`: prints usage text.

Notes:

- Excludes barrel files, stories, specs, HTML templates, and SCSS files from reporting.
- Useful after `npm run test:coverage`.

## `extract-story-source-files.mjs`

Generates real `.story.ts`, `.story.html`, and `.story.scss` files for legacy monolithic `*.stories.ts` files without changing the runtime Storybook stories yet.

What it does:

- scans legacy `*.stories.ts` files under `packages/`
- extracts story source from structured `parameters.docs.source.code` blocks when present
- falls back to local demo-component extraction for stories that use `See <DemoComponent> component in stories file.`
- falls back again to the story `render().template` when no richer source block is available
- writes the extracted files under `stories/<story-name>/`

Usage:

```sh
npm run storybook:extract-sources
npm run storybook:extract-sources -- --write
npm run storybook:extract-sources -- --write --match=theme-toggle
```

Notes:

- Default mode is dry-run. Pass `--write` to actually create or update files.
- This is a safe scaffolding pass for Storybook source tabs and later migration review.
- Generated TypeScript files may still require manual cleanup before they are promoted to live wrapper components.

## `find-jsdoc-violations.mjs`

Scans TypeScript files under `packages/` for two formatting issues:

- missing blank lines before `/**`
- blank lines immediately after `*/`

Usage:

```sh
node scripts/find-jsdoc-violations.mjs
```

Output:

- Prints grouped violation lists to stdout with file and line references.

Notes:

- This is a read-only audit script.
- Pair it with `fix-jsdoc-spacing.mjs` if you want to apply the standard spacing automatically.

## `fix-jsdoc-spacing.mjs`

Rewrites TypeScript files under `packages/` to fix the JSDoc spacing issues reported by `find-jsdoc-violations.mjs`.

Usage:

```sh
node scripts/fix-jsdoc-spacing.mjs
```

What it fixes:

- inserts a blank line before JSDoc opening blocks when missing
- removes blank lines between a JSDoc close and the documented member

Notes:

- The script is intended to be idempotent.
- It rewrites files in place, so review the diff afterwards.

## `generate-icon-registry.mjs`

Builds the generated Lucide icon registry consumed by the UI icon system.

Usage:

```sh
node scripts/generate-icon-registry.mjs
```

Inputs:

- SVG files in `resources/icons/lucide`
- optional companion JSON metadata files in the same folder for category information

Output:

- `packages/ui-kit/src/lib/icon/lucide-icons.generated.ts`

Notes:

- Regenerate this after updating raw Lucide assets or their metadata.
- The output file is fully generated and should not be edited by hand.

## `generate-showcase-story-data.mjs`

Regenerates the JSON datasets used by the showcase stories in the navigation-page demos.

Usage:

```sh
node scripts/generate-showcase-story-data.mjs
```

Output directory:

- `packages/ui-blocks/src/lib/navigation-page/data`

Files written:

- `recipe-book-app.data.json`
- `user-management-app.data.json`
- `warehouse-management-app.data.json`
- `video-sharing-app.data.json`
- `communication-suite-app.data.json`

Notes:

- This is a content-generation utility for the showcase/demo experience.
- Run it when changing the structure or seed data of the showcase stories.

## `generate-token-manifest.mjs`

Scans source files for CSS custom properties and emits a structured token manifest.

Usage:

```sh
node scripts/generate-token-manifest.mjs
```

What it does:

- walks package source files
- extracts CSS custom property definitions from SCSS and inline-style TypeScript sources
- infers token types and ownership
- writes a machine-readable manifest

Output:

- `css-token-manifest.json`

Notes:

- Use this after significant token or theming changes.
- The generated manifest is meant for tooling and documentation workflows.

## `refactor-dark-mode.mjs`

Migrates older per-file dark-mode SCSS patterns to the shared `mix.dark-mode` mixin style.

Usage:

```sh
node scripts/refactor-dark-mode.mjs
```

What it does:

- finds SCSS files still using `:host-context(html.dark-theme)` patterns
- adds `@use 'mixins' as mix;` when missing
- rewrites matched explicit dark-mode blocks to `@include mix.dark-mode { ... }`

Notes:

- This is a migration helper and may skip complex patterns it cannot safely rewrite.
- Review each changed SCSS file after running it.

## `storybook-screenshot-overrides.mjs`

Configuration module consumed by `capture-storybook-screenshots.mjs`.

What it controls:

- default themes, viewport, selector, delay, crop padding, and output directory
- per-component overrides
- per-story overrides
- shrink-wrap behavior for problematic captures

Usage:

There is no direct command for this file. Edit it when a Storybook story needs custom capture settings, then rerun the screenshot script:

```sh
npm run storybook:screenshots
```

Notes:

- This file is imported automatically by the screenshot capture script.
- Keep overrides narrow and story-specific where possible.

## `strip-colors.mjs`

Removes color-related declarations from component SCSS files.

Usage:

```sh
node scripts/strip-colors.mjs
```

What it removes:

- color custom property definitions
- pure color properties like `color`, `background-color`, `border-color`, `fill`, and `stroke`
- mixed shorthand declarations such as `background`, `border`, `outline`, `box-shadow`, and `text-shadow` when they include color values

What it preserves:

- structural resets such as `border: none` and `background: none`
- non-color layout, sizing, spacing, and typography declarations

Notes:

- This script rewrites `*.component.scss` files in place.
- It uses PostCSS with the SCSS parser, so it is best treated as a bulk refactoring utility.
