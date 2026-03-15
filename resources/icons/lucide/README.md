# Lucide Icons

**Version:** 0.577.0
**Source:** https://github.com/lucide-icons/lucide
**License:** ISC (see [LICENSE](./LICENSE))

## About

Lucide is a community-maintained fork of Feather Icons. All SVGs use
`stroke="currentColor"` and `fill="none"` — they inherit the current
text colour automatically.

## Contents

| File type | Count | Purpose                                            |
| --------- | ----- | -------------------------------------------------- |
| `*.svg`   | 1 703 | Icon artwork (24 × 24, stroked, `currentColor`)    |
| `*.json`  | 1 703 | Metadata: `contributors`, `tags`, and `categories` |
| `LICENSE` | 1     | ISC licence text                                   |

### JSON metadata format

Each JSON file sits beside its matching SVG and looks like this:

```json
{
  "contributors": ["colebemis", "ericfennis"],
  "tags": ["forward", "direction", "north"],
  "categories": ["arrows"]
}
```

- **`categories`** — used to generate the namespaced icon registry
  (e.g. all `"text"` icons → `UIIcons.Lucide.Text`).
- **`tags`** — search keywords for icon discovery / Storybook gallery.
- **`contributors`** — attribution for the individual icon.

## Update procedure

1. Download the latest release tarball from the
   [Lucide releases page](https://github.com/lucide-icons/lucide/releases).
2. Extract and replace all `.svg` **and** `.json` files in this directory.
3. Update the `LICENSE` file if it changed.
4. Update the version number in this README.
5. Run the icon registry generator (if one exists) or manually update
   the TypeScript icon definitions in `packages/ui-kit/src/lib/icon/`.
